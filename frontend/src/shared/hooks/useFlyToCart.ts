import { useState } from "react";

type FlyState = {
  from: DOMRect;
  to: DOMRect;
  image: string;
};

export function useFlyToCart() {
  const [fly, setFly] = useState<FlyState | null>(null);

  const triggerFly = (
    event: React.MouseEvent<HTMLButtonElement>,
    image: string,
    cartSelector = "[data-cart-icon]"
  ) => {
    const button = event.currentTarget;

    // pega o ícone do carrinho que está VISÍVEL na tela
    // (importante porque temos 2 no header: mobile e desktop)
    const cartIcon = Array.from(
      document.querySelectorAll<HTMLElement>(cartSelector)
    ).find((el) => {
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    });

    if (!button || !cartIcon) return;

    const from = button.getBoundingClientRect();
    const to = cartIcon.getBoundingClientRect();

    setFly({ from, to, image });
  };

  const clearFly = () => setFly(null);

  return { fly, triggerFly, clearFly };
}