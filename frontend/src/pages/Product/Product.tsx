import { useState } from "react";
import { useParams } from "react-router-dom";
import { Container } from "../../shared/components/layout/Container";
import { Toast } from "../../shared/components/ui/Toast";
import { useCart } from "../../app/providers/CartProvider";
import { products } from "../../shared/constants/products";

export function Product() {
  const { id } = useParams();
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

  const handleAddToCart = () => {
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
            <div className="flex min-h-[500px] items-center justify-center rounded-3xl border border-white/10 bg-zinc-900/60 p-10">
              <img
                src={product.image}
                alt={product.name}
                className="max-h-[450px] w-full object-contain"
              />
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

              <p className="mt-2 text-zinc-500">
                {product.installment}
              </p>

              <p className="mt-8 max-w-xl leading-7 text-zinc-400">
                Produto premium selecionado pela XBR Store, desenvolvido para
                oferecer alto desempenho, qualidade e uma experiência
                diferenciada.
              </p>

              <button
                onClick={handleAddToCart}
                className="mt-10 w-full rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-4 font-bold text-white shadow-lg shadow-violet-700/20 transition hover:scale-[1.02] hover:shadow-violet-500/40 active:scale-[0.98] lg:max-w-md"
              >
                Adicionar ao carrinho
              </button>
            </div>
          </div>
        </Container>
      </main>
    </>
  );
}