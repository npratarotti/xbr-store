import { Link, useSearchParams } from "react-router-dom";
import { Container } from "../../shared/components/layout/Container";

export function PaymentPending() {
  const [searchParams] = useSearchParams();
  const externalRef = searchParams.get("external_reference");

  return (
    <main className="min-h-screen bg-background py-20 transition-colors duration-300">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/10 text-4xl text-amber-500">
            ⏳
          </div>

          <span className="mt-8 block text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
            XBR Store
          </span>

          <h1 className="mt-3 text-4xl font-black tracking-tight text-text md:text-5xl">
            Pagamento em{" "}
            <span className="bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">
              análise
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-muted">
            Recebemos seu pedido, mas o pagamento ainda está sendo processado.
            Assim que for confirmado, você vai receber a confirmação.
          </p>

          <p className="mt-4 text-sm text-muted">
            Isso costuma acontecer em pagamentos por boleto ou PIX que ainda
            não foram pagos.
          </p>

          {externalRef && (
            <div className="mt-8 inline-flex flex-col rounded-2xl border border-border bg-surface/50 px-8 py-4">
              <span className="text-xs uppercase tracking-wider text-muted">
                Pedido
              </span>
              <span className="mt-1 font-bold text-text">{externalRef}</span>
            </div>
          )}

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              to="/profile"
              className="rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 py-4 font-bold text-white transition hover:scale-[1.02]"
            >
              Ver meus pedidos
            </Link>
            <Link
              to="/products"
              className="rounded-2xl border border-border bg-surface px-8 py-4 font-semibold text-text transition hover:border-violet-500"
            >
              Continuar comprando
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}