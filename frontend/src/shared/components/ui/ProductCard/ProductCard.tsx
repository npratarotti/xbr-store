type ProductCardProps = {
  image: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  badge?: string;
};

export function ProductCard({
  image,
  name,
  category,
  price,
  rating,
  badge,
}: ProductCardProps) {
  return (
    <article
      className="
        group
        relative
        overflow-hidden
        rounded-3xl
        border
        border-white/10
        bg-zinc-900/70
        p-5
        backdrop-blur-xl
        transition-all
        duration-500
        hover:-translate-y-2
        hover:border-violet-500/50
        hover:shadow-[0_25px_70px_rgba(124,58,237,.20)]
      "
    >
      {/* Brilho do card */}

      <div
        className="
          pointer-events-none
          absolute
          -right-20
          -top-20
          h-40
          w-40
          rounded-full
          bg-violet-600/10
          blur-3xl
          transition
          duration-500
          group-hover:bg-violet-600/20
        "
      />

      {/* Badge */}

      {badge && (
        <span
          className="
            absolute
            left-5
            top-5
            z-10
            rounded-full
            bg-violet-600/90
            px-3
            py-1
            text-xs
            font-semibold
            text-white
          "
        >
          {badge}
        </span>
      )}

      {/* Imagem */}

      <div
        className="
          relative
          mb-6
          flex
          h-64
          items-center
          justify-center
          overflow-hidden
          rounded-2xl
          bg-zinc-950/60
        "
      >
        <img
          src={image}
          alt={name}
          className="
            h-full
            w-full
            object-contain
            p-6
            transition-transform
            duration-500
            group-hover:scale-110
          "
        />
      </div>

      {/* Informações */}

      <span className="text-sm text-zinc-500">
        {category}
      </span>

      <h3 className="mt-2 text-xl font-bold text-white">
        {name}
      </h3>

      {/* Avaliação */}

      <div className="mt-3 flex items-center gap-2">
        <span className="text-yellow-400">
          {"★".repeat(Math.floor(rating))}
        </span>

        <span className="text-sm text-zinc-500">
          {rating}
        </span>
      </div>

      {/* Preço */}

      <p className="mt-4 text-3xl font-black text-white">
        {price.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}
      </p>

      {/* Botão */}

      <button
        className="
          mt-6
          w-full
          rounded-2xl
          bg-gradient-to-r
          from-violet-600
          to-fuchsia-600
          py-3.5
          font-semibold
          text-white
          shadow-lg
          shadow-violet-700/20
          transition-all
          duration-300
          hover:scale-[1.02]
          hover:shadow-violet-500/40
        "
      >
        Adicionar ao carrinho
      </button>
    </article>
  );
}