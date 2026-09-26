import { useState } from "react";
import { useParams } from "react-router-dom";
import { Container } from "../../shared/components/layout/Container";
import { Toast } from "../../shared/components/ui/Toast";
import { useCart } from "../../app/providers/CartProvider";
import { useProducts } from "../../shared/hooks/useProducts";

export function Product() {
  const { id } = useParams();
  const products = useProducts();
  const product = products.find((item) => item.id === Number(id));

  const { addToCart } = useCart();
  const [showToast, setShowToast] = useState(false);

  if (!product) {
    return (
      <main className="min-h-screen bg-[#09090B] py-20">
        <Container>
          <h1 className="text-3xl font-black text-white">
            Produto não encontrado
          </h1>
        </Container>
      </main>
    );
  }

  const isOutOfStock = product.stock === 0;
  const isLowStock =
    typeof product.stock === "number" &&
    product.stock > 0 &&
    product.stock <= 5;

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    addToCart({
      id: product.id,
      image: product.image,
      name: product.name,
      price: product.price,
    });

    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 2500);
  };

  return (
    <>
      {showToast && (
        <Toast message={`${product.name} foi adicionado ao carrinho`} />
      )}

      <main className="min-h-screen bg-[#09090B] py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="relative flex min-h-[500px] items-center justify-center rounded-3xl border border-white/10 bg-zinc-900/60 p-10">
              <img
                src={product.image}
                alt={product.name}
                className={`max-h-[450px] w-full object-contain ${
                  isOutOfStock ? "opacity-40 grayscale" : ""
                }`}
              />

              {isOutOfStock && (
                <div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-black/60">
                  <span className="rounded-full border border-red-500/40 bg-red-600/20 px-6 py-3 text-lg font-black uppercase tracking-wider text-red-300">
                    Esgotado
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center">
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
                {product.category}
              </span>

              <h1 className="mt-4 text-4xl font-black text-white md:text-5xl">
                {product.name}
              </h1>

              <div className="mt-5 flex items-center gap-3">
                <span className="tracking-wide text-yellow-400">
                  {"★".repeat(Math.floor(product.rating))}
                </span>

                <span className="text-sm text-zinc-500">
                  {product.rating.toFixed(1)} / 5
                </span>
              </div>

              <div className="my-8 h-px bg-white/10" />

              <p className="text-4xl font-black text-white">
                {product.price.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </p>

              <p className="mt-2 text-zinc-500">{product.installment}</p>

              {isLowStock && (
                <p className="mt-4 inline-flex w-fit items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-400">
                  🔥 Apenas {product.stock} em estoque
                </p>
              )}

              <p className="mt-8 max-w-xl leading-7 text-zinc-400">
                Produto premium selecionado pela XBR Store, desenvolvido para
                oferecer alto desempenho, qualidade e uma experiência
                diferenciada.
              </p>

              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`
                  mt-10 w-full rounded-2xl py-4 font-bold text-white transition
                  lg:max-w-md
                  ${
                    isOutOfStock
                      ? "cursor-not-allowed bg-zinc-800 text-zinc-500"
                      : "bg-gradient-to-r from-violet-600 to-fuchsia-600 shadow-lg shadow-violet-700/20 hover:scale-[1.02] hover:shadow-violet-500/40 active:scale-[0.98]"
                  }
                `}
              >
                {isOutOfStock
                  ? "Produto esgotado"
                  : "Adicionar ao carrinho"}
              </button>
            </div>
          </div>
        </Container>
      </main>
    </>
  );
}