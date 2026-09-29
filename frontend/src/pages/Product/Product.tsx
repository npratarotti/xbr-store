import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container } from "../../shared/components/layout/Container";
import { Toast } from "../../shared/components/ui/Toast";
import { useCart } from "../../app/providers/CartProvider";
import { useProducts } from "../../shared/hooks/useProducts";
import { useAuth } from "../../app/providers/AuthProvider";
import {
  useReviews,
  getProductReviews,
  getAverageRating,
  hasUserBoughtProduct,
  getUserReview,
  upsertReview,
  deleteReview,
} from "../../shared/hooks/useReviews";
import { ReviewCard } from "../../shared/components/ui/ReviewCard/ReviewCard";
import { ReviewForm } from "../../shared/components/ui/ReviewForm/ReviewForm";
import { StarRating } from "../../shared/components/ui/StarRating/StarRating";

type ToastState = {
  message: string;
  type: "success" | "error";
};

export function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const products = useProducts();
  const product = products.find((item) => item.id === Number(id));

  const { addToCart } = useCart();
  const { user } = useAuth();

  const [showToast, setShowToast] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  useReviews();

  const productId = Number(id);

  const [showForm, setShowForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const reviews = product ? getProductReviews(productId) : [];
  const { average, count } = product
    ? getAverageRating(productId)
    : { average: 0, count: 0 };

  const userEmail = user?.email?.toLowerCase().trim() ?? "";
  const hasBought = userEmail
    ? hasUserBoughtProduct(userEmail, productId)
    : false;
  const userReview = userEmail ? getUserReview(userEmail, productId) : null;

  useEffect(() => {
    setShowForm(false);
    setShowDeleteConfirm(false);
  }, [productId]);

  // Auto-dismiss do toast de review
  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  if (!product) {
    return (
      <main className="min-h-screen bg-background py-20 transition-colors duration-300">
        <Container>
          <h1 className="text-3xl font-black text-text">
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

  // 🆕 "Comprar agora" — adiciona e vai direto pro checkout
  const handleBuyNow = () => {
    if (isOutOfStock) return;

    addToCart({
      id: product.id,
      image: product.image,
      name: product.name,
      price: product.price,
    });

    navigate("/checkout");
  };

  // 🆕 Compartilhar produto
  const handleShare = async () => {
    const url = window.location.href;

    if (typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: product.name,
          text: `Olha esse produto na XBR Store: ${product.name}`,
          url,
        });
        return;
      } catch {
        // usuário cancelou — ignora
        return;
      }
    }

    // Fallback: copia pra área de transferência
    try {
      await navigator.clipboard.writeText(url);
      setToast({
        message: "Link copiado para a área de transferência!",
        type: "success",
      });
    } catch {
      setToast({
        message: "Não foi possível copiar o link.",
        type: "error",
      });
    }
  };

  const handleSubmitReview = (data: {
    rating: number;
    comment: string;
    photo?: string;
  }) => {
    if (!user) return;

    const isEditing = !!userReview;

    upsertReview({
      productId: product.id,
      userEmail: user.email,
      userName: user.name,
      rating: data.rating,
      comment: data.comment,
      photo: data.photo,
    });

    setShowForm(false);

    setToast({
      message: isEditing
        ? "Sua avaliação foi atualizada!"
        : "Sua avaliação foi publicada!",
      type: "success",
    });
  };

  const handleDeleteReview = () => {
    if (!userReview) return;
    deleteReview(userReview.id);
    setShowDeleteConfirm(false);

    setToast({
      message: "Sua avaliação foi removida.",
      type: "error",
    });
  };

  return (
    <>
      {showToast && (
        <Toast message={`${product.name} foi adicionado ao carrinho`} />
      )}

      {toast && <Toast message={toast.message} type={toast.type} />}

      <main className="min-h-screen bg-background py-20 transition-colors duration-300">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="relative flex min-h-[500px] items-center justify-center rounded-3xl border border-border bg-surface/60 p-10">
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
              <div className="flex items-start justify-between gap-4">
                <span className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
                  {product.category}
                </span>

                {/* 🆕 Botão de compartilhar */}
                <button
                  type="button"
                  onClick={handleShare}
                  aria-label="Compartilhar produto"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface/60 text-muted transition hover:border-violet-500/50 hover:text-violet-400"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                </button>
              </div>

              <h1 className="mt-4 text-4xl font-black text-text md:text-5xl">
                {product.name}
              </h1>

              <div className="mt-5 flex items-center gap-3">
                <span className="tracking-wide text-yellow-400">
                  {"★".repeat(Math.floor(product.rating))}
                </span>

                <span className="text-sm text-muted">
                  {product.rating.toFixed(1)} / 5
                </span>

                {count > 0 && (
                  <span className="text-sm text-muted">
                    · {count} avaliaç{count === 1 ? "ão" : "ões"}
                  </span>
                )}
              </div>

              <div className="my-8 h-px bg-border" />

              <p className="text-4xl font-black text-text">
                {product.price.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </p>

              <p className="mt-2 text-muted">{product.installment}</p>

              {isLowStock && (
                <p className="mt-4 inline-flex w-fit items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-400">
                  🔥 Apenas {product.stock} em estoque
                </p>
              )}

              <p className="mt-8 max-w-xl leading-7 text-muted">
                Produto premium selecionado pela XBR Store, desenvolvido para
                oferecer alto desempenho, qualidade e uma experiência
                diferenciada.
              </p>

              {/* 🆕 Botões de ação */}
              <div className="mt-10 flex flex-col gap-3 sm:flex-row lg:max-w-md">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`
                    flex-1 rounded-2xl py-4 font-bold transition
                    ${
                      isOutOfStock
                        ? "cursor-not-allowed bg-zinc-800 text-zinc-500"
                        : "border border-violet-500/40 bg-transparent text-violet-400 hover:bg-violet-500/10"
                    }
                  `}
                >
                  {isOutOfStock
                    ? "Produto esgotado"
                    : "Adicionar ao carrinho"}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className={`
                    flex-1 rounded-2xl py-4 font-bold text-white transition
                    ${
                      isOutOfStock
                        ? "cursor-not-allowed bg-zinc-800 text-zinc-500"
                        : "bg-gradient-to-r from-violet-600 to-fuchsia-600 shadow-lg shadow-violet-700/20 hover:scale-[1.02] hover:shadow-violet-500/40 active:scale-[0.98]"
                    }
                  `}
                >
                  {isOutOfStock ? "Indisponível" : "Comprar agora"}
                </button>
              </div>
            </div>
          </div>

          {/* AVALIAÇÕES */}
          <section className="mt-20">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
                  Avaliações
                </span>

                <h2 className="mt-2 text-3xl font-black tracking-tight text-text">
                  O que dizem sobre{" "}
                  <span className="bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">
                    este produto
                  </span>
                </h2>

                {count > 0 ? (
                  <div className="mt-3 flex items-center gap-3">
                    <StarRating value={average} size="md" readOnly />
                    <span className="text-sm text-muted">
                      <span className="font-bold text-text">
                        {average.toFixed(1)}
                      </span>{" "}
                      · {count} avaliaç{count === 1 ? "ão" : "ões"}
                    </span>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-muted">
                    Ainda não há avaliações para este produto.
                  </p>
                )}
              </div>

              {user && hasBought && !userReview && !showForm && (
                <button
                  type="button"
                  onClick={() => setShowForm(true)}
                  className="rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 font-bold text-white shadow-lg shadow-violet-700/20 transition hover:scale-[1.02]"
                >
                  ✍️ Avaliar produto
                </button>
              )}
            </div>

            {!user && (
              <div className="rounded-3xl border border-border bg-surface/50 px-6 py-10 text-center">
                <p className="text-muted">
                  Faça login e compre este produto para poder avaliá-lo.
                </p>
              </div>
            )}

            {user && !hasBought && (
              <div className="rounded-3xl border border-border bg-surface/50 px-6 py-10 text-center">
                <p className="text-muted">
                  Você precisa ter comprado este produto para avaliá-lo.
                </p>
              </div>
            )}

            {user && hasBought && showForm && (
              <div className="mb-8">
                <ReviewForm
                  initialReview={userReview}
                  onSubmit={handleSubmitReview}
                  onCancel={() => setShowForm(false)}
                />
              </div>
            )}

            {reviews.length > 0 && (
              <div className="space-y-5">
                {reviews.map((review) => {
                  const isOwner =
                    !!user &&
                    review.userEmail.toLowerCase().trim() === userEmail;

                  return (
                    <ReviewCard
                      key={review.id}
                      review={review}
                      isOwner={isOwner}
                      onEdit={isOwner ? () => setShowForm(true) : undefined}
                      onDelete={
                        isOwner ? () => setShowDeleteConfirm(true) : undefined
                      }
                    />
                  );
                })}
              </div>
            )}

            {showDeleteConfirm && (
              <div className="mt-6 rounded-3xl border border-red-500/20 bg-red-500/5 p-6 text-center">
                <p className="font-semibold text-text">
                  Excluir sua avaliação?
                </p>

                <p className="mt-1 text-sm text-muted">
                  Essa ação não pode ser desfeita.
                </p>

                <div className="mt-5 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleDeleteReview}
                    className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-500/20"
                  >
                    Sim, excluir
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="rounded-2xl border border-border bg-background px-5 py-2.5 text-sm font-semibold text-muted transition hover:border-violet-500/50 hover:text-text"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </section>
        </Container>
      </main>
    </>
  );
}