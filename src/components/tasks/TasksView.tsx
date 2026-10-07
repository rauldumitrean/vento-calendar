"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Filter, CheckCircle2, Circle, Clock, AlertCircle, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Task, TaskPriority, TaskStatus } from "@/types";
import { TaskItem } from "./TaskItem";
import { TaskModal } from "./TaskModal";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const STATUS_FILTERS: { key: "all" | TaskStatus; label: string }[] = [
  { key: "all", label: "Todas" },
  { key: "todo", label: "Pendientes" },
  { key: "in_progress", label: "En progreso" },
  { key: "done", label: "Hechas" },
];

const CATEGORIES = ["general", "examen", "tarea", "proyecto", "personal", "trabajo", "estudio"];

export function TasksView() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"all" | TaskStatus>("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showCompleted, setShowCompleted] = useState(true);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch("/api/tasks");
      if (res.ok) {
        const data = await res.json();
        setTasks(data.map((t: Task) => ({
          ...t,
          dueDate: t.dueDate ? new Date(t.dueDate) : null,
          createdAt: new Date(t.createdAt),
          updatedAt: new Date(t.updatedAt),
        })));
      }
    } catch {
      toast.error("Error cargando tareas");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const filteredTasks = tasks.filter(t => {
    if (statusFilter !== "all" && t.status !== statusFilter) return false;
    if (!showCompleted && t.status === "done") return false;
    return true;
  });

  const handleSave = async (data: Partial<Task>) => {
    try {
      const method = selectedTask ? "PUT" : "POST";
      const url = selectedTask ? `/api/tasks/${selectedTask.id}` : "/api/tasks";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      toast.success(selectedTask ? "Tarea actualizada" : "Tarea creada");
      setShowModal(false);
      fetchTasks();
    } catch {
      toast.error("Error guardando tarea");
    }
  };

  const handleToggle = async (task: Task) => {
    const newStatus: TaskStatus = task.status === "done" ? "todo" : "done";
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
    } catch {
      toast.error("Error actualizando tarea");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Tarea eliminada");
      setShowModal(false);
      fetchTasks();
    } catch {
      toast.error("Error eliminando tarea");
    }
  };

  const stats = {
    total: tasks.length,
    done: tasks.filter(t => t.status === "done").length,
    pending: tasks.filter(t => t.status === "todo").length,
    high: tasks.filter(t => t.priority === "high" && t.status !== "done").length,
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tareas</h1>
          <button
            onClick={() => { setSelectedTask(null); setShowModal(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Nueva tarea
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {[
            { label: "Total", value: stats.total, color: "text-gray-900 dark:text-white" },
            { label: "Hechas", value: stats.done, color: "text-green-600 dark:text-green-400" },
            { label: "Pendientes", value: stats.pending, color: "text-blue-600 dark:text-blue-400" },
            { label: "Urgentes", value: stats.high, color: "text-red-600 dark:text-red-400" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center">
              <p className={cn("text-2xl font-bold", color)}>{value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex justify-between items-center gap-4 overflow-x-auto pb-1">
          <div className="flex gap-2">
            {STATUS_FILTERS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setStatusFilter(key)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition",
                  statusFilter === key
                    ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition whitespace-nowrap"
          >
            {showCompleted ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showCompleted ? "Ocultar completadas" : "Mostrar completadas"}
          </button>
        </div>
      </div>

      {/* Task list */}
      <div className="flex-1 overflow-auto px-6 py-4">
        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse flex items-center justify-between p-4 bg-white/50 dark:bg-gray-800/40 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                <div className="flex gap-4 items-center w-full">
                  <div className="w-5 h-5 rounded-md bg-gray-200 dark:bg-gray-700" />
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                  </div>
                  <div className="w-16 h-6 rounded-full bg-gray-200 dark:bg-gray-700" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <CheckCircle2 className="w-12 h-12 text-gray-300 dark:text-gray-700 mb-3" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">No hay tareas aquí</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">¡Crea una nueva tarea para empezar!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <AnimatePresence mode="popLayout">
              {filteredTasks.map(task => (
                <motion.div
                  key={task.id}
                  layout
                  className="w-full"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <TaskItem
                    task={task}
                    onToggle={handleToggle}
                    onEdit={() => { setSelectedTask(task); setShowModal(true); }}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {showModal && (
        <TaskModal
          task={selectedTask}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

