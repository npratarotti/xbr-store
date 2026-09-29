import { useEffect, useState } from "react";

import { Toast } from "../../../shared/components/ui/Toast";
import { ConfirmDialog } from "../../../shared/components/ui/ConfirmDialog";
import { useShipping } from "../../../shared/hooks/useShipping";
import {
  maskCep,
  normalizeCep,
  type ShippingZone,
} from "../../../shared/types/shipping";

type ToastState = {
  message: string;
  type: "success" | "error";
};

type ZoneFormErrors = {
  label?: string;
  cepStart?: string;
  cepEnd?: string;
  price?: string;
  days?: string;
};

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function ShippingManager() {
  const config = useShipping();

  const [freeThreshold, setFreeThreshold] = useState(
    config.freeShippingThreshold.toString()
  );
  const [fallbackPrice, setFallbackPrice] = useState(
    config.fallbackPrice.toString()
  );
  const [fallbackDays, setFallbackDays] = useState(
    config.fallbackDays.toString()
  );

  const [label, setLabel] = useState("");
  const [cepStart, setCepStart] = useState("");
  const [cepEnd, setCepEnd] = useState("");
  const [price, setPrice] = useState("");
  const [days, setDays] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [errors, setErrors] = useState<ZoneFormErrors>({});

  const [toast, setToast] = useState<ToastState | null>(null);
  const [zoneToDelete, setZoneToDelete] =
    useState<ShippingZone | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    setFreeThreshold(config.freeShippingThreshold.toString());
    setFallbackPrice(config.fallbackPrice.toString());
    setFallbackDays(config.fallbackDays.toString());
  }, [
    config.freeShippingThreshold,
    config.fallbackPrice,
    config.fallbackDays,
  ]);

  const persist = (updated: typeof config) => {
    localStorage.setItem("xbr-shipping", JSON.stringify(updated));
    window.dispatchEvent(new Event("xbr-shipping-updated"));
  };

  const handleSaveGeneral = () => {
    const parsedFree = Number(freeThreshold);
    const parsedFallback = Number(fallbackPrice);
    const parsedDays = Number(fallbackDays);

    if (Number.isNaN(parsedFree) || parsedFree < 0) {
      setToast({
        message: "Valor de frete grátis inválido.",
        type: "error",
      });
      return;
    }

    if (Number.isNaN(parsedFallback) || parsedFallback < 0) {
      setToast({
        message: "Valor de frete padrão inválido.",
        type: "error",
      });
      return;
    }

    if (Number.isNaN(parsedDays) || parsedDays < 0) {
      setToast({
        message: "Prazo padrão inválido.",
        type: "error",
      });
      return;
    }

    persist({
      ...config,
      freeShippingThreshold: parsedFree,
      fallbackPrice: parsedFallback,
      fallbackDays: parsedDays,
    });

    setToast({
      message: "Configurações de frete salvas!",
      type: "success",
    });
  };

  const validateZone = (): ZoneFormErrors => {
    const nextErrors: ZoneFormErrors = {};

    if (!label.trim()) nextErrors.label = "Informe um nome.";
    else if (label.trim().length < 2)
      nextErrors.label = "Nome muito curto.";

    const startNum = normalizeCep(cepStart);
    const endNum = normalizeCep(cepEnd);

    if (!cepStart.trim()) nextErrors.cepStart = "Informe o CEP inicial.";
    else if (cepStart.replace(/\D/g, "").length !== 8)
      nextErrors.cepStart = "CEP precisa ter 8 dígitos.";

    if (!cepEnd.trim()) nextErrors.cepEnd = "Informe o CEP final.";
    else if (cepEnd.replace(/\D/g, "").length !== 8)
      nextErrors.cepEnd = "CEP precisa ter 8 dígitos.";

    if (startNum > endNum)
      nextErrors.cepEnd = "O CEP final precisa ser maior que o inicial.";

    const parsedPrice = Number(price);
    if (!price.trim()) nextErrors.price = "Informe o preço.";
    else if (Number.isNaN(parsedPrice) || parsedPrice < 0)
      nextErrors.price = "Preço inválido.";

    const parsedDays = Number(days);
    if (!days.trim()) nextErrors.days = "Informe o prazo.";
    else if (Number.isNaN(parsedDays) || parsedDays <= 0)
      nextErrors.days = "Prazo inválido.";

    return nextErrors;
  };

  const resetForm = () => {
    setLabel("");
    setCepStart("");
    setCepEnd("");
    setPrice("");
    setDays("");
    setEditingId(null);
    setErrors({});
  };

  const handleSubmitZone = (event: React.FormEvent) => {
    event.preventDefault();

    const validationErrors = validateZone();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    const newZone: ShippingZone = {
      id: editingId ?? Date.now(),
      label: label.trim(),
      cepStart: normalizeCep(cepStart),
      cepEnd: normalizeCep(cepEnd),
      price: Number(price),
      days: Number(days),
    };

    const updatedZones = editingId
      ? config.zones.map((z) => (z.id === editingId ? newZone : z))
      : [...config.zones, newZone];

    persist({ ...config, zones: updatedZones });

    setToast({
      message: editingId ? "Faixa atualizada!" : "Faixa adicionada!",
      type: "success",
    });

    resetForm();
  };

  const handleEditZone = (zone: ShippingZone) => {
    setEditingId(zone.id);
    setLabel(zone.label);
    setCepStart(maskCep(zone.cepStart.toString().padStart(8, "0")));
    setCepEnd(maskCep(zone.cepEnd.toString().padStart(8, "0")));
    setPrice(zone.price.toString());
    setDays(zone.days.toString());
    setErrors({});
  };

  const handleDeleteZone = (zone: ShippingZone) => {
    setZoneToDelete(zone);
  };

  const confirmDeleteZone = () => {
    if (!zoneToDelete) return;

    persist({
      ...config,
      zones: config.zones.filter((z) => z.id !== zoneToDelete.id),
    });

    if (editingId === zoneToDelete.id) resetForm();

    setToast({
      message: `Faixa "${zoneToDelete.label}" removida.`,
      type: "error",
    });

    setZoneToDelete(null);
  };

  const inputClass = (hasError: boolean) =>
    `w-full rounded-2xl border bg-background px-5 py-3.5 text-text outline-none placeholder:text-muted transition ${
      hasError
        ? "border-red-500/60 focus:border-red-500"
        : "border-border focus:border-violet-500"
    }`;

  return (
    <>
      <section id="gestao-frete" className="mt-10">
        <div className="mb-6">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
            Logística
          </span>

          <h2 className="mt-2 text-2xl font-black tracking-tight text-text">
            Frete e{" "}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">
              entrega
            </span>
          </h2>

          <p className="mt-2 text-sm text-muted">
            Configure faixas de CEP e regras de frete grátis.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-surface to-background p-6">
          <div className="pointer-events-none absolute -top-20 right-0 h-40 w-40 rounded-full bg-violet-600/10 blur-3xl" />

          <h3 className="relative text-sm font-bold uppercase tracking-wider text-violet-400">
            ⚙️ Configurações gerais
          </h3>

          <div className="relative mt-5 grid gap-5 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-xs font-medium text-muted">
                Frete grátis a partir de (R$)
              </label>

              <input
                type="number"
                step="0.01"
                min="0"
                value={freeThreshold}
                onChange={(event) => setFreeThreshold(event.target.value)}
                className={inputClass(false)}
              />

              <p className="mt-2 text-xs text-muted/70">
                0 = desativa frete grátis.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-muted">
                Frete padrão (fora das faixas)
              </label>

              <input
                type="number"
                step="0.01"
                min="0"
                value={fallbackPrice}
                onChange={(event) => setFallbackPrice(event.target.value)}
                className={inputClass(false)}
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-muted">
                Prazo do frete padrão (dias)
              </label>

              <input
                type="number"
                min="0"
                value={fallbackDays}
                onChange={(event) => setFallbackDays(event.target.value)}
                className={inputClass(false)}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleSaveGeneral}
            className="relative mt-6 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-7 py-3 font-bold text-white shadow-lg shadow-violet-700/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-violet-500/40 active:scale-[0.98]"
          >
            Salvar configurações
          </button>
        </div>

        <form
          onSubmit={handleSubmitZone}
          noValidate
          className="relative mt-8 overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-surface to-background p-6"
        >
          <div className="pointer-events-none absolute -top-20 right-0 h-40 w-40 rounded-full bg-violet-600/10 blur-3xl" />

          <h3 className="relative text-sm font-bold uppercase tracking-wider text-violet-400">
            {editingId ? "✏️ Editar faixa" : "➕ Nova faixa"}
          </h3>

          <div className="relative mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
            <div>
              <input
                type="text"
                placeholder="Nome (ex: SP)"
                value={label}
                onChange={(event) => setLabel(event.target.value)}
                className={inputClass(!!errors.label)}
              />
              {errors.label && (
                <p className="mt-2 text-xs font-medium text-red-400">
                  {errors.label}
                </p>
              )}
            </div>

            <div>
              <input
                type="text"
                placeholder="CEP inicial"
                value={cepStart}
                onChange={(event) => setCepStart(maskCep(event.target.value))}
                className={inputClass(!!errors.cepStart)}
              />
              {errors.cepStart && (
                <p className="mt-2 text-xs font-medium text-red-400">
                  {errors.cepStart}
                </p>
              )}
            </div>

            <div>
              <input
                type="text"
                placeholder="CEP final"
                value={cepEnd}
                onChange={(event) => setCepEnd(maskCep(event.target.value))}
                className={inputClass(!!errors.cepEnd)}
              />
              {errors.cepEnd && (
                <p className="mt-2 text-xs font-medium text-red-400">
                  {errors.cepEnd}
                </p>
              )}
            </div>

            <div>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="Preço (R$)"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                className={inputClass(!!errors.price)}
              />
              {errors.price && (
                <p className="mt-2 text-xs font-medium text-red-400">
                  {errors.price}
                </p>
              )}
            </div>

            <div>
              <input
                type="number"
                min="0"
                placeholder="Dias úteis"
                value={days}
                onChange={(event) => setDays(event.target.value)}
                className={inputClass(!!errors.days)}
              />
              {errors.days && (
                <p className="mt-2 text-xs font-medium text-red-400">
                  {errors.days}
                </p>
              )}
            </div>
          </div>

          <div className="relative mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              className="rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-7 py-3.5 font-bold text-white shadow-lg shadow-violet-700/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-violet-500/40 active:scale-[0.98]"
            >
              {editingId ? "Salvar alterações" : "Adicionar faixa"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-2xl border border-border bg-background px-7 py-3.5 font-semibold text-muted transition hover:border-violet-500/50 hover:text-text"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        <div className="mt-8">
          <div className="mb-4 flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-violet-500" />
            <p className="text-sm text-muted">
              <span className="font-bold text-text">
                {config.zones.length}
              </span>{" "}
              faixa{config.zones.length !== 1 ? "s" : ""} de CEP cadastrada
              {config.zones.length !== 1 ? "s" : ""}
            </p>
          </div>

          {config.zones.length === 0 ? (
            <div className="rounded-3xl border border-border bg-surface/60 px-6 py-16 text-center">
              <div className="text-5xl">🚚</div>

              <p className="mt-4 font-semibold text-text">
                Nenhuma faixa cadastrada
              </p>

              <p className="mt-2 text-sm text-muted">
                Os CEPs que não caírem em nenhuma faixa pagam o frete padrão.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {[...config.zones]
                .sort((a, b) => a.cepStart - b.cepStart)
                .map((zone) => (
                  <article
                    key={zone.id}
                    className="group relative flex flex-col gap-4 overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-surface to-background p-5 transition-all duration-500 hover:-translate-y-1 hover:border-violet-500/30 md:flex-row md:items-center"
                  >
                    <div className="pointer-events-none absolute -top-20 right-0 h-40 w-40 rounded-full bg-violet-600/10 blur-3xl transition-all duration-500 group-hover:bg-violet-600/25" />

                    <div className="relative min-w-0 flex-1">
                      <h3 className="text-lg font-black text-text">
                        {zone.label}
                      </h3>

                      <p className="mt-1 text-sm text-muted">
                        CEP {zone.cepStart.toString().padStart(8, "0")} –{" "}
                        {zone.cepEnd.toString().padStart(8, "0")}
                      </p>

                      <p className="mt-2 text-sm">
                        <span className="font-semibold text-violet-400">
                          {formatCurrency(zone.price)}
                        </span>{" "}
                        <span className="text-muted">
                          · {zone.days} dia(s) úteis
                        </span>
                      </p>
                    </div>

                    <div className="relative flex gap-3">
                      <button
                        type="button"
                        onClick={() => handleEditZone(zone)}
                        className="rounded-2xl border border-violet-500/20 bg-violet-500/10 px-5 py-3 text-sm font-semibold text-violet-400 transition hover:bg-violet-500/20"
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteZone(zone)}
                        className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/20"
                      >
                        Excluir
                      </button>
                    </div>
                  </article>
                ))}
            </div>
          )}
        </div>
      </section>

      <ConfirmDialog
        open={zoneToDelete !== null}
        title="Excluir faixa de CEP?"
        description={
          zoneToDelete
            ? `Tem certeza que deseja excluir a faixa "${zoneToDelete.label}"?`
            : undefined
        }
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        onConfirm={confirmDeleteZone}
        onCancel={() => setZoneToDelete(null)}
      />

      {toast && <Toast message={toast.message} type={toast.type} />}
    </>
  );
}