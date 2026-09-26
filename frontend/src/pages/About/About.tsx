import { Link } from "react-router-dom";
import { Container } from "../../shared/components/layout/Container";

export function About() {
  return (
    <main className="min-h-screen bg-[#09090B] py-20">
      <Container>
        <div className="mx-auto max-w-3xl">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
            Sobre
          </span>

          <h1 className="mt-3 text-4xl font-black text-white md:text-5xl">
            Sobre o XBR Store
          </h1>

          <p className="mt-6 text-lg leading-8 text-zinc-400">
            O XBR Store é um e-commerce de demonstração construído com React,
            TypeScript, Tailwind CSS e Vite. Todo o fluxo — catálogo, carrinho,
            checkout, painel administrativo — funciona de verdade, mas os dados
            ficam armazenados localmente no seu navegador.
          </p>

          <div className="mt-12 rounded-3xl border border-violet-500/20 bg-violet-500/5 p-7">
            <h2 className="text-xl font-bold text-violet-300">
              🧪 Como testar
            </h2>

            <ol className="mt-5 list-inside list-decimal space-y-3 text-zinc-300">
              <li>
                Navegue pelo catálogo, filtre por categoria, busque por produtos
              </li>
              <li>
                Adicione produtos ao carrinho e finalize uma compra de teste
              </li>
              <li>
                Crie uma conta e acesse <strong>/profile</strong> para ver seus
                pedidos
              </li>
              <li>
                Faça login marcando{" "}
                <strong>"🧪 Entrar em modo demonstração"</strong> para acessar o
                painel de administrador
              </li>
              <li>
                No painel, gerencie produtos, pedidos, cupons e faixas de CEP
              </li>
            </ol>
          </div>

          <div className="mt-8 rounded-3xl border border-white/10 bg-zinc-900/70 p-7">
            <h2 className="text-xl font-bold text-white">
              🔒 Sobre segurança
            </h2>

            <p className="mt-3 leading-7 text-zinc-400">
              Este é um{" "}
              <strong className="text-white">projeto de demonstração</strong>.
              Não use dados reais (senhas, CPF, cartão). Os dados ficam apenas
              no seu navegador e podem ser apagados a qualquer momento ao limpar
              o cache.
            </p>

            <p className="mt-3 leading-7 text-zinc-400">
              Em uma versão de produção, a autenticação seria feita em um
              backend real (Supabase, Firebase ou similar), com senhas
              hasheadas, tokens seguros e validação de todas as operações no
              servidor.
            </p>
          </div>

          <div className="mt-10">
            <Link
              to="/"
              className="inline-block rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 py-4 font-bold text-white transition hover:scale-[1.02]"
            >
              Voltar para a loja
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}