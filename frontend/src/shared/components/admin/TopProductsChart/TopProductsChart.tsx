import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
  } from "recharts";
  
  type TopProductsChartProps = {
    data: { name: string; quantity: number; revenue: number }[];
  };
  
  export function TopProductsChart({ data }: TopProductsChartProps) {
    const formatCurrency = (value: number) =>
      value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
  
    // Trunca nome grande
    const formatName = (name: string) =>
      name.length > 20 ? `${name.slice(0, 20)}...` : name;
  
    const chartData = data.map((item) => ({
      ...item,
      shortName: formatName(item.name),
    }));
  
    return (
      <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-surface to-background p-6">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-text">
            Produtos mais vendidos
          </h3>
          <p className="mt-1 text-sm text-muted">
            Top 5 do período por quantidade
          </p>
        </div>
  
        {data.length === 0 ? (
          <div className="flex h-72 items-center justify-center">
            <p className="text-sm text-muted">Nenhuma venda no período</p>
          </div>
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ left: 0, right: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  stroke="#71717a"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="shortName"
                  stroke="#71717a"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  width={120}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181b",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    padding: 12,
                  }}
                  labelStyle={{ color: "#a1a1aa", fontSize: 12 }}
                  formatter={(value: number, _name, props: any) => [
                    `${value} un. (${formatCurrency(props.payload.revenue)})`,
                    "Vendidos",
                  ]}
                  labelFormatter={(_label, payload) =>
                    payload?.[0]?.payload?.name ?? ""
                  }
                />
                <Bar dataKey="quantity" radius={[0, 8, 8, 0]}>
                  {chartData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={index === 0 ? "#a855f7" : "#8b5cf6"}
                      fillOpacity={1 - index * 0.15}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    );
  }