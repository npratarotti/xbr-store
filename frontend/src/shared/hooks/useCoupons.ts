import { useEffect, useState } from "react";
import type { Coupon } from "../types/coupon";
import { normalizeCouponCode } from "../types/coupon";

function loadCoupons(): Coupon[] {
  try {
    const raw = localStorage.getItem("xbr-coupons");
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function useCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>(loadCoupons);

  useEffect(() => {
    const handleUpdate = () => setCoupons(loadCoupons());

    window.addEventListener("xbr-coupons-updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("xbr-coupons-updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return coupons;
}

/**
 * Resultado da validação de cupom.
 *
 * Usamos um objeto "achatado" em vez de union discriminada
 * porque o TS tem dificuldade em estreitar unions quando a
 * variável vem de uma função com retorno explícito de union.
 *
 * `reason` só existe quando `valid === false`.
 */
export type CouponValidation = {
  valid: boolean;
  discount: number;
  reason?: string;
};

/**
 * Valida um cupom e calcula o desconto.
 * @param coupon Cupom a validar
 * @param subtotal Subtotal atual do carrinho
 */
export function validateCoupon(
  coupon: Coupon,
  subtotal: number
): CouponValidation {
  if (!coupon.active) {
    return {
      valid: false,
      discount: 0,
      reason: "Este cupom está inativo.",
    };
  }

  if (coupon.expiresAt) {
    const expires = new Date(coupon.expiresAt).getTime();

    if (Number.isNaN(expires)) {
      return {
        valid: false,
        discount: 0,
        reason: "Data de validade inválida.",
      };
    }

    if (Date.now() > expires) {
      return {
        valid: false,
        discount: 0,
        reason: "Este cupom expirou.",
      };
    }
  }

  if (coupon.minTotal && subtotal < coupon.minTotal) {
    return {
      valid: false,
      discount: 0,
      reason: `Este cupom exige um mínimo de ${coupon.minTotal.toLocaleString(
        "pt-BR",
        { style: "currency", currency: "BRL" }
      )} em compras.`,
    };
  }

  if (coupon.value <= 0) {
    return {
      valid: false,
      discount: 0,
      reason: "Cupom com valor inválido.",
    };
  }

  let discount = 0;

  if (coupon.type === "percent") {
    discount = (subtotal * coupon.value) / 100;
  } else {
    discount = coupon.value;
  }

  // Desconto nunca passa do subtotal
  discount = Math.min(discount, subtotal);
  discount = Math.round(discount * 100) / 100;

  return { valid: true, discount };
}

export function findCoupon(
  coupons: Coupon[],
  code: string
): Coupon | undefined {
  const normalized = normalizeCouponCode(code);
  return coupons.find(
    (coupon) => normalizeCouponCode(coupon.code) === normalized
  );
}