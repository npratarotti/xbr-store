import { useMemo, useState } from "react";
import { Container } from "../../shared/components/layout/Container";
import { ProductCard } from "../../shared/components/ui/ProductCard";
import { products } from "../../shared/constants/products";

export function Products() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [sort, setSort] = useState("default");

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "Todos" || product.category === category;

      return matchesSearch && matchesCategory;
    });

    if (sort === "price-asc") {
      result = [...result].sort((a, b) => a.price - b.price);
    }

    if (sort === "price-desc") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    if (sort === "rating") {
      result = [...result].sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [search, category, sort]);

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

        {/* Filtros */}
        <div className="mb-10 flex flex-col gap-4 rounded-3xl border border-white/10 bg-zinc-900/60 p-5 md:flex-row">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar produtos..."
            className="flex-1 rounded-2xl border border-white/10 bg-zinc-950 px-5 py-3.5 text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-500"
          />

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="rounded-2xl border border-white/10 bg-zinc-950 px-5 py-3.5 text-zinc-300 outline-none focus:border-violet-500"
          >
            <option value="Todos">Todas as categorias</option>
            <option value="Notebook">Notebook</option>
            <option value="Smartphone">Smartphone</option>
            <option value="Áudio">Áudio</option>
            <option value="Wearables">Wearables</option>
          </select>

          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="rounded-2xl border border-white/10 bg-zinc-950 px-5 py-3.5 text-zinc-300 outline-none focus:border-violet-500"
          >
            <option value="default">Ordenar por</option>
            <option value="price-asc">Menor preço</option>
            <option value="price-desc">Maior preço</option>
            <option value="rating">Mais bem avaliados</option>
          </select>
        </div>

        {/* Resultado */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-zinc-500">
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "produto encontrado" : "produtos encontrados"}
          </p>
        </div>

        {/* Produtos */}
        {filteredProducts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
             <ProductCard
             key={product.id}
             id={product.id}
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
        ) : (
          <div className="rounded-3xl border border-white/10 bg-zinc-900/50 py-20 text-center">
            <p className="text-xl font-bold text-white">
              Nenhum produto encontrado
            </p>

            <p className="mt-2 text-zinc-500">
              Tente buscar outro produto ou categoria.
            </p>
          </div>
        )}
      </Container>
    </main>
  );
}