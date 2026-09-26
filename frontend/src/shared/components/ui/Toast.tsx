type ToastType = "success" | "error";

type ToastProps = {
  message: string;
  type?: ToastType;
};

const VARIANTS: Record<
  ToastType,
  { wrapper: string; icon: string; symbol: string }
> = {
  success: {
    wrapper: "border-violet-500/30 shadow-violet-900/30",
    icon: "bg-green-500/15 text-green-400",
    symbol: "✓",
  },
  error: {
    wrapper: "border-red-500/30 shadow-red-900/30",
    icon: "bg-red-500/15 text-red-400",
    symbol: "!",
  },
};

export function Toast({ message, type = "success" }: ToastProps) {
  const variant = VARIANTS[type];

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 rounded-2xl border bg-zinc-900/95 px-5 py-4 text-white shadow-2xl backdrop-blur-xl ${variant.wrapper}`}
    >
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-full ${variant.icon}`}
      >
        {variant.symbol}
      </span>

      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}