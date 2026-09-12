import { Link } from "react-router-dom";
import { Container } from "../Container";

export function Header() {
  const savedCart = localStorage.getItem("xbr-cart");
  const cart = savedCart ? JSON.parse(savedCart) : [];

  const cartQuantity = cart.reduce(
    (total: number, item: { quantity: number }) => total + item.quantity,
    0
  );

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
      <Container>
        <div className="flex h-20 items-center justify-between">
          
          <Link to="/" className="group">
            <h1 className="text-3xl font-black text-violet-500 transition group-hover:text-fuchsia-400">
              XBR
            </h1>
            <p className="text-xs text-zinc-500">Store</p>
          </Link>

          <div className="hidden w-full max-w-xl px-10 md:block">
            <input
              type="text"
              placeholder="Buscar produtos..."
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-500"
            />
          </div>

          <nav className="flex items-center gap-6">
            <Link
              to="/login"
              className="text-sm text-zinc-300 transition hover:text-white"
            >
              Login
            </Link>

            <Link
              to="/cart"
              className="relative rounded-xl bg-violet-600 px-5 py-2 font-medium text-white transition hover:bg-violet-700"
            >
              Carrinho

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