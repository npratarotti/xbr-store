import { Link } from "react-router-dom";

import { Container } from "../../shared/components/layout/Container";

type OrderItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

type Order = {
  id: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
  address?: {
    cep: string;
    address: string;
    number: string;
    complement?: string;
    city: string;
    state: string;
  };
  payment: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
};

export function OrderSuccess() {
  const savedOrder = localStorage.getItem("xbr-last-order");

  const order: Order | null = savedOrder
    ? JSON.parse(savedOrder)
    : null;

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const formatPayment = (payment: string) => {
    if (payment === "pix") {
      return "PIX";
    }

    if (payment === "credit") {
      return "Cartão de crédito";
    }

    return payment;
  };

  if (!order) {
    return (
      <main className="min-h-screen bg-[#09090B] py-20">
        <Container>
          <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-zinc-900/70 px-6 py-20 text-center">
            <div className="text-6xl">📦</div>

            <h1 className="mt-6 text-3xl font-black text-white">
              Pedido não encontrado
            </h1>

            <p className="mt-3 text-zinc-500">
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
    <main className="min-h-screen bg-[#09090B] py-12 md:py-20">
      <Container>
        <div className="mx-auto max-w-4xl">
          {/* Sucesso */}

          <div className="rounded-3xl border border-white/10 bg-zinc-900/70 p-8 text-center shadow-2xl shadow-violet-900/10 md:p-12">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 text-4xl text-green-400">
              ✓
            </div>

            <span className="mt-8 block text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
              XBR Store
            </span>

            <h1 className="mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">
              Pedido{" "}
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">
                realizado!
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-zinc-400">
              Obrigado pela sua compra, {order.customer.name}.
              Seu pedido foi registrado com sucesso.
            </p>

            {/* Número do pedido */}

            <div className="mt-8 inline-flex flex-col rounded-2xl border border-violet-500/20 bg-violet-500/5 px-8 py-4">
              <span className="text-xs uppercase tracking-wider text-zinc-500">
                Número do pedido
              </span>

              <span className="mt-1 text-xl font-black text-violet-400">
                {order.id}
              </span>
            </div>
          </div>

          {/* Informações */}

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {/* Cliente */}

            <section className="rounded-3xl border border-white/10 bg-zinc-900/70 p-7">
              <h2 className="text-xl font-bold text-white">
                Dados do cliente
              </h2>

              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-zinc-600">
                    Nome
                  </p>

                  <p className="mt-1 font-medium text-zinc-200">
                    {order.customer.name}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-zinc-600">
                    E-mail
                  </p>

                  <p className="mt-1 break-all font-medium text-zinc-200">
                    {order.customer.email}
                  </p>
                </div>

                {order.customer.phone && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-zinc-600">
                      Telefone
                    </p>

                    <p className="mt-1 font-medium text-zinc-200">
                      {order.customer.phone}
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Pagamento */}

            <section className="rounded-3xl border border-white/10 bg-zinc-900/70 p-7">
              <h2 className="text-xl font-bold text-white">
                Pagamento
              </h2>

              <div className="mt-5">
                <p className="text-xs uppercase tracking-wider text-zinc-600">
                  Forma escolhida
                </p>

                <p className="mt-2 text-lg font-bold text-white">
                  {formatPayment(order.payment)}
                </p>

                <span className="mt-3 inline-block rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
                  Pedido confirmado
                </span>
              </div>
            </section>
          </div>

          {/* Endereço */}

          {order.address && (
            <section className="mt-6 rounded-3xl border border-white/10 bg-zinc-900/70 p-7">
              <h2 className="text-xl font-bold text-white">
                Endereço de entrega
              </h2>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-wider text-zinc-600">
                    Endereço
                  </p>

                  <p className="mt-1 text-zinc-300">
                    {order.address.address}, {order.address.number}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-zinc-600">
                    Cidade
                  </p>

                  <p className="mt-1 text-zinc-300">
                    {order.address.city} - {order.address.state}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-zinc-600">
                    CEP
                  </p>

                  <p className="mt-1 text-zinc-300">
                    {order.address.cep}
                  </p>
                </div>

                {order.address.complement && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-zinc-600">
                      Complemento
                    </p>

                    <p className="mt-1 text-zinc-300">
                      {order.address.complement}
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Produtos */}

          <section className="mt-6 rounded-3xl border border-white/10 bg-zinc-900/70 p-7">
            <h2 className="text-xl font-bold text-white">
              Produtos do pedido
            </h2>

            <div className="mt-6 space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-5 rounded-2xl border border-white/5 bg-zinc-950/60 p-4"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-white">
                      {item.name}
                    </p>

                    <p className="mt-1 text-sm text-zinc-500">
                      Quantidade: {item.quantity}
                    </p>
                  </div>

                  <p className="whitespace-nowrap font-bold text-zinc-300">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="my-6 h-px bg-white/10" />

            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-white">
                Total
              </span>

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
              className="rounded-2xl border border-white/10 bg-zinc-900 px-8 py-4 text-center font-semibold text-zinc-300 transition hover:border-violet-500 hover:text-white"
            >
              Ver meus pedidos
            </Link>

            <Link
              to="/"
              className="rounded-2xl border border-white/10 bg-zinc-950 px-8 py-4 text-center font-semibold text-zinc-300 transition hover:border-violet-500 hover:text-white"
            >
              Início
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}