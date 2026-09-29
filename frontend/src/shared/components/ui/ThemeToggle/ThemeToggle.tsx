import { useTheme } from "../../../../app/providers/ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Mudar para tema claro" : "Mudar para tema escuro"}
      onClick={toggleTheme}
      className={`
        relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center
        rounded-full border transition-colors duration-300
        ${
          isDark
            ? "border-zinc-700 bg-zinc-800"
            : "border-zinc-300 bg-zinc-200"
        }
      `}
    >
      <span
        className={`
          absolute left-1 text-xs transition-opacity duration-300
          ${isDark ? "opacity-40" : "opacity-100"}
        `}
      >
        ☀️
      </span>

      <span
        className={`
          absolute right-1 text-xs transition-opacity duration-300
          ${isDark ? "opacity-100" : "opacity-40"}
        `}
      >
        🌙
      </span>

      <span
        className={`
          relative z-10 inline-block h-5 w-5 transform rounded-full
          bg-white shadow-lg transition-transform duration-300
          ${isDark ? "translate-x-6" : "translate-x-1"}
        `}
      />
    </button>
  );
}