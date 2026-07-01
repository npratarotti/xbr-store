type CategoryCardProps = {
    icon: string;
    name: string;
  };
  
  export function CategoryCard({ icon, name }: CategoryCardProps) {
    return (
      <button
        className="
          flex
          flex-col
          items-center
          justify-center
          rounded-2xl
          border
          border-zinc-800
          bg-zinc-900
          p-8
          transition-all
          duration-300
          hover:-translate-y-2
          hover:border-violet-500
          hover:shadow-xl
        "
      >
        <span className="text-5xl">{icon}</span>
  
        <span className="mt-4 font-semibold">
          {name}
        </span>
      </button>
    );
  }