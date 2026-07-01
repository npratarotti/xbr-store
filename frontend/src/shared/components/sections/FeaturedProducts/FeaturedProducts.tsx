import { ProductCard } from "../../ui/ProductCard";
import { Container } from "../../layout/Container";
import { featuredProducts } from "../../../constants/products";

export function FeaturedProducts() {
  return (
    <section className="py-24">
      <Container>
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-black">
            Produtos em Destaque
          </h2>

          <p className="mt-4 text-zinc-400">
            Os produtos mais desejados da XBR Store.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              image={product.image}
              name={product.name}
              category={product.category}
              price={product.price}
              rating={product.rating}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}