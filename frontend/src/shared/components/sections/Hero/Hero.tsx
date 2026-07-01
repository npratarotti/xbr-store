import { Button } from "../../ui/Button";
import { Container } from "../../layout/Container";

export function Hero() {
  return (
    <section className="py-24">
      <Container>
        <div className="flex flex-col items-center text-center">

          <span className="mb-4 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-300">
            🚀 Bem-vindo à XBR Store
          </span>

          <h1 className="max-w-5xl text-5xl font-black leading-tight md:text-7xl">
            Tecnologia que
            <span className="block text-violet-500">
              impulsiona o seu futuro.
            </span>
          </h1>

          <p className="mt-8 max-w-2xl text-lg text-zinc-400">
            Descubra produtos cuidadosamente selecionados para quem
            busca inovação, desempenho e uma experiência de compra
            diferenciada.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">

            <Button>
              Explorar Produtos
            </Button>

            <button
              className="
                rounded-xl
                border
                border-zinc-700
                px-6
                py-3
                font-semibold
                transition
                hover:border-violet-500
              "
            >
              Ver Ofertas
            </button>

          </div>

        </div>
      </Container>
    </section>
  );
}