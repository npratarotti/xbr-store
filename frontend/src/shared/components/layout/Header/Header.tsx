import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { Container } from "../Container";

import { useCart } from "../../../../app/providers/CartProvider";
import { useAuth } from "../../../../app/providers/AuthProvider";
import { useProducts } from "../../../hooks/useProducts";

export function Header() {
  const { cartQuantity } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const products = useProducts();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Busca desktop
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Busca mobile
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const [showMobileSuggestions, setShowMobileSuggestions] = useState(false);

  // Fecha o menu sempre que a rota muda
  useEffect(() => {
    setIsMenuOpen(false);
    setShowSuggestions(false);
    setShowMobileSuggestions(false);
    setSearchQuery("");
    setMobileSearchQuery("");
  }, [location.pathname]);

  // Bloqueia o scroll do body quando o menu está aberto
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // Fecha sugestões ao clicar fora (desktop)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fecha sugestões com Esc
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowSuggestions(false);
        setShowMobileSuggestions(false);
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/");
  };

  const closeMenu = () => setIsMenuOpen(false);

  // Sugestões de busca (mesma lógica para desktop e mobile)
  const getSuggestions = (query: string) => {
    const q = query.toLowerCase().trim();

    if (q.length < 2) return [];

    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      )
      .slice(0, 5);
  };

  const desktopSuggestions = useMemo(
    () => getSuggestions(searchQuery),
    [searchQuery, products]
  );

  const mobileSuggestions = useMemo(
    () => getSuggestions(mobileSearchQuery),
    [mobileSearchQuery, products]
  );

  const goToProduct = (id: number) => {
    setShowSuggestions(false);
    setShowMobileSuggestions(false);
    setSearchQuery("");
    setMobileSearchQuery("");
    closeMenu();
    navigate(`/product/${id}`);
  };

  const goToAllResults = (query: string) => {
    const q = query.trim();
    if (!q) return;

    setShowSuggestions(false);
    setShowMobileSuggestions(false);
    setSearchQuery("");
    setMobileSearchQuery("");
    closeMenu();
    navigate(`/products?search=${encodeURIComponent(q)}`);
  };

  const handleDesktopSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    goToAllResults(searchQuery);
  };

  const handleMobileSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    goToAllResults(mobileSearchQuery);
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
            <p className="text-xs text-zinc-500">Store</p>
          </Link>

          {/* Busca (desktop) */}
          <div
            ref={searchContainerRef}
            className="relative hidden flex-1 max-w-xl md:block"
          >
            <form onSubmit={handleDesktopSubmit}>
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => {
                  if (searchQuery.trim().length >= 2) {
                    setShowSuggestions(true);
                  }
                }}
                placeholder="Buscar produtos..."
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-500"
              />
            </form>

            {/* Dropdown de sugestões (desktop) */}
            {showSuggestions && desktopSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl shadow-black/50">
                <ul className="divide-y divide-white/5">
                  {desktopSuggestions.map((product) => (
                    <li key={product.id}>
                      <button
                        type="button"
                        onClick={() => goToProduct(product.id)}
                        className="flex w-full items-center gap-4 px-4 py-3 text-left transition hover:bg-violet-500/10"
                      >
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-zinc-900">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-contain p-1"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-white">
                            {product.name}
                          </p>

                          <p className="mt-0.5 truncate text-xs text-zinc-500">
                            {product.category}
                          </p>
                        </div>

                        <span className="shrink-0 text-sm font-bold text-violet-400">
                          {product.price.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => goToAllResults(searchQuery)}
                  className="flex w-full items-center justify-center gap-2 border-t border-white/10 bg-zinc-900/50 px-4 py-3 text-sm font-semibold text-violet-400 transition hover:bg-violet-500/10 hover:text-violet-300"
                >
                  Ver todos os resultados para "{searchQuery}"
                  <span>→</span>
                </button>
              </div>
            )}
          </div>

          {/* Navegação desktop */}
          <nav className="hidden items-center gap-5 sm:flex">
            <Link
              to="/"
              className="text-sm font-medium text-zinc-300 transition hover:text-white"
            >
              Início
            </Link>

            <Link
              to="/products"
              className="text-sm font-medium text-zinc-300 transition hover:text-white"
            >
              Produtos
            </Link>

            <Link
              to="/about"
              className="text-sm font-medium text-zinc-300 transition hover:text-white"
            >
              Sobre
            </Link>

            <Link
              to="/wishlist"
              className="relative text-sm font-medium text-zinc-300 transition hover:text-white"
            >
              Favoritos
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
                  className="text-sm font-medium text-zinc-500 transition hover:text-red-400"
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
              <span className="ml-2 hidden sm:inline">Carrinho</span>
              {cartQuantity > 0 && (
                <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-fuchsia-500 px-1.5 text-xs font-bold text-white shadow-lg">
                  {cartQuantity}
                </span>
              )}
            </Link>
          </nav>

          {/* Carrinho + Hamburguer (mobile) */}
          <div className="flex items-center gap-3 sm:hidden">
            <Link
              to="/cart"
              className="relative rounded-xl bg-violet-600 px-3 py-2 font-medium text-white transition hover:bg-violet-700"
            >
              🛒
              {cartQuantity > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-fuchsia-500 px-1 text-[10px] font-bold text-white shadow-lg">
                  {cartQuantity}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={isMenuOpen}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-200 transition hover:border-violet-500 hover:text-violet-400"
            >
              {isMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </Container>

      {/* ===== MENU MOBILE ===== */}
      <div
        onClick={closeMenu}
        className={`
          fixed inset-0 top-20 z-40 bg-black/60 backdrop-blur-sm
          transition-opacity duration-300 sm:hidden
          ${isMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}
        `}
      />

      <aside
        className={`
          fixed right-0 top-20 z-50 h-[calc(100vh-5rem)] w-[80%] max-w-sm
          overflow-y-auto border-l border-zinc-800 bg-zinc-950 px-6 py-8
          transition-transform duration-300 ease-out sm:hidden
          ${isMenuOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Busca mobile com autocomplete */}
        <div className="relative mb-6">
          <form onSubmit={handleMobileSubmit}>
            <input
              type="text"
              value={mobileSearchQuery}
              onChange={(event) => {
                setMobileSearchQuery(event.target.value);
                setShowMobileSuggestions(true);
              }}
              onFocus={() => {
                if (mobileSearchQuery.trim().length >= 2) {
                  setShowMobileSuggestions(true);
                }
              }}
              placeholder="Buscar produtos..."
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-500"
            />
          </form>

          {/* Dropdown de sugestões (mobile) */}
          {showMobileSuggestions && mobileSuggestions.length > 0 && (
            <div className="mt-2 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl">
              <ul className="divide-y divide-white/5">
                {mobileSuggestions.map((product) => (
                  <li key={product.id}>
                    <button
                      type="button"
                      onClick={() => goToProduct(product.id)}
                      className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition hover:bg-violet-500/10"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-zinc-950">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-contain p-1"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold text-white">
                          {product.name}
                        </p>

                        <p className="mt-0.5 truncate text-[10px] text-zinc-500">
                          {product.category}
                        </p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => goToAllResults(mobileSearchQuery)}
                className="flex w-full items-center justify-center gap-2 border-t border-white/10 bg-zinc-950/50 px-3 py-2.5 text-xs font-semibold text-violet-400 transition hover:bg-violet-500/10"
              >
                Ver todos os resultados
                <span>→</span>
              </button>
            </div>
          )}
        </div>

        {/* Links de navegação */}
        <nav className="flex flex-col gap-1">
          <Link
            to="/"
            onClick={closeMenu}
            className="rounded-xl px-4 py-3 text-base font-medium text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
          >
            Início
          </Link>

          <Link
            to="/products"
            onClick={closeMenu}
            className="rounded-xl px-4 py-3 text-base font-medium text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
          >
            Produtos
          </Link>

          <Link
            to="/about"
            onClick={closeMenu}
            className="rounded-xl px-4 py-3 text-base font-medium text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
          >
            Sobre
          </Link>

          <Link
            to="/wishlist"
            onClick={closeMenu}
            className="rounded-xl px-4 py-3 text-base font-medium text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
          >
            Favoritos
          </Link>

          {user && (
            <>
              <Link
                to="/admin"
                onClick={closeMenu}
                className="rounded-xl px-4 py-3 text-base font-medium text-violet-400 transition hover:bg-violet-500/10 hover:text-violet-300"
              >
                Admin
              </Link>

              <Link
                to="/profile"
                onClick={closeMenu}
                className="rounded-xl px-4 py-3 text-base font-medium text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
              >
                Minha conta
              </Link>
            </>
          )}
        </nav>

        {/* Rodapé do menu */}
        <div className="mt-8 border-t border-zinc-800 pt-6">
          {user ? (
            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-xl border border-zinc-700 px-4 py-3 text-center text-sm font-medium text-zinc-300 transition hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
            >
              Sair da conta
            </button>
          ) : (
            <Link
              to="/login"
              onClick={closeMenu}
              className="block w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-3 text-center text-sm font-bold text-white transition hover:scale-[1.02]"
            >
              Entrar
            </Link>
          )}
        </div>
      </aside>
    </header>
  );
}