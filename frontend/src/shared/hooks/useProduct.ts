import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import type { Product } from "./useProducts";

function mapRow(row: any): Product {
  return {
    id: Number(row.id),
    name: row.name,
    category: row.category,
    price: Number(row.price),
    image: row.image_url,
    installment: row.installment,
    rating: Number(row.rating),
    badge: row.badge ?? undefined,
    stock: typeof row.stock === "number" ? row.stock : undefined,
  };
}

export function useProduct(id: number | null) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id === null || Number.isNaN(id)) {
      setLoading(false);
      return;
    }

    let mounted = true;

    async function load() {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (!mounted) return;

      if (fetchError) {
        setError(fetchError.message);
        setProduct(null);
      } else if (data) {
        setProduct(mapRow(data));
      } else {
        setProduct(null);
      }
      setLoading(false);
    }

    load();

    return () => {
      mounted = false;
    };
  }, [id]);

  return { product, loading, error };
}