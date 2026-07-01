import { Container } from "../../layout/Container";

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 py-16">
      <Container>
        <div className="grid gap-10 md:grid-cols-4">

          <div>
            <h3 className="text-2xl font-black text-violet-500">
              XBR Store
            </h3>

            <p className="mt-4 text-zinc-400">
              Tecnologia premium para quem busca desempenho,
              inovação e qualidade.
            </p>
          </div>

          <div>
            <h4 className="font-bold">Categorias</h4>

            <ul className="mt-4 space-y-2 text-zinc-400">
              <li>Computadores</li>
              <li>Smartphones</li>
              <li>Áudio</li>
              <li>Games</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold">Institucional</h4>

            <ul className="mt-4 space-y-2 text-zinc-400">
              <li>Sobre</li>
              <li>Contato</li>
              <li>Política de Privacidade</li>
              <li>Termos de Uso</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold">Redes</h4>

            <ul className="mt-4 space-y-2 text-zinc-400">
              <li>GitHub</li>
              <li>LinkedIn</li>
              <li>Instagram</li>
            </ul>
          </div>

        </div>

        <div className="mt-12 border-t border-zinc-800 pt-8 text-center text-sm text-zinc-500">
          © 2026 XBR Store. Todos os direitos reservados.
        </div>
      </Container>
    </footer>
  );
}