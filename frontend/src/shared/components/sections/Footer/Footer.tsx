import { Container } from "../../layout/Container";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background transition-colors duration-300">
      <Container>
        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">

          {/* Marca */}
          <div>
            <h2 className="text-3xl font-black text-violet-500">
              XBR
            </h2>

            <p className="mt-1 text-xs uppercase tracking-[0.3em] text-muted">
              Store
            </p>

            <p className="mt-6 max-w-xs text-sm leading-6 text-muted">
              Tecnologia, inovação e produtos premium para acompanhar o seu
              ritmo.
            </p>
          </div>

          {/* Loja */}
          <div>
            <h3 className="font-bold text-text">Loja</h3>

            <ul className="mt-5 space-y-3 text-sm text-muted">
              <li><a href="#" className="transition hover:text-violet-400">Todos os produtos</a></li>
              <li><a href="#" className="transition hover:text-violet-400">Ofertas</a></li>
              <li><a href="#" className="transition hover:text-violet-400">Mais vendidos</a></li>
              <li><a href="#" className="transition hover:text-violet-400">Lançamentos</a></li>
            </ul>
          </div>

          {/* Atendimento */}
          <div>
            <h3 className="font-bold text-text">Atendimento</h3>

            <ul className="mt-5 space-y-3 text-sm text-muted">
              <li><a href="#" className="transition hover:text-violet-400">Central de ajuda</a></li>
              <li><a href="#" className="transition hover:text-violet-400">Entrega e frete</a></li>
              <li><a href="#" className="transition hover:text-violet-400">Trocas e devoluções</a></li>
              <li><a href="#" className="transition hover:text-violet-400">Fale conosco</a></li>
            </ul>
          </div>

          {/* Redes */}
          <div>
            <h3 className="font-bold text-text">Conecte-se</h3>

            <p className="mt-5 text-sm leading-6 text-muted">
              Acompanhe a XBR Store e fique por dentro das novidades.
            </p>

            <div className="mt-5 flex gap-3">
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-sm text-muted transition hover:border-violet-500/50 hover:text-violet-400">IG</a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-sm text-muted transition hover:border-violet-500/50 hover:text-violet-400">X</a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-sm text-muted transition hover:border-violet-500/50 hover:text-violet-400">YT</a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col gap-3 border-t border-border py-6 text-xs text-muted md:flex-row md:items-center md:justify-between">
          <p>© 2026 XBR Store. Todos os direitos reservados.</p>

          <div className="flex gap-5">
            <a href="#" className="transition hover:text-text">Privacidade</a>
            <a href="#" className="transition hover:text-text">Termos de uso</a>
          </div>
        </div>
      </Container>
    </footer>
  );
}