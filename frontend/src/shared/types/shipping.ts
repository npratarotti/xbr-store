export type ShippingZone = {
    id: number;
    label: string;      // "SP", "Nordeste", etc.
    cepStart: number;   // 01000000
    cepEnd: number;     // 19999999
    price: number;      // em R$
    days: number;       // prazo em dias úteis
  };
  
  export type ShippingConfig = {
    freeShippingThreshold: number;
    /** Preço cobrado quando o CEP não cai em nenhuma faixa */
    fallbackPrice: number;
    /** Prazo estimado do fallback */
    fallbackDays: number;
    zones: ShippingZone[];
  };
  
  export const DEFAULT_SHIPPING: ShippingConfig = {
    freeShippingThreshold: 199,
    fallbackPrice: 29.9,
    fallbackDays: 7,
    zones: [
      { id: 1, label: "SP",             cepStart: 1000000,  cepEnd: 19999999, price: 15, days: 2 },
      { id: 2, label: "RJ",             cepStart: 20000000, cepEnd: 28999999, price: 20, days: 3 },
      { id: 3, label: "ES",             cepStart: 29000000, cepEnd: 29999999, price: 25, days: 4 },
      { id: 4, label: "MG",             cepStart: 30000000, cepEnd: 39999999, price: 25, days: 4 },
      { id: 5, label: "Nordeste",       cepStart: 40000000, cepEnd: 65999999, price: 35, days: 6 },
      { id: 6, label: "Norte",          cepStart: 66000000, cepEnd: 69999999, price: 45, days: 8 },
      { id: 7, label: "Centro-Oeste/DF",cepStart: 70000000, cepEnd: 79999999, price: 30, days: 5 },
      { id: 8, label: "Sul",            cepStart: 80000000, cepEnd: 99999999, price: 25, days: 4 },
    ],
  };
  
  /** Remove tudo que não for dígito do CEP. "01310-100" → 1310100 */
  export function normalizeCep(input: string): number {
    const digits = input.replace(/\D/g, "");
    return digits ? Number(digits) : 0;
  }
  
  /** Aplica máscara "00000-000" enquanto digita */
  export function maskCep(input: string): string {
    const digits = input.replace(/\D/g, "").slice(0, 8);
    if (digits.length <= 5) return digits;
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  }