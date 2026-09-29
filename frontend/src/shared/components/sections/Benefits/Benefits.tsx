import { Container } from "../../layout/Container";
import { BenefitCard } from "../../ui/BenefitCard";
import { benefits } from "../../../constants/benefits";

export function Benefits() {
  return (
    <section className="relative overflow-hidden bg-background py-24 transition-colors duration-300">

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
            Nossos diferenciais
          </span>

          <h2 className="text-4xl font-black tracking-tight text-text md:text-5xl">
            Por que escolher a{" "}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">
              XBR Store
            </span>
            ?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted md:text-lg">
            Nossa missão é oferecer tecnologia com qualidade, segurança e confiança.
          </p>
        </div>

        {/* Cards */}
        <div className="relative grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {benefits.map((benefit) => (
            <BenefitCard
              key={benefit.id}
              title={benefit.title}
              description={benefit.description}
              image={benefit.image}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}