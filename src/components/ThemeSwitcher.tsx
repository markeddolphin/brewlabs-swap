import { useEffect, useState } from "react";
import clsx from "clsx";
import { useTheme } from "next-themes";
import { Switch } from "@headlessui/react";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const [isDark, setDark] = useState(theme === "dark");
  const [mounted, setMounted] = useState(false);

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), []);

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
      setDark(false);
    }
    if (theme === "light") {
      setTheme("dark");
      setDark(true);
    }
  };

  if (!mounted) return null;

  return (
    <div className="inline-flex py-3 px-4">
      <Switch
        checked={isDark}
        onChange={toggleTheme}
        className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-400 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 dark:bg-slate-600"
      >
        <span className="sr-only">Change theme</span>
        <span
          className={clsx(
            isDark ? "translate-x-5" : "translate-x-0",
            "pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
          )}
        >
          <span
            className={clsx(
              isDark
                ? "opacity-0 duration-100 ease-out"
                : "opacity-100 duration-200 ease-in",
              "absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
            )}
            aria-hidden="true"
          >
            <SunIcon className="h-4 w-4 text-dark" />
          </span>
          <span
            className={clsx(
              isDark
                ? "opacity-100 duration-200 ease-in"
                : "opacity-0 duration-100 ease-out",
              "absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
            )}
            aria-hidden="true"
          >
            <MoonIcon className="h-4 w-4 text-dark" />
          </span>
        </span>
      </Switch>

      <span className="ml-4 text-sm text-gray-500">Current theme: {theme}</span>
    </div>
  );
};

export default ThemeSwitcher;
