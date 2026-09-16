import {
    createContext,
    useContext,
    useState,
    type ReactNode,
  } from "react";
  
  type User = {
    name: string;
    email: string;
  };
  
  type AuthContextType = {
    user: User | null;
    register: (name: string, email: string, password: string) => boolean;
    login: (email: string, password: string) => boolean;
    logout: () => void;
  };
  
  const AuthContext = createContext<AuthContextType | undefined>(undefined);
  
  export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
      const savedUser = localStorage.getItem("xbr-user");
  
      return savedUser ? JSON.parse(savedUser) : null;
    });
  
    const register = (
      name: string,
      email: string,
      password: string
    ) => {
      const existingUser = localStorage.getItem("xbr-account");
  
      if (existingUser) {
        const account = JSON.parse(existingUser);
  
        if (account.email === email) {
          return false;
        }
      }
  
      const account = {
        name,
        email,
        password,
      };
  
      localStorage.setItem("xbr-account", JSON.stringify(account));
  
      return true;
    };
  
    const login = (email: string, password: string) => {
      const savedAccount = localStorage.getItem("xbr-account");
  
      if (!savedAccount) {
        return false;
      }
  
      const account = JSON.parse(savedAccount);
  
      if (
        account.email !== email ||
        account.password !== password
      ) {
        return false;
      }
  
      const loggedUser = {
        name: account.name,
        email: account.email,
      };
  
      setUser(loggedUser);
      localStorage.setItem("xbr-user", JSON.stringify(loggedUser));
  
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
      throw new Error("useAuth deve ser usado dentro de AuthProvider");
    }
  
    return context;
  }