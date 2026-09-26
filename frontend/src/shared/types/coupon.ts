export type CouponType = "percent" | "fixed";

export type Coupon = {
  /** Código do cupom, sempre armazenado em MAIÚSCULO e sem espaços. */
  code: string;
  type: CouponType;
  /** Se type = "percent": valor em % (ex.: 10 = 10%). Se "fixed": valor em R$. */
  value: number;
  /** Valor mínimo do subtotal para o cupom valer. Opcional. */
  minTotal?: number;
  /** Data ISO de expiração. Opcional. */
  expiresAt?: string;
  active: boolean;
};

/** Cupom aplicado no carrinho, com o desconto já calculado. */
export type AppliedCoupon = {
  code: string;
  type: CouponType;
  value: number;
  /** Valor efetivamente descontado (em R$). */
  discount: number;
};

export function normalizeCouponCode(input: string) {
  return input.trim().toUpperCase().replace(/\s+/g, "");
}