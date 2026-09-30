import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
  } from "react";
  import { supabase } from "../../lib/supabase";
  import { useAuth } from "./AuthProvider";
  
  type WishlistContextType = {
    wishlist: number[];
    wishlistCount: number;
    loading: boolean;
    isInWishlist: (id: number) => boolean;
    toggleWishlist: (id: number) => Promise<void>;
    clearWishlist: () => Promise<void>;
  };
  
  const WishlistContext = createContext<WishlistContextType | undefined>(
    undefined
  );
  
  export function WishlistProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [wishlist, setWishlist] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
  
    // ===== Carrega a wishlist quando o usuário loga/desloga =====
    useEffect(() => {
      if (!user) {
        setWishlist([]);
        return;
      }
  
      let mounted = true;
  
      async function load() {
        setLoading(true);
  
        const { data, error } = await supabase
          .from("wishlists")
          .select("product_id")
          .eq("user_id", user!.id);
  
        if (!mounted) return;
  
        if (error) {
          console.error("Erro ao carregar wishlist:", error.message);
          setWishlist([]);
        } else {
          setWishlist((data ?? []).map((row) => Number(row.product_id)));
        }
  
        setLoading(false);
      }
  
      load();
  
      return () => {
        mounted = false;
      };
    }, [user]);
  
    const isInWishlist = (id: number) => wishlist.includes(id);
  
    const toggleWishlist = async (id: number) => {
      if (!user) return;
  
      const alreadyIn = wishlist.includes(id);
  
      // Atualização otimista (UI responde na hora)
      if (alreadyIn) {
        setWishlist((current) => current.filter((item) => item !== id));
      } else {
        setWishlist((current) => [...current, id]);
      }
  
      // Persiste no banco
      if (alreadyIn) {
        const { error } = await supabase
          .from("wishlists")
          .delete()
          .eq("user_id", user.id)
          .eq("product_id", id);
  
        if (error) {
          console.error("Erro ao remover favorito:", error.message);
          // Reverte a UI
          setWishlist((current) => [...current, id]);
        }
      } else {
        const { error } = await supabase
          .from("wishlists")
          .insert({ user_id: user.id, product_id: id });
  
        if (error) {
          console.error("Erro ao adicionar favorito:", error.message);
          // Reverte a UI
          setWishlist((current) => current.filter((item) => item !== id));
        }
      }
    };
  
    const clearWishlist = async () => {
      if (!user) return;
  
      const previous = wishlist;
      setWishlist([]);
  
      const { error } = await supabase
        .from("wishlists")
        .delete()
        .eq("user_id", user.id);
  
      if (error) {
        console.error("Erro ao limpar wishlist:", error.message);
        setWishlist(previous);
      }
    };
  
    const wishlistCount = wishlist.length;
  
    return (
      <WishlistContext.Provider
        value={{
          wishlist,
          wishlistCount,
          loading,
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