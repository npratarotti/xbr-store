import { Link, useNavigate } from "react-router-dom";

import { Container } from "../Container";

import { useCart } from "../../../../app/providers/CartProvider";

import { useAuth } from "../../../../app/providers/AuthProvider";

export function Header() {
  const { cartQuantity } = useCart();

  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
      <Container>
        <div className="flex h-20 items-center justify-between gap-6">

          {/* Logo */}

          <Link to="/" className="group shrink-0">
            <h1 className="text-3xl font-black text-violet-500 transition group-hover:text-fuchsia-400">
              XBR
            </h1>

            <p className="text-xs text-zinc-500">
              Store
            </p>
          </Link>

          {/* Busca */}

          <div className="hidden flex-1 max-w-xl md:block">
            <form
              onSubmit={(event) => {
                event.preventDefault();
              
                const form = event.currentTarget;
              
                const input = form.elements.namedItem(
                  "search"
                ) as HTMLInputElement;
              
                const search = input.value.trim();
              
                if (search) {
                  navigate(`/products?search=${encodeURIComponent(search)}`);
                }
              }}

              className="hidden flex-1 max-w-xl md:block"
            >
              <input
                name="search"
                type="text"
                placeholder="Buscar produtos..."
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-500"
              />
            </form>
          </div>

          {/* Navegação */}

          <nav className="flex items-center gap-3 sm:gap-5">

            <Link
              to="/"
              className="hidden text-sm font-medium text-zinc-300 transition hover:text-white sm:block"
            >
              Início
            </Link>

            <Link
              to="/products"
              className="hidden text-sm font-medium text-zinc-300 transition hover:text-white sm:block"
            >
              Produtos
            </Link>

            {user ? (
  <>
    <Link
      to="/admin"
      className="hidden rounded-xl px-3 py-2 text-sm font-medium text-violet-400 transition hover:bg-violet-500/10 hover:text-violet-300 md:block"
    >
      Admin
    </Link>

    <Link
      to="/profile"
      className="rounded-xl px-3 py-2 text-sm font-medium text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
    >
      Minha conta
    </Link>

    <button
      type="button"
      onClick={handleLogout}
      className="hidden text-sm font-medium text-zinc-500 transition hover:text-red-400 sm:block"
    >
      Sair
    </button>
  </>
) : (
              <Link
                to="/login"
                className="rounded-xl px-3 py-2 text-sm font-medium text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
              >
                Entrar
              </Link>
            )}

            <Link
              to="/cart"
              className="relative rounded-xl bg-violet-600 px-4 py-2.5 font-medium text-white transition hover:bg-violet-700"
            >
              🛒

              <span className="ml-2 hidden sm:inline">
                Carrinho
              </span>

              {cartQuantity > 0 && (
                <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-fuchsia-500 px-1.5 text-xs font-bold text-white shadow-lg">
                  {cartQuantity}
                </span>
              )}
            </Link>

          </nav>
        </div>
      </Container>
    </header>
  );
}