import { Container } from "../../shared/components/layout/Container";
import { ProductCard } from "../../shared/components/ui/ProductCard";
import { products } from "../../shared/constants/products";

export function Products() {
  return (
    <main className="min-h-screen bg-[#09090B] py-20">
      <Container>
        {/* Cabeçalho */}
        <div className="mb-12">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
            XBR Store
          </span>

          <h1 className="mt-3 text-5xl font-black text-white md:text-6xl">
            Todos os produtos
          </h1>

          <p className="mt-4 max-w-2xl text-lg text-zinc-400">
            Tecnologia de alto desempenho para acompanhar o seu ritmo.
          </p>
        </div>

        {/* Busca e filtros */}
        <div className="mb-10 flex flex-col gap-4 rounded-3xl border border-white/10 bg-zinc-900/60 p-5 md:flex-row">
          <input
            type="text"
            placeholder="Buscar produtos..."
            className="flex-1 rounded-2xl border border-white/10 bg-zinc-950 px-5 py-3.5 text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-500"
          />

          <select
            className="rounded-2xl border border-white/10 bg-zinc-950 px-5 py-3.5 text-zinc-300 outline-none focus:border-violet-500"
          >
            <option>Todos os produtos</option>
            <option>Notebook</option>
            <option>Smartphone</option>
            <option>Áudio</option>
            <option>Wearables</option>
          </select>

          <select
            className="rounded-2xl border border-white/10 bg-zinc-950 px-5 py-3.5 text-zinc-300 outline-none focus:border-violet-500"
          >
            <option>Ordenar</option>
            <option>Menor preço</option>
            <option>Maior preço</option>
            <option>Mais bem avaliados</option>
          </select>
        </div>

        {/* Produtos */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              image={product.image}
              name={product.name}
              category={product.category}
              price={product.price}
              installment={product.installment}
              rating={product.rating}
              badge={product.badge}
            />
          ))}
        </div>
      </Container>
    </main>
  );
}