export type OrderStatus =
  | "Pendente"
  | "Pago"
  | "Enviado"
  | "Entregue"
  | "Cancelado";

export const ORDER_STATUSES: OrderStatus[] = [
  "Pendente",
  "Pago",
  "Enviado",
  "Entregue",
  "Cancelado",
];

export const ORDER_STATUS_STYLES: Record<
  OrderStatus,
  { badge: string; dot: string }
> = {
  Pendente: {
    badge:
      "border-yellow-500/20 bg-yellow-500/10 text-yellow-400",
    dot: "bg-yellow-400",
  },
  Pago: {
    badge: "border-green-500/20 bg-green-500/10 text-green-400",
    dot: "bg-green-400",
  },
  Enviado: {
    badge: "border-blue-500/20 bg-blue-500/10 text-blue-400",
    dot: "bg-blue-400",
  },
  Entregue: {
    badge:
      "border-violet-500/20 bg-violet-500/10 text-violet-400",
    dot: "bg-violet-400",
  },
  Cancelado: {
    badge: "border-red-500/20 bg-red-500/10 text-red-400",
    dot: "bg-red-400",
  },
};

export function isOrderStatus(value: string): value is OrderStatus {
  return (ORDER_STATUSES as string[]).includes(value);
}