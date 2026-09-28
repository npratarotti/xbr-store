import { useEffect, useState } from "react";

import { Toast } from "../../../shared/components/ui/Toast";
import { ConfirmDialog } from "../../../shared/components/ui/ConfirmDialog";
import { useCoupons } from "../../../shared/hooks/useCoupons";
import {
  normalizeCouponCode,
  type Coupon,
  type CouponType,
} from "../../../shared/types/coupon";

type FormErrors = {
  code?: string;
  value?: string;
  minTotal?: string;
  expiresAt?: string;
};

type ToastState = {
  message: string;
  type: "success" | "error";
};

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function isExpired(coupon: Coupon) {
  if (!coupon.expiresAt) return false;
  const time = new Date(coupon.expiresAt).getTime();
  return !Number.isNaN(time) && Date.now() > time;
}

export function CouponManager() {
  const coupons = useCoupons();

  const [code, setCode] = useState("");
  const [type, setType] = useState<CouponType>("percent");
  const [value, setValue] = useState("");
  const [minTotal, setMinTotal] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  const [editingCode, setEditingCode] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const [toast, setToast] = useState<ToastState | null>(null);
  const [couponToDelete, setCouponToDelete] =
    useState<Coupon | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {};
    const normalizedCode = normalizeCouponCode(code);

    if (!normalizedCode) {
      nextErrors.code = "Informe o código do cupom.";
    } else if (normalizedCode.length < 3) {
      nextErrors.code = "O código precisa ter pelo menos 3 caracteres.";
    } else if (
      !editingCode &&
      coupons.some(
        (c) => normalizeCouponCode(c.code) === normalizedCode
      )
    ) {
      nextErrors.code = "Já existe um cupom com esse código.";
    }

    const parsedValue = Number(value);

    if (!value.trim()) {
      nextErrors.value = "Informe o valor.";
    } else if (Number.isNaN(parsedValue) || parsedValue <= 0) {
      nextErrors.value = "O valor precisa ser maior que zero.";
    } else if (type === "percent" && parsedValue > 100) {
      nextErrors.value = "O percentual não pode passar de 100%.";
    }

    if (minTotal.trim()) {
      const parsedMin = Number(minTotal);
      if (Number.isNaN(parsedMin) || parsedMin < 0) {
        nextErrors.minTotal = "O mínimo precisa ser zero ou mais.";
      }
    }

    if (expiresAt) {
      const time = new Date(expiresAt).getTime();
      if (Number.isNaN(time)) {
        nextErrors.expiresAt = "Data inválida.";
      }
    }

    return nextErrors;
  };

  const persistCoupons = (updated: Coupon[]) => {
    localStorage.setItem("xbr-coupons", JSON.stringify(updated));
    window.dispatchEvent(new Event("xbr-coupons-updated"));
  };

  const resetForm = () => {
    setCode("");
    setType("percent");
    setValue("");
    setMinTotal("");
    setExpiresAt("");
    setEditingCode(null);
    setErrors({});
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    const normalizedCode = normalizeCouponCode(code);
    const parsedValue = Number(value);
    const parsedMin = minTotal.trim() ? Number(minTotal) : undefined;

    const newCoupon: Coupon = {
      code: normalizedCode,
      type,
      value: parsedValue,
      minTotal: parsedMin,
      expiresAt: expiresAt
        ? new Date(expiresAt).toISOString()
        : undefined,
      active: true,
    };

    if (editingCode) {
      const updated = coupons.map((coupon) =>
        normalizeCouponCode(coupon.code) === editingCode
          ? { ...newCoupon, active: coupon.active }
          : coupon
      );

      persistCoupons(updated);

      setToast({
        message: "Cupom atualizado com sucesso!",
        type: "success",
      });
    } else {
      persistCoupons([...coupons, newCoupon]);

      setToast({
        message: "Cupom adicionado com sucesso!",
        type: "success",
      });
    }

    resetForm();
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingCode(normalizeCouponCode(coupon.code));
    setCode(coupon.code);
    setType(coupon.type);
    setValue(coupon.value.toString());
    setMinTotal(
      typeof coupon.minTotal === "number" ? coupon.minTotal.toString() : ""
    );
    setExpiresAt(
      coupon.expiresAt
        ? new Date(coupon.expiresAt).toISOString().slice(0, 10)
        : ""
    );
    setErrors({});
  };

  const handleToggleActive = (coupon: Coupon) => {
    const updated = coupons.map((c) =>
      normalizeCouponCode(c.code) === normalizeCouponCode(coupon.code)
        ? { ...c, active: !c.active }
        : c
    );

    persistCoupons(updated);
  };

  const handleDelete = (coupon: Coupon) => setCouponToDelete(coupon);

  const confirmDelete = () => {
    if (!couponToDelete) return;

    const targetCode = normalizeCouponCode(couponToDelete.code);

    persistCoupons(
      coupons.filter(
        (c) => normalizeCouponCode(c.code) !== targetCode
      )
    );

    if (editingCode === targetCode) {
      resetForm();
    }

    setToast({
      message: `Cupom "${couponToDelete.code}" excluído.`,
      type: "error",
    });

    setCouponToDelete(null);
  };

  const inputClass = (hasError: boolean) =>
    `w-full rounded-2xl border bg-zinc-950 px-5 py-3.5 text-white outline-none placeholder:text-zinc-600 transition ${
      hasError
        ? "border-red-500/60 focus:border-red-500"
        : "border-white/10 focus:border-violet-500"
    }`;

  return (
    <>
      <section id="gestao-cupons" className="mt-10">
        <div className="mb-6">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
            Promoções
          </span>

          <h2 className="mt-2 text-2xl font-black tracking-tight text-white">
            Cupons de{" "}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">
              desconto
            </span>
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            Crie e gerencie cupons para suas promoções.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900 to-zinc-950 p-6"
        >
          <div className="pointer-events-none absolute -top-20 right-0 h-40 w-40 rounded-full bg-violet-600/10 blur-3xl" />

          <div className="relative mb-5 flex items-center gap-2">
            <span className="text-lg">
              {editingCode ? "✏️" : "🎟️"}
            </span>
            <p className="text-sm font-semibold text-zinc-300">
              {editingCode ? "Editando cupom" : "Novo cupom"}
            </p>
          </div>

          <div className="relative grid gap-5 md:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-1">
              <input
                type="text"
                placeholder="Código (ex: XBR10)"
                value={code}
                onChange={(event) =>
                  setCode(event.target.value.toUpperCase())
                }
                className={inputClass(!!errors.code)}
                disabled={!!editingCode}
              />
              {errors.code && (
                <p className="mt-2 text-xs font-medium text-red-400">
                  {errors.code}
                </p>
              )}
            </div>

            <div className="lg:col-span-1">
              <select
                value={type}
                onChange={(event) =>
                  setType(event.target.value as CouponType)
                }
                className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-5 py-3.5 text-white outline-none focus:border-violet-500"
              >
                <option value="percent">Percentual (%)</option>
                <option value="fixed">Valor fixo (R$)</option>
              </select>
            </div>

            <div className="lg:col-span-1">
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder={type === "percent" ? "Valor (%)" : "Valor (R$)"}
                value={value}
                onChange={(event) => setValue(event.target.value)}
                className={inputClass(!!errors.value)}
              />
              {errors.value && (
                <p className="mt-2 text-xs font-medium text-red-400">
                  {errors.value}
                </p>
              )}
            </div>

            <div className="lg:col-span-1">
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="Mínimo (opcional)"
                value={minTotal}
                onChange={(event) => setMinTotal(event.target.value)}
                className={inputClass(!!errors.minTotal)}
              />
              {errors.minTotal && (
                <p className="mt-2 text-xs font-medium text-red-400">
                  {errors.minTotal}
                </p>
              )}
            </div>

            <div className="lg:col-span-1">
              <input
                type="date"
                value={expiresAt}
                onChange={(event) => setExpiresAt(event.target.value)}
                className={inputClass(!!errors.expiresAt)}
              />
              {errors.expiresAt && (
                <p className="mt-2 text-xs font-medium text-red-400">
                  {errors.expiresAt}
                </p>
              )}
            </div>
          </div>

          <div className="relative mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              className="rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-7 py-3.5 font-bold text-white shadow-lg shadow-violet-700/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-violet-500/40 active:scale-[0.98]"
            >
              {editingCode ? "Salvar alterações" : "Adicionar cupom"}
            </button>

            {editingCode && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-2xl border border-white/10 bg-zinc-950 px-7 py-3.5 font-semibold text-zinc-300 transition hover:border-white/20 hover:text-white"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        <div className="mt-8">
          <div className="mb-4 flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-violet-500" />
            <p className="text-sm text-zinc-400">
              <span className="font-bold text-white">{coupons.length}</span>{" "}
              cupom{coupons.length !== 1 ? "s" : ""} cadastrado
              {coupons.length !== 1 ? "s" : ""}
            </p>
          </div>

          {coupons.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-zinc-900/60 px-6 py-16 text-center">
              <div className="text-5xl">🎟️</div>

              <p className="mt-4 font-semibold text-white">
                Nenhum cupom cadastrado
              </p>

              <p className="mt-2 text-sm text-zinc-500">
                Os cupons criados aparecerão aqui.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {coupons.map((coupon) => {
                const expired = isExpired(coupon);

                return (
                  <article
                    key={coupon.code}
                    className="group relative flex flex-col gap-4 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900 to-zinc-950 p-5 transition-all duration-500 hover:-translate-y-1 hover:border-violet-500/30 md:flex-row md:items-center"
                  >
                    <div className="pointer-events-none absolute -top-20 right-0 h-40 w-40 rounded-full bg-violet-600/10 blur-3xl transition-all duration-500 group-hover:bg-violet-600/25" />

                    <div className="relative min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-black tracking-wider text-white">
                          {coupon.code}
                        </h3>

                        {!coupon.active && (
                          <span className="rounded-full border border-zinc-500/30 bg-zinc-500/10 px-2 py-0.5 text-xs font-semibold text-zinc-400">
                            Inativo
                          </span>
                        )}

                        {expired && (
                          <span className="rounded-full border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-xs font-semibold text-red-400">
                            Expirado
                          </span>
                        )}
                      </div>

                      <p className="mt-2 text-sm text-zinc-300">
                        <span className="font-semibold text-violet-400">
                          {coupon.type === "percent"
                            ? `${coupon.value}% OFF`
                            : `${formatCurrency(coupon.value)} OFF`}
                        </span>

                        {typeof coupon.minTotal === "number" && (
                          <span className="ml-2 text-zinc-500">
                            · mínimo {formatCurrency(coupon.minTotal)}
                          </span>
                        )}

                        {coupon.expiresAt && (
                          <span className="ml-2 text-zinc-500">
                            · válido até{" "}
                            {new Date(
                              coupon.expiresAt
                            ).toLocaleDateString("pt-BR")}
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="relative flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(coupon)}
                        className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-5 py-3 text-sm font-semibold text-amber-400 transition hover:bg-amber-500/20"
                      >
                        {coupon.active ? "Desativar" : "Ativar"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleEdit(coupon)}
                        className="rounded-2xl border border-violet-500/20 bg-violet-500/10 px-5 py-3 text-sm font-semibold text-violet-400 transition hover:bg-violet-500/20"
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(coupon)}
                        className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/20"
                      >
                        Excluir
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <ConfirmDialog
        open={couponToDelete !== null}
        title="Excluir cupom?"
        description={
          couponToDelete
            ? `Tem certeza que deseja excluir o cupom "${couponToDelete.code}"? Essa ação não pode ser desfeita.`
            : undefined
        }
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        onConfirm={confirmDelete}
        onCancel={() => setCouponToDelete(null)}
      />

      {toast && <Toast message={toast.message} type={toast.type} />}
    </>
  );
}