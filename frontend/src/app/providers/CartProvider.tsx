

import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
  } from "react";
  
  type CartItem = {
    id: number;
    image: string;
    name: string;
    price: number;
    quantity: number;
  };
  
  type CartContextType = {
    cart: CartItem[];
    cartQuantity: number;
    addToCart: (item: Omit<CartItem, "quantity">) => void;
    increaseQuantity: (id: number) => void;
    decreaseQuantity: (id: number) => void;
    removeItem: (id: number) => void;
  };
  
  const CartContext = createContext<CartContextType | undefined>(undefined);
  
  export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>(() => {
      const savedCart = localStorage.getItem("xbr-cart");
  
      return savedCart ? JSON.parse(savedCart) : [];
    });
  
    useEffect(() => {
      localStorage.setItem("xbr-cart", JSON.stringify(cart));
    }, [cart]);
  
    const addToCart = (item: Omit<CartItem, "quantity">) => {
      setCart((currentCart) => {
        const existingProduct = currentCart.find(
          (cartItem) => cartItem.id === item.id
        );
  
        if (existingProduct) {
          return currentCart.map((cartItem) =>
            cartItem.id === item.id
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          );
        }
  
        return [...currentCart, { ...item, quantity: 1 }];
      });
    };
  
    const increaseQuantity = (id: number) => {
      setCart((currentCart) =>
        currentCart.map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    };
  
    const decreaseQuantity = (id: number) => {
      setCart((currentCart) =>
        currentCart
          .map((item) =>
            item.id === id
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
          .filter((item) => item.quantity > 0)
      );
    };
  
    const removeItem = (id: number) => {
      setCart((currentCart) =>
        currentCart.filter((item) => item.id !== id)
      );
    };
  
    const cartQuantity = cart.reduce(
      (total, item) => total + item.quantity,
      0
    );
  
    return (
      <CartContext.Provider
        value={{
          cart,
          cartQuantity,
          addToCart,
          increaseQuantity,
          decreaseQuantity,
          removeItem,
        }}
      >
        {children}
      </CartContext.Provider>
    );
  }
  
  export function useCart() {
    const context = useContext(CartContext);
  
    if (!context) {
      throw new Error("useCart deve ser usado dentro de CartProvider");
    }
  
    return context;
  }