"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Bell } from "lucide-react";
import type { User } from "next-auth";

interface TopBarProps {
  user: User;
}

export function TopBar({ user }: TopBarProps) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="h-14 border-b border-gray-200/50 dark:border-gray-800/50 bg-transparent flex items-center justify-between px-6 flex-shrink-0">
      <div />
      <div className="flex items-center gap-2">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          aria-label="Toggle theme"
        >
          {mounted && theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white text-sm font-bold">
          {user?.name?.[0]?.toUpperCase() ?? "U"}
        </div>
      </div>
    </header>
  );
}
