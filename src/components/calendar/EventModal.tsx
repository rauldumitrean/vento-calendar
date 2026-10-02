"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { X, Trash2, MapPin, Clock, RefreshCw, AlignLeft } from "lucide-react";
import type { CalendarEvent, EventColor } from "@/types";
import { EVENT_COLORS } from "@/lib/utils";
import { cn } from "@/lib/utils";

const COLORS: EventColor[] = ["blue", "red", "green", "yellow", "purple", "pink", "orange", "gray"];

const RECURRENCE_OPTIONS = [
  { value: "", label: "Sin repetición" },
  { value: "daily", label: "Cada día" },
  { value: "weekly", label: "Cada semana" },
  { value: "monthly", label: "Cada mes" },
  { value: "yearly", label: "Cada año" },
];

interface EventModalProps {
  event: CalendarEvent | null;
  initialDate: Date | null;
  prefillData?: Partial<CalendarEvent> | null;
  onSave: (data: Partial<CalendarEvent>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onClose: () => void;
}

export function EventModal({ event, initialDate, prefillData, onSave, onDelete, onClose }: EventModalProps) {
  const isEditing = !!event;
  const defaultStart = prefillData?.startDate ? new Date(prefillData.startDate) : (initialDate ?? new Date());
  const defaultEnd = prefillData?.endDate ? new Date(prefillData.endDate) : new Date(defaultStart.getTime() + 60 * 60 * 1000);

  const [form, setForm] = useState({
    title: event?.title ?? prefillData?.title ?? "",
    description: event?.description ?? prefillData?.description ?? "",
    startDate: event?.startDate ? format(new Date(event.startDate), "yyyy-MM-dd'T'HH:mm") : format(defaultStart, "yyyy-MM-dd'T'HH:mm"),
    endDate: event?.endDate ? format(new Date(event.endDate), "yyyy-MM-dd'T'HH:mm") : format(defaultEnd, "yyyy-MM-dd'T'HH:mm"),
    allDay: event?.allDay ?? prefillData?.allDay ?? false,
    color: (event?.color ?? prefillData?.color ?? "blue") as EventColor,
    location: event?.location ?? prefillData?.location ?? "",
    recurrenceFreq: (event?.recurrence as { frequency?: string } | null)?.frequency ?? (prefillData?.recurrence as any)?.frequency ?? "",
  });

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      await onSave({
        title: form.title,
        description: form.description || null,
        startDate: new Date(form.startDate),
        endDate: new Date(form.endDate),
        allDay: form.allDay,
        color: form.color,
        location: form.location || null,
        recurrence: form.recurrenceFreq ? { frequency: form.recurrenceFreq as "daily" | "weekly" | "monthly" | "yearly", interval: 1 } : null,
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!event?.id) return;
    setDeleting(true);
    try {
      await onDelete(event.id);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-3xl border border-white/50 dark:border-gray-700/50 rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {isEditing ? "Editar evento" : "Nuevo evento"}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <input
            type="text"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="Título del evento"
            required
            className="w-full text-xl font-semibold bg-transparent border-0 border-b-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none pb-2 text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 transition"
          />

          {/* All day toggle */}
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setForm(f => ({ ...f, allDay: !f.allDay }))}
              className={cn(
                "w-11 h-6 rounded-full transition-colors",
                form.allDay ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
              )}
            >
              <div className={cn(
                "w-5 h-5 bg-white rounded-full shadow transition-transform mt-0.5 ml-0.5",
                form.allDay ? "translate-x-5" : "translate-x-0"
              )} />
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-300">Todo el día</span>
          </label>

          {/* Dates */}
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <div className="flex-1 grid grid-cols-2 gap-2">
              <input
                type={form.allDay ? "date" : "datetime-local"}
                value={form.allDay ? form.startDate.split("T")[0] : form.startDate}
                onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                className="text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <input
                type={form.allDay ? "date" : "datetime-local"}
                value={form.allDay ? form.endDate.split("T")[0] : form.endDate}
                onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                className="text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              value={form.location}
              onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
              placeholder="Añadir ubicación"
              className="flex-1 text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Description */}
          <div className="flex items-start gap-2">
            <AlignLeft className="w-4 h-4 text-gray-400 flex-shrink-0 mt-2.5" />
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Añadir descripción"
              rows={3}
              className="flex-1 text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition"
            />
          </div>

          {/* Recurrence */}
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <select
              value={form.recurrenceFreq}
              onChange={e => setForm(f => ({ ...f, recurrenceFreq: e.target.value }))}
              className="flex-1 text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              {RECURRENCE_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Color picker */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 dark:text-gray-400">Color:</span>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, color }))}
                  className={cn(
                    "w-6 h-6 rounded-full transition-all",
                    EVENT_COLORS[color].dot,
                    form.color === color ? "ring-2 ring-offset-2 ring-gray-400 scale-110" : "hover:scale-105"
                  )}
                />
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2">
            {isEditing && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                {deleting ? "Eliminando..." : "Eliminar"}
              </button>
            )}
            <div className="flex gap-3 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving || !form.title.trim()}
                className="px-6 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition disabled:opacity-50 shadow-sm"
              >
                {saving ? "Guardando..." : isEditing ? "Guardar" : "Crear evento"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

