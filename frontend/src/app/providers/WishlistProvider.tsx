import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
  } from "react";
  
  type WishlistContextType = {
    wishlist: number[];
    wishlistCount: number;
    isInWishlist: (id: number) => boolean;
    toggleWishlist: (id: number) => void;
    clearWishlist: () => void;
  };
  
  const WishlistContext = createContext<WishlistContextType | undefined>(
    undefined
  );
  
  export function WishlistProvider({ children }: { children: ReactNode }) {
    const [wishlist, setWishlist] = useState<number[]>(() => {
      const saved = localStorage.getItem("xbr-wishlist");
  
      return saved ? JSON.parse(saved) : [];
    });
  
    useEffect(() => {
      localStorage.setItem("xbr-wishlist", JSON.stringify(wishlist));
    }, [wishlist]);
  
    const isInWishlist = (id: number) => wishlist.includes(id);
  
    const toggleWishlist = (id: number) => {
      setWishlist((current) =>
        current.includes(id)
          ? current.filter((item) => item !== id)
          : [...current, id]
      );
    };
  
    const clearWishlist = () => setWishlist([]);
  
    const wishlistCount = wishlist.length;
  
    return (
      <WishlistContext.Provider
        value={{
          wishlist,
          wishlistCount,
          isInWishlist,
          toggleWishlist,
          clearWishlist,
        }}
      >
        {children}
      </WishlistContext.Provider>
    );
  }
  
  export function useWishlist() {
    const context = useContext(WishlistContext);
  
    if (!context) {
      throw new Error(
        "useWishlist deve ser usado dentro de WishlistProvider"
      );
    }
  
    return context;
  }