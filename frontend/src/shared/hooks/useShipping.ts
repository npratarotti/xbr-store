import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import {
  normalizeCep,
  type ShippingConfig,
  type ShippingZone,
} from "../types/shipping";

/**
 * Converte row da tabela shipping_zones pro tipo do app
 */
function mapZoneRow(row: any): ShippingZone {
  return {
    id: Number(row.id),
    label: row.label,
    cepStart: Number(row.cep_start),
    cepEnd: Number(row.cep_end),
    price: Number(row.price),
    days: Number(row.days),
  };
}

/**
 * Hook que busca a config completa (geral + zonas) e escuta realtime
 */
export function useShipping() {
  const [config, setConfig] = useState<ShippingConfig>({
    freeShippingThreshold: 0,
    fallbackPrice: 0,
    fallbackDays: 0,
    zones: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let channel: ReturnType<typeof supabase.channel> | null = null;

    async function load() {
      setLoading(true);
      setError(null);

      const [configRes, zonesRes] = await Promise.all([
        supabase.from("shipping_config").select("*").eq("id", 1).maybeSingle(),
        supabase
          .from("shipping_zones")
          .select("*")
          .order("cep_start", { ascending: true }),
      ]);

      if (!mounted) return;

      if (configRes.error || zonesRes.error) {
        setError(configRes.error?.message ?? zonesRes.error?.message ?? "Erro");
        return;
      }

      setConfig({
        freeShippingThreshold: Number(
          configRes.data?.free_shipping_threshold ?? 0
        ),
        fallbackPrice: Number(configRes.data?.fallback_price ?? 0),
        fallbackDays: Number(configRes.data?.fallback_days ?? 0),
        zones: (zonesRes.data ?? []).map(mapZoneRow),
      });

      setLoading(false);
    }

    load();

    const channelName = `shipping-changes-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;

    channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "shipping_zones" },
        () => {
          if (mounted) load();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "shipping_config" },
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

  return { config, loading, error };
}

/**
 * Atualiza a config geral
 */
export async function updateShippingConfig(config: {
  freeShippingThreshold: number;
  fallbackPrice: number;
  fallbackDays: number;
}) {
  const { error } = await supabase
    .from("shipping_config")
    .update({
      free_shipping_threshold: config.freeShippingThreshold,
      fallback_price: config.fallbackPrice,
      fallback_days: config.fallbackDays,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);

  if (error) throw new Error(error.message);
}

/**
 * Cria uma faixa
 */
export async function createShippingZone(zone: {
  label: string;
  cepStart: number;
  cepEnd: number;
  price: number;
  days: number;
}) {
  const { error } = await supabase.from("shipping_zones").insert({
    label: zone.label,
    cep_start: zone.cepStart,
    cep_end: zone.cepEnd,
    price: zone.price,
    days: zone.days,
  });

  if (error) throw new Error(error.message);
}

/**
 * Atualiza uma faixa
 */
export async function updateShippingZone(
  id: number,
  zone: {
    label: string;
    cepStart: number;
    cepEnd: number;
    price: number;
    days: number;
  }
) {
  const { error } = await supabase
    .from("shipping_zones")
    .update({
      label: zone.label,
      cep_start: zone.cepStart,
      cep_end: zone.cepEnd,
      price: zone.price,
      days: zone.days,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

/**
 * Deleta uma faixa
 */
export async function deleteShippingZone(id: number) {
  const { error } = await supabase
    .from("shipping_zones")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
}

/**
 * Cálculo de frete (lógica pura, permanece no front)
 */
export type ShippingResult = {
  price: number;
  days: number;
  zone?: ShippingZone;
  freeBecauseThreshold: boolean;
};

export function calculateShipping(
  config: ShippingConfig,
  cep: string,
  subtotal: number
): ShippingResult | null {
  const cepNumber = normalizeCep(cep);

  if (cepNumber <= 0) return null;

  const zone = config.zones.find(
    (z) => cepNumber >= z.cepStart && cepNumber <= z.cepEnd
  );

  const price = zone ? zone.price : config.fallbackPrice;
  const days = zone ? zone.days : config.fallbackDays;

  const freeBecauseThreshold =
    config.freeShippingThreshold > 0 &&
    subtotal >= config.freeShippingThreshold;

  return {
    price: freeBecauseThreshold ? 0 : price,
    days,
    zone,
    freeBecauseThreshold,
  };
}