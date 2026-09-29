import { Link } from "react-router-dom";
import { Container } from "../../shared/components/layout/Container";
import { useCart } from "../../app/providers/CartProvider";

export function Cart() {
  const { cart, increaseQuantity, decreaseQuantity, removeItem } = useCart();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <main className="min-h-screen bg-background py-20 transition-colors duration-300">
      <Container>
        <div className="mb-12">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
            XBR Store
          </span>

          <h1 className="mt-3 text-4xl font-black tracking-tight text-text md:text-5xl">
            Seu{" "}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">
              carrinho
            </span>
          </h1>

          <p className="mt-4 text-muted">
            Confira seus produtos antes de finalizar a compra.
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="rounded-3xl border border-border bg-surface/60 px-6 py-24 text-center">
            <div className="text-6xl">🛒</div>

            <h2 className="mt-6 text-2xl font-bold text-text">
              Seu carrinho está vazio
            </h2>

            <p className="mt-3 text-muted">
              Adicione produtos para começar sua compra.
            </p>

            <Link
              to="/products"
              className="mt-8 inline-block rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 py-4 font-bold text-white transition hover:scale-105"
            >
              Explorar produtos
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-5 rounded-3xl border border-border bg-surface/60 p-5 sm:flex-row sm:items-center"
                >
                  <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-2xl bg-background">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-contain p-3"
                    />
                  </div>

                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-text">
                      {item.name}
                    </h2>

                    <p className="mt-2 text-lg font-bold text-violet-400">
                      {item.price.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </p>

                    <div className="mt-5 flex items-center gap-3">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-background text-text transition hover:border-violet-500"
                      >
                        −
                      </button>

                      <span className="min-w-8 text-center font-bold text-text">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => increaseQuantity(item.id)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-background text-text transition hover:border-violet-500"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-sm text-muted transition hover:text-red-400"
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>

            <aside className="h-fit rounded-3xl border border-border bg-surface/70 p-7">
              <h2 className="text-xl font-bold text-text">
                Resumo do pedido
              </h2>

              <div className="my-6 h-px bg-border" />

              <div className="flex justify-between text-muted">
                <span>Subtotal</span>

                <span>
                  {total.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </div>

              <div className="mt-4 flex justify-between text-muted">
                <span>Frete</span>

                <span className="text-green-400">Grátis</span>
              </div>

              <div className="my-6 h-px bg-border" />

              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-text">Total</span>

                <span className="text-2xl font-black text-text">
                  {total.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </div>

              <Link
                to="/checkout"
                className="mt-7 block w-full rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-4 text-center font-bold text-white shadow-lg shadow-violet-700/20 transition hover:scale-[1.02]"
              >
                Finalizar compra
              </Link>
            </aside>
          </div>
        )}
      </Container>
    </main>
  );
}