import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container } from "../../shared/components/layout/Container";
import { useCart } from "../../app/providers/CartProvider";

export function Checkout() {
  const navigate = useNavigate();
  const { cart } = useCart();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cep, setCep] = useState("");
  const [address, setAddress] = useState("");
  const [number, setNumber] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [payment, setPayment] = useState("pix");
  const [error, setError] = useState("");

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (
      !name.trim() ||
      !email.trim() ||
      !cep.trim() ||
      !address.trim() ||
      !number.trim() ||
      !city.trim() ||
      !state.trim()
    ) {
      setError("Preencha todos os dados de entrega.");
      return;
    }

    navigate("/order-success");
  };

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-[#09090B] py-20">
        <Container>
          <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-zinc-900/60 px-6 py-20 text-center">
            <div className="text-6xl">🛒</div>

            <h1 className="mt-6 text-3xl font-black text-white">
              Seu carrinho está vazio
            </h1>

            <p className="mt-3 text-zinc-500">
              Adicione um produto antes de continuar para o checkout.
            </p>

            <Link
              to="/products"
              className="mt-8 inline-block rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 py-4 font-bold text-white"
            >
              Explorar produtos
            </Link>
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#09090B] py-20">
      <Container>
        <div className="mb-12">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
            XBR Store
          </span>

          <h1 className="mt-3 text-5xl font-black text-white">
            Finalizar compra
          </h1>

          <p className="mt-4 text-zinc-400">
            Preencha seus dados para finalizar seu pedido.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-8 lg:grid-cols-[1fr_380px]"
        >
          <div className="space-y-6">
            <section className="rounded-3xl border border-white/10 bg-zinc-900/70 p-7">
              <h2 className="text-xl font-bold text-white">
                Dados pessoais
              </h2>

              <div className="mt-6 grid gap-5">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-zinc-300"
                  >
                    Nome completo
                  </label>

                  <input
                    id="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Seu nome completo"
                    className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-5 py-3.5 text-white outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-zinc-300"
                  >
                    E-mail
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="seu@email.com"
                    className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-5 py-3.5 text-white outline-none focus:border-violet-500"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-zinc-900/70 p-7">
              <h2 className="text-xl font-bold text-white">
                Endereço de entrega
              </h2>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="cep"
                    className="mb-2 block text-sm font-medium text-zinc-300"
                  >
                    CEP
                  </label>

                  <input
                    id="cep"
                    value={cep}
                    onChange={(event) => setCep(event.target.value)}
                    placeholder="00000-000"
                    className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-5 py-3.5 text-white outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="number"
                    className="mb-2 block text-sm font-medium text-zinc-300"
                  >
                    Número
                  </label>

                  <input
                    id="number"
                    value={number}
                    onChange={(event) => setNumber(event.target.value)}
                    placeholder="123"
                    className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-5 py-3.5 text-white outline-none focus:border-violet-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="address"
                    className="mb-2 block text-sm font-medium text-zinc-300"
                  >
                    Endereço
                  </label>

                  <input
                    id="address"
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    placeholder="Rua, avenida..."
                    className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-5 py-3.5 text-white outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="city"
                    className="mb-2 block text-sm font-medium text-zinc-300"
                  >
                    Cidade
                  </label>

                  <input
                    id="city"
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                    placeholder="Sua cidade"
                    className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-5 py-3.5 text-white outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="state"
                    className="mb-2 block text-sm font-medium text-zinc-300"
                  >
                    Estado
                  </label>

                  <input
                    id="state"
                    value={state}
                    onChange={(event) => setState(event.target.value)}
                    placeholder="SP"
                    maxLength={2}
                    className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-5 py-3.5 text-white uppercase outline-none focus:border-violet-500"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-zinc-900/70 p-7">
              <h2 className="text-xl font-bold text-white">
                Forma de pagamento
              </h2>

              <div className="mt-6 space-y-3">
                <label className="flex cursor-pointer items-center gap-4 rounded-2xl border border-white/10 bg-zinc-950 p-4 transition hover:border-violet-500/50">
                  <input
                    type="radio"
                    name="payment"
                    value="pix"
                    checked={payment === "pix"}
                    onChange={(event) => setPayment(event.target.value)}
                    className="accent-violet-600"
                  />

                  <div>
                    <p className="font-semibold text-white">PIX</p>
                    <p className="text-sm text-zinc-500">
                      Pagamento instantâneo
                    </p>
                  </div>
                </label>

                <label className="flex cursor-pointer items-center gap-4 rounded-2xl border border-white/10 bg-zinc-950 p-4 transition hover:border-violet-500/50">
                  <input
                    type="radio"
                    name="payment"
                    value="credit"
                    checked={payment === "credit"}
                    onChange={(event) => setPayment(event.target.value)}
                    className="accent-violet-600"
                  />

                  <div>
                    <p className="font-semibold text-white">
                      Cartão de crédito
                    </p>
                    <p className="text-sm text-zinc-500">
                      Até 12x
                    </p>
                  </div>
                </label>
              </div>
            </section>

            {error && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-400">
                {error}
              </div>
            )}
          </div>

          <aside className="h-fit rounded-3xl border border-white/10 bg-zinc-900/70 p-7 lg:sticky lg:top-28">
            <h2 className="text-xl font-bold text-white">
              Resumo do pedido
            </h2>

            <div className="my-6 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4"
                >
                  <div>
                    <p className="text-sm font-medium text-white">
                      {item.name}
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">
                      Quantidade: {item.quantity}
                    </p>
                  </div>

                  <span className="whitespace-nowrap text-sm font-semibold text-zinc-300">
                    {(item.price * item.quantity).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </div>
              ))}
            </div>

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

              <span className="text-green-400">
                Grátis
              </span>
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

            <button
              type="submit"
              className="mt-7 w-full rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-4 font-bold text-white shadow-lg shadow-violet-700/20 transition hover:scale-[1.02] hover:shadow-violet-500/40 active:scale-[0.98]"
            >
              Confirmar pedido
            </button>
          </aside>
        </form>
      </Container>
    </main>
  );
}