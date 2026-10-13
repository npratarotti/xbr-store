import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "../../shared/components/layout/Container";
import { Toast } from "../../shared/components/ui/Toast";
import { supabase } from "../../lib/supabase";

type ToastState = {
  message: string;
  type: "success" | "error";
};

export function ResetPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const [checkingSession, setCheckingSession] = useState(true);
  const [hasSession, setHasSession] = useState(false);

  // Verifica se o usuário chegou pelo link de recuperação
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setHasSession(!!session);
      setCheckingSession(false);
    });
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password.length < 6) {
      setToast({
        message: "A senha precisa ter pelo menos 6 caracteres.",
        type: "error",
      });
      return;
    }

    if (password !== confirmPassword) {
      setToast({
        message: "As senhas não coincidem.",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase.auth.updateUser({ password });

    setIsSubmitting(false);

    if (error) {
      setToast({
        message: error.message ?? "Erro ao atualizar senha.",
        type: "error",
      });
      return;
    }

    setToast({
      message: "Senha atualizada com sucesso!",
      type: "success",
    });

    setTimeout(() => navigate("/login"), 2000);
  };

  if (checkingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-500/30 border-t-violet-500" />
      </main>
    );
  }

  if (!hasSession) {
    return (
      <main className="min-h-screen bg-background py-20">
        <Container>
          <div className="mx-auto max-w-md rounded-3xl border border-red-500/20 bg-red-500/5 p-8 text-center">
            <div className="text-5xl">🔒</div>
            <h1 className="mt-5 text-2xl font-black text-text">
              Link inválido ou expirado
            </h1>
            <p className="mt-3 text-muted">
              O link de recuperação pode ter expirado. Solicite um novo
              e-mail de recuperação.
            </p>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="mt-6 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 font-bold text-white transition hover:scale-[1.02]"
            >
              Voltar pro login
            </button>
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background py-20 transition-colors duration-300">
      <Container>
        <div className="mx-auto max-w-md">
          <div className="mb-10 text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-400">
              XBR Store
            </span>

            <h1 className="mt-4 text-3xl font-black tracking-tight text-text">
              Criar nova{" "}
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">
                senha
              </span>
            </h1>

            <p className="mt-3 text-muted">
              Escolha uma senha nova e segura pra sua conta.
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-surface/70 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-muted"
                >
                  Nova senha
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                  required
                  className="w-full rounded-2xl border border-border bg-background px-5 py-3.5 text-text outline-none transition placeholder:text-muted focus:border-violet-500"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-muted"
                >
                  Confirmar senha
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                  required
                  className="w-full rounded-2xl border border-border bg-background px-5 py-3.5 text-text outline-none transition placeholder:text-muted focus:border-violet-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-4 font-bold text-white shadow-lg shadow-violet-700/20 transition hover:scale-[1.02] hover:shadow-violet-500/40 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                )}
                {isSubmitting ? "Salvando..." : "Salvar nova senha"}
              </button>
            </form>
          </div>
        </div>
      </Container>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </main>
  );
}