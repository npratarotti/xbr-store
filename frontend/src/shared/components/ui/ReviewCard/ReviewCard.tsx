import { StarRating } from "../StarRating/StarRating";
import type { Review } from "../../../types/review";

type ReviewCardProps = {
  review: Review;
  isOwner?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
};

export function ReviewCard({
  review,
  isOwner = false,
  onEdit,
  onDelete,
}: ReviewCardProps) {
  const formattedDate = new Date(
    review.updatedAt || review.createdAt
  ).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const initials = review.userName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <article className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-surface to-background p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 text-sm font-black text-white">
          {initials}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-bold text-text">{review.userName}</p>

            {isOwner && (
              <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-violet-400">
                Sua avaliação
              </span>
            )}
          </div>

          <p className="mt-1 text-xs text-muted">{formattedDate}</p>
        </div>

        <StarRating value={review.rating} size="sm" readOnly />
      </div>

      <p className="mt-4 whitespace-pre-line leading-7 text-text/80">
        {review.comment}
      </p>

      {review.photo && (
        <div className="mt-4 overflow-hidden rounded-2xl border border-border">
          <img
            src={review.photo}
            alt="Foto da avaliação"
            className="max-h-80 w-full object-cover"
          />
        </div>
      )}

      {isOwner && (
        <div className="mt-5 flex flex-wrap gap-3">
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="rounded-xl border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-xs font-semibold text-violet-400 transition hover:bg-violet-500/20"
            >
              Editar avaliação
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-500/20"
            >
              Excluir
            </button>
          )}
        </div>
      )}
    </article>
  );
}