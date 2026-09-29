import { useState } from "react";
import { Link } from "react-router-dom";
import { Toast } from "../Toast";
import { useCart } from "../../../../app/providers/CartProvider";
import { useWishlist } from "../../../../app/providers/WishlistProvider";

type ProductCardProps = {
  id: number;
  image: string;
  name: string;
  category: string;
  price: number;
  installment?: string;
  rating: number;
  badge?: string;
  stock?: number;
};

export function ProductCard({
  id,
  image,
  name,
  category,
  price,
  installment,
  rating,
  badge,
  stock,
}: ProductCardProps) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [showToast, setShowToast] = useState(false);
  const [showWishToast, setShowWishToast] = useState(false);

  const isOutOfStock = stock === 0;
  const isLowStock = typeof stock === "number" && stock > 0 && stock <= 5;
  const isFavorited = isInWishlist(id);

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    addToCart({ id, image, name, price });

    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 2500);
  };

  const handleToggleWishlist = () => {
    toggleWishlist(id);

    setShowWishToast(true);

    setTimeout(() => {
      setShowWishToast(false);
    }, 2000);
  };

  return (
    <>
      {showToast && (
        <Toast message={`${name} foi adicionado ao carrinho`} />
      )}

      {showWishToast && (
        <Toast
          message={
            isFavorited
              ? `${name} foi adicionado aos favoritos`
              : `${name} foi removido dos favoritos`
          }
        />
      )}

      <article
        className="
          group
          relative
          overflow-hidden
          rounded-3xl
          border
          border-white/10
          bg-zinc-900/70
          p-5
          backdrop-blur-xl
          transition-all
          duration-500
          hover:-translate-y-2
          hover:border-violet-500/50
          hover:shadow-[0_25px_70px_rgba(124,58,237,.20)]
        "
      >
        <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-violet-600/10 blur-3xl transition duration-500 group-hover:bg-violet-600/20" />

        {/* Badges do topo (esquerda) */}
        <div className="absolute left-5 top-5 z-10 flex flex-col items-start gap-2">
          {isOutOfStock ? (
            <span className="rounded-full border border-red-500/30 bg-red-600/90 px-3 py-1 text-xs font-semibold text-white shadow-lg shadow-red-900/30">
              Esgotado
            </span>
          ) : isLowStock ? (
            <span className="rounded-full border border-amber-400/30 bg-amber-500/90 px-3 py-1 text-xs font-semibold text-black shadow-lg shadow-amber-900/30">
              Últimas unidades
            </span>
          ) : (
            badge && (
              <span className="rounded-full border border-violet-400/20 bg-violet-600/90 px-3 py-1 text-xs font-semibold text-white shadow-lg shadow-violet-900/20">
                {badge}
              </span>
            )
          )}
        </div>

        {/* Botão de favorito (direita) */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label={
            isFavorited ? "Remover dos favoritos" : "Adicionar aos favoritos"
          }
          className={`absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-300 ${
            isFavorited
              ? "border-fuchsia-500/50 bg-fuchsia-500/20 text-fuchsia-400 hover:bg-fuchsia-500/30"
              : "border-white/10 bg-zinc-950/60 text-zinc-400 hover:border-fuchsia-500/50 hover:text-fuchsia-400"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={isFavorited ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        <Link to={`/product/${id}`} className="block">
          <div className="relative mb-6 flex h-64 items-center justify-center overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-zinc-950 to-zinc-900">
            <div className="pointer-events-none absolute h-32 w-32 rounded-full bg-violet-600/10 blur-3xl transition-all duration-500 group-hover:bg-violet-600/20" />

            <img
              src={image}
              alt={name}
              className={`relative h-full w-full object-contain p-6 transition-transform duration-500 group-hover:scale-110 ${
                isOutOfStock ? "opacity-40 grayscale" : ""
              }`}
            />

            {isOutOfStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <span className="rounded-full border border-red-500/40 bg-red-600/20 px-4 py-2 text-sm font-black uppercase tracking-wider text-red-300">
                  Esgotado
                </span>
              </div>
            )}
          </div>
        </Link>

        <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">
          {category}
        </span>

        <Link
          to={`/product/${id}`}
          className="mt-2 block min-h-[56px] text-xl font-bold leading-7 text-white transition-colors duration-300 hover:text-violet-200"
        >
          {name}
        </Link>

        <div className="mt-3 flex items-center gap-2">
          <span className="text-sm tracking-wide text-yellow-400">
            {"★".repeat(Math.floor(rating))}
          </span>

          <span className="text-sm font-medium text-zinc-500">
            {rating.toFixed(1)}
          </span>
        </div>

        <div className="mt-5">
          <p className="text-3xl font-black tracking-tight text-white">
            {price.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>

          {installment && (
            <p className="mt-1 text-sm text-zinc-500">{installment}</p>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`
            mt-6
            w-full
            rounded-2xl
            py-3.5
            font-semibold
            text-white
            shadow-lg
            transition-all
            duration-300
            ${
              isOutOfStock
                ? "cursor-not-allowed bg-zinc-800 text-zinc-500 shadow-none"
                : "bg-gradient-to-r from-violet-600 to-fuchsia-600 shadow-violet-700/20 hover:scale-[1.02] hover:shadow-violet-500/40 active:scale-[0.98]"
            }
          `}
        >
          {isOutOfStock ? "Produto esgotado" : "Adicionar ao carrinho"}
        </button>
      </article>
    </>
  );
}