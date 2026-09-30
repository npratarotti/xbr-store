import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";

type User = {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
};

type AuthResult = {
  success: boolean;
  error?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<AuthResult>;
  login: (
    email: string,
    password: string
  ) => Promise<AuthResult>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

/** E-mail que vira admin automaticamente (fallback se o banco não marcar) */
const ADMIN_EMAIL = "admin@xbr.com";

/**
 * Busca o perfil completo (name + is_admin) da tabela `profiles`
 */
async function fetchProfile(supabaseUser: SupabaseUser): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("name, email, is_admin")
      .eq("id", supabaseUser.id)
      .maybeSingle();

    if (error || !data) {
      // Fallback: usa dados do metadata se o perfil ainda não existir
      return {
        id: supabaseUser.id,
        name: supabaseUser.user_metadata?.name ?? "Usuário",
        email: supabaseUser.email ?? "",
        isAdmin:
          (supabaseUser.email ?? "").toLowerCase() === ADMIN_EMAIL,
      };
    }

    return {
      id: supabaseUser.id,
      name: data.name,
      email: data.email,
      isAdmin: data.is_admin,
    };
  } catch {
    return null;
  }
}

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ===== Carrega a sessão inicial e escuta mudanças =====
  useEffect(() => {
    let mounted = true;

    // 1. Pega a sessão atual (se o usuário já estava logado)
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;

      if (session?.user) {
        const profile = await fetchProfile(session.user);
        if (mounted) setUser(profile);
      }

      if (mounted) setLoading(false);
    });

    // 2. Escuta mudanças de auth (login, logout, refresh de token)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;

      if (session?.user) {
        const profile = await fetchProfile(session.user);
        if (mounted) setUser(profile);
      } else {
        if (mounted) setUser(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // ===== Registrar =====
  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<AuthResult> => {
    const normalizedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    const { error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: {
          name: trimmedName,
        },
      },
    });

    if (error) {
      // Traduz mensagens comuns do Supabase
      if (error.message.toLowerCase().includes("already registered")) {
        return {
          success: false,
          error: "Este e-mail já está cadastrado.",
        };
      }

      if (error.message.toLowerCase().includes("password")) {
        return {
          success: false,
          error: "A senha precisa ter pelo menos 6 caracteres.",
        };
      }

      return {
        success: false,
        error: error.message,
      };
    }

    return { success: true };
  };

  // ===== Login =====
  const login = async (
    email: string,
    password: string
  ): Promise<AuthResult> => {
    const normalizedEmail = email.trim().toLowerCase();

    const { error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (error) {
      if (error.message.toLowerCase().includes("invalid login")) {
        return {
          success: false,
          error: "E-mail ou senha inválidos.",
        };
      }

      if (error.message.toLowerCase().includes("email not confirmed")) {
        return {
          success: false,
          error:
            "Confirme seu e-mail antes de fazer login. Verifique sua caixa de entrada.",
        };
      }

      return {
        success: false,
        error: error.message,
      };
    }

    return { success: true };
  };

  // ===== Logout =====
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }

  return context;
}