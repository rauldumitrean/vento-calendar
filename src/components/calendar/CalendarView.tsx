"use client";

import { useState, useEffect, useCallback } from "react";
import { addMonths, subMonths, addWeeks, subWeeks, addDays, subDays, format } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Plus, Sparkles } from "lucide-react";
import { MonthView } from "./MonthView";
import { WeekView } from "./WeekView";
import { DayView } from "./DayView";
import { EventModal } from "./EventModal";
import type { CalendarEvent, CalendarView } from "@/types";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

export function CalendarView() {
  const [view, setView] = useState<CalendarView>("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [prefillData, setPrefillData] = useState<Partial<CalendarEvent> | null>(null);
  const [nlInput, setNlInput] = useState("");
  const [parsingNL, setParsingNL] = useState(false);

  // Fetch events
  const fetchEvents = useCallback(async () => {
    try {
      const res = await fetch("/api/events");
      if (res.ok) {
        const data = await res.json();
        setEvents(data.map((e: CalendarEvent) => ({
          ...e,
          startDate: new Date(e.startDate),
          endDate: new Date(e.endDate),
        })));
      }
    } catch (error) {
      toast.error("Error cargando eventos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
    const handler = () => fetchEvents();
    window.addEventListener("ventoo-events-updated", handler);
    return () => window.removeEventListener("ventoo-events-updated", handler);
  }, [fetchEvents]);

  // SSE for real-time sync
  useEffect(() => {
    const evtSource = new EventSource("/api/sse");
    evtSource.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === "event_created" || data.type === "event_updated" || data.type === "event_deleted") {
        fetchEvents();
      }
    };
    return () => evtSource.close();
  }, [fetchEvents]);

  // Navigation
  const navigate = (direction: "prev" | "next") => {
    if (view === "month") setCurrentDate(d => direction === "next" ? addMonths(d, 1) : subMonths(d, 1));
    else if (view === "week") setCurrentDate(d => direction === "next" ? addWeeks(d, 1) : subWeeks(d, 1));
    else setCurrentDate(d => direction === "next" ? addDays(d, 1) : subDays(d, 1));
  };

  const headerTitle = () => {
    if (view === "month") return format(currentDate, "MMMM yyyy", { locale: es });
    if (view === "week") return format(currentDate, "MMMM yyyy", { locale: es });
    return format(currentDate, "EEEE, d MMMM yyyy", { locale: es });
  };

  // Natural language event creation
  const handleNLSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!nlInput.trim()) return;
      setParsingNL(true);
      try {
        const res = await fetch("/api/ai/parse", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: nlInput }),
        });
        const parsedData = await res.json();
        
        if (parsedData.error) {
          toast.error(parsedData.error);
        } else {
          const eventsToCreate = Array.isArray(parsedData) ? parsedData : [parsedData];
          if (eventsToCreate.length === 0) {
            toast.error("No se detectó ningún evento válido.");
            setParsingNL(false);
            return;
          }
          let successCount = 0;
          for (const evt of eventsToCreate) {
            const createRes = await fetch("/api/events", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(evt),
            });
            if (createRes.ok) successCount++;
          }
          if (successCount > 0) {
            toast.success(`Â¡${successCount} evento(s) guardado(s)!`);
            setNlInput("");
            fetchEvents();
          } else {
            toast.error("Error al guardar los eventos");
          }
        }
      } catch {
        toast.error("Error al interpretar el texto");
      } finally {
        setParsingNL(false);
      }
  };

  const handleEventSave = async (eventData: Partial<CalendarEvent>) => {
    try {
      const method = selectedEvent ? "PUT" : "POST";
      const realId = selectedEvent ? selectedEvent.id.split('_')[0] : "";
      const url = selectedEvent ? `/api/events/${realId}` : "/api/events";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Error");
      }
      toast.success(selectedEvent ? "Evento actualizado" : "Evento creado");
      setShowModal(false);
      fetchEvents();
    } catch (err: any) {
      toast.error(err.message || "Error guardando el evento");
    }
  };

  const handleEventDelete = async (id: string) => {
    try {
      const realId = id.split('_')[0];
      const res = await fetch(`/api/events/${realId}`, { method: "DELETE" });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Error");
      }
      toast.success("Evento eliminado");
      setShowModal(false);
      fetchEvents();
    } catch (err: any) {
      toast.error(err.message || "Error eliminando el evento");
    }
  };

  const views: { key: CalendarView; label: string }[] = [
    { key: "month", label: "Mes" },
    { key: "week", label: "Semana" },
    { key: "day", label: "DÃ­a" },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex-shrink-0 bg-transparent border-b border-gray-200/50 dark:border-gray-800/50 backdrop-blur-md px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Left: nav */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition"
            >
              Hoy
            </button>
            <div className="flex items-center gap-1">
              <button onClick={() => navigate("prev")} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-600 dark:text-gray-400">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={() => navigate("next")} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-600 dark:text-gray-400">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
              {headerTitle()}
            </h2>
          </div>

          {/* Right: view switcher + new event */}
          <div className="flex items-center gap-3">
            {/* NL Input */}
            <form onSubmit={handleNLSubmit} className="hidden lg:flex items-center gap-2">
              <div className="relative">
                <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
                <input
                  value={nlInput}
                  onChange={e => setNlInput(e.target.value)}
                  placeholder='ej: "Examen de mates el viernes a las 10"'
                  className="pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-72 transition"
                />
              </div>
              <button
                type="submit"
                disabled={parsingNL || !nlInput.trim()}
                className="px-3 py-2 text-sm rounded-xl bg-blue-100/80 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 disabled:opacity-50 transition font-medium"
              >
                {parsingNL ? "..." : "Crear"}
              </button>
            </form>

            {/* View switcher */}
            <div className="flex rounded-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
              {views.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setView(key)}
                  className={cn(
                    "px-3 py-1.5 text-sm font-medium transition",
                    view === key
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* New event */}
            <button
              onClick={() => { setSelectedEvent(null); setSelectedDate(null); setPrefillData(null); setShowModal(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Nuevo evento
            </button>
          </div>
        </div>
      </div>

      {/* Calendar body */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="h-full p-4 flex flex-col gap-4 animate-pulse">
            <div className="grid grid-cols-7 gap-4 flex-1">
              {[...Array(35)].map((_, i) => (
                <div key={i} className="bg-gray-200/50 dark:bg-gray-800/30 rounded-2xl border border-gray-100 dark:border-gray-800 backdrop-blur-sm shadow-sm" />
              ))}
            </div>
          </div>
        ) : (
          <>
            {view === "month" && (
              <MonthView
                currentDate={currentDate}
                events={events}
                onDayClick={(date) => { setSelectedDate(date); setSelectedEvent(null); setShowModal(true); }}
                onEventClick={(event) => { setSelectedEvent(event); setShowModal(true); }}
              />
            )}
            {view === "week" && (
              <WeekView
                currentDate={currentDate}
                events={events}
                onSlotClick={(date) => { setSelectedDate(date); setSelectedEvent(null); setShowModal(true); }}
                onEventClick={(event) => { setSelectedEvent(event); setShowModal(true); }}
              />
            )}
            {view === "day" && (
              <DayView
                currentDate={currentDate}
                events={events}
                onSlotClick={(date) => { setSelectedDate(date); setSelectedEvent(null); setShowModal(true); }}
                onEventClick={(event) => { setSelectedEvent(event); setShowModal(true); }}
              />
            )}
          </>
        )}
      </div>

      {/* Event Modal */}
      {showModal && (
        <EventModal
          event={selectedEvent}
          initialDate={selectedDate}
          prefillData={prefillData}
          onSave={handleEventSave}
          onDelete={handleEventDelete}
          onClose={() => { setShowModal(false); setPrefillData(null); }}
        />
      )}
    </div>
  );
}


