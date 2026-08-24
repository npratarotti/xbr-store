import { Container } from "../../layout/Container";
import { CategoryCard } from "../../ui/CategoryCard";
import { categories } from "../../../constants/categories";

export function Categories() {
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
            Explore nossa coleção
          </span>

          <h2 className="text-4xl font-black tracking-tight text-white md:text-5xl">
            Explore por{" "}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">
              Categorias
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-400 md:text-lg">
            Encontre rapidamente a tecnologia ideal para acompanhar
            seu estilo, trabalho, diversão e performance.
          </p>

        </div>

        {/* Categorias */}
        <div className="relative grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6 lg:gap-5">

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