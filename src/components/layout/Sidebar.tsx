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

// Inline SVG to avoid network request / broken image on first load
function VentooLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Ventoo Calendar"
    >
      {/* Hollow Purple Cloud */}
      <path
        d="M 366 396 H 196 A 140 140 0 1 1 331.98 222.68 A 90 90 0 1 1 366 396 Z"
        fill="none"
        stroke="#7c3aed"
        strokeWidth="36"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Calendar Icon Bottom Right */}
      <g transform="translate(250, 240) scale(1.6)">
        <rect x="20" y="30" width="100" height="90" rx="16" fill="#e9d5ff" />
        <path
          d="M20,55 L120,55 L120,46 C120,37.2 112.8,30 104,30 L36,30 C27.2,30 20,37.2 20,46 L20,55 Z"
          fill="#7c3aed"
        />
        <rect x="20" y="30" width="100" height="90" rx="16" fill="none" stroke="#9333ea" strokeWidth="4" />
        {/* Binder Rings */}
        <rect x="40" y="15" width="10" height="25" rx="5" fill="#c084fc" stroke="#7e22ce" strokeWidth="3" />
        <circle cx="45" cy="35" r="3" fill="#4c1d95" />
        <rect x="90" y="15" width="10" height="25" rx="5" fill="#c084fc" stroke="#7e22ce" strokeWidth="3" />
        <circle cx="95" cy="35" r="3" fill="#4c1d95" />
        {/* Grid Lines */}
        <line x1="22" y1="75" x2="118" y2="75" stroke="#d8b4fe" strokeWidth="2" />
        <line x1="22" y1="95" x2="118" y2="95" stroke="#d8b4fe" strokeWidth="2" />
        <line x1="45" y1="57" x2="45" y2="118" stroke="#d8b4fe" strokeWidth="2" />
        <line x1="70" y1="57" x2="70" y2="118" stroke="#d8b4fe" strokeWidth="2" />
        <line x1="95" y1="57" x2="95" y2="118" stroke="#d8b4fe" strokeWidth="2" />
      </g>
    </svg>
  );
}

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
        {/* Logo — click leads to landing page */}
        <Link href="/" className="flex items-center gap-3 px-2 mb-8 group">
          <VentooLogo className="w-10 h-10 shrink-0 group-hover:scale-105 transition-transform" />
          <span className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            Ventoo Calendar
          </span>
        </Link>

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

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-800/50 pb-safe">
        <div className="flex justify-around items-center p-2">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-col items-center justify-center w-16 h-12 rounded-xl transition-all",
                  isActive
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                )}
              >
                <Icon className={cn("w-6 h-6 mb-1", isActive ? "fill-blue-100 dark:fill-blue-900/30" : "")} />
                <span className="text-[10px] font-medium">{label}</span>
              </Link>
            );
          })}
          
          <button
            onClick={() => setShowAI(true)}
            className="flex flex-col items-center justify-center w-16 h-12 rounded-xl text-purple-600 dark:text-purple-400 transition-all"
          >
            <Sparkles className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-medium">IA</span>
          </button>
          
          <Link
            href="/settings"
            className={cn(
              "flex flex-col items-center justify-center w-16 h-12 rounded-xl transition-all",
              pathname.startsWith("/settings")
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            )}
          >
            <Settings className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-medium">Ajustes</span>
          </Link>
        </div>
      </nav>

      {/* AI Chat Modal */}
      {showAI && <AIChat onClose={() => setShowAI(false)} />}
    </>
  );
}
