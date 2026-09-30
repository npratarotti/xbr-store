import { supabase } from "../../lib/supabase";

/**
 * Upload de imagem no bucket reviews-images
 */
export async function uploadReviewImage(file: File): Promise<string> {
  const fileExt = file.name.split(".").pop() ?? "jpg";
  const fileName = `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("reviews-images")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Erro no upload: ${uploadError.message}`);
  }

  const { data } = supabase.storage
    .from("reviews-images")
    .getPublicUrl(fileName);

  return data.publicUrl;
}

/**
 * Deleta uma imagem do Storage (silencioso)
 */
export async function deleteReviewImage(url: string) {
  const marker = "/storage/v1/object/public/reviews-images/";
  const index = url.indexOf(marker);
  if (index === -1) return;

  const path = url.slice(index + marker.length);

  await supabase.storage.from("reviews-images").remove([path]);
}

/**
 * Cria ou atualiza uma review (chave = product_id + user_id)
 */
export async function upsertReview(input: {
  productId: number;
  userId: string;
  rating: number;
  comment: string;
  photoUrl?: string | null;
}) {
  const { data: existing } = await supabase
    .from("reviews")
    .select("id")
    .eq("product_id", input.productId)
    .eq("user_id", input.userId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("reviews")
      .update({
        rating: input.rating,
        comment: input.comment,
        photo_url: input.photoUrl ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);

    if (error) throw new Error(error.message);
    return;
  }

  const { error } = await supabase.from("reviews").insert({
    product_id: input.productId,
    user_id: input.userId,
    rating: input.rating,
    comment: input.comment,
    photo_url: input.photoUrl ?? null,
  });

  if (error) throw new Error(error.message);
}

/**
 * Deleta uma review
 */
export async function deleteReview(reviewId: number) {
  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("id", reviewId);

  if (error) throw new Error(error.message);
}

/**
 * Busca a review do usuário logado para um produto
 */
export async function getUserReview(
  userId: string,
  productId: number
): Promise<{
  id: number;
  rating: number;
  comment: string;
  photo?: string;
} | null> {
  const { data, error } = await supabase
    .from("reviews")
    .select("id, rating, comment, photo_url")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .maybeSingle();

  if (error || !data) return null;

  return {
    id: Number(data.id),
    rating: Number(data.rating),
    comment: data.comment,
    photo: data.photo_url ?? undefined,
  };
}

/**
 * Verifica se o usuário já comprou o produto
 * (usa a tabela orders do Supabase agora)
 */
export async function hasUserBoughtProduct(
  userId: string,
  productId: number
): Promise<boolean> {
  const { data, error } = await supabase
    .from("orders")
    .select("id, order_items!inner(product_id)")
    .eq("user_id", userId)
    .neq("status", "Cancelado")
    .eq("order_items.product_id", productId)
    .limit(1);

  if (error) return false;
  return (data ?? []).length > 0;
}