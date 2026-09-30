export function ProductSkeleton() {
    return (
      <article className="relative overflow-hidden rounded-3xl border border-border bg-surface/70 p-5">
        <div className="relative mb-6 h-64 animate-pulse rounded-2xl border border-border/50 bg-background/60" />
        <div className="h-3 w-20 animate-pulse rounded-full bg-background/60" />
        <div className="mt-3 space-y-2">
          <div className="h-5 w-full animate-pulse rounded-full bg-background/60" />
          <div className="h-5 w-3/4 animate-pulse rounded-full bg-background/60" />
        </div>
        <div className="mt-4 h-4 w-24 animate-pulse rounded-full bg-background/60" />
        <div className="mt-5 space-y-2">
          <div className="h-8 w-32 animate-pulse rounded-full bg-background/60" />
          <div className="h-4 w-28 animate-pulse rounded-full bg-background/60" />
        </div>
        <div className="mt-6 h-12 w-full animate-pulse rounded-2xl bg-background/60" />
      </article>
    );
  }