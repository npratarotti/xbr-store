import { Link } from "react-router-dom";
import { Container } from "../../shared/components/layout/Container";

export function OrderSuccess() {
  return (
    <main className="min-h-screen bg-[#09090B] py-20">
      <Container>
        <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-zinc-900/70 px-6 py-20 text-center shadow-2xl">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-500/10 text-5xl">
            ✓
          </div>

          <span className="mt-8 block text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
            XBR Store
          </span>

          <h1 className="mt-4 text-4xl font-black text-white">
            Pedido realizado!
          </h1>

          <p className="mx-auto mt-5 max-w-lg text-zinc-400">
            Obrigado pela sua compra. Seu pedido foi recebido com sucesso e
            será preparado para envio.
          </p>

          <div className="mt-8 rounded-2xl border border-white/10 bg-zinc-950/70 p-5">
            <p className="text-sm text-zinc-500">
              Número do pedido
            </p>

            <p className="mt-2 text-xl font-bold text-white">
              #XBR-{Date.now().toString().slice(-6)}
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/products"
              className="rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 py-4 font-bold text-white transition hover:scale-105"
            >
              Continuar comprando
            </Link>

            <Link
              to="/"
              className="rounded-2xl border border-white/10 bg-zinc-950 px-8 py-4 font-bold text-white transition hover:border-violet-500"
            >
              Voltar para início
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}