import { useState } from "react";
import { Container } from "../../shared/components/layout/Container";
import { ProductManager } from "./components/ProductManager";
import { OrderManager } from "./components/OrderManager";
import { CouponManager } from "./components/CouponManager";
import { ShippingManager } from "./components/ShippingManager";
import { useOrders } from "../../shared/hooks/useOrders";
import {
  useAdminStats,
  type PeriodOption,
} from "../../shared/hooks/useAdminStats";
import { MetricCard } from "../../shared/components/admin/MetricCard/MetricCard";
import { SalesChart } from "../../shared/components/admin/SalesChart/SalesChart";
import { TopProductsChart } from "../../shared/components/admin/TopProductsChart/TopProductsChart";
import { StatusChart } from "../../shared/components/admin/StatusChart/StatusChart";
import { AdminSkeleton } from "../../shared/components/admin/AdminSkeleton/AdminSkeleton";

type TabKey = "dashboard" | "pedidos" | "produtos" | "cupons" | "frete";

type Tab = {
  key: TabKey;
  label: string;
  icon: string;
};

const TABS: Tab[] = [
  { key: "dashboard", label: "Dashboard", icon: "📊" },
  { key: "pedidos", label: "Pedidos", icon: "📦" },
  { key: "produtos", label: "Produtos", icon: "🛒" },
  { key: "cupons", label: "Cupons", icon: "🎟️" },
  { key: "frete", label: "Frete", icon: "🚚" },
];

type PeriodFilter = {
  value: PeriodOption;
  label: string;
};

const PERIOD_OPTIONS: PeriodFilter[] = [
  { value: "7d", label: "7 dias" },
  { value: "30d", label: "30 dias" },
  { value: "90d", label: "90 dias" },
  { value: "all", label: "Tudo" },
];

export function Admin() {
  const { orders, loading } = useOrders();
  const [period, setPeriod] = useState<PeriodOption>("30d");
  const [activeTab, setActiveTab] = useState<TabKey>("dashboard");

  const stats = useAdminStats(orders, period);

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  return (
    <main className="relative min-h-screen overflow-hidden bg-background py-12 transition-colors duration-300 md:py-20">
      {/* LUZES DE FUNDO */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-violet-700/10 blur-[140px]" />
        <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-fuchsia-600/5 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-violet-600/5 blur-[120px]" />
      </div>

      <Container>
        {/* HEADER */}
        <div className="relative mb-8">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
            XBR Store
          </span>

          <h1 className="mt-3 text-4xl font-black tracking-tight text-text md:text-5xl">
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">
              Painel Admin
            </span>
          </h1>

          <p className="mt-4 text-muted">
            Gerencie sua loja em um só lugar.
          </p>
        </div>

        {/* ABAS */}
        <div className="relative mb-8 overflow-x-auto">
          <div className="flex min-w-max gap-2 border-b border-border pb-1">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.key;

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 rounded-t-2xl border-b-2 px-4 py-3 text-sm font-semibold transition md:px-5 md:text-base ${
                    isActive
                      ? "border-violet-500 bg-violet-500/10 text-violet-300"
                      : "border-transparent text-muted hover:bg-surface/60 hover:text-text"
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* CONTEÚDO DAS ABAS */}
        <div className="relative">
          {activeTab === "dashboard" && (
            <section>
              {/* Filtro de período */}
              <div className="relative mb-8">
                <span className="mb-3 block text-sm font-medium text-muted">
                  Período:
                </span>
                <div className="flex flex-wrap gap-2">
                  {PERIOD_OPTIONS.map((option) => {
                    const isActive = period === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setPeriod(option.value)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition sm:px-4 sm:py-2 ${
                          isActive
                            ? "border-violet-500/40 bg-violet-500/20 text-violet-300"
                            : "border-border bg-surface/60 text-muted hover:border-violet-500/30 hover:text-text"
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {loading ? (
                <AdminSkeleton />
              ) : (
                <>
                  {/* MÉTRICAS */}
                  <div className="relative grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
                    <MetricCard
                      label="Faturamento"
                      value={formatCurrency(stats.totalRevenue)}
                      change={stats.revenueChange}
                      icon="💰"
                      sparkline={stats.salesByDay.map((d) => d.total)}
                    />
                    <MetricCard
                      label="Pedidos"
                      value={String(stats.totalOrders)}
                      change={stats.ordersChange}
                      icon="📦"
                      sparkline={stats.salesByDay.map((d) => d.count)}
                    />
                    <MetricCard
                      label="Clientes únicos"
                      value={String(stats.uniqueCustomers)}
                      icon="👥"
                    />
                    <MetricCard
                      label="Ticket médio"
                      value={formatCurrency(stats.averageTicket)}
                      icon="🎯"
                    />
                  </div>

                  {/* GRÁFICOS */}
                  <div className="relative mt-6 grid gap-5 lg:grid-cols-2">
                    <div className="lg:col-span-2">
                      <SalesChart data={stats.salesByDay} />
                    </div>

                    <TopProductsChart data={stats.topProducts} />
                    <StatusChart data={stats.statusDistribution} />
                  </div>
                </>
              )}
            </section>
          )}

          {activeTab === "pedidos" && <OrderManager />}
          {activeTab === "produtos" && <ProductManager />}
          {activeTab === "cupons" && <CouponManager />}
          {activeTab === "frete" && <ShippingManager />}
        </div>
      </Container>
    </main>
  );
}