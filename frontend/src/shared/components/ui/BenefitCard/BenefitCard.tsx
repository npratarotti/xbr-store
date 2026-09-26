type BenefitCardProps = {
  image: string;
  title: string;
  description: string;
};

export function BenefitCard({
  image,
  title,
  description,
}: BenefitCardProps) {
  return (
    <article
      className="
        group
        relative
        flex
        flex-col
        items-center
        overflow-hidden
        rounded-3xl
        border
        border-white/10
        bg-gradient-to-b
        from-zinc-900
        to-zinc-950
        p-8
        text-center
        transition-all
        duration-500
        hover:-translate-y-2
        hover:border-violet-500/50
        hover:shadow-[0_20px_60px_rgba(124,58,237,0.20)]
      "
    >
      {/* Glow interno */}
      <div
        className="
          pointer-events-none
          absolute
          -top-20
          h-40
          w-40
          rounded-full
          bg-violet-600/10
          blur-3xl
          transition-all
          duration-500
          group-hover:bg-violet-600/25
        "
      />

      {/* Imagem */}
      <div
        className="
          relative
          mb-6
          flex
          h-20
          w-20
          items-center
          justify-center
          overflow-hidden
          rounded-2xl
          border
          border-white/10
          bg-white/[0.04]
          shadow-inner
          transition-all
          duration-500
          group-hover:scale-110
          group-hover:border-violet-500/40
          group-hover:bg-violet-500/10
        "
      >
        <img
          src={image}
          alt={title}
          loading="lazy"
          draggable={false}
          className="
            h-full
            w-full
            object-contain
            p-3
            transition-transform
            duration-500
            group-hover:scale-110
            select-none
          "
        />
      </div>

      {/* Título */}
      <h3
        className="
          relative
          text-xl
          font-bold
          text-white
          transition-colors
          duration-300
          group-hover:text-violet-300
        "
      >
        {title}
      </h3>

      {/* Descrição */}
      <p className="relative mt-3 text-sm leading-6 text-zinc-400">
        {description}
      </p>

      {/* Indicador */}
      <span
        className="
          relative
          mt-6
          h-1
          w-0
          rounded-full
          bg-gradient-to-r
          from-violet-500
          to-fuchsia-500
          transition-all
          duration-500
          group-hover:w-10
        "
      />
    </article>
  );
}