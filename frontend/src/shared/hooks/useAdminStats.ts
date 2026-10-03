import { useMemo } from "react";
import type { Order } from "./useOrders";

export type AdminStats = {
  totalRevenue: number;
  totalOrders: number;
  uniqueCustomers: number;
  averageTicket: number;
  revenueChange: number;
  ordersChange: number;
  salesByDay: { date: string; label: string; total: number; count: number }[];
  topProducts: { name: string; quantity: number; revenue: number }[];
  statusDistribution: { status: string; count: number; percentage: number }[];
};

export type PeriodOption = "7d" | "30d" | "90d" | "all";

function getPeriodDates(period: PeriodOption): {
  start: Date;
  end: Date;
  previousStart: Date;
  previousEnd: Date;
  days: number;
} {
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const start = new Date();

  let days = 30;
  if (period === "7d") days = 7;
  if (period === "30d") days = 30;
  if (period === "90d") days = 90;
  if (period === "all") days = 365 * 5;

  start.setDate(start.getDate() - days);
  start.setHours(0, 0, 0, 0);

  const previousEnd = new Date(start);
  previousEnd.setMilliseconds(-1);

  const previousStart = new Date(previousEnd);
  previousStart.setDate(previousStart.getDate() - days);
  previousStart.setHours(0, 0, 0, 0);

  return { start, end, previousStart, previousEnd, days };
}

export function useAdminStats(
  orders: Order[],
  period: PeriodOption
): AdminStats {
  return useMemo(() => {
    const { start, end, previousStart, previousEnd, days } =
      getPeriodDates(period);

    const validOrders = orders.filter((o) => o.status !== "Cancelado");

    const currentOrders = validOrders.filter((o) => {
      const d = new Date(o.createdAt);
      return d >= start && d <= end;
    });

    const previousOrders = validOrders.filter((o) => {
      const d = new Date(o.createdAt);
      return d >= previousStart && d <= previousEnd;
    });

    const totalRevenue = currentOrders.reduce((sum, o) => sum + o.total, 0);
    const totalOrders = currentOrders.length;
    const uniqueCustomers = new Set(
      currentOrders
        .map((o) => o.customer?.email?.toLowerCase())
        .filter(Boolean)
    ).size;
    const averageTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const previousRevenue = previousOrders.reduce(
      (sum, o) => sum + o.total,
      0
    );
    const previousCount = previousOrders.length;

    const revenueChange =
      previousRevenue > 0
        ? ((totalRevenue - previousRevenue) / previousRevenue) * 100
        : totalRevenue > 0
          ? 100
          : 0;

    const ordersChange =
      previousCount > 0
        ? ((totalOrders - previousCount) / previousCount) * 100
        : totalOrders > 0
          ? 100
          : 0;

    const daysArray: {
      date: string;
      label: string;
      total: number;
      count: number;
    }[] = [];

    const daysToShow = Math.min(days, 90);
    for (let i = daysToShow - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);

      const dateKey = d.toISOString().split("T")[0];

      const dayOrders = currentOrders.filter((o) => {
        const od = new Date(o.createdAt);
        od.setHours(0, 0, 0, 0);
        return od.getTime() === d.getTime();
      });

      daysArray.push({
        date: dateKey,
        label: d.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
        }),
        total: dayOrders.reduce((sum, o) => sum + o.total, 0),
        count: dayOrders.length,
      });
    }

    const productMap = new Map<
      string,
      { quantity: number; revenue: number }
    >();

    for (const order of currentOrders) {
      for (const item of order.items) {
        const existing = productMap.get(item.name);
        if (existing) {
          existing.quantity += item.quantity;
          existing.revenue += item.price * item.quantity;
        } else {
          productMap.set(item.name, {
            quantity: item.quantity,
            revenue: item.price * item.quantity,
          });
        }
      }
    }

    const topProducts = Array.from(productMap.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    const statusCounts: Record<string, number> = {};
    for (const order of orders) {
      const s = order.status || "Pendente";
      statusCounts[s] = (statusCounts[s] || 0) + 1;
    }

    const totalForStatus = Object.values(statusCounts).reduce(
      (a, b) => a + b,
      0
    );

    const statusDistribution = Object.entries(statusCounts).map(
      ([status, count]) => ({
        status,
        count,
        percentage:
          totalForStatus > 0 ? (count / totalForStatus) * 100 : 0,
      })
    );

    return {
      totalRevenue,
      totalOrders,
      uniqueCustomers,
      averageTicket,
      revenueChange,
      ordersChange,
      salesByDay: daysArray,
      topProducts,
      statusDistribution,
    };
  }, [orders, period]);
}