import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
  } from "recharts";
  
  type SalesChartProps = {
    data: { label: string; total: number }[];
  };
  
  export function SalesChart({ data }: SalesChartProps) {
    const formatCurrency = (value: number) =>
      value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
  
    const formatCompact = (value: number) => {
      if (value >= 1000) {
        return `R$ ${(value / 1000).toFixed(1)}k`;
      }
      return `R$ ${value}`;
    };
  
    return (
      <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-surface to-background p-6">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-text">Vendas ao longo do tempo</h3>
          <p className="mt-1 text-sm text-muted">
            Faturamento diário no período selecionado
          </p>
        </div>
  
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
              />
              <XAxis
                dataKey="label"
                stroke="#71717a"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#71717a"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatCompact}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#18181b",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  padding: 12,
                }}
                labelStyle={{ color: "#a1a1aa", fontSize: 12 }}
                itemStyle={{ color: "#8b5cf6", fontWeight: 600 }}
                formatter={(value: number) => [formatCurrency(value), "Vendas"]}
                labelFormatter={(label) => `Dia ${label}`}
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ fill: "#8b5cf6", r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: "#a855f7" }}
                fill="url(#colorTotal)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }