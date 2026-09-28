import { useMemo, useState } from "react";
import { useOrders, type Order } from "../../../shared/hooks/useOrders";
import {
  ORDER_STATUSES,
  ORDER_STATUS_STYLES,
  isOrderStatus,
  type OrderStatus,
} from "../../../shared/constants/orderStatus";

type StatusFilter = "Todos" | OrderStatus;
type PeriodFilter = "all" | "today" | "7d" | "30d";
type CustomerFilter = "all" | string; // string = email do cliente

function isWithinPeriod(createdAt: string, period: PeriodFilter) {
  if (period === "all") return true;

  const created = new Date(createdAt).getTime();
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;

  if (period === "today") {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    return created >= startOfDay.getTime();
  }

  if (period === "7d") return created >= now - 7 * day;
  if (period === "30d") return created >= now - 30 * day;

  return true;
}

export function OrderManager() {
  const orders = useOrders();

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("Todos");
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>("all");
  const [customerFilter, setCustomerFilter] =
    useState<CustomerFilter>("all");
  const [search, setSearch] = useState("");

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    const raw = localStorage.getItem("xbr-orders");
    if (!raw) return;

    try {
      const all: Order[] = JSON.parse(raw);
      const updated = all.map((order) =>
        order.id === orderId ? { ...order, status } : order
      );

      localStorage.setItem("xbr-orders", JSON.stringify(updated));
      window.dispatchEvent(new Event("xbr-orders-updated"));
    } catch {
      // ignore
    }
  };

  // Lista de clientes únicos (por email), com contagem de pedidos
  const customers = useMemo(() => {
    const map = new Map<
      string,
      { name: string; email: string; count: number }
    >();

    for (const order of orders) {
      const email = order.customer?.email?.toLowerCase().trim();
      if (!email) continue;

      const existing = map.get(email);

      if (existing) {
        existing.count += 1;
      } else {
        map.set(email, {
          name: order.customer.name,
          email,
          count: 1,
        });
      }
    }

    return Array.from(map.values()).sort((a, b) =>
      a.name.localeCompare(b.name, "pt-BR")
    );
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();

    return orders
      .filter((order) => {
        const matchesStatus =
          statusFilter === "Todos" || order.status === statusFilter;

        const matchesPeriod = isWithinPeriod(order.createdAt, periodFilter);

        const matchesCustomer =
          customerFilter === "all" ||
          order.customer?.email?.toLowerCase().trim() === customerFilter;

        const matchesSearch =
          !normalizedSearch ||
          order.id.toLowerCase().includes(normalizedSearch) ||
          order.customer?.name?.toLowerCase().includes(normalizedSearch) ||
          order.customer?.email?.toLowerCase().includes(normalizedSearch);

        return (
          matchesStatus &&
          matchesPeriod &&
          matchesCustomer &&
          matchesSearch
        );
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );
  }, [orders, statusFilter, periodFilter, customerFilter, search]);

  const countsByStatus = useMemo(() => {
    const counts: Record<StatusFilter, number> = {
      Todos: orders.length,
      Pendente: 0,
      Pago: 0,
      Enviado: 0,
      Entregue: 0,
      Cancelado: 0,
    };

    for (const order of orders) {
      if (isOrderStatus(order.status)) {
        counts[order.status] += 1;
      }
    }

    return counts;
  }, [orders]);

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  return (
    <section className="mt-10">
      <div className="mb-6">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
          Vendas
        </span>

        <h2 className="mt-2 text-2xl font-black tracking-tight text-white">
          Pedidos{" "}
          <span className="bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">
            recentes
          </span>
        </h2>

        <p className="mt-2 text-sm text-zinc-500">
          Acompanhe e atualize o status dos pedidos da loja.
        </p>
      </div>

      {/* Filtros de status */}
      {orders.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {(["Todos", ...ORDER_STATUSES] as StatusFilter[]).map((status) => {
            const isActive = statusFilter === status;

            return (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                  isActive
                    ? "border-violet-500/40 bg-violet-500/20 text-violet-300"
                    : "border-white/10 bg-zinc-900/60 text-zinc-400 hover:border-white/20 hover:text-white"
                }`}
              >
                {status}{" "}
                <span className="ml-1 text-zinc-500">
                  ({countsByStatus[status]})
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Busca + cliente + período */}
      {orders.length > 0 && (
        <div className="mb-6 flex flex-col gap-3 md:flex-row">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por número, nome ou e-mail..."
            className="flex-1 rounded-2xl border border-white/10 bg-zinc-950 px-5 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-violet-500"
          />

          <select
            value={customerFilter}
            onChange={(event) => setCustomerFilter(event.target.value)}
            className="rounded-2xl border border-white/10 bg-zinc-950 px-5 py-3 text-sm text-zinc-300 outline-none focus:border-violet-500"
          >
            <option value="all">Todos os clientes</option>

            {customers.map((customer) => (
              <option key={customer.email} value={customer.email}>
                {customer.name} ({customer.count})
              </option>
            ))}
          </select>

          <select
            value={periodFilter}
            onChange={(event) =>
              setPeriodFilter(event.target.value as PeriodFilter)
            }
            className="rounded-2xl border border-white/10 bg-zinc-950 px-5 py-3 text-sm text-zinc-300 outline-none focus:border-violet-500"
          >
            <option value="all">Todo o período</option>
            <option value="today">Hoje</option>
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
          </select>
        </div>
      )}

      {/* Contagem */}
      {orders.length > 0 && (
        <div className="mb-4 flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-violet-500" />
          <p className="text-sm text-zinc-400">
            <span className="font-bold text-white">{filteredOrders.length}</span>{" "}
            de {orders.length} pedido(s)
          </p>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-zinc-900/70 px-6 py-20 text-center">
          <div className="text-5xl">📦</div>

          <h3 className="mt-5 text-xl font-bold text-white">
            Nenhum pedido ainda
          </h3>

          <p className="mt-2 text-zinc-500">
            Os pedidos realizados pelos clientes aparecerão aqui.
          </p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-zinc-900/70 px-6 py-16 text-center">
          <p className="text-zinc-400">
            Nenhum pedido corresponde aos filtros.
          </p>

          <button
            type="button"
            onClick={() => {
              setStatusFilter("Todos");
              setPeriodFilter("all");
              setCustomerFilter("all");
              setSearch("");
            }}
            className="mt-5 rounded-2xl border border-white/10 bg-zinc-950 px-5 py-2.5 text-sm font-semibold text-zinc-300 transition hover:border-violet-500 hover:text-white"
          >
            Limpar filtros
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredOrders.map((order) => {
            const style = isOrderStatus(order.status)
              ? ORDER_STATUS_STYLES[order.status]
              : ORDER_STATUS_STYLES.Pendente;

            return (
              <article
                key={order.id}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 transition-all duration-500 hover:-translate-y-1 hover:border-violet-500/30"
              >
                <div className="pointer-events-none absolute -top-20 right-0 h-40 w-40 rounded-full bg-violet-600/10 blur-3xl transition-all duration-500 group-hover:bg-violet-600/25" />

                <div className="relative flex flex-col justify-between gap-5 lg:flex-row">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-zinc-500">
                      Pedido
                    </p>

                    <h3 className="mt-1 text-lg font-bold text-white">
                      #{order.id}
                    </h3>

                    <p className="mt-2 text-sm text-zinc-500">
                      {new Date(order.createdAt).toLocaleString("pt-BR")}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold ${style.badge}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${style.dot}`}
                      />
                      {order.status}
                    </span>

                    <p className="text-xl font-black text-violet-400">
                      {formatCurrency(order.total)}
                    </p>
                  </div>
                </div>

                <div className="relative my-5 h-px bg-white/10" />

                <div className="relative grid gap-5 md:grid-cols-3">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-zinc-500">
                      Cliente
                    </p>

                    <p className="mt-2 font-semibold text-white">
                      {order.customer.name}
                    </p>

                    <p className="mt-1 break-all text-sm text-zinc-500">
                      {order.customer.email}
                    </p>

                    {order.customer.phone && (
                      <p className="mt-1 text-sm text-zinc-500">
                        {order.customer.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-zinc-500">
                      Produtos
                    </p>

                    <div className="mt-2 space-y-2">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between gap-4 text-sm"
                        >
                          <span className="text-zinc-300">
                            {item.name} × {item.quantity}
                          </span>

                          <span className="text-zinc-500">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-zinc-500">
                      Atualizar status
                    </p>

                    <select
                      value={
                        isOrderStatus(order.status)
                          ? order.status
                          : "Pendente"
                      }
                      onChange={(event) =>
                        handleStatusChange(
                          order.id,
                          event.target.value as OrderStatus
                        )
                      }
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-violet-500"
                    >
                      {ORDER_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>

                    {order.payment && (
                      <p className="mt-3 text-xs text-zinc-500">
                        Pagamento:{" "}
                        <span className="font-semibold text-zinc-300">
                          {order.payment === "pix"
                            ? "PIX"
                            : order.payment === "credit"
                              ? "Cartão de crédito"
                              : order.payment}
                        </span>
                      </p>
                    )}

                    {order.coupon && (
                      <p className="mt-1 text-xs text-zinc-500">
                        Cupom:{" "}
                        <span className="font-semibold text-green-400">
                          {order.coupon.code} (-
                          {order.coupon.discount.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })})
                        </span>
                      </p>
                    )}

                    {order.shipping && order.shipping.price > 0 && (
                      <p className="mt-1 text-xs text-zinc-500">
                        Frete:{" "}
                        <span className="font-semibold text-zinc-300">
                          {order.shipping.price.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}