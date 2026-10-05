"use client";

import { useState, useRef, useEffect } from "react";
import { X, Trash2, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import type { Task, TaskPriority, TaskStatus, EventColor } from "@/types";
import { EVENT_COLORS } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";
import { es } from "date-fns/locale";

const COLORS: EventColor[] = ["blue", "red", "green", "yellow", "purple", "pink", "orange", "gray"];
const CATEGORIES = ["general", "examen", "tarea", "proyecto", "personal", "trabajo", "estudio"];

function CustomDatePicker({ value, onChange }: { value: string, onChange: (d: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(value ? new Date(value) : new Date());

  const days = eachDayOfInterval({ start: startOfMonth(currentMonth), end: endOfMonth(currentMonth) });
  const firstDay = startOfMonth(currentMonth).getDay();
  const padding = firstDay === 0 ? 6 : firstDay - 1;
  const paddingArray = Array(padding).fill(null);

  return (
    <div className="relative">
      <button 
        type="button" 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      >
        <span>{value ? format(new Date(value), "dd MMM yyyy", { locale: es }) : "Sin fecha"}</span>
        <CalendarIcon className="w-4 h-4 text-gray-500" />
      </button>
      
      {isOpen && (
        <div className="absolute z-50 mt-1 left-0 p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl w-64">
          <div className="flex justify-between items-center mb-2">
            <button type="button" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-sm capitalize">{format(currentMonth, "MMMM yyyy", { locale: es })}</span>
            <button type="button" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs mb-1 text-gray-500 font-medium">
            {['L','M','X','J','V','S','D'].map(d => <div key={d}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {paddingArray.map((_, i) => <div key={`pad-${i}`} />)}
            {days.map((day, i) => {
              const isSelected = value && isSameDay(day, new Date(value));
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    onChange(format(day, "yyyy-MM-dd"));
                    setIsOpen(false);
                  }}
                  className={cn(
                    "p-1.5 text-xs rounded-full transition",
                    isSelected 
                      ? "bg-blue-600 text-white hover:bg-blue-700" 
                      : "text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                  )}
                >
                  {format(day, "d")}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

interface TaskModalProps {
  task: Task | null;
  onSave: (data: Partial<Task>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onClose: () => void;
}

export function TaskModal({ task, onSave, onDelete, onClose }: TaskModalProps) {
  const isEditing = !!task;

  const [form, setForm] = useState({
    title: task?.title ?? "",
    description: task?.description ?? "",
    dueDate: task?.dueDate ? format(new Date(task.dueDate), "yyyy-MM-dd") : "",
    priority: (task?.priority ?? "medium") as TaskPriority,
    status: (task?.status ?? "todo") as TaskStatus,
    category: task?.category ?? "general",
    color: (task?.color ?? "blue") as EventColor,
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
        dueDate: form.dueDate ? new Date(form.dueDate) : null,
        priority: form.priority,
        status: form.status,
        category: form.category,
        color: form.color,
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!task?.id) return;
    setDeleting(true);
    try { await onDelete(task.id); } finally { setDeleting(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-3xl border border-white/50 dark:border-gray-700/50 rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {isEditing ? "Editar tarea" : "Nueva tarea"}
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
            placeholder="Título de la tarea"
            required
            className="w-full text-lg font-semibold bg-transparent border-0 border-b-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none pb-2 text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 transition"
          />

          {/* Description */}
          <textarea
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="Descripción (opcional)"
            rows={2}
            className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition"
          />

          {/* Due date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Fecha límite</label>
              <CustomDatePicker value={form.dueDate} onChange={v => setForm(f => ({ ...f, dueDate: v }))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Prioridad</label>
              <select
                value={form.priority}
                onChange={e => setForm(f => ({ ...f, priority: e.target.value as TaskPriority }))}
                className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="low">🟢 Baja</option>
                <option value="medium">🟡 Media</option>
                <option value="high">🔴 Alta</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Category */}
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Categoría</label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition capitalize"
              >
                {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
              </select>
            </div>
            {/* Status */}
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Estado</label>
              <select
                value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value as TaskStatus }))}
                className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="todo">⏳ Pendiente</option>
                <option value="in_progress">🔄 En progreso</option>
                <option value="done">✅ Hecho</option>
              </select>
            </div>
          </div>

          {/* Color */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 dark:text-gray-400">Color:</span>
            <div className="flex gap-2">
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
          <div className="flex items-center pt-2">
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
              <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition">
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving || !form.title.trim()}
                className="px-6 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition disabled:opacity-50 shadow-sm"
              >
                {saving ? "Guardando..." : isEditing ? "Guardar" : "Crear tarea"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

