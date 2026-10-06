import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type FlyToCartProps = {
  from: DOMRect;
  to: DOMRect;
  image: string;
  onComplete: () => void;
};

export function FlyToCart({ from, to, image, onComplete }: FlyToCartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));

    const timeout = setTimeout(() => {
      onComplete();
    }, 800);

    return () => clearTimeout(timeout);
  }, [onComplete]);

  const startX = from.left + from.width / 2;
  const startY = from.top + from.height / 2;

  const endX = to.left + to.width / 2;
  const endY = to.top + to.height / 2;

  return createPortal(
    <div
      style={{
        position: "fixed",
        left: mounted ? endX : startX,
        top: mounted ? endY : startY,
        transform: `translate(-50%, -50%) scale(${mounted ? 0.3 : 1})`,
        opacity: mounted ? 0 : 1,
        transition:
          "left 700ms cubic-bezier(0.5, -0.5, 0.7, 1), top 700ms cubic-bezier(0.5, -0.5, 0.7, 1), transform 700ms ease-in, opacity 700ms ease-in",
        zIndex: 99999,
        pointerEvents: "none",
        width: 56,
        height: 56,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          overflow: "hidden",
          background: "white",
          boxShadow: "0 10px 25px rgba(124, 58, 237, 0.4)",
          border: "2px solid #a855f7",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={image}
          alt=""
          style={{
            width: "80%",
            height: "80%",
            objectFit: "contain",
          }}
        />
      </div>
    </div>,
    document.body
  );
}