import { Link } from "react-router-dom";
import { Container } from "../../shared/components/layout/Container";
import { useOrders } from "../../shared/hooks/useOrders";

export function OrderSuccess() {
  const { orders, loading } = useOrders();

  // Pega o pedido mais recente (a lista já vem ordenada por created_at DESC)
  const order = orders[0];

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const formatPayment = (payment: string) => {
    if (payment === "pix") return "PIX";
    if (payment === "credit") return "Cartão de crédito";
    return payment;
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background transition-colors duration-300">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-500/30 border-t-violet-500" />
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-background py-20 transition-colors duration-300">
        <Container>
          <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-surface/70 px-6 py-20 text-center">
            <div className="text-6xl">📦</div>

            <h1 className="mt-6 text-3xl font-black text-text">
              Pedido não encontrado
            </h1>

            <p className="mt-3 text-muted">
              Não encontramos os dados do último pedido.
            </p>

            <Link
              to="/products"
              className="mt-8 inline-block rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 py-4 font-bold text-white transition hover:scale-[1.02]"
            >
              Explorar produtos
            </Link>
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background py-12 transition-colors duration-300 md:py-20">
      <Container>
        <div className="mx-auto max-w-4xl">
          {/* Sucesso */}
          <div className="rounded-3xl border border-border bg-surface/70 p-8 text-center shadow-2xl shadow-violet-900/10 md:p-12">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 text-4xl text-green-500">
              ✓
            </div>

            <span className="mt-8 block text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
              XBR Store
            </span>

            <h1 className="mt-3 text-4xl font-black tracking-tight text-text md:text-5xl">
              Pedido{" "}
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">
                realizado!
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-muted">
              Obrigado pela sua compra, {order.customer.name}. Seu pedido foi
              registrado com sucesso.
            </p>

            <div className="mt-8 inline-flex flex-col rounded-2xl border border-violet-500/20 bg-violet-500/5 px-8 py-4">
              <span className="text-xs uppercase tracking-wider text-muted">
                Número do pedido
              </span>

              <span className="mt-1 text-xl font-black text-violet-400">
                {order.code}
              </span>
            </div>
          </div>

          {/* Informações */}
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <section className="rounded-3xl border border-border bg-surface/70 p-7">
              <h2 className="text-xl font-bold text-text">
                Dados do cliente
              </h2>

              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted">
                    Nome
                  </p>
                  <p className="mt-1 font-medium text-text">
                    {order.customer.name}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-muted">
                    E-mail
                  </p>
                  <p className="mt-1 break-all font-medium text-text">
                    {order.customer.email}
                  </p>
                </div>

                {order.customer.phone && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted">
                      Telefone
                    </p>
                    <p className="mt-1 font-medium text-text">
                      {order.customer.phone}
                    </p>
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-3xl border border-border bg-surface/70 p-7">
              <h2 className="text-xl font-bold text-text">Pagamento</h2>

              <div className="mt-5">
                <p className="text-xs uppercase tracking-wider text-muted">
                  Forma escolhida
                </p>

                <p className="mt-2 text-lg font-bold text-text">
                  {formatPayment(order.payment)}
                </p>

                <span className="mt-3 inline-block rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-500">
                  Pedido confirmado
                </span>
              </div>
            </section>
          </div>

          {/* Endereço */}
          {order.address && (
            <section className="mt-6 rounded-3xl border border-border bg-surface/70 p-7">
              <h2 className="text-xl font-bold text-text">
                Endereço de entrega
              </h2>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted">
                    Endereço
                  </p>
                  <p className="mt-1 text-text/80">
                    {order.address.address}, {order.address.number}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-muted">
                    Cidade
                  </p>
                  <p className="mt-1 text-text/80">
                    {order.address.city} - {order.address.state}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-muted">
                    CEP
                  </p>
                  <p className="mt-1 text-text/80">{order.address.cep}</p>
                </div>

                {order.address.complement && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted">
                      Complemento
                    </p>
                    <p className="mt-1 text-text/80">
                      {order.address.complement}
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Produtos */}
          <section className="mt-6 rounded-3xl border border-border bg-surface/70 p-7">
            <h2 className="text-xl font-bold text-text">
              Produtos do pedido
            </h2>

            <div className="mt-6 space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-5 rounded-2xl border border-border/50 bg-background/60 p-4"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-text">{item.name}</p>
                    <p className="mt-1 text-sm text-muted">
                      Quantidade: {item.quantity}
                    </p>
                  </div>

                  <p className="whitespace-nowrap font-bold text-text/80">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="my-6 h-px bg-border" />

            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-text">Total</span>
              <span className="text-2xl font-black text-violet-400">
                {formatCurrency(order.total)}
              </span>
            </div>
          </section>

          {/* Botões */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              to="/products"
              className="rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 py-4 text-center font-bold text-white shadow-lg shadow-violet-700/20 transition hover:scale-[1.02]"
            >
              Continuar comprando
            </Link>

            <Link
              to="/profile"
              className="rounded-2xl border border-border bg-surface px-8 py-4 text-center font-semibold text-text transition hover:border-violet-500"
            >
              Ver meus pedidos
            </Link>

            <Link
              to="/"
              className="rounded-2xl border border-border bg-background px-8 py-4 text-center font-semibold text-text transition hover:border-violet-500"
            >
              Início
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}