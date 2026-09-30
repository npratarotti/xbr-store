import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import type { Coupon } from "../types/coupon";
import { normalizeCouponCode } from "../types/coupon";

/**
 * Converte row do banco pro formato do app
 */
function mapRow(row: any): Coupon {
  return {
    code: row.code,
    type: row.type,
    value: Number(row.value),
    minTotal: row.min_total !== null ? Number(row.min_total) : undefined,
    expiresAt: row.expires_at ?? undefined,
    active: !!row.active,
  };
}

/**
 * Hook que lista cupons (com realtime)
 */
export function useCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let channel: ReturnType<typeof supabase.channel> | null = null;

    async function load() {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("coupons")
        .select("*")
        .order("created_at", { ascending: false });

      if (!mounted) return;

      if (fetchError) {
        setError(fetchError.message);
        setCoupons([]);
      } else {
        setCoupons((data ?? []).map(mapRow));
      }

      setLoading(false);
    }

    load();

    const channelName = `coupons-changes-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;

    channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "coupons" },
        () => {
          if (mounted) load();
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  return { coupons, loading, error };
}

/**
 * Ações de escrita (usadas no CouponManager)
 */
export async function createOrUpdateCoupon(coupon: Coupon) {
  const payload = {
    code: normalizeCouponCode(coupon.code),
    type: coupon.type,
    value: coupon.value,
    min_total: coupon.minTotal ?? null,
    expires_at: coupon.expiresAt ?? null,
    active: coupon.active,
  };

  const { error } = await supabase
    .from("coupons")
    .upsert(payload, { onConflict: "code" });

  if (error) throw new Error(error.message);
}

export async function deleteCoupon(code: string) {
  const { error } = await supabase
    .from("coupons")
    .delete()
    .eq("code", normalizeCouponCode(code));

  if (error) throw new Error(error.message);
}

export async function toggleCouponActive(code: string, active: boolean) {
  const { error } = await supabase
    .from("coupons")
    .update({ active })
    .eq("code", normalizeCouponCode(code));

  if (error) throw new Error(error.message);
}

/**
 * Validação de cupom (permanece no front, é lógica pura)
 */
export type CouponValidation = {
  valid: boolean;
  discount: number;
  reason?: string;
};

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

  discount = Math.min(discount, subtotal);
  discount = Math.round(discount * 100) / 100;

  return { valid: true, discount };
}

/**
 * Acha cupom na lista por código
 */
export function findCoupon(
  coupons: Coupon[],
  code: string
): Coupon | undefined {
  const normalized = normalizeCouponCode(code);
  return coupons.find(
    (coupon) => normalizeCouponCode(coupon.code) === normalized
  );
}