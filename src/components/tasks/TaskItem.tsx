"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CheckCircle2, Circle, Clock, Edit2, AlertCircle } from "lucide-react";
import type { Task } from "@/types";
import { cn } from "@/lib/utils";
import { EVENT_COLORS } from "@/lib/utils";

const PRIORITY_STYLES = {
  high:   { icon: AlertCircle, text: "text-red-600 dark:text-red-400", label: "Alta" },
  medium: { icon: Clock,        text: "text-yellow-600 dark:text-yellow-400", label: "Media" },
  low:    { icon: Circle,       text: "text-green-600 dark:text-green-400", label: "Baja" },
};

interface TaskItemProps {
  task: Task;
  onToggle: (task: Task) => void;
  onEdit: () => void;
}

export function TaskItem({ task, onToggle, onEdit }: TaskItemProps) {
  const priority = PRIORITY_STYLES[task.priority];
  const isDone = task.status === "done";
  const colors = EVENT_COLORS[task.color] ?? EVENT_COLORS.blue;
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !isDone;

  return (
    <div className={cn(
      "flex items-center gap-3 p-4 rounded-2xl border transition-all hover:shadow-sm group",
      isDone
        ? "bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 opacity-60"
        : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700"
    )}>
      {/* Color dot */}
      <div className={cn("w-1.5 h-12 rounded-full flex-shrink-0", colors.dot)} />

      {/* Checkbox */}
      <button
        onClick={() => onToggle(task)}
        className="flex-shrink-0 transition hover:scale-110"
      >
        {isDone
          ? <CheckCircle2 className="w-6 h-6 text-green-500" />
          : <Circle className="w-6 h-6 text-gray-300 dark:text-gray-600 hover:text-blue-500" />
        }
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={cn(
          "font-medium text-gray-900 dark:text-white",
          isDone && "line-through text-gray-500 dark:text-gray-400"
        )}>
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          {task.category !== "general" && (
            <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full capitalize">
              {task.category}
            </span>
          )}
          <span className={cn("text-xs flex items-center gap-1", priority.text)}>
            {task.priority !== "low" && <priority.icon className="w-3 h-3" />}
            {priority.label}
          </span>
          {task.dueDate && (
            <span className={cn(
              "text-xs",
              isOverdue ? "text-red-500 font-medium" : "text-gray-500 dark:text-gray-400"
            )}>
              {isOverdue ? "⚠️ " : ""}
              Vence {format(new Date(task.dueDate), "d MMM", { locale: es })}
            </span>
          )}
        </div>
        {task.description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">{task.description}</p>
        )}
      </div>

      {/* Edit */}
      <button
        onClick={onEdit}
        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 transition"
      >
        <Edit2 className="w-4 h-4" />
      </button>
    </div>
  );
}

