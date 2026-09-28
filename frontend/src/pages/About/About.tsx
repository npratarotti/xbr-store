import { Link } from "react-router-dom";
import { Container } from "../../shared/components/layout/Container";

export function About() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#09090B] py-20">

      {/* Glows de fundo */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-violet-700/10 blur-[140px]" />
        <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-fuchsia-600/5 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-violet-600/5 blur-[120px]" />
      </div>

      <Container>
        <div className="relative mx-auto max-w-3xl">

          {/* Cabeçalho */}
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
            Sobre
          </span>

          <h1 className="mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">
            Sobre a{" "}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">
              XBR Store
            </span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-zinc-400">
            A XBR Store é um e-commerce de demonstração construída com React,
            TypeScript, Tailwind CSS e Vite. Todo o fluxo — catálogo, carrinho,
            checkout, painel administrativo — funciona de verdade, mas os dados
            ficam armazenados localmente no seu navegador.
          </p>

          {/* Card: Como testar */}
          <div className="relative mt-12 overflow-hidden rounded-3xl border border-violet-500/20 bg-violet-500/[0.06] p-7 backdrop-blur-xl">
            <div className="pointer-events-none absolute -top-20 right-0 h-40 w-40 rounded-full bg-violet-600/20 blur-3xl" />

            <h2 className="relative text-xl font-bold text-violet-300">
              🧪 Como testar
            </h2>

            <ol className="relative mt-5 list-inside list-decimal space-y-3 text-zinc-300">
              <li>
                Navegue pelo catálogo, filtre por categoria, busque por produtos
              </li>
              <li>
                Adicione produtos ao carrinho e finalize uma compra de teste
              </li>
              <li>
                Crie uma conta e acesse <strong className="text-white">/profile</strong> para ver seus
                pedidos
              </li>
              <li>
                Faça login marcando{" "}
                <strong className="text-white">"🧪 Entrar em modo demonstração"</strong> para acessar o
                painel de administrador
              </li>
              <li>
                No painel, gerencie produtos, pedidos, cupons e faixas de CEP
              </li>
            </ol>
          </div>

          {/* Card: Segurança */}
          <div className="relative mt-8 overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/70 p-7 backdrop-blur-xl">
            <div className="pointer-events-none absolute -top-20 left-0 h-40 w-40 rounded-full bg-violet-600/10 blur-3xl" />

            <h2 className="relative text-xl font-bold text-white">
              🔒 Sobre segurança
            </h2>

            <p className="relative mt-3 leading-7 text-zinc-400">
              Este é um{" "}
              <strong className="text-white">projeto de demonstração</strong>.
              Não use dados reais (senhas, CPF, cartão). Os dados ficam apenas
              no seu navegador e podem ser apagados a qualquer momento ao limpar
              o cache.
            </p>

            <p className="relative mt-3 leading-7 text-zinc-400">
              Em uma versão de produção, a autenticação seria feita em um
              backend real (Supabase, Firebase ou similar), com senhas
              hasheadas, tokens seguros e validação de todas as operações no
              servidor.
            </p>
          </div>

          {/* Botão */}
          <div className="mt-10">
            <Link
              to="/"
              className="
                group
                inline-flex
                items-center
                gap-2
                rounded-2xl
                bg-gradient-to-r
                from-violet-600
                to-fuchsia-600
                px-8
                py-4
                font-bold
                text-white
                shadow-lg
                shadow-violet-700/20
                transition-all
                duration-300
                hover:scale-[1.02]
                hover:shadow-violet-500/40
                active:scale-[0.98]
              "
            >
              <span>Voltar para a loja</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>

        </div>
      </Container>
    </main>
  );
}