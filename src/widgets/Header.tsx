import { Moon, Sun } from "lucide-react";
import { Button } from "../shared/ui/Button";
import { useThemeStore } from "../shared/stores/useThemeStore";

export function Header() {
  const { isDark, toggleTheme } = useThemeStore();

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Dashboard
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="light"
            onClick={toggleTheme}
            startContent={
              isDark ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )
            }
          >
            <span className="hidden">{isDark ? "Light" : "Dark"}</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
