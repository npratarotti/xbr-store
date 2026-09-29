type StarRatingProps = {
    value: number;
    onChange?: (value: number) => void;
    size?: "sm" | "md" | "lg";
    readOnly?: boolean;
  };
  
  export function StarRating({
    value,
    onChange,
    size = "md",
    readOnly = false,
  }: StarRatingProps) {
    const sizeClass = {
      sm: "text-base",
      md: "text-2xl",
      lg: "text-3xl",
    }[size];
  
    const interactive = !readOnly && onChange;
  
    return (
      <div className={`flex items-center gap-1 ${sizeClass}`}>
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= Math.round(value);
  
          return (
            <button
              key={star}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onChange?.(star)}
              aria-label={`${star} estrela${star > 1 ? "s" : ""}`}
              className={`transition ${
                interactive ? "cursor-pointer hover:scale-110" : "cursor-default"
              } ${filled ? "text-yellow-400" : "text-zinc-700"}`}
            >
              ★
            </button>
          );
        })}
      </div>
    );
  }