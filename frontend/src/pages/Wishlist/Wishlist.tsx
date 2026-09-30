import { Link } from "react-router-dom";
import { Container } from "../../shared/components/layout/Container";
import { ProductCard } from "../../shared/components/ui/ProductCard";
import { ProductSkeleton } from "../../shared/components/ui/ProductSkeleton/ProductSkeleton";
import { useProducts } from "../../shared/hooks/useProducts";
import { useWishlist } from "../../app/providers/WishlistProvider";

export function Wishlist() {
  const { wishlist } = useWishlist();
  const { products, loading, error } = useProducts();

  const favoriteProducts = products.filter((product) =>
    wishlist.includes(product.id)
  );

  return (
    <main className="min-h-screen bg-background py-20 transition-colors duration-300">
      <Container>
        <div className="mb-12">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
            XBR Store
          </span>

          <h1 className="mt-3 text-4xl font-black tracking-tight text-text md:text-5xl">
            Meus{" "}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">
              favoritos
            </span>
          </h1>

          <p className="mt-4 max-w-2xl text-muted">
            Os produtos que você salvou para comprar depois.
          </p>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-500/20 bg-red-500/5 py-20 text-center">
            <p className="text-xl font-bold text-red-400">
              Erro ao carregar favoritos
            </p>
            <p className="mt-2 text-muted">{error}</p>
          </div>
        ) : favoriteProducts.length === 0 ? (
          <div className="rounded-3xl border border-border bg-surface/60 px-6 py-24 text-center">
            <div className="text-6xl">💜</div>

            <h2 className="mt-6 text-2xl font-bold text-text">
              Sua lista de favoritos está vazia
            </h2>

            <p className="mt-3 text-muted">
              Toque no coração de qualquer produto para salvá-lo aqui.
            </p>

            <Link
              to="/products"
              className="mt-8 inline-block rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 py-4 font-bold text-white shadow-lg shadow-violet-700/20 transition hover:scale-[1.02]"
            >
              Explorar produtos
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-violet-500" />

              <p className="text-sm text-muted">
                <span className="font-bold text-text">
                  {favoriteProducts.length}
                </span>{" "}
                {favoriteProducts.length === 1
                  ? "produto salvo"
                  : "produtos salvos"}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {favoriteProducts.map((product) => (
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
                  stock={product.stock}
                />
              ))}
            </div>
          </>
        )}
      </Container>
    </main>
  );
}