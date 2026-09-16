import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Container } from "../../shared/components/layout/Container";
import { useAuth } from "../../app/providers/AuthProvider";

type LocationState = {
  registered?: boolean;
};

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const registered = (location.state as LocationState | null)?.registered;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Preencha o e-mail e a senha.");
      return;
    }

    const success = login(
      email.trim().toLowerCase(),
      password
    );

    if (!success) {
      setError("E-mail ou senha inválidos.");
      return;
    }

    navigate("/");
  };

  return (
    <main className="min-h-screen bg-[#09090B] py-20">
      <Container>
        <div className="mx-auto max-w-md">
          <div className="mb-10 text-center">
            <Link
              to="/"
              className="text-4xl font-black text-violet-500 transition hover:text-fuchsia-400"
            >
              XBR
            </Link>

            <p className="mt-2 text-sm text-zinc-500">Store</p>

            <h1 className="mt-8 text-3xl font-black text-white">
              Bem-vindo de volta
            </h1>

            <p className="mt-3 text-zinc-500">
              Entre na sua conta para continuar.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-zinc-900/70 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl">
            {registered && (
              <div className="mb-5 rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
                Conta criada com sucesso! Agora entre com seus dados.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-zinc-300"
                >
                  E-mail
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="seu@email.com"
                  className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-5 py-3.5 text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-500"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-zinc-300"
                  >
                    Senha
                  </label>

                  <button
                    type="button"
                    className="text-xs font-medium text-violet-400 transition hover:text-violet-300"
                  >
                    Esqueci minha senha
                  </button>
                </div>

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-5 py-3.5 text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-500"
                />
              </div>

              {error && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-4 font-bold text-white shadow-lg shadow-violet-700/20 transition hover:scale-[1.02] hover:shadow-violet-500/40 active:scale-[0.98]"
              >
                Entrar
              </button>
            </form>

            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10" />

              <span className="text-xs uppercase tracking-wider text-zinc-600">
                ou
              </span>

              <div className="h-px flex-1 bg-white/10" />
            </div>

            <Link
              to="/register"
              className="block w-full rounded-2xl border border-white/10 bg-white/[0.03] py-4 text-center font-semibold text-white transition hover:border-violet-500/50 hover:bg-violet-500/5"
            >
              Criar uma conta
            </Link>
          </div>

          <p className="mt-8 text-center text-xs text-zinc-600">
            © 2026 XBR Store. Todos os direitos reservados.
          </p>
        </div>
      </Container>
    </main>
  );
}