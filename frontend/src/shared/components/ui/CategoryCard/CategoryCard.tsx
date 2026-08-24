type CategoryCardProps = {
  icon: string;
  name: string;
};

export function CategoryCard({
  icon,
  name,
}: CategoryCardProps) {
  return (
    <button
      className="
        group
        relative
        flex
        min-h-[210px]
        flex-col
        items-center
        justify-center
        overflow-hidden
        rounded-3xl
        border
        border-white/10
        bg-gradient-to-b
        from-zinc-900
        to-zinc-950
        p-6
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

      {/* Ícone */}
      <div
        className="
          relative
          flex
          h-20
          w-20
          items-center
          justify-center
          rounded-2xl
          border
          border-white/10
          bg-white/[0.04]
          text-4xl
          shadow-inner
          transition-all
          duration-500
          group-hover:scale-110
          group-hover:border-violet-500/40
          group-hover:bg-violet-500/10
        "
      >
        <span
          className="
            transition-transform
            duration-500
            group-hover:scale-110
          "
        >
          {icon}
        </span>
      </div>

      {/* Nome */}
      <span
        className="
          relative
          mt-6
          text-base
          font-bold
          text-white
          transition-colors
          duration-300
          group-hover:text-violet-300
        "
      >
        {name}
      </span>

      {/* Indicador */}
      <span
        className="
          relative
          mt-3
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
    </button>
  );
}