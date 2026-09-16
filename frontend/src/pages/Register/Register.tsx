import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container } from "../../shared/components/layout/Container";
import { useAuth } from "../../app/providers/AuthProvider";

export function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Preencha todos os campos.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    if (!acceptedTerms) {
      setError("Você precisa aceitar os termos de uso.");
      return;
    }

    const success = register(
      name.trim(),
      email.trim().toLowerCase(),
      password
    );

    if (!success) {
      setError("Este e-mail já está cadastrado.");
      return;
    }

    navigate("/login", {
      state: { registered: true },
    });
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
              Crie sua conta
            </h1>

            <p className="mt-3 text-zinc-500">
              Cadastre-se para começar sua experiência na XBR.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-zinc-900/70 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-zinc-300"
                >
                  Nome completo
                </label>

                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Seu nome"
                  className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-5 py-3.5 text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-500"
                />
              </div>

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
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-zinc-300"
                >
                  Senha
                </label>

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-5 py-3.5 text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-500"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-zinc-300"
                >
                  Confirmar senha
                </label>

                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-5 py-3.5 text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-500"
                />
              </div>

              <label className="flex items-start gap-3 text-sm text-zinc-500">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(event) =>
                    setAcceptedTerms(event.target.checked)
                  }
                  className="mt-1 h-4 w-4 rounded border-zinc-700 bg-zinc-950 accent-violet-600"
                />

                <span>
                  Aceito os termos de uso e a política de privacidade da XBR
                  Store.
                </span>
              </label>

              {error && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-4 font-bold text-white shadow-lg shadow-violet-700/20 transition hover:scale-[1.02] hover:shadow-violet-500/40 active:scale-[0.98]"
              >
                Criar minha conta
              </button>
            </form>

            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10" />

              <span className="text-xs uppercase tracking-wider text-zinc-600">
                já possui uma conta?
              </span>

              <div className="h-px flex-1 bg-white/10" />
            </div>

            <Link
              to="/login"
              className="block w-full rounded-2xl border border-white/10 bg-white/[0.03] py-4 text-center font-semibold text-white transition hover:border-violet-500/50 hover:bg-violet-500/5"
            >
              Entrar na minha conta
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