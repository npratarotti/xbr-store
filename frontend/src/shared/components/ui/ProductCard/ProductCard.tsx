type ProductCardProps = {
    image: string;
    name: string;
    category: string;
    price: string;
    rating: number;
  };
  
  export function ProductCard({
    image,
    name,
    category,
    price,
    rating,
  }: ProductCardProps) {
    return (
      <article className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition hover:border-violet-500 hover:shadow-lg">
        <div className="mb-6 flex h-32 items-center justify-center text-6xl">
          {image}
        </div>
  
        <span className="text-sm text-zinc-500">
          {category}
        </span>
  
        <h3 className="mt-2 text-xl font-bold">
          {name}
        </h3>
  
        <p className="mt-3 text-2xl font-black text-violet-500">
          {price}
        </p>
  
        <p className="mt-3 text-yellow-400">
          {"⭐".repeat(rating)}
        </p>
  
        <button
          className="
            mt-6
            w-full
            rounded-xl
            bg-violet-600
            py-3
            font-semibold
            transition
            hover:bg-violet-700
          "
        >
          Adicionar ao carrinho
        </button>
      </article>
    );
  }