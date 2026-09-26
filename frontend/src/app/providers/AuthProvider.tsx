import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

type User = {
  name: string;
  email: string;
  isAdmin: boolean;
};

type AuthContextType = {
  user: User | null;
  register: (
    name: string,
    email: string,
    password: string
  ) => boolean;
  login: (
    email: string,
    password: string,
    forceAdmin?: boolean
  ) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

/** E-mail que vira admin automaticamente */
const ADMIN_EMAIL = "admin@xbr.com";

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("xbr-user");

    return savedUser ? JSON.parse(savedUser) : null;
  });

  const register = (
    name: string,
    email: string,
    password: string
  ) => {
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = localStorage.getItem("xbr-account");

    if (existingUser) {
      const account = JSON.parse(existingUser);

      if (account.email === normalizedEmail) {
        return false;
      }
    }

    const account = {
      name: name.trim(),
      email: normalizedEmail,
      password,
      isAdmin: normalizedEmail === ADMIN_EMAIL,
    };

    localStorage.setItem(
      "xbr-account",
      JSON.stringify(account)
    );

    return true;
  };

  const login = (
    email: string,
    password: string,
    forceAdmin = false
  ) => {
    const normalizedEmail = email.trim().toLowerCase();

    const savedAccount = localStorage.getItem("xbr-account");

    if (!savedAccount) {
      return false;
    }

    const account = JSON.parse(savedAccount);

    if (
      account.email !== normalizedEmail ||
      account.password !== password
    ) {
      return false;
    }

    const isAdmin =
      account.isAdmin ||
      normalizedEmail === ADMIN_EMAIL ||
      forceAdmin;

    const loggedUser = {
      name: account.name,
      email: account.email,
      isAdmin,
    };

    setUser(loggedUser);

    localStorage.setItem(
      "xbr-user",
      JSON.stringify(loggedUser)
    );

    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("xbr-user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
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
    throw new Error(
      "useAuth deve ser usado dentro de AuthProvider"
    );
  }

  return context;
}