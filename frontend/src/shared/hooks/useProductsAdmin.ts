import { supabase } from "../../lib/supabase";

export type ProductInput = {
  name: string;
  category: string;
  price: number;
  image_url: string;
  installment: string;
  rating: number;
  badge?: string | null;
  stock?: number | null;
};

/**
 * Faz upload de uma imagem no bucket products-images
 * Retorna a URL pública
 */
export async function uploadProductImage(file: File): Promise<string> {
  const fileExt = file.name.split(".").pop() ?? "jpg";
  const fileName = `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("products-images")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Erro no upload: ${uploadError.message}`);
  }

  const { data } = supabase.storage
    .from("products-images")
    .getPublicUrl(fileName);

  return data.publicUrl;
}

/**
 * Cria um produto
 */
export async function createProduct(input: ProductInput) {
  const { data, error } = await supabase
    .from("products")
    .insert(input)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/**
 * Atualiza um produto
 */
export async function updateProduct(
  id: number,
  input: Partial<ProductInput>
) {
  const { data, error } = await supabase
    .from("products")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/**
 * Deleta um produto
 */
export async function deleteProduct(id: number) {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
}

/**
 * Extrai o path interno do Storage a partir de uma URL pública
 */
export function getStoragePathFromUrl(url: string): string | null {
  const marker = "/storage/v1/object/public/products-images/";
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return url.slice(index + marker.length);
}

/**
 * Deleta uma imagem do Storage
 */
export async function deleteProductImage(url: string) {
  const path = getStoragePathFromUrl(url);
  if (!path) return;

  await supabase.storage.from("products-images").remove([path]);
}