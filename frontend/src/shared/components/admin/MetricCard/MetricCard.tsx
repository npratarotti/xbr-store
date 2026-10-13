type MetricCardProps = {
  label: string;
  value: string;
  change?: number;
  icon: string;
  sparkline?: number[];
};

function MiniSparkline({ data }: { data: number[] }) {
  if (!data || data.length < 2) return null;

  const width = 100;
  const height = 32;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data
    .map((value, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className="mt-3 h-8 w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="sparkline-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgb(168, 85, 247)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="rgb(168, 85, 247)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* área preenchida */}
      <polygon
        points={`0,${height} ${points} ${width},${height}`}
        fill="url(#sparkline-fill)"
      />

      {/* linha */}
      <polyline
        points={points}
        fill="none"
        stroke="rgb(168, 85, 247)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function MetricCard({
  label,
  value,
  change,
  icon,
  sparkline,
}: MetricCardProps) {
  const hasChange = typeof change === "number";
  const isPositive = hasChange && change >= 0;

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-surface to-background p-5 transition-all duration-500 hover:-translate-y-1 hover:border-violet-500/30">
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-violet-600/10 blur-3xl transition-all duration-500 group-hover:bg-violet-600/25" />

      <div className="relative flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted">
          {label}
        </span>
        <span className="text-lg">{icon}</span>
      </div>

      <p className="relative mt-3 text-2xl font-black tracking-tight text-text md:text-3xl">
        {value}
      </p>

      {hasChange && (
        <p
          className={`relative mt-2 text-xs font-semibold ${
            isPositive ? "text-green-400" : "text-red-400"
          }`}
        >
          {isPositive ? "▲" : "▼"} {Math.abs(change).toFixed(1)}%
          <span className="ml-1 text-muted/80">vs. período anterior</span>
        </p>
      )}

      {sparkline && <MiniSparkline data={sparkline} />}
    </div>
  );
}