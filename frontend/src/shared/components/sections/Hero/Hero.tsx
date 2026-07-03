import { Button } from "../../ui/Button";
import { Container } from "../../layout/Container";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white py-32">

      {/* Fundo */}
      <div className="absolute inset-0 -z-10">

        {/* Imagem */}
        <img
          src="/images/lnotebook-gamer.webp"
          alt="Notebook Gamer"
          className="h-full w-full object-cover object-right opacity-10"
        />

        {/* Gradiente */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/90 to-white" />

        {/* Glow roxo */}
        <div className="absolute left-1/2 top-20 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-500/20 blur-[140px]" />

      </div>

      <Container>
        <div className="flex flex-col items-center text-center">

          <span className="mb-6 rounded-full border border-violet-500/30 bg-violet-500/10 px-5 py-2 text-sm font-medium text-violet-600">
            🚀 Bem-vindo à XBR Store
          </span>

          <h1 className="max-w-5xl text-6xl font-black leading-tight tracking-tight md:text-8xl">
            Tecnologia que
            <span className="block bg-gradient-to-r from-violet-700 to-fuchsia-500 bg-clip-text text-transparent">
              impulsiona o seu futuro.
            </span>
          </h1>

          <p className="mt-8 max-w-3xl text-xl leading-8 text-zinc-600">
            Descubra produtos cuidadosamente selecionados para quem busca inovação,
            desempenho e uma experiência de compra diferenciada.
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-5">

            <Button>
              Explorar Produtos
            </Button>

            <button
              className="
                rounded-xl
                border
                border-zinc-300
                bg-white
                px-7
                py-3
                font-semibold
                shadow-sm
                transition-all
                hover:border-violet-500
                hover:shadow-lg
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