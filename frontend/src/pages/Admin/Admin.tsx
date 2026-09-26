import { Container } from "../../shared/components/layout/Container";
import { ProductManager } from "./components/ProductManager";
import { OrderManager } from "./components/OrderManager";
import { CouponManager } from "./components/CouponManager";
import { ShippingManager } from "./components/ShippingManager";   // ⬅️ NOVO

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
    <main className="min-h-screen bg-[#09090B] py-12 md:py-20">
      <Container>
        <div className="mb-12">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
            XBR Store
          </span>

          <h1 className="mt-3 text-4xl font-black text-white md:text-5xl">
            Dashboard
          </h1>

          <p className="mt-4 text-zinc-400">
            Visão geral da sua loja.
          </p>
        </div>

        {/* MÉTRICAS */}
        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-zinc-900/70 p-6">
            <p className="text-sm text-zinc-500">Pedidos</p>

            <p className="mt-3 text-4xl font-black text-white">
              {orders.length}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-zinc-900/70 p-6">
            <p className="text-sm text-zinc-500">
              Produtos cadastrados
            </p>

            <p className="mt-3 text-4xl font-black text-white">
              {products.length}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-zinc-900/70 p-6">
            <p className="text-sm text-zinc-500">Vendas</p>

            <p className="mt-3 text-3xl font-black text-violet-400">
              {totalSales.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>
          </div>
        </div>

        {/* PEDIDOS */}
        <OrderManager />

        {/* CUPONS */}
        <CouponManager />

        {/* FRETE */}
        <ShippingManager /> 

        {/* PRODUTOS */}
        <ProductManager />
      </Container>
    </main>
  );
}