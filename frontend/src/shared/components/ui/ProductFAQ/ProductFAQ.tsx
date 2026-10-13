import { useState } from "react";

export type FAQItem = {
  question: string;
  answer: string;
};

type ProductFAQProps = {
  items: FAQItem[];
  productName: string;
};

export function ProductFAQ({ items, productName }: ProductFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (items.length === 0) return null;

  // Schema.org pra aparecer no Google como "Perguntas frequentes"
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section className="mt-20">
      {/* Schema.org pro Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="mb-8">
        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
          Dúvidas frequentes
        </span>

        <h2 className="mt-2 text-3xl font-black tracking-tight text-text">
          Perguntas sobre{" "}
          <span className="bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">
            este produto
          </span>
        </h2>

        <p className="mt-3 text-muted">
          Tudo o que você precisa saber antes de comprar.
        </p>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={index}
              className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                isOpen
                  ? "border-violet-500/40 bg-violet-500/5"
                  : "border-border bg-surface/50 hover:border-violet-500/30"
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition"
              >
                <span className="font-semibold text-text">
                  {item.question}
                </span>

                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-sm transition-all duration-300 ${
                    isOpen
                      ? "rotate-45 border-violet-500/50 bg-violet-500/20 text-violet-400"
                      : "border-border text-muted"
                  }`}
                >
                  +
                </span>
              </button>

              <div
                className={`grid transition-all duration-300 ease-out ${
                  isOpen
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 leading-7 text-muted">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA final */}
      <div className="mt-8 rounded-3xl border border-border bg-surface/50 p-6 text-center">
        <p className="text-sm text-muted">
          Não encontrou o que procurava? Fale com a gente!
        </p>

        <a
          href={`https://wa.me/5519998714765?text=${encodeURIComponent(
            `Olá! Tenho uma dúvida sobre o produto ${productName}.`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-[#25D366] px-6 py-3 font-bold text-white shadow-lg transition hover:scale-[1.02]"
        >
          💬 Falar no WhatsApp
        </a>
      </div>
    </section>
  );
}