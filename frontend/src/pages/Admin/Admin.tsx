import { useState } from "react";
import { Container } from "../../shared/components/layout/Container";
import { ProductManager } from "./components/ProductManager";
import { OrderManager } from "./components/OrderManager";
import { CouponManager } from "./components/CouponManager";
import { ShippingManager } from "./components/ShippingManager";
import { useOrders } from "../../shared/hooks/useOrders";
import {
  useAdminStats,
  type PeriodOption,
} from "../../shared/hooks/useAdminStats";
import { MetricCard } from "../../shared/components/admin/MetricCard/MetricCard";
import { SalesChart } from "../../shared/components/admin/SalesChart/SalesChart";
import { TopProductsChart } from "../../shared/components/admin/TopProductsChart/TopProductsChart";
import { StatusChart } from "../../shared/components/admin/StatusChart/StatusChart";

type PeriodFilter = {
  value: PeriodOption;
  label: string;
};

const PERIOD_OPTIONS: PeriodFilter[] = [
  { value: "7d", label: "7 dias" },
  { value: "30d", label: "30 dias" },
  { value: "90d", label: "90 dias" },
  { value: "all", label: "Tudo" },
];

export function Admin() {
  const { orders, loading } = useOrders();
  const [period, setPeriod] = useState<PeriodOption>("30d");

  const stats = useAdminStats(orders, period);

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  return (
    <main className="relative min-h-screen overflow-hidden bg-background py-12 transition-colors duration-300 md:py-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-violet-700/10 blur-[140px]" />
        <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-fuchsia-600/5 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-violet-600/5 blur-[120px]" />
      </div>

      <Container>
        <div className="relative mb-12">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
            XBR Store
          </span>

          <h1 className="mt-3 text-4xl font-black tracking-tight text-text md:text-5xl">
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">
              Dashboard
            </span>
          </h1>

          <p className="mt-4 text-muted">Visão geral da sua loja.</p>
        </div>

        {/* Filtro de período - CORRIGIDO */}
        <div className="relative mb-8">
          <span className="mb-3 block text-sm font-medium text-muted">
            Período:
          </span>
          <div className="flex flex-wrap gap-2">
            {PERIOD_OPTIONS.map((option) => {
              const isActive = period === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setPeriod(option.value)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition sm:px-4 sm:py-2 ${
                    isActive
                      ? "border-violet-500/40 bg-violet-500/20 text-violet-300"
                      : "border-border bg-surface/60 text-muted hover:border-violet-500/30 hover:text-text"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div className="space-y-8">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-36 animate-pulse rounded-3xl border border-border bg-surface/60"
                />
              ))}
            </div>
            <div className="grid gap-5 lg:grid-cols-2">
              <div className="h-96 animate-pulse rounded-3xl border border-border bg-surface/60" />
              <div className="h-96 animate-pulse rounded-3xl border border-border bg-surface/60" />
            </div>
          </div>
        ) : (
          <>
            {/* MÉTRICAS - gap menor em mobile */}
            <div className="relative grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                label="Faturamento"
                value={formatCurrency(stats.totalRevenue)}
                change={stats.revenueChange}
                icon="💰"
              />
              <MetricCard
                label="Pedidos"
                value={String(stats.totalOrders)}
                change={stats.ordersChange}
                icon="📦"
              />
              <MetricCard
                label="Clientes únicos"
                value={String(stats.uniqueCustomers)}
                icon="👥"
              />
              <MetricCard
                label="Ticket médio"
                value={formatCurrency(stats.averageTicket)}
                icon="🎯"
              />
            </div>

            {/* GRÁFICOS */}
            <div className="relative mt-8 grid gap-5 lg:grid-cols-2">
              <div className="lg:col-span-2">
                <SalesChart data={stats.salesByDay} />
              </div>

              <TopProductsChart data={stats.topProducts} />
              <StatusChart data={stats.statusDistribution} />
            </div>

            <div className="relative my-14 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
          </>
        )}

        <div className="relative space-y-10">
          <OrderManager />
          <CouponManager />
          <ShippingManager />
          <ProductManager />
        </div>
      </Container>
    </main>
  );
}