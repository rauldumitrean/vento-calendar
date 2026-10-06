"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { theme: activeTheme, setTheme: setActiveTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    timezone: "Europe/Madrid",
    dailyDigestEnabled: true,
    dailyDigestTime: "08:00",
    defaultView: "month",
    weekStartsOn: 1,
    theme: "system",
  });

  useEffect(() => {
    setMounted(true);
    // Fetch settings from API
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setSettings({
            timezone: data.timezone || "Europe/Madrid",
            dailyDigestEnabled: data.dailyDigestEnabled ?? true,
            dailyDigestTime: data.dailyDigestTime || "08:00",
            defaultView: data.defaultView || "month",
            weekStartsOn: data.weekStartsOn ?? 1,
            theme: data.theme || activeTheme || "system",
          });
          if (data.theme && data.theme !== activeTheme) {
             setActiveTheme(data.theme);
          }
        }
      })
      .catch(() => toast.error("Error cargando ajustes"))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error();
      setActiveTheme(settings.theme);
      toast.success("Ajustes guardados correctamente");
    } catch {
      toast.error("Error guardando ajustes");
    } finally {
      setSaving(false);
    }
  };

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8 w-full animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6" />
        <div className="space-y-6">
          <div className="bg-white/50 dark:bg-gray-900/40 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 h-64" />
          <div className="bg-white/50 dark:bg-gray-900/40 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 h-32" />
          <div className="bg-white/50 dark:bg-gray-900/40 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 h-48" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Ajustes</h1>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white dark:bg-gray-900 shadow-sm rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Preferencias de Calendario</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Zona horaria</label>
              <select
                value={settings.timezone}
                onChange={e => setSettings({ ...settings, timezone: e.target.value })}
                className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Europe/Madrid">Europa/Madrid</option>
                <option value="America/New_York">América/New York</option>
                <option value="America/Mexico_City">América/Mexico City</option>
                <option value="America/Bogotáa">América/Bogotáá</option>
                <option value="America/Buenos_Aires">América/Buenos Aires</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vista por defecto</label>
              <select
                value={settings.defaultView}
                onChange={e => setSettings({ ...settings, defaultView: e.target.value })}
                className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="month">Mes</option>
                <option value="week">Semana</option>
                <option value="day">Día</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Primer día de la semana</label>
              <select
                value={settings.weekStartsOn}
                onChange={e => setSettings({ ...settings, weekStartsOn: Number(e.target.value) })}
                className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={1}>Lunes</option>
                <option value={0}>Domingo</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 shadow-sm rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Temas y Apariencia</h2>
          
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Selecciona un tema para la aplicación</label>
            <div className="grid grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => { setSettings({ ...settings, theme: "light" }); setActiveTheme("light"); }}
                className={`p-4 rounded-xl border-2 text-center transition-all ${settings.theme === "light" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"}`}
              >
                <div className="w-full h-12 bg-white rounded-lg border border-gray-200 mb-2 shadow-sm" />
                <span className="text-sm font-medium">Claro</span>
              </button>
              
              <button
                type="button"
                onClick={() => { setSettings({ ...settings, theme: "dark" }); setActiveTheme("dark"); }}
                className={`p-4 rounded-xl border-2 text-center transition-all ${settings.theme === "dark" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"}`}
              >
                <div className="w-full h-12 bg-[#111827] rounded-lg border border-gray-700 mb-2 shadow-sm" />
                <span className="text-sm font-medium">Oscuro</span>
              </button>

              <button
                type="button"
                onClick={() => { setSettings({ ...settings, theme: "system" }); setActiveTheme("system"); }}
                className={`p-4 rounded-xl border-2 text-center transition-all ${settings.theme === "system" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"}`}
              >
                <div className="w-full h-12 bg-gradient-to-r from-white to-[#111827] rounded-lg border border-gray-300 mb-2 shadow-sm" />
                <span className="text-sm font-medium">Sistema</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 shadow-sm rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Notificaciones</h2>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                id="dailyDigestEnabled"
                type="checkbox"
                checked={settings.dailyDigestEnabled}
                onChange={e => setSettings({ ...settings, dailyDigestEnabled: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="dailyDigestEnabled" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Recibir resumen diario por email
              </label>
            </div>

            {settings.dailyDigestEnabled && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hora del resumen diario</label>
                <input
                  type="time"
                  value={settings.dailyDigestTime}
                  onChange={e => setSettings({ ...settings, dailyDigestTime: e.target.value })}
                  className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition disabled:opacity-50 shadow-sm"
          >
            {saving ? "Guardando..." : "Guardar ajustes"}
          </button>
        </div>
      </form>
    </div>
  );
}

