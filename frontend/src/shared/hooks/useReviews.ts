import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import type { Review } from "../types/review";

function mapRow(row: any): Review {
  return {
    id: Number(row.id),
    productId: Number(row.product_id),
    userId: row.user_id,
    userName: row.profiles?.name ?? "Usuário",
    userEmail: row.profiles?.email ?? "",
    rating: Number(row.rating),
    comment: row.comment,
    photo: row.photo_url ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at ?? undefined,
  };
}

/**
 * Lista reviews de um produto específico (com realtime)
 */
export function useProductReviews(productId: number | null) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (productId === null || Number.isNaN(productId)) {
      setLoading(false);
      return;
    }

    let mounted = true;
    let channel: ReturnType<typeof supabase.channel> | null = null;

    async function load() {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("reviews")
        .select(
          `
          id,
          product_id,
          user_id,
          rating,
          comment,
          photo_url,
          created_at,
          updated_at,
          profiles:user_id ( name, email )
        `
        )
        .eq("product_id", productId)
        .order("created_at", { ascending: false });

      if (!mounted) return;

      if (fetchError) {
        setError(fetchError.message);
        setReviews([]);
      } else {
        setReviews((data ?? []).map(mapRow));
      }

      setLoading(false);
    }

    load();

    const channelName = `reviews-${productId}-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;

    channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "reviews",
          filter: `product_id=eq.${productId}`,
        },
        () => {
          if (mounted) load();
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      if (channel) supabase.removeChannel(channel);
    };
  }, [productId]);

  return { reviews, loading, error };
}