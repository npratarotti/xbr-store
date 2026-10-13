import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Container } from "../../shared/components/layout/Container";
import { Toast } from "../../shared/components/ui/Toast";
import { useAuth } from "../../app/providers/AuthProvider";
import { supabase } from "../../lib/supabase";

type LocationState = {
  registered?: boolean;
};

type ToastState = {
  message: string;
  type: "success" | "error";
};

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  // Modal "Esqueci minha senha"
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [sendingReset, setSendingReset] = useState(false);

  const registered = (location.state as LocationState | null)?.registered;

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Preencha o e-mail e a senha.");
      return;
    }

    setIsSubmitting(true);

    const result = await login(email.trim().toLowerCase(), password);

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error ?? "E-mail ou senha inválidos.");
      return;
    }

    navigate("/");
  };

  const handleSendReset = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!forgotEmail.trim()) return;

    setSendingReset(true);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      forgotEmail.trim().toLowerCase(),
      {
        redirectTo: `${window.location.origin}/reset-password`,
      }
    );

    setSendingReset(false);

    if (resetError) {
      setToast({
        message: resetError.message ?? "Erro ao enviar e-mail.",
        type: "error",
      });
    } else {
      setToast({
        message: "Enviamos um link de recuperação pro seu e-mail!",
        type: "success",
      });
      setShowForgot(false);
      setForgotEmail("");
    }

    setTimeout(() => setToast(null), 3500);
  };

  return (
    <main className="min-h-screen bg-background py-20 transition-colors duration-300">
      <Container>
        <div className="mx-auto max-w-md">
          <div className="mb-10 text-center">
            <Link
              to="/"
              className="text-4xl font-black text-violet-500 transition hover:text-fuchsia-400"
            >
              XBR
            </Link>

            <p className="mt-2 text-sm text-muted">Store</p>

            <h1 className="mt-8 text-3xl font-black tracking-tight text-text">
              Bem-vindo{" "}
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">
                de volta
              </span>
            </h1>

            <p className="mt-3 text-muted">
              Entre na sua conta para continuar.
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-surface/70 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl">
            {registered && (
              <div className="mb-5 rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-500">
                Conta criada com sucesso! Agora entre com seus dados.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-muted"
                >
                  E-mail
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="seu@email.com"
                  className="w-full rounded-2xl border border-border bg-background px-5 py-3.5 text-text outline-none transition placeholder:text-muted focus:border-violet-500"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-muted"
                  >
                    Senha
                  </label>

                  <button
                    type="button"
                    onClick={() => setShowForgot(true)}
                    className="text-xs font-semibold text-violet-400 transition hover:text-violet-300"
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
                  className="w-full rounded-2xl border border-border bg-background px-5 py-3.5 text-text outline-none transition placeholder:text-muted focus:border-violet-500"
                />
              </div>

              {error && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-4 font-bold text-white shadow-lg shadow-violet-700/20 transition hover:scale-[1.02] hover:shadow-violet-500/40 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                )}
                {isSubmitting ? "Entrando..." : "Entrar"}
              </button>
            </form>

            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-border" />

              <span className="text-xs uppercase tracking-wider text-muted">
                ou
              </span>

              <div className="h-px flex-1 bg-border" />
            </div>

            <Link
              to="/register"
              className="block w-full rounded-2xl border border-border bg-surface py-4 text-center font-semibold text-text transition hover:border-violet-500/50 hover:bg-violet-500/5"
            >
              Criar uma conta
            </Link>
          </div>

          <p className="mt-8 text-center text-xs text-muted">
            © 2026 XBR Store. Todos os direitos reservados.
          </p>
        </div>
      </Container>

      {/* MODAL ESQUECI MINHA SENHA */}
      {showForgot && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
          onClick={() => setShowForgot(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-border bg-background p-7 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
                Recuperar senha
              </span>

              <h2 className="mt-2 text-2xl font-black text-text">
                Esqueceu a senha?
              </h2>

              <p className="mt-2 text-sm text-muted">
                Informe seu e-mail e enviaremos um link para criar uma nova
                senha.
              </p>
            </div>

            <form onSubmit={handleSendReset} className="space-y-4">
              <input
                type="email"
                value={forgotEmail}
                onChange={(event) => setForgotEmail(event.target.value)}
                placeholder="seu@email.com"
                required
                className="w-full rounded-2xl border border-border bg-surface px-5 py-3.5 text-text outline-none transition placeholder:text-muted focus:border-violet-500"
              />

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowForgot(false)}
                  className="flex-1 rounded-2xl border border-border bg-background px-5 py-3.5 font-semibold text-muted transition hover:border-violet-500/50 hover:text-text"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={sendingReset}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3.5 font-bold text-white transition hover:scale-[1.02] disabled:opacity-60"
                >
                  {sendingReset && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  )}
                  {sendingReset ? "Enviando..." : "Enviar link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} />}
    </main>
  );
}