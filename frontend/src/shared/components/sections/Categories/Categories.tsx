import { Container } from "../../layout/Container";
import { CategoryCard } from "../../ui/CategoryCard";
import { categories } from "../../../constants/categories";

export function Categories() {
  return (
    <section className="py-24">
      <Container>
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-black">
            Explore por Categorias
          </h2>

          <p className="mt-4 text-zinc-400">
            Encontre rapidamente os produtos ideais para você.
          </p>
        </div>

        <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              icon={category.icon}
              name={category.name}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}