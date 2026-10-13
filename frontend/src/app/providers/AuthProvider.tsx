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
  avatarUrl: string | null;
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
  login: (email: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  updateAvatar: (file: File) => Promise<AuthResult>;
  removeAvatar: () => Promise<AuthResult>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = "admin@xbr.com";

async function fetchProfile(supabaseUser: SupabaseUser): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("name, email, is_admin, avatar_url")
      .eq("id", supabaseUser.id)
      .maybeSingle();

    if (error || !data) {
      return {
        id: supabaseUser.id,
        name: supabaseUser.user_metadata?.name ?? "Usuário",
        email: supabaseUser.email ?? "",
        isAdmin: (supabaseUser.email ?? "").toLowerCase() === ADMIN_EMAIL,
        avatarUrl: supabaseUser.user_metadata?.avatar_url ?? null,
      };
    }

    return {
      id: supabaseUser.id,
      name: data.name,
      email: data.email,
      isAdmin: data.is_admin,
      avatarUrl: data.avatar_url ?? null,
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;

      if (session?.user) {
        const profile = await fetchProfile(session.user);
        if (mounted) setUser(profile);
      }

      if (mounted) setLoading(false);
    });

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
      if (error.message.toLowerCase().includes("already registered")) {
        return { success: false, error: "Este e-mail já está cadastrado." };
      }

      if (error.message.toLowerCase().includes("password")) {
        return {
          success: false,
          error: "A senha precisa ter pelo menos 6 caracteres.",
        };
      }

      return { success: false, error: error.message };
    }

    return { success: true };
  };

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
        return { success: false, error: "E-mail ou senha inválidos." };
      }

      if (error.message.toLowerCase().includes("email not confirmed")) {
        return {
          success: false,
          error:
            "Confirme seu e-mail antes de fazer login. Verifique sua caixa de entrada.",
        };
      }

      return { success: false, error: error.message };
    }

    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateAvatar = async (file: File): Promise<AuthResult> => {
    if (!user) return { success: false, error: "Você precisa estar logada." };

    if (file.size > 2 * 1024 * 1024) {
      return { success: false, error: "A imagem deve ter no máximo 2 MB." };
    }

    if (!file.type.startsWith("image/")) {
      return { success: false, error: "Envie apenas arquivos de imagem." };
    }

    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${user.id}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true, cacheControl: "3600" });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(path);

      const publicUrl = urlData.publicUrl;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id);

      if (updateError) throw updateError;

      setUser({ ...user, avatarUrl: publicUrl });
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Erro ao atualizar foto.",
      };
    }
  };

  const removeAvatar = async (): Promise<AuthResult> => {
    if (!user) return { success: false, error: "Você precisa estar logada." };

    try {
      await supabase
        .from("profiles")
        .update({ avatar_url: null })
        .eq("id", user.id);

      setUser({ ...user, avatarUrl: null });
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Erro ao remover foto.",
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        updateAvatar,
        removeAvatar,
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