import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
  } from "recharts";
  
  type StatusChartProps = {
    data: { status: string; count: number; percentage: number }[];
  };
  
  const STATUS_COLORS: Record<string, string> = {
    Pendente: "#eab308",
    Pago: "#3b82f6",
    Enviado: "#8b5cf6",
    Entregue: "#22c55e",
    Cancelado: "#ef4444",
  };
  
  export function StatusChart({ data }: StatusChartProps) {
    const chartData = data.filter((d) => d.count > 0);
  
    const total = chartData.reduce((sum, d) => sum + d.count, 0);
  
    return (
      <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-surface to-background p-6">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-text">
            Status dos pedidos
          </h3>
          <p className="mt-1 text-sm text-muted">
            Distribuição geral ({total} pedidos)
          </p>
        </div>
  
        {chartData.length === 0 ? (
          <div className="flex h-72 items-center justify-center">
            <p className="text-sm text-muted">Nenhum pedido cadastrado</p>
          </div>
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={
                        STATUS_COLORS[entry.status] ?? "#71717a"
                      }
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181b",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    padding: 12,
                  }}
                  labelStyle={{ color: "#a1a1aa", fontSize: 12 }}
                  formatter={(value: number, _name, props: any) => [
                    `${value} pedidos (${props.payload.percentage.toFixed(1)}%)`,
                    props.payload.status,
                  ]}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  formatter={(value, entry: any) => (
                    <span style={{ color: "#a1a1aa", fontSize: 12 }}>
                      {value} ({entry.payload.count})
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    );
  }