import { ProductCard } from "../../ui/ProductCard";
import { Container } from "../../layout/Container";
import { useProducts } from "../../../hooks/useProducts";

export function FeaturedProducts() {
  const products = useProducts();

  return (
    <section className="relative overflow-hidden bg-[#09090B] py-24">

      {/* Glow de fundo */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-violet-700/10 blur-[140px]" />
        <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-fuchsia-600/5 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-violet-600/5 blur-[120px]" />
      </div>

      <Container>
        {/* Título */}
        <div className="relative mb-14 text-center">
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-[0.25em] text-violet-400">
            Nossos produtos
          </span>

          <h2 className="text-4xl font-black tracking-tight text-white md:text-5xl">
            Produtos em{" "}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">
              Destaque
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-400 md:text-lg">
            Os produtos mais desejados da XBR Store.
          </p>
        </div>

        {/* Grid de produtos */}
        <div className="relative grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
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
      </Container>
    </section>
  );
}