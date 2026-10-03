import { useState } from "react";
import { Link } from "react-router-dom";
import { Container } from "../../shared/components/layout/Container";
import { useCart } from "../../app/providers/CartProvider";
import { useAuth } from "../../app/providers/AuthProvider";
import { useOrders } from "../../shared/hooks/useOrders";
import { supabase } from "../../lib/supabase";
import {
  ORDER_STATUS_STYLES,
  isOrderStatus,
} from "../../shared/constants/orderStatus";

export function Profile() {
  const { user, loading: authLoading } = useAuth();
  const { orders, loading: ordersLoading } = useOrders();
  const { addToCart, clearCart } = useCart();

  const [payingOrder, setPayingOrder] = useState<string | null>(null);

  const loading = authLoading || ordersLoading;

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const handlePayNow = async (order: any) => {
    if (!user) return;

    setPayingOrder(order.code);

    try {
      // Reconstrói o carrinho com os itens do pedido
      clearCart();
      for (const item of order.items) {
        for (let i = 0; i < item.quantity; i++) {
          addToCart({
            id: item.id,
            image: item.image ?? "",
            name: item.name,
            price: item.price,
          });
        }
      }

      // Pega o token de sessão
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;

      // Chama a Edge Function pra gerar novo init_point
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({
            orderCode: order.code,
            items: order.items.map((item: any) => ({
              productId: item.id,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
            })),
            customer: {
              name: order.customer.name,
              email: order.customer.email,
              phone: order.customer.phone ?? "",
            },
            address: order.address ?? {
              cep: "",
              address: "",
              number: "",
              city: "",
              state: "",
            },
          }),
        }
      );

      const paymentData = await response.json();

      if (!response.ok || !paymentData.init_point) {
        throw new Error(paymentData.error ?? "Erro ao gerar pagamento");
      }

      window.location.href = paymentData.init_point;
    } catch (err) {
      console.error("Erro ao pagar:", err);
      alert(
        err instanceof Error
          ? err.message
          : "Erro ao gerar pagamento. Tente novamente."
      );
      setPayingOrder(null);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background transition-colors duration-300">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-500/30 border-t-violet-500" />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-background py-20 transition-colors duration-300">
        <Container>
          <p className="text-center text-muted">Você precisa estar logada.</p>
        </Container>
      </main>
    );
  }

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <main className="min-h-screen bg-background py-20 transition-colors duration-300">
      <Container>
        <div className="mb-12">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
            XBR Store
          </span>

          <h1 className="mt-3 text-4xl font-black tracking-tight text-text md:text-5xl">
            Minha{" "}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">
              conta
            </span>
          </h1>
          <p className="mt-4 text-muted">
            Gerencie seus dados e acompanhe seus pedidos.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
          <aside className="h-fit rounded-3xl border border-border bg-surface/70 p-7">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 text-3xl font-black text-white">
              {initials}
            </div>

            <h2 className="mt-5 text-xl font-bold text-text">{user.name}</h2>

            <p className="mt-2 break-all text-sm text-muted">
              {user.email}
            </p>

            {user.isAdmin && (
              <span className="mt-3 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-400">
                ✦ Administrador
              </span>
            )}

            <div className="my-6 h-px bg-border" />

            <Link
              to="/products"
              className="block rounded-2xl border border-border bg-background px-5 py-3 text-center font-semibold text-text transition hover:border-violet-500"
            >
              Continuar comprando
            </Link>
          </aside>

          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-black text-text">Meus pedidos</h2>

              <p className="mt-1 text-muted">
                {orders.length}{" "}
                {orders.length === 1
                  ? "pedido realizado"
                  : "pedidos realizados"}
              </p>
            </div>

            {orders.length === 0 ? (
              <div className="rounded-3xl border border-border bg-surface/60 px-6 py-20 text-center">
                <div className="text-5xl">📦</div>

                <h3 className="mt-5 text-xl font-bold text-text">
                  Você ainda não possui pedidos
                </h3>

                <p className="mt-2 text-muted">
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
                      className="rounded-3xl border border-border bg-surface/70 p-6 transition hover:border-violet-500/30"
                    >
                      <div className="flex flex-col justify-between gap-5 sm:flex-row">
                        <div>
                          <p className="text-sm text-muted">Pedido</p>
                          <p className="mt-1 font-bold text-text">
                            #{order.code}
                          </p>
                          <p className="mt-2 text-sm text-muted">
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
                            <p className="text-sm text-muted">Status</p>
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
                            <p className="text-sm text-muted">Total</p>
                            <p className="mt-1 text-xl font-black text-violet-400">
                              {formatCurrency(order.total)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="my-5 h-px bg-border" />

                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-4">
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-background">
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
                              <p className="font-semibold text-text">
                                {item.name}
                              </p>
                              <p className="text-sm text-muted">
                                Quantidade: {item.quantity}
                              </p>
                            </div>

                            <p className="hidden text-sm font-semibold text-muted sm:block">
                              {formatCurrency(item.price * item.quantity)}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Botão Pagar Agora — só aparece se estiver Pendente */}
                      {order.status === "Pendente" && (
                        <button
                          type="button"
                          onClick={() => handlePayNow(order)}
                          disabled={payingOrder === order.code}
                          className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 font-bold text-white shadow-lg shadow-violet-700/20 transition hover:scale-[1.02] hover:shadow-violet-500/40 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {payingOrder === order.code && (
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          )}
                          {payingOrder === order.code
                            ? "Gerando pagamento..."
                            : "Pagar agora"}
                        </button>
                      )}
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