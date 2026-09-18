import { Link } from "react-router-dom";
import { Container } from "../../shared/components/layout/Container";

type OrderItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

type Order = {
  id: string;
  customer: {
    name: string;
    email: string;
  };
  items: OrderItem[];
  total: number;
  createdAt: string;
};

export function Profile() {
  const user = JSON.parse(
    localStorage.getItem("xbr-user") || "null"
  );

  const orders: Order[] = JSON.parse(
    localStorage.getItem("xbr-orders") || "[]"
  );

  return (
    <main className="min-h-screen bg-[#09090B] py-20">
      <Container>
        <div className="mb-12">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
            XBR Store
          </span>

          <h1 className="mt-3 text-5xl font-black text-white">
            Minha conta
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
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-white">
                  Meus pedidos
                </h2>

                <p className="mt-1 text-zinc-500">
                  {orders.length} pedido(s) realizado(s)
                </p>
              </div>
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
              </div>
            ) : (
              <div className="space-y-5">
                {orders.map((order) => (
                  <article
                    key={order.id}
                    className="rounded-3xl border border-white/10 bg-zinc-900/70 p-6"
                  >
                    <div className="flex flex-col justify-between gap-4 sm:flex-row">
                      <div>
                        <p className="text-sm text-zinc-500">
                          Pedido
                        </p>

                        <p className="mt-1 font-bold text-white">
                          #{order.id}
                        </p>
                      </div>

                      <div className="sm:text-right">
                        <p className="text-sm text-zinc-500">
                          Total
                        </p>

                        <p className="mt-1 text-xl font-black text-violet-400">
                          {order.total.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="my-5 h-px bg-white/10" />

                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-16 w-16 rounded-xl bg-zinc-950 object-contain p-2"
                          />

                          <div className="flex-1">
                            <p className="font-semibold text-white">
                              {item.name}
                            </p>

                            <p className="text-sm text-zinc-500">
                              Quantidade: {item.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </Container>
    </main>
  );
}