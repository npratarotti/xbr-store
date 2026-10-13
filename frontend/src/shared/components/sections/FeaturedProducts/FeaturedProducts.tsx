import { Link } from "react-router-dom";
import { ProductCard } from "../../ui/ProductCard/ProductCard";
import { ProductSkeleton } from "../../ui/ProductSkeleton/ProductSkeleton";
import { useProducts } from "../../../hooks/useProducts";

export function FeaturedProducts() {
  const { products, loading } = useProducts();

  const featured = products.slice(0, 4);

  return (
    <section className="bg-background py-20 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-400">
            Nossos produtos
          </span>

          <h2 className="mt-4 text-3xl font-black tracking-tight text-text md:text-5xl">
            Produtos em{" "}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">
              destaque
            </span>
          </h2>

          <p className="mt-4 text-muted">
            Os produtos mais desejados da XBR Store.
          </p>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <div className="rounded-3xl border border-border bg-surface/60 px-6 py-20 text-center">
            <div className="text-5xl">📦</div>
            <p className="mt-4 font-semibold text-text">
              Nenhum produto cadastrado ainda.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((product) => (
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
        )}

        <div className="mt-12 text-center">
          <Link
            to="/products"
            className="inline-block rounded-2xl border border-border bg-surface px-8 py-4 font-bold text-text transition hover:border-violet-500"
          >
            Ver todos os produtos
          </Link>
        </div>
      </div>
    </section>
  );
}