import { Link } from "react-router-dom";
import { Container } from "../../shared/components/layout/Container";
import { useOrders, type Order } from "../../shared/hooks/useOrders";
import {
  ORDER_STATUS_STYLES,
  isOrderStatus,
} from "../../shared/constants/orderStatus";

function belongsToUser(order: Order, user: { name: string; email: string }) {
  const orderEmail = order.customer?.email?.toLowerCase().trim();
  const orderName = order.customer?.name?.toLowerCase().trim();
  const userEmail = user.email?.toLowerCase().trim();
  const userName = user.name?.toLowerCase().trim();

  if (orderEmail && userEmail && orderEmail === userEmail) {
    return true;
  }

  if (orderName && userName && orderName === userName) {
    return true;
  }

  return false;
}

export function Profile() {
  const user = JSON.parse(
    localStorage.getItem("xbr-user") || "null"
  );

  const allOrders = useOrders();

  const orders = user
    ? allOrders.filter((order) => belongsToUser(order, user))
    : [];

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  return (
    <main className="min-h-screen bg-[#09090B] py-20">
      <Container>
        <div className="mb-12">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
            XBR Store
          </span>

          <h1 className="mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">
            Minha{" "}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">
              conta
            </span>
          </h1>
          <p className="mt-4 text-zinc-400">
            Gerencie seus dados e acompanhe seus pedidos.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
          <aside className="h-fit rounded-3xl border border-white/10 bg-zinc-900/70 p-7">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 text-3xl font-black text-white">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <h2 className="mt-5 text-xl font-bold text-white">
              {user?.name || "Usuário"}
            </h2>

            <p className="mt-2 break-all text-sm text-zinc-500">
              {user?.email || "E-mail não informado"}
            </p>

            <div className="my-6 h-px bg-white/10" />

            <Link
              to="/products"
              className="block rounded-2xl border border-white/10 bg-zinc-950 px-5 py-3 text-center font-semibold text-white transition hover:border-violet-500"
            >
              Continuar comprando
            </Link>
          </aside>

          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-black text-white">
                Meus pedidos
              </h2>

              <p className="mt-1 text-zinc-500">
                {orders.length}{" "}
                {orders.length === 1
                  ? "pedido realizado"
                  : "pedidos realizados"}
              </p>
            </div>

            {orders.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-zinc-900/60 px-6 py-20 text-center">
                <div className="text-5xl">📦</div>

                <h3 className="mt-5 text-xl font-bold text-white">
                  Você ainda não possui pedidos
                </h3>

                <p className="mt-2 text-zinc-500">
                  Seus pedidos aparecerão aqui depois da primeira compra.
                </p>

                <Link
                  to="/products"
                  className="mt-7 inline-block rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-7 py-3 font-bold text-white transition hover:scale-[1.02]"
                >
                  Explorar produtos
                </Link>
              </div>
            ) : (
              <div className="space-y-5">
                {orders.map((order) => {
                  const style = isOrderStatus(order.status)
                    ? ORDER_STATUS_STYLES[order.status]
                    : ORDER_STATUS_STYLES.Pendente;

                  return (
                    <article
                      key={order.id}
                      className="rounded-3xl border border-white/10 bg-zinc-900/70 p-6 transition hover:border-violet-500/30"
                    >
                      <div className="flex flex-col justify-between gap-5 sm:flex-row">
                        <div>
                          <p className="text-sm text-zinc-500">
                            Pedido
                          </p>

                          <p className="mt-1 font-bold text-white">
                            #{order.id}
                          </p>

                          <p className="mt-2 text-sm text-zinc-500">
                            {new Date(order.createdAt).toLocaleDateString(
                              "pt-BR",
                              {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </p>
                        </div>

                        <div className="flex items-start gap-4 sm:text-right">
                          <div>
                            <p className="text-sm text-zinc-500">
                              Status
                            </p>

                            <span
                              className={`mt-1 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${style.badge}`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${style.dot}`}
                              />
                              {order.status || "Pendente"}
                            </span>
                          </div>

                          <div>
                            <p className="text-sm text-zinc-500">
                              Total
                            </p>

                            <p className="mt-1 text-xl font-black text-violet-400">
                              {formatCurrency(order.total)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="my-5 h-px bg-white/10" />

                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-4"
                          >
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-zinc-950">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="h-full w-full object-contain p-2"
                                />
                              ) : (
                                <span className="text-2xl">📦</span>
                              )}
                            </div>

                            <div className="flex-1">
                              <p className="font-semibold text-white">
                                {item.name}
                              </p>

                              <p className="text-sm text-zinc-500">
                                Quantidade: {item.quantity}
                              </p>
                            </div>

                            <p className="hidden text-sm font-semibold text-zinc-400 sm:block">
                              {formatCurrency(item.price * item.quantity)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </Container>
    </main>
  );
}