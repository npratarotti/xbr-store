export function ProductSkeleton() {
  return (
    <article className="animate-pulse overflow-hidden rounded-3xl border border-border bg-surface/70 p-5">
      {/* Imagem */}
      <div className="relative mb-6 h-64 rounded-2xl bg-background/60" />

      {/* Categoria */}
      <div className="h-3 w-20 rounded-full bg-background/60" />

      {/* Nome */}
      <div className="mt-3 h-5 w-3/4 rounded-lg bg-background/60" />
      <div className="mt-2 h-5 w-1/2 rounded-lg bg-background/60" />

      {/* Rating */}
      <div className="mt-4 h-4 w-24 rounded-lg bg-background/60" />

      {/* Preço */}
      <div className="mt-5 h-8 w-32 rounded-lg bg-background/60" />

      {/* Botão */}
      <div className="mt-6 h-12 w-full rounded-2xl bg-background/60" />
    </article>
  );
}