"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  CalendarDays,
  FileUp,
  CheckSquare,
  LogOut,
  Settings,
  Sparkles,
} from "lucide-react";
import type { User } from "next-auth";
import { useState } from "react";
import { AIChat } from "@/components/ai/AIChat";

const navItems = [
  { href: "/calendar", label: "Calendario", icon: CalendarDays },
  { href: "/schedule", label: "Horario", icon: FileUp },
  { href: "/tasks", label: "Tareas", icon: CheckSquare },
];

interface SidebarProps {
  user: User;
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const [showAI, setShowAI] = useState(false);

  return (
    <>
      <aside className="hidden md:flex flex-col w-64 bg-transparent border-r border-gray-200/50 dark:border-gray-800/50 py-6 px-4">
        {/* Logo */}
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-sm">
            <CalendarDays className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900 dark:text-white">Ventoo Calendar</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                pathname === href || pathname.startsWith(href)
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        {/* AI Button */}
        <button
          onClick={() => setShowAI(true)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all mb-2"
        >
          <Sparkles className="w-5 h-5 flex-shrink-0" />
          Asistente IA
        </button>

        {/* Bottom */}
        <div className="border-t border-gray-200/50 dark:border-gray-800/50 pt-4 space-y-1">
          <Link
            href="/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            <Settings className="w-5 h-5" />
            Configuración
          </Link>

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Cerrar sesión
          </button>
        </div>

        {/* User */}
        <div className="mt-4 flex items-center gap-3 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {user?.name?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
      </aside>

      {/* AI Chat Modal */}
      {showAI && <AIChat onClose={() => setShowAI(false)} />}
    </>
  );
}

