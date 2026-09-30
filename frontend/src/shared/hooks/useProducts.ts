import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  installment: string;
  rating: number;
  badge?: string;
  stock?: number;
};

type UseProductsResult = {
  products: Product[];
  loading: boolean;
  error: string | null;
};

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

export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let channel: ReturnType<typeof supabase.channel> | null = null;

    async function load() {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("products")
        .select("*")
        .order("id", { ascending: true });

      if (!mounted) return;

      if (fetchError) {
        setError(fetchError.message);
        setProducts([]);
      } else {
        setProducts((data ?? []).map(mapRow));
      }

      setLoading(false);
    }

    load();

    // Cria o canal DEPOIS do load, e com nome único
    const channelName = `products-changes-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        () => {
          if (mounted) load();
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  return { products, loading, error };
}