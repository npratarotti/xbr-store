import { useShipping, calculateShipping } from "../../shared/hooks/useShipping";
import { maskCep } from "../../shared/types/shipping";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Container } from "../../shared/components/layout/Container";
import { useCart } from "../../app/providers/CartProvider";
import {
  useCoupons,
  findCoupon,
  validateCoupon,
} from "../../shared/hooks/useCoupons";
import {
  normalizeCouponCode,
  type AppliedCoupon,
} from "../../shared/types/coupon";

export function Checkout() {
  const navigate = useNavigate();

  const { cart } = useCart();

  const coupons = useCoupons();

  const shippingConfig = useShipping();

  const savedUser = localStorage.getItem("xbr-user");

  const user = savedUser ? JSON.parse(savedUser) : null;

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");

  const [cep, setCep] = useState("");
  const [address, setAddress] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const [payment, setPayment] = useState("pix");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cupom
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [appliedCoupon, setAppliedCoupon] =
    useState<AppliedCoupon | null>(null);

    // Frete
const [shippingResult, setShippingResult] = useState<{
  price: number;
  days: number;
} | null>(null);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Recalcula o desconto sempre que o subtotal muda.
  // Se o cupom deixar de ser válido (ex.: subtotal caiu abaixo do mínimo),
  // remove automaticamente e avisa.
  useEffect(() => {
    useEffect(() => {
      if (!cep.trim()) {
        setShippingResult(null);
        return;
      }
    
      const result = calculateShipping(shippingConfig, cep, subtotal);
    
      if (!result) {
        setShippingResult(null);
        return;
      }
    
      setShippingResult({ price: result.price, days: result.days });
    }, [cep, subtotal, shippingConfig]);

    if (!appliedCoupon) return;

    const coupon = findCoupon(coupons, appliedCoupon.code);

    if (!coupon) {
      setAppliedCoupon(null);
      setCouponError("O cupom aplicado não existe mais.");
      return;
    }

    const result = validateCoupon(coupon, subtotal);

if (result.valid === false) {
  setAppliedCoupon(null);
  setCouponError(result.reason);
  return;
}

    if (result.discount !== appliedCoupon.discount) {
      setAppliedCoupon({
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        discount: result.discount,
      });
    }
  }, [subtotal, coupons, appliedCoupon]);

  const discount = appliedCoupon?.discount ?? 0;
const shippingPrice = shippingResult?.price ?? 0;
const finalTotal = Math.max(0, subtotal - discount + shippingPrice);

  const handleApplyCoupon = () => {
    setCouponError("");

    const normalized = normalizeCouponCode(couponInput);

    if (!normalized) {
      setCouponError("Informe um código de cupom.");
      return;
    }

    const coupon = findCoupon(coupons, normalized);

    if (!coupon) {
      setCouponError("Cupom não encontrado.");
      return;
    }

    const result = validateCoupon(coupon, subtotal);

if (result.valid === false) {
  setCouponError(result.reason ?? "Cupom inválido.");
  return;
}

    setAppliedCoupon({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      discount: result.discount,
    });

    setCouponInput("");
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError("");
    setCouponInput("");
  };

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-[#09090B] py-20">
        <Container>
          <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-zinc-900/70 px-6 py-20 text-center">
            <div className="text-6xl">🛒</div>

            <h1 className="mt-6 text-3xl font-black text-white">
              Seu carrinho está vazio
            </h1>

            <p className="mt-3 text-zinc-500">
              Adicione pelo menos um produto antes de finalizar a compra.
            </p>

            <Link
              to="/products"
              className="mt-8 inline-block rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 py-4 font-bold text-white transition hover:scale-[1.02]"
            >
              Explorar produtos
            </Link>
          </div>
        </Container>
      </main>
    );
  }

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (cart.length === 0) {
      setError("Seu carrinho está vazio.");
      return;
    }

    if (
      !name.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !cep.trim() ||
      !address.trim() ||
      !number.trim() ||
      !city.trim() ||
      !state.trim()
    ) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    setIsSubmitting(true);

    const order = {
      id: `XBR-${Date.now()}`,

      customer: {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
      },

      address: {
        cep: cep.trim(),
        address: address.trim(),
        number: number.trim(),
        complement: complement.trim(),
        city: city.trim(),
        state: state.trim().toUpperCase(),
      },

      payment,

      items: cart,

      subtotal,

      discount,

      shipping: shippingResult
    ? {
        price: shippingResult.price,
        days: shippingResult.days,
      }
    : { price: 0, days: 0 },

      coupon: appliedCoupon
        ? {
            code: appliedCoupon.code,
            type: appliedCoupon.type,
            value: appliedCoupon.value,
            discount: appliedCoupon.discount,
          }
        : undefined,

      total: finalTotal,

      status: "Pendente",

      createdAt: new Date().toISOString(),
    };

    // Simula processamento (em produção: chamada à API de pagamento)
    await new Promise((resolve) => setTimeout(resolve, 900));

    const savedOrders = localStorage.getItem("xbr-orders");

    const orders = savedOrders ? JSON.parse(savedOrders) : [];

    orders.push(order);

    localStorage.setItem("xbr-orders", JSON.stringify(orders));
    window.dispatchEvent(new Event("xbr-orders-updated"));

    localStorage.setItem("xbr-last-order", JSON.stringify(order));

    localStorage.removeItem("xbr-cart");

    navigate("/order-success");
  };

  return (
    <main className="min-h-screen bg-[#09090B] py-12 md:py-20">
      <Container>
        <div className="mb-12">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
            XBR Store
          </span>

          <h1 className="mt-3 text-4xl font-black text-white md:text-5xl">
            Finalizar compra
          </h1>

          <p className="mt-4 text-zinc-400">
            Preencha seus dados para finalizar seu pedido.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-8 lg:grid-cols-[1fr_380px]"
        >
          <div className="space-y-6">
            {/* Dados pessoais */}
            <section className="rounded-3xl border border-white/10 bg-zinc-900/70 p-7">
              <h2 className="text-xl font-bold text-white">
                Dados pessoais
              </h2>

              <div className="mt-6 grid gap-5">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-zinc-300"
                  >
                    Nome completo *
                  </label>

                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Seu nome completo"
                    required
                    className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-5 py-3.5 text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-zinc-300"
                  >
                    E-mail *
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="seu@email.com"
                    required
                    className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-5 py-3.5 text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-medium text-zinc-300"
                  >
                    Telefone *
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="(19) 99999-9999"
                    required
                    className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-5 py-3.5 text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-500"
                  />
                </div>
              </div>
            </section>

            {/* Endereço */}
            <section className="rounded-3xl border border-white/10 bg-zinc-900/70 p-7">
              <h2 className="text-xl font-bold text-white">
                Endereço de entrega
              </h2>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="cep"
                    className="mb-2 block text-sm font-medium text-zinc-300"
                  >
                    CEP *
                  </label>

                  <input
                    id="cep"
                    type="text"
                    value={cep}
                    onChange={(event) => setCep(maskCep(event.target.value))}
                    maxLength={9}
                    placeholder="00000-000"
                    required
                    className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-5 py-3.5 text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="number"
                    className="mb-2 block text-sm font-medium text-zinc-300"
                  >
                    Número *
                  </label>

                  <input
                    id="number"
                    type="text"
                    value={number}
                    onChange={(event) => setNumber(event.target.value)}
                    placeholder="123"
                    required
                    className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-5 py-3.5 text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="address"
                    className="mb-2 block text-sm font-medium text-zinc-300"
                  >
                    Endereço *
                  </label>

                  <input
                    id="address"
                    type="text"
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    placeholder="Rua, avenida..."
                    required
                    className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-5 py-3.5 text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="complement"
                    className="mb-2 block text-sm font-medium text-zinc-300"
                  >
                    Complemento
                  </label>

                  <input
                    id="complement"
                    type="text"
                    value={complement}
                    onChange={(event) => setComplement(event.target.value)}
                    placeholder="Apartamento, bloco, referência..."
                    className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-5 py-3.5 text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="city"
                    className="mb-2 block text-sm font-medium text-zinc-300"
                  >
                    Cidade *
                  </label>

                  <input
                    id="city"
                    type="text"
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                    placeholder="Sua cidade"
                    required
                    className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-5 py-3.5 text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="state"
                    className="mb-2 block text-sm font-medium text-zinc-300"
                  >
                    Estado *
                  </label>

                  <input
                    id="state"
                    type="text"
                    value={state}
                    onChange={(event) => setState(event.target.value)}
                    placeholder="SP"
                    maxLength={2}
                    required
                    className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-5 py-3.5 text-white uppercase outline-none transition placeholder:text-zinc-600 focus:border-violet-500"
                  />
                </div>
              </div>
            </section>

            {/* Pagamento */}
            <section className="rounded-3xl border border-white/10 bg-zinc-900/70 p-7">
              <h2 className="text-xl font-bold text-white">
                Forma de pagamento
              </h2>

              <div className="mt-6 space-y-3">
                <label className="flex cursor-pointer items-center gap-4 rounded-2xl border border-white/10 bg-zinc-950 p-4 transition hover:border-violet-500/50">
                  <input
                    type="radio"
                    name="payment"
                    value="pix"
                    checked={payment === "pix"}
                    onChange={(event) => setPayment(event.target.value)}
                    className="accent-violet-600"
                  />

                  <div>
                    <p className="font-semibold text-white">PIX</p>

                    <p className="text-sm text-zinc-500">
                      Pagamento instantâneo
                    </p>
                  </div>
                </label>

                <label className="flex cursor-pointer items-center gap-4 rounded-2xl border border-white/10 bg-zinc-950 p-4 transition hover:border-violet-500/50">
                  <input
                    type="radio"
                    name="payment"
                    value="credit"
                    checked={payment === "credit"}
                    onChange={(event) => setPayment(event.target.value)}
                    className="accent-violet-600"
                  />

                  <div>
                    <p className="font-semibold text-white">
                      Cartão de crédito
                    </p>

                    <p className="text-sm text-zinc-500">Até 12x</p>
                  </div>
                </label>
              </div>
            </section>

            {/* Erro */}
            {error && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-400">
                {error}
              </div>
            )}
          </div>

          {/* Resumo */}
          <aside className="h-fit rounded-3xl border border-white/10 bg-zinc-900/70 p-7 lg:sticky lg:top-28">
            <h2 className="text-xl font-bold text-white">
              Resumo do pedido
            </h2>

            <div className="my-6 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">
                      {item.name}
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">
                      Quantidade: {item.quantity}
                    </p>
                  </div>

                  <span className="whitespace-nowrap text-sm font-semibold text-zinc-300">
                    {(item.price * item.quantity).toLocaleString(
                      "pt-BR",
                      {
                        style: "currency",
                        currency: "BRL",
                      }
                    )}
                  </span>
                </div>
              ))}
            </div>

            <div className="my-6 h-px bg-white/10" />

            {/* CUPOM */}
            <div className="mb-4">
              {appliedCoupon ? (
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-3">
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wider text-green-400">
                      Cupom aplicado
                    </p>

                    <p className="mt-1 truncate font-bold text-white">
                      {appliedCoupon.code}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="rounded-xl border border-white/10 bg-zinc-950 px-3 py-1.5 text-xs font-semibold text-zinc-400 transition hover:border-red-500/40 hover:text-red-400"
                  >
                    Remover
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(event) =>
                        setCouponInput(
                          event.target.value.toUpperCase()
                        )
                      }
                      placeholder="Cupom de desconto"
                      className="flex-1 rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white uppercase outline-none placeholder:text-zinc-600 focus:border-violet-500"
                    />

                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm font-semibold text-white transition hover:border-violet-500"
                    >
                      Aplicar
                    </button>
                  </div>

                  {couponError && (
                    <p className="mt-2 text-xs font-medium text-red-400">
                      {couponError}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-between text-zinc-400">
              <span>Subtotal</span>

              <span>
                {subtotal.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </div>

            <div className="mt-4 flex justify-between text-zinc-400">
  <span>
    Frete
    {shippingResult && shippingResult.days > 0 && (
      <span className="ml-2 text-xs text-zinc-600">
        ({shippingResult.days} {shippingResult.days === 1 ? "dia" : "dias"})
      </span>
    )}
  </span>

  {!cep.trim() ? (
    <span className="text-zinc-500">—</span>
  ) : !shippingResult ? (
    <span className="text-zinc-500">CEP inválido</span>
  ) : shippingResult.price === 0 ? (
    <span className="text-green-400">Grátis</span>
  ) : (
    <span>
      {shippingResult.price.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })}
    </span>
  )}
</div>

            {appliedCoupon && (
              <div className="mt-4 flex justify-between text-green-400">
                <span>Desconto ({appliedCoupon.code})</span>

                <span>
                  -{" "}
                  {appliedCoupon.discount.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </div>
            )}

            <div className="my-6 h-px bg-white/10" />

            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-white">Total</span>

              <span className="text-2xl font-black text-white">
                {finalTotal.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-7 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-4 font-bold text-white shadow-lg shadow-violet-700/20 transition hover:scale-[1.02] hover:shadow-violet-500/40 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              )}

              {isSubmitting
                ? "Processando pedido..."
                : "Confirmar pedido"}
            </button>

            <p className="mt-4 text-center text-xs leading-5 text-zinc-600">
              Ao confirmar, seu pedido será registrado na XBR Store.
            </p>
          </aside>
        </form>
      </Container>
    </main>
  );
}