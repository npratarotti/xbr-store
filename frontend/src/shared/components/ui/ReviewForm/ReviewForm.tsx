import { useEffect, useRef, useState } from "react";
import { StarRating } from "../StarRating/StarRating";
import type { Review } from "../../../types/review";

type ReviewFormProps = {
  initialReview?: Review | null;
  onSubmit: (data: {
    rating: number;
    comment: string;
    photo?: string;
  }) => void;
  onCancel?: () => void;
};

const MAX_PHOTO_SIZE_MB = 2;

export function ReviewForm({
  initialReview,
  onSubmit,
  onCancel,
}: ReviewFormProps) {
  const [rating, setRating] = useState(initialReview?.rating ?? 0);
  const [comment, setComment] = useState(initialReview?.comment ?? "");
  const [photo, setPhoto] = useState<string | undefined>(
    initialReview?.photo
  );
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setRating(initialReview?.rating ?? 0);
    setComment(initialReview?.comment ?? "");
    setPhoto(initialReview?.photo);
    setError("");
  }, [initialReview]);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_PHOTO_SIZE_MB * 1024 * 1024) {
      setError(`A imagem deve ter no máximo ${MAX_PHOTO_SIZE_MB} MB.`);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Envie apenas arquivos de imagem.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(reader.result as string);
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhoto(undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (rating === 0) {
      setError("Escolha uma nota de 1 a 5 estrelas.");
      return;
    }

    if (comment.trim().length < 10) {
      setError("Escreva pelo menos 10 caracteres no comentário.");
      return;
    }

    onSubmit({
      rating,
      comment: comment.trim(),
      photo,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900 to-zinc-950 p-6"
    >
      <div className="pointer-events-none absolute -top-20 right-0 h-40 w-40 rounded-full bg-violet-600/10 blur-3xl" />

      <h3 className="relative text-lg font-bold text-white">
        {initialReview ? "Editar sua avaliação" : "Avaliar este produto"}
      </h3>

      <p className="relative mt-1 text-sm text-zinc-500">
        Conte o que você achou do produto.
      </p>

      <div className="relative mt-5 space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Sua nota *
          </label>

          <StarRating value={rating} onChange={setRating} size="lg" />
        </div>

        <div>
          <label
            htmlFor="review-comment"
            className="mb-2 block text-sm font-medium text-zinc-300"
          >
            Comentário *
          </label>

          <textarea
            id="review-comment"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            rows={4}
            placeholder="O que você achou do produto?"
            className="w-full resize-none rounded-2xl border border-white/10 bg-zinc-950 px-5 py-3.5 text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Foto (opcional)
          </label>

          {photo ? (
            <div className="relative overflow-hidden rounded-2xl border border-white/10">
              <img
                src={photo}
                alt="Prévia"
                className="max-h-64 w-full object-cover"
              />

              <button
                type="button"
                onClick={handleRemovePhoto}
                className="absolute right-3 top-3 rounded-full border border-white/20 bg-black/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur transition hover:bg-red-500/70"
              >
                Remover
              </button>
            </div>
          ) : (
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-white/20 bg-zinc-950 px-5 py-8 text-sm text-zinc-400 transition hover:border-violet-500/50 hover:text-violet-300">
              <span>📷</span>
              <span>Escolher imagem</span>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}
      </div>

      <div className="relative mt-6 flex flex-wrap gap-3">
        <button
          type="submit"
          className="rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 font-bold text-white shadow-lg shadow-violet-700/20 transition hover:scale-[1.02] hover:shadow-violet-500/40 active:scale-[0.98]"
        >
          {initialReview ? "Salvar alterações" : "Publicar avaliação"}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-2xl border border-white/10 bg-zinc-950 px-6 py-3 font-semibold text-zinc-300 transition hover:border-white/20 hover:text-white"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}