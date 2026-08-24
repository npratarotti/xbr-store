type ProductCardProps = {
  image: string;
  name: string;
  category: string;
  price: number;
  installment?: string;
  rating: number;
  badge?: string;
};

export function ProductCard({
  image,
  name,
  category,
  price,
  installment,
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
            border
            border-violet-400/20
            bg-violet-600/90
            px-3
            py-1
            text-xs
            font-semibold
            text-white
            shadow-lg
            shadow-violet-900/20
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
          border
          border-white/5
          bg-gradient-to-br
          from-zinc-950
          to-zinc-900
        "
      >
        <div
          className="
            pointer-events-none
            absolute
            h-32
            w-32
            rounded-full
            bg-violet-600/10
            blur-3xl
            transition-all
            duration-500
            group-hover:bg-violet-600/20
          "
        />

        <img
          src={image}
          alt={name}
          className="
            relative
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

      {/* Categoria */}
      <span
        className="
          text-xs
          font-semibold
          uppercase
          tracking-wider
          text-violet-400
        "
      >
        {category}
      </span>

      {/* Nome */}
      <h3
        className="
          mt-2
          min-h-[56px]
          text-xl
          font-bold
          leading-7
          text-white
          transition-colors
          duration-300
          group-hover:text-violet-200
        "
      >
        {name}
      </h3>

      {/* Avaliação */}
      <div className="mt-3 flex items-center gap-2">
        <span className="text-sm tracking-wide text-yellow-400">
          {"★".repeat(Math.floor(rating))}
        </span>

        <span className="text-sm font-medium text-zinc-500">
          {rating.toFixed(1)}
        </span>
      </div>

      {/* Preço */}
      <div className="mt-5">
        <p className="text-3xl font-black tracking-tight text-white">
          {price.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </p>

        {installment && (
          <p className="mt-1 text-sm text-zinc-500">
            {installment}
          </p>
        )}
      </div>

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
          active:scale-[0.98]
        "
      >
        Adicionar ao carrinho
      </button>
    </article>
  );
}