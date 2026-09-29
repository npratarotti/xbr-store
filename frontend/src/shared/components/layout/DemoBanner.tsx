export function DemoBanner() {
  return (
    <div className="relative z-40 border-b border-violet-500/20 bg-gradient-to-r from-violet-600/10 via-fuchsia-600/10 to-violet-600/10 px-4 py-2 text-center">
      <p className="text-xs text-violet-400">
        🧪 <span className="font-semibold">Projeto de demonstração</span> — os
        dados ficam salvos no seu navegador.{" "}
        <a
          href="/about"
          className="font-semibold underline decoration-violet-500/50 underline-offset-2 transition hover:text-violet-500"
        >
          Saiba mais
        </a>
      </p>
    </div>
  );
}