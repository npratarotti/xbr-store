import { useEffect, useState } from "react";
import {
  DEFAULT_SHIPPING,
  normalizeCep,
  type ShippingConfig,
  type ShippingZone,
} from "../types/shipping";

function loadShipping(): ShippingConfig {
  try {
    const raw = localStorage.getItem("xbr-shipping");
    if (!raw) return DEFAULT_SHIPPING;

    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.zones)) return DEFAULT_SHIPPING;

    return {
      freeShippingThreshold:
        typeof parsed.freeShippingThreshold === "number"
          ? parsed.freeShippingThreshold
          : DEFAULT_SHIPPING.freeShippingThreshold,
      fallbackPrice:
        typeof parsed.fallbackPrice === "number"
          ? parsed.fallbackPrice
          : DEFAULT_SHIPPING.fallbackPrice,
      fallbackDays:
        typeof parsed.fallbackDays === "number"
          ? parsed.fallbackDays
          : DEFAULT_SHIPPING.fallbackDays,
      zones: parsed.zones,
    };
  } catch {
    return DEFAULT_SHIPPING;
  }
}

export function useShipping() {
  const [config, setConfig] = useState<ShippingConfig>(loadShipping);

  useEffect(() => {
    const handleUpdate = () => setConfig(loadShipping());

    window.addEventListener("xbr-shipping-updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("xbr-shipping-updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return config;
}

export type ShippingResult = {
  /** Preço final do frete (0 se grátis) */
  price: number;
  /** Prazo em dias úteis */
  days: number;
  /** Faixa que casou (ou undefined se foi fallback) */
  zone?: ShippingZone;
  /** Se o frete ficou grátis por atingir o threshold */
  freeBecauseThreshold: boolean;
};

/**
 * Calcula o frete pro CEP e subtotal dados.
 *
 * @param config Configuração atual (do useShipping)
 * @param cep CEP cru ("01310-100", "01310100", etc.)
 * @param subtotal Valor dos produtos (sem frete)
 * @returns Resultado do cálculo, ou null se o CEP é inválido
 */
export function calculateShipping(
  config: ShippingConfig,
  cep: string,
  subtotal: number
): ShippingResult | null {
  const cepNumber = normalizeCep(cep);

  if (cepNumber <= 0) return null;

  // 1. Acha a faixa
  const zone = config.zones.find(
    (z) => cepNumber >= z.cepStart && cepNumber <= z.cepEnd
  );

  const price = zone ? zone.price : config.fallbackPrice;
  const days = zone ? zone.days : config.fallbackDays;

  // 2. Checa frete grátis
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