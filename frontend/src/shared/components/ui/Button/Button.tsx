import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
};

export function Button({ children, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="
        rounded-xl
        bg-violet-600
        px-6
        py-3
        font-semibold
        text-white
        transition
        hover:bg-violet-700
      "
    >
      {children}
    </button>
  );
}