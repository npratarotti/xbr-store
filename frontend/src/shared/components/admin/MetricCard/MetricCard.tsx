type MetricCardProps = {
    label: string;
    value: string;
    change?: number;
    icon: string;
  };
  
  export function MetricCard({ label, value, change, icon }: MetricCardProps) {
    const hasChange = typeof change === "number";
    const isPositive = hasChange && change >= 0;
  
    return (
      <div className="group relative overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-surface to-background p-6 transition-all duration-500 hover:-translate-y-1 hover:border-violet-500/50 hover:shadow-[0_20px_60px_rgba(124,58,237,0.20)]">
        <div className="pointer-events-none absolute -top-20 right-0 h-40 w-40 rounded-full bg-violet-600/10 blur-3xl transition-all duration-500 group-hover:bg-violet-600/25" />
  
        <div className="relative flex items-center justify-between">
          <p className="text-sm text-muted">{label}</p>
          <span className="text-2xl">{icon}</span>
        </div>
  
        <p className="relative mt-3 text-3xl font-black text-text">
          {value}
        </p>
  
        {hasChange && (
          <div className="relative mt-3 flex items-center gap-1.5 text-xs font-semibold">
            <span
              className={
                isPositive ? "text-green-500" : "text-red-400"
              }
            >
              {isPositive ? "▲" : "▼"}{" "}
              {Math.abs(change).toFixed(1)}%
            </span>
            <span className="text-muted">vs período anterior</span>
          </div>
        )}
      </div>
    );
  }