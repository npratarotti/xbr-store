import { useEffect, useState } from "react";
import { products as mockProducts } from "../constants/products";

export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  installment: string;
  rating: number;
  badge?: string;
  /** undefined ou null = estoque ilimitado. 0 = esgotado. */
  stock?: number;
};

function formatInstallment(price: number) {
  const value = price / 12;
  return `12x de ${value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })}`;
}

function normalizeProduct(raw: any): Product {
  const mock = mockProducts.find((item) => item.id === raw.id);

  return {
    id: raw.id,
    name: raw.name,
    category: raw.category,
    price: raw.price,
    image: raw.image,
    installment: mock?.installment ?? formatInstallment(raw.price),
    rating: mock?.rating ?? 5,
    badge: mock?.badge,
    stock:
      typeof raw.stock === "number" && raw.stock >= 0
        ? raw.stock
        : undefined,
  };
}

function loadProducts(): Product[] {
  const stored = localStorage.getItem("xbr-products");

  if (!stored) return mockProducts;

  try {
    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed) || parsed.length === 0) {
      return mockProducts;
    }

    return parsed.map(normalizeProduct);
  } catch {
    return mockProducts;
  }
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(loadProducts);

  useEffect(() => {
    const handleUpdate = () => setProducts(loadProducts());

    window.addEventListener("xbr-products-updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("xbr-products-updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return products;
}