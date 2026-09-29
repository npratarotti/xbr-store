import { Container } from "../../layout/Container";

export function Newsletter() {
  return (
    <section className="relative overflow-hidden bg-background py-24 transition-colors duration-300">
      <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[120px]" />

      <Container>
        <div className="relative overflow-hidden rounded-[32px] border border-violet-500/20 bg-gradient-to-br from-violet-600/20 via-surface to-fuchsia-600/10 p-10 text-center md:p-16">
          <span className="text-sm font-semibold uppercase tracking-widest text-violet-400">
            Fique por dentro
          </span>

          <h2 className="mt-4 text-4xl font-black text-text md:text-5xl">
            Tecnologia, ofertas e novidades.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-muted">
            Receba novidades e ofertas exclusivas da XBR Store diretamente no seu e-mail.
          </p>

          <form className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Seu melhor e-mail"
              className="flex-1 rounded-xl border border-border bg-background/30 px-5 py-3.5 text-text outline-none placeholder:text-muted focus:border-violet-500"
            />

            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-7 py-3.5 font-semibold text-white transition hover:scale-[1.02]"
            >
              Quero receber
            </button>
          </form>
        </div>
      </Container>
    </section>
  );
}