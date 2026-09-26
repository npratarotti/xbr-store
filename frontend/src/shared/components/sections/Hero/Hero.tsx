import { Button } from "../../ui/Button";
import { Container } from "../../layout/Container";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#09090B] pt-12">
      {/* Luzes do fundo */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-20 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-violet-700/25 blur-[160px]" />
        <div className="absolute right-0 top-40 h-96 w-96 rounded-full bg-fuchsia-500/10 blur-[150px]" />
      </div>

      <Container>
      <div className="relative grid items-center gap-12 py-16 lg:grid-cols-2 lg:gap-16 lg:py-8 lg:pl-16 lg:pr-4">

          {/* Texto */}
          <div>
            <span className="inline-block rounded-full border border-violet-500/30 bg-violet-500/10 px-5 py-2 text-sm font-medium text-violet-300">
              🚀 Bem-vindo à XBR Store
            </span>

            <h1 className="mt-6 text-3xl font-black leading-tight text-white md:text-4xl lg:text-4xl xl:text-5xl">
              Tecnologia que{" "}
            <span className="whitespace-nowrap bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
               impulsiona o seu futuro.
            </span>
        </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-zinc-400 lg:text-lg lg:leading-8">
              Produtos premium para quem busca desempenho,
              inovação e uma experiência de compra diferenciada.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button>
                Explorar Produtos
              </Button>

              <button className="rounded-xl border border-zinc-700 px-6 py-3 font-semibold text-white transition hover:border-violet-500">
                Ver ofertas
              </button>
            </div>
          </div>

          {/* Notebook */}
          <div className="relative flex justify-center lg:justify-end">
          <img
    src="/images/hero/hero-notebook.png"
    alt="Notebook Gamer"
    className="
      w-[125%]
      max-w-[700px]
      lg:-translate-x-8
      xl:-translate-x-4
      drop-shadow-[0_70px_120px_rgba(124,58,237,0.55)]
      animate-float
      select-none
      pointer-events-none
    "
  />
</div>

        </div>
      </Container>
    </section>
  );
}