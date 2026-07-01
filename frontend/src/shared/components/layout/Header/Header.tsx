import { Container } from "../Container";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
      <Container>
        <div className="flex h-20 items-center justify-between">

          {/* Logo */}

          <div>
            <h1 className="text-3xl font-black text-violet-500">
              XBR
            </h1>

            <p className="text-xs text-zinc-500">
              Store
            </p>
          </div>

          {/* Busca */}

          <div className="hidden w-full max-w-xl px-10 md:block">
            <input
              type="text"
              placeholder="Buscar produtos..."
              className="
                w-full
                rounded-xl
                border
                border-zinc-700
                bg-zinc-900
                px-5
                py-3
                text-sm
                outline-none
                transition
                focus:border-violet-500
              "
            />
          </div>

          {/* Menu */}

          <nav className="flex items-center gap-6">

            <button className="text-sm text-zinc-300 hover:text-white transition">
              Login
            </button>

            <button
              className="
                rounded-xl
                bg-violet-600
                px-5
                py-2
                font-medium
                hover:bg-violet-700
                transition
              "
            >
              Carrinho
            </button>

          </nav>

        </div>
      </Container>
    </header>
  );
}