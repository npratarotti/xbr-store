import { Container } from "../../layout/Container";
import { BenefitCard } from "../../ui/BenefitCard";
import { benefits } from "../../constants/benefits";

export function Benefits() {
  return (
    <section className="py-24">
      <Container>
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-black">
            Por que escolher a XBR Store?
          </h2>

          <p className="mt-4 text-zinc-400">
            Nossa missão é oferecer tecnologia com qualidade, segurança e confiança.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {benefits.map((benefit) => (
            <BenefitCard
              key={benefit.id}
              icon={benefit.icon}
              title={benefit.title}
              description={benefit.description}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}