import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { Container } from "../../shared/components/layout/Container";
import { ProductCard } from "../../shared/components/ui/ProductCard";
import { ProductSkeleton } from "../../shared/components/ui/ProductSkeleton/ProductSkeleton";
import { useProducts } from "../../shared/hooks/useProducts";
import { categories } from "../../shared/constants/categories";

export function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, loading, error } = useProducts();

  const urlSearch = searchParams.get("search") || "";
  const urlCategory = searchParams.get("category") || "";

  const [search, setSearch] = useState(urlSearch);
  const [category, setCategory] = useState(urlCategory || "Todos");
  const [sort, setSort] = useState("default");

  useEffect(() => {
    setSearch(urlSearch);
  }, [urlSearch]);

  useEffect(() => {
    setCategory(urlCategory || "Todos");
  }, [urlCategory]);

  useEffect(() => {
    if (search === urlSearch) return;

    const timer = setTimeout(() => {
      const next = new URLSearchParams(searchParams);

      if (search.trim()) {
        next.set("search", search.trim());
      } else {
        next.delete("search");
      }

      setSearchParams(next, { replace: true });
    }, 400);

    return () => clearTimeout(timer);
  }, [search, urlSearch, searchParams, setSearchParams]);

  const handleCategoryChange = (value: string) => {
    setCategory(value);

    const next = new URLSearchParams(searchParams);

    if (value === "Todos") {
      next.delete("category");
    } else {
      next.set("category", value);
    }

    setSearchParams(next, { replace: true });
  };

  const dynamicCategories = useMemo(() => {
    const names = new Set<string>([
      ...categories.map((c) => c.name),
      ...products.map((p) => p.category),
    ]);

    return Array.from(names).sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const normalizedSearch = search.toLowerCase().trim();

      const matchesSearch =
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.category.toLowerCase().includes(normalizedSearch);

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
  }, [products, search, category, sort]);

  const handleClearFilters = () => {
    setSearch("");
    setCategory("Todos");
    setSort("default");
    setSearchParams({}, { replace: true });
  };

  return (
    <main className="min-h-screen bg-background py-20 transition-colors duration-300">
      <Container>
        <div className="mb-12">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
            XBR Store
          </span>

          <h1 className="mt-3 text-5xl font-black text-text md:text-6xl">
            Todos os produtos
          </h1>

          <p className="mt-4 max-w-2xl text-lg text-muted">
            Tecnologia de alto desempenho para acompanhar o seu ritmo.
          </p>
        </div>

        <div className="mb-10 flex flex-col gap-4 rounded-3xl border border-border bg-surface/60 p-5 md:flex-row">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar produtos..."
            className="flex-1 rounded-2xl border border-border bg-background px-5 py-3.5 text-text outline-none transition placeholder:text-muted focus:border-violet-500"
          />

          <select
            value={category}
            onChange={(event) => handleCategoryChange(event.target.value)}
            className="rounded-2xl border border-border bg-background px-5 py-3.5 text-muted outline-none focus:border-violet-500"
          >
            <option value="Todos">Todas as categorias</option>

            {dynamicCategories.map((categoryName) => (
              <option key={categoryName} value={categoryName}>
                {categoryName}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="rounded-2xl border border-border bg-background px-5 py-3.5 text-muted outline-none focus:border-violet-500"
          >
            <option value="default">Ordenar por</option>
            <option value="price-asc">Menor preço</option>
            <option value="price-desc">Maior preço</option>
            <option value="rating">Mais bem avaliados</option>
          </select>
        </div>

        {category !== "Todos" && (
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm font-semibold text-violet-300">
              <span>Categoria: {category}</span>

              <button
                type="button"
                onClick={() => handleCategoryChange("Todos")}
                aria-label="Remover filtro de categoria"
                className="rounded-full text-violet-300 transition hover:text-white"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* 🆕 Estados de loading, erro e vazio */}

        {loading ? (
          <>
            <div className="mb-6 flex items-center gap-2">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-violet-500" />
              <p className="text-sm text-muted">Carregando produtos...</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          </>
        ) : error ? (
          <div className="rounded-3xl border border-red-500/20 bg-red-500/5 py-20 text-center">
            <p className="text-xl font-bold text-red-400">
              Erro ao carregar produtos
            </p>
            <p className="mt-2 text-muted">{error}</p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-muted">
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1
                  ? "produto encontrado"
                  : "produtos encontrados"}
              </p>
            </div>

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
                    reviewCount={product.reviewCount} 
                    badge={product.badge}
                    stock={product.stock}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-border bg-surface/50 py-20 text-center">
                <p className="text-xl font-bold text-text">
                  Nenhum produto encontrado
                </p>

                <p className="mt-2 text-muted">
                  Tente buscar outro produto ou categoria.
                </p>

                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="mt-6 rounded-2xl bg-violet-600 px-6 py-3 font-semibold text-white transition hover:bg-violet-700"
                >
                  Limpar filtros
                </button>
              </div>
            )}
          </>
        )}
      </Container>
    </main>
  );
}