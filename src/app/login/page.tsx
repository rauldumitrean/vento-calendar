"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Email o contraseña incorrectos");
      } else {
        toast.success("¡Bienvenido!");
        router.push("/calendar");
        router.refresh();
      }
    } catch {
      toast.error("Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 mb-4">
            <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-label="Ventoo Calendar">
              <path d="M 366 396 H 196 A 140 140 0 1 1 331.98 222.68 A 90 90 0 1 1 366 396 Z" fill="none" stroke="#7c3aed" strokeWidth="36" strokeLinejoin="round" strokeLinecap="round" />
              <g transform="translate(250, 240) scale(1.6)">
                <rect x="20" y="30" width="100" height="90" rx="16" fill="#e9d5ff" />
                <path d="M20,55 L120,55 L120,46 C120,37.2 112.8,30 104,30 L36,30 C27.2,30 20,37.2 20,46 L20,55 Z" fill="#7c3aed" />
                <rect x="20" y="30" width="100" height="90" rx="16" fill="none" stroke="#9333ea" strokeWidth="4" />
                <rect x="40" y="15" width="10" height="25" rx="5" fill="#c084fc" stroke="#7e22ce" strokeWidth="3" />
                <circle cx="45" cy="35" r="3" fill="#4c1d95" />
                <rect x="90" y="15" width="10" height="25" rx="5" fill="#c084fc" stroke="#7e22ce" strokeWidth="3" />
                <circle cx="95" cy="35" r="3" fill="#4c1d95" />
                <line x1="22" y1="75" x2="118" y2="75" stroke="#d8b4fe" strokeWidth="2" />
                <line x1="22" y1="95" x2="118" y2="95" stroke="#d8b4fe" strokeWidth="2" />
                <line x1="45" y1="57" x2="45" y2="118" stroke="#d8b4fe" strokeWidth="2" />
                <line x1="70" y1="57" x2="70" y2="118" stroke="#d8b4fe" strokeWidth="2" />
                <line x1="95" y1="57" x2="95" y2="118" stroke="#d8b4fe" strokeWidth="2" />
              </g>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Ventoo Calendar</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Tu calendario inteligente con IA</p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Iniciar sesión</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Entrando...
                </span>
              ) : "Entrar"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Usa tus credenciales de{" "}
            <span className="font-semibold text-blue-600 dark:text-blue-400">Ventoo</span>
          </p>
        </div>
      </div>
    </div>
  );
}

