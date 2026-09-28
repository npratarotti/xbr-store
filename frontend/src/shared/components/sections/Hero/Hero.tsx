import { Link } from "react-router-dom";
import { Button } from "../../ui/Button";
import { Container } from "../../layout/Container";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#09090B]">
      {/* Luzes do fundo */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-20 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-violet-700/25 blur-[160px]" />
        <div className="absolute right-0 top-40 h-96 w-96 rounded-full bg-fuchsia-500/10 blur-[150px]" />
      </div>

      <Container>
        <div className="relative grid items-center gap-10 px-4 py-10 lg:grid-cols-[1fr_1.3fr] lg:gap-6 lg:py-14 lg:pl-16 lg:pr-4">

          {/* Texto */}
          <div>
            <span className="inline-block rounded-full border border-violet-500/30 bg-violet-500/10 px-5 py-2 text-sm font-medium text-violet-300">
              🚀 Bem-vindo à XBR Store
            </span>

            <h1 className="mt-6 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl md:text-5xl lg:text-4xl xl:text-5xl">
              Tecnologia que
              <br />
              <span className="whitespace-nowrap bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 bg-clip-text text-2xl text-transparent sm:text-3xl md:text-4xl lg:text-3xl xl:text-4xl">
                impulsiona o seu futuro.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-zinc-400 lg:text-lg lg:leading-8">
              Produtos premium para quem busca desempenho,
              inovação e uma experiência de compra diferenciada.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/products">
                <Button>
                  Explorar Produtos
                </Button>
              </Link>

              <Link
                to="/products?filter=ofertas"
                className="rounded-xl border border-zinc-700 px-6 py-3 font-semibold text-white transition hover:border-violet-500"
              >
                Ver ofertas
              </Link>
            </div>
          </div>

          {/* Notebook */}
          <div className="relative hidden justify-center lg:flex lg:justify-center">
            <img
              src="/images/hero/hero-notebook.png"
              alt="Notebook Gamer"
              className="
                w-full
                max-w-[1150px]
                -translate-x-4
                xl:-translate-x-8
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