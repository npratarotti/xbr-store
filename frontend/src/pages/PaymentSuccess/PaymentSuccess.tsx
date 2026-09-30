import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Container } from "../../shared/components/layout/Container";
import { supabase } from "../../lib/supabase";

export function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const externalRef = searchParams.get("external_reference");

  const [syncing, setSyncing] = useState(true);
  const [orderCode, setOrderCode] = useState<string | null>(externalRef);

  useEffect(() => {
    // Dá uma pequena espera pro webhook processar
    const timer = setTimeout(() => {
      setSyncing(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!externalRef) return;

    supabase
      .from("orders")
      .select("code")
      .eq("code", externalRef)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setOrderCode(data.code);
      });
  }, [externalRef]);

  return (
    <main className="min-h-screen bg-background py-20 transition-colors duration-300">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 text-4xl text-green-500">
            ✓
          </div>

          <span className="mt-8 block text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
            XBR Store
          </span>

          <h1 className="mt-3 text-4xl font-black tracking-tight text-text md:text-5xl">
            Pagamento{" "}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">
              aprovado!
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-muted">
            Obrigado pela sua compra! Seu pedido foi confirmado e já está sendo
            processado.
          </p>

          {orderCode && (
            <div className="mt-8 inline-flex flex-col rounded-2xl border border-violet-500/20 bg-violet-500/5 px-8 py-4">
              <span className="text-xs uppercase tracking-wider text-muted">
                Número do pedido
              </span>
              <span className="mt-1 text-xl font-black text-violet-400">
                {orderCode}
              </span>
            </div>
          )}

          {syncing && (
            <p className="mt-4 text-xs text-muted/70">
              Sincronizando com o sistema...
            </p>
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