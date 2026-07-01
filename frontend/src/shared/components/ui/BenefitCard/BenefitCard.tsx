type BenefitCardProps = {
  icon: string;
  title: string;
  description: string;
};

export function BenefitCard({
  icon,
  title,
  description,
}: BenefitCardProps) {
  return (
    <article
      className="
        rounded-2xl
        border
        border-zinc-800
        bg-zinc-900
        p-8
        text-center
        transition-all
        duration-300
        hover:-translate-y-2
        hover:border-violet-500
        hover:shadow-xl
      "
    >
      <div className="mb-5 text-5xl">
        {icon}
      </div>

      <h3 className="text-xl font-bold">
        {title}
      </h3>

      <p className="mt-3 text-zinc-400">
        {description}
      </p>
    </article>
  );
}