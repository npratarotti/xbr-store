import { useEffect, useState } from "react";

export type OrderItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

export type OrderStatus =
  | "Pendente"
  | "Pago"
  | "Enviado"
  | "Entregue"
  | "Cancelado";

export type Order = {
  id: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
  address?: {
    cep: string;
    address: string;
    number: string;
    complement?: string;
    city: string;
    state: string;
  };
  payment?: string;
  items: OrderItem[];

  coupon?: {
    code: string;
    type: "percent" | "fixed";
    value: number;
    discount: number;
  };

  subtotal?: number;
  discount?: number;

  shipping?: {
    price: number;
    days: number;
  };

  total: number;
  status: string;
  createdAt: string;
};

function loadOrders(): Order[] {
  try {
    const raw = localStorage.getItem("xbr-orders");
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>(loadOrders);

  useEffect(() => {
    const handleUpdate = () => setOrders(loadOrders());

    window.addEventListener("xbr-orders-updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("xbr-orders-updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return orders;
}