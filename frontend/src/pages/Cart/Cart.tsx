import { useEffect, useState } from "react";
import { Container } from "../../shared/components/layout/Container";

type CartItem = {
  id: number;
  image: string;
  name: string;
  price: number;
  quantity: number;
};

export function Cart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("xbr-cart");

    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const updateCart = (updatedCart: CartItem[]) => {
    setCart(updatedCart);
    localStorage.setItem("xbr-cart", JSON.stringify(updatedCart));
  };

  const increaseQuantity = (id: number) => {
    const updatedCart = cart.map((item) =>
      item.id === id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );

    updateCart(updatedCart);
  };

  const decreaseQuantity = (id: number) => {
    const updatedCart = cart
      .map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);

    updateCart(updatedCart);
  };

  const removeItem = (id: number) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    updateCart(updatedCart);
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <main className="min-h-screen bg-[#09090B] py-20">
      <Container>
        <div className="mb-12">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
            XBR Store
          </span>

          <h1 className="mt-3 text-5xl font-black text-white">
            Seu carrinho
          </h1>

          <p className="mt-4 text-zinc-400">
            Confira seus produtos antes de finalizar a compra.
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-zinc-900/60 px-6 py-24 text-center">
            <div className="text-6xl">🛒</div>

            <h2 className="mt-6 text-2xl font-bold text-white">
              Seu carrinho está vazio
            </h2>

            <p className="mt-3 text-zinc-500">
              Adicione produtos para começar sua compra.
            </p>

            <a
              href="/products"
              className="mt-8 inline-block rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 py-4 font-bold text-white transition hover:scale-105"
            >
              Explorar produtos
            </a>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            {/* Produtos */}
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-5 rounded-3xl border border-white/10 bg-zinc-900/60 p-5 sm:flex-row sm:items-center"
                >
                  <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-2xl bg-zinc-950">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-contain p-3"
                    />
                  </div>

                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-white">
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
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-zinc-950 text-white transition hover:border-violet-500"
                      >
                        −
                      </button>

                      <span className="min-w-8 text-center font-bold text-white">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => increaseQuantity(item.id)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-zinc-950 text-white transition hover:border-violet-500"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-sm text-zinc-500 transition hover:text-red-400"
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>

            {/* Resumo */}
            <aside className="h-fit rounded-3xl border border-white/10 bg-zinc-900/70 p-7">
              <h2 className="text-xl font-bold text-white">
                Resumo do pedido
              </h2>

              <div className="my-6 h-px bg-white/10" />

              <div className="flex justify-between text-zinc-400">
                <span>Subtotal</span>

                <span>
                  {total.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </div>

              <div className="mt-4 flex justify-between text-zinc-400">
                <span>Frete</span>
                <span className="text-green-400">Grátis</span>
              </div>

              <div className="my-6 h-px bg-white/10" />

              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-white">
                  Total
                </span>

                <span className="text-2xl font-black text-white">
                  {total.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </div>

              <button className="mt-7 w-full rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-4 font-bold text-white shadow-lg shadow-violet-700/20 transition hover:scale-[1.02]">
                Finalizar compra
              </button>
            </aside>
          </div>
        )}
      </Container>
    </main>
  );
}