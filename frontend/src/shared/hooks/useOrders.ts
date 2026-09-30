import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../app/providers/AuthProvider";

export type OrderItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

export type Order = {
  id: number;
  code: string;
  userId: string | null;
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
  payment: string;
  items: OrderItem[];
  coupon?: {
    code: string;
    type: "percent" | "fixed";
    value: number;
    discount: number;
  };
  subtotal: number;
  discount: number;
  shipping: {
    price: number;
    days: number;
  };
  total: number;
  status: string;
  createdAt: string;
};

type UseOrdersResult = {
  orders: Order[];
  loading: boolean;
  error: string | null;
};

/**
 * Converte as rows (order + order_items join) pro formato do app.
 * Uma row por item → agrupa por order_id.
 */
function mapRows(rows: any[]): Order[] {
  const map = new Map<number, Order>();

  for (const row of rows) {
    const orderId = Number(row.id);

    if (!map.has(orderId)) {
      map.set(orderId, {
        id: orderId,
        code: row.code,
        userId: row.user_id,
        customer: {
          name: row.customer_name,
          email: row.customer_email,
          phone: row.customer_phone ?? undefined,
        },
        address: row.address_cep
          ? {
              cep: row.address_cep,
              address: row.address_street ?? "",
              number: row.address_number ?? "",
              complement: row.address_complement ?? undefined,
              city: row.address_city ?? "",
              state: row.address_state ?? "",
            }
          : undefined,
        payment: row.payment,
        coupon: row.coupon_code
          ? {
              code: row.coupon_code,
              type: row.coupon_type,
              value: Number(row.coupon_value),
              discount: Number(row.coupon_discount),
            }
          : undefined,
        subtotal: Number(row.subtotal),
        discount: Number(row.discount),
        shipping: {
          price: Number(row.shipping_price),
          days: Number(row.shipping_days ?? 0),
        },
        total: Number(row.total),
        status: row.status,
        createdAt: row.created_at,
        items: [],
      });
    }

    if (row.items_id) {
      map.get(orderId)!.items.push({
        id: Number(row.items_id),
        name: row.items_name,
        price: Number(row.items_price),
        quantity: Number(row.items_quantity),
        image: row.items_image ?? undefined,
      });
    }
  }

  return Array.from(map.values());
}

/**
 * Lista pedidos (todos se admin, só os do user se cliente)
 */
export function useOrders(): UseOrdersResult {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    let mounted = true;
    let channel: ReturnType<typeof supabase.channel> | null = null;

    async function load() {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("orders")
        .select(
          `
          id,
          code,
          user_id,
          customer_name,
          customer_email,
          customer_phone,
          address_cep,
          address_street,
          address_number,
          address_complement,
          address_city,
          address_state,
          payment,
          coupon_code,
          coupon_type,
          coupon_value,
          coupon_discount,
          subtotal,
          discount,
          shipping_price,
          shipping_days,
          total,
          status,
          created_at,
          order_items (
            id,
            product_name,
            product_image,
            price,
            quantity
          )
        `
        )
        .order("created_at", { ascending: false });

      if (!mounted) return;

      if (fetchError) {
        setError(fetchError.message);
        setOrders([]);
        setLoading(false);
        return;
      }

      // Achata order_items pra mapear
      const flatRows = (data ?? []).flatMap((order: any) => {
        if (!order.order_items || order.order_items.length === 0) {
          return [{ ...order, items_id: null }];
        }
        return order.order_items.map((item: any) => ({
          ...order,
          items_id: item.id,
          items_name: item.product_name,
          items_image: item.product_image,
          items_price: item.price,
          items_quantity: item.quantity,
        }));
      });

      setOrders(mapRows(flatRows));
      setLoading(false);
    }

    load();

    const channelName = `orders-changes-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;

    channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => {
          if (mounted) load();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "order_items" },
        () => {
          if (mounted) load();
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      if (channel) supabase.removeChannel(channel);
    };
  }, [user]);

  return { orders, loading, error };
}