import { Container } from "../Container";

export function Header() {
  return (
    <header
      className="
        fixed
        top-0
        left-0
        right-0
        z-50
        border-b
        border-white/10
        bg-black/50
        backdrop-blur-2xl
      "
    >
      <Container>
        <div className="flex h-24 items-center justify-between">

          {/* Logo */}

          <div>

            <h1 className="text-4xl font-black tracking-tight">

              <span className="text-white">
                X
              </span>

              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">
                BR
              </span>

            </h1>

            <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
              Premium Store
            </p>

          </div>

          {/* Busca */}

          <div className="hidden w-full max-w-xl px-10 lg:block">

            <input
              type="text"
              placeholder="Buscar produtos..."
              className="
                w-full
                rounded-2xl
                border
                border-white/10
                bg-white/5
                px-6
                py-3.5
                text-sm
                text-white
                placeholder:text-zinc-500
                outline-none
                transition-all
                duration-300
                focus:border-violet-500
                focus:bg-white/10
                focus:shadow-[0_0_35px_rgba(139,92,246,.35)]
              "
            />

          </div>

          {/* Menu */}

          <nav className="flex items-center gap-5">

            <button
              className="
                text-sm
                font-medium
                text-zinc-300
                transition
                hover:text-white
              "
            >
              Login
            </button>

            <button
              className="
                rounded-2xl
                bg-gradient-to-r
                from-violet-600
                to-fuchsia-600
                px-6
                py-3
                font-semibold
                text-white
                shadow-lg
                shadow-violet-700/30
                transition-all
                duration-300
                hover:scale-105
                hover:shadow-violet-500/50
              "
            >
              🛒 Carrinho
            </button>

          </nav>

        </div>
      </Container>
    </header>
  );
}