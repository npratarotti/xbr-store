export function AdminSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Cards de métrica */}
      <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="relative h-36 overflow-hidden rounded-3xl border border-border bg-surface/60 p-5"
          >
            <div className="h-3 w-20 rounded-full bg-background/80" />
            <div className="mt-4 h-7 w-32 rounded-lg bg-background/80" />
            <div className="mt-4 h-8 w-full rounded-lg bg-background/60" />
          </div>
        ))}
      </div>

      {/* Gráfico grande */}
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <div className="h-72 rounded-3xl border border-border bg-surface/60 lg:col-span-2" />
        <div className="h-64 rounded-3xl border border-border bg-surface/60" />
        <div className="h-64 rounded-3xl border border-border bg-surface/60" />
      </div>
    </div>
  );
}