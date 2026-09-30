import { supabase } from "../../lib/supabase";

type CreateOrderInput = {
  userId: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
  address: {
    cep: string;
    address: string;
    number: string;
    complement?: string;
    city: string;
    state: string;
  };
  payment: string;
  items: Array<{
    productId: number;
    name: string;
    image?: string;
    price: number;
    quantity: number;
  }>;
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
};

export async function createOrder(input: CreateOrderInput): Promise<string> {
  const code = `XBR-${Date.now()}`;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      code,
      user_id: input.userId,
      customer_name: input.customer.name,
      customer_email: input.customer.email,
      customer_phone: input.customer.phone ?? null,
      address_cep: input.address.cep,
      address_street: input.address.address,
      address_number: input.address.number,
      address_complement: input.address.complement ?? null,
      address_city: input.address.city,
      address_state: input.address.state,
      payment: input.payment,
      coupon_code: input.coupon?.code ?? null,
      coupon_type: input.coupon?.type ?? null,
      coupon_value: input.coupon?.value ?? null,
      coupon_discount: input.coupon?.discount ?? null,
      subtotal: input.subtotal,
      discount: input.discount,
      shipping_price: input.shipping.price,
      shipping_days: input.shipping.days,
      total: input.total,
      status: "Pendente",
    })
    .select()
    .single();

  if (orderError) throw new Error(orderError.message);

  const itemsPayload = input.items.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    product_name: item.name,
    product_image: item.image ?? null,
    price: item.price,
    quantity: item.quantity,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(itemsPayload);

  if (itemsError) {
    await supabase.from("orders").delete().eq("id", order.id);
    throw new Error(itemsError.message);
  }

  return code;
}

export async function updateOrderStatus(
  orderId: number,
  status: string
) {
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);

  if (error) throw new Error(error.message);
}