import { Container } from "../../layout/Container";
import { Button } from "../../ui/Button";

export function Newsletter() {
  return (
    <section className="py-24">
      <Container>
        <div
          className="
            rounded-3xl
            border
            border-violet-500/30
            bg-zinc-900
            p-12
            text-center
          "
        >
          <h2 className="text-4xl font-black">
            Receba ofertas exclusivas
          </h2>

          <p className="mt-4 text-zinc-400">
            Cadastre seu e-mail e fique por dentro das novidades da XBR Store.
          </p>

          <form className="mx-auto mt-10 flex max-w-2xl flex-col gap-4 md:flex-row">
            <input
              type="email"
              placeholder="Digite seu melhor e-mail"
              className="
                flex-1
                rounded-xl
                border
                border-zinc-700
                bg-zinc-950
                px-5
                py-4
                outline-none
                focus:border-violet-500
              "
            />

            <Button>
              Inscrever-se
            </Button>
          </form>
        </div>
      </Container>
    </section>
  );
}