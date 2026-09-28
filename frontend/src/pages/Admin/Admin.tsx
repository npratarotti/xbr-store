import { Container } from "../../shared/components/layout/Container";
import { ProductManager } from "./components/ProductManager";
import { OrderManager } from "./components/OrderManager";
import { CouponManager } from "./components/CouponManager";
import { ShippingManager } from "./components/ShippingManager";

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
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
};

export function Admin() {
  const orders: Order[] = JSON.parse(
    localStorage.getItem("xbr-orders") || "[]"
  );

  const products = JSON.parse(
    localStorage.getItem("xbr-products") || "[]"
  );

  const validOrders = orders.filter(
    (order) => order.status !== "Cancelado"
  );

  const totalSales = validOrders.reduce(
    (total, order) => total + order.total,
    0
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#09090B] py-12 md:py-20">

      {/* Glows de fundo */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-violet-700/10 blur-[140px]" />
        <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-fuchsia-600/5 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-violet-600/5 blur-[120px]" />
      </div>

      <Container>
        {/* Cabeçalho */}
        <div className="relative mb-12">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
            XBR Store
          </span>

          <h1 className="mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">
              Dashboard
            </span>
          </h1>

          <p className="mt-4 text-zinc-400">
            Visão geral da sua loja.
          </p>
        </div>

        {/* MÉTRICAS */}
        <div className="relative grid gap-5 md:grid-cols-3">
          {/* Pedidos */}
          <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 transition-all duration-500 hover:-translate-y-1 hover:border-violet-500/50 hover:shadow-[0_20px_60px_rgba(124,58,237,0.20)]">
            <div className="pointer-events-none absolute -top-20 right-0 h-40 w-40 rounded-full bg-violet-600/10 blur-3xl transition-all duration-500 group-hover:bg-violet-600/25" />

            <div className="relative flex items-center justify-between">
              <p className="text-sm text-zinc-500">Pedidos</p>
              <span className="text-2xl">📦</span>
            </div>

            <p className="relative mt-3 text-4xl font-black text-white">
              {orders.length}
            </p>
          </div>

          {/* Produtos */}
          <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 transition-all duration-500 hover:-translate-y-1 hover:border-violet-500/50 hover:shadow-[0_20px_60px_rgba(124,58,237,0.20)]">
            <div className="pointer-events-none absolute -top-20 right-0 h-40 w-40 rounded-full bg-violet-600/10 blur-3xl transition-all duration-500 group-hover:bg-violet-600/25" />

            <div className="relative flex items-center justify-between">
              <p className="text-sm text-zinc-500">Produtos cadastrados</p>
              <span className="text-2xl">🛍️</span>
            </div>

            <p className="relative mt-3 text-4xl font-black text-white">
              {products.length}
            </p>
          </div>

          {/* Vendas */}
          <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 transition-all duration-500 hover:-translate-y-1 hover:border-violet-500/50 hover:shadow-[0_20px_60px_rgba(124,58,237,0.20)]">
            <div className="pointer-events-none absolute -top-20 right-0 h-40 w-40 rounded-full bg-violet-600/10 blur-3xl transition-all duration-500 group-hover:bg-violet-600/25" />

            <div className="relative flex items-center justify-between">
              <p className="text-sm text-zinc-500">Vendas</p>
              <span className="text-2xl">💰</span>
            </div>

            <p className="relative mt-3 text-3xl font-black text-violet-400">
              {totalSales.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>
          </div>
        </div>

        {/* Separador visual */}
        <div className="relative my-14 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />

        {/* MANAGERS */}
        <div className="relative space-y-10">
          <OrderManager />
          <CouponManager />
          <ShippingManager />
          <ProductManager />
        </div>
      </Container>
    </main>
  );
}