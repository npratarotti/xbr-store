import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
};

export function Button({ children, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="rounded-xl
      bg-violet-600
      px-8
      py-4
      font-semibold
      text-white
      transition-all
      duration-300
      hover:-translate-y-1
      hover:bg-violet-500
      hover:shadow-[0_20px_50px_rgba(124,58,237,.45)]"
    >
      {children}
    </button>
  );
}