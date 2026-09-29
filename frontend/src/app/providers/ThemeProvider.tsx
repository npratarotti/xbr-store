import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
  } from "react";
  
  type Theme = "dark" | "light";
  
  type ThemeContextType = {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
  };
  
  const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
  
  const STORAGE_KEY = "xbr-theme";
  
  function getInitialTheme(): Theme {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "dark" || saved === "light") return saved;
  
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }
  
    return "light";
  }
  
  export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<Theme>(getInitialTheme);
  
    useEffect(() => {
      const root = document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(theme);
      localStorage.setItem(STORAGE_KEY, theme);
    }, [theme]);
  
    useEffect(() => {
      const media = window.matchMedia("(prefers-color-scheme: dark)");
  
      const handleChange = (event: MediaQueryListEvent) => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) {
          setThemeState(event.matches ? "dark" : "light");
        }
      };
  
      media.addEventListener("change", handleChange);
      return () => media.removeEventListener("change", handleChange);
    }, []);
  
    const toggleTheme = () => {
      setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
    };
  
    const setTheme = (next: Theme) => setThemeState(next);
  
    return (
      <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
        {children}
      </ThemeContext.Provider>
    );
  }
  
  export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
      throw new Error("useTheme deve ser usado dentro de ThemeProvider");
    }
    return context;
  }