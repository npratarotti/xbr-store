import { ProductCard } from "../../ui/ProductCard";
import { Container } from "../../layout/Container";
import { useProducts } from "../../../hooks/useProducts";

export function FeaturedProducts() {
  const products = useProducts();

  return (
    <section className="py-24">
      <Container>
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-black text-black">
            Produtos em Destaque
          </h2>

          <p className="mt-4 text-zinc-400">
            Os produtos mais desejados da XBR Store.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
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