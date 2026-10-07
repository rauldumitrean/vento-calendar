"use client";

import { useState, useRef, useEffect } from "react";
import { UploadCloud, FileType, CheckCircle, Loader2, Plus, Sparkles, BookOpen, Trash2, Pencil, X, Clock, MapPin, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const daysMap: Record<number, string> = {
  1: "Lunes", 2: "Martes", 3: "Miércoles", 4: "Jueves", 5: "Viernes", 6: "Sábado", 0: "Domingo"
};

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  // Import state
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successCount, setSuccessCount] = useState<number | null>(null);
  const [previewEvents, setPreviewEvents] = useState<any[] | null>(null);
  const [isSavingPreview, setIsSavingPreview] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manual state
  const [manualForm, setManualForm] = useState({
    id: "",
    title: "",
    dayOfWeek: "1",
    startTime: "09:00",
    endTime: "10:30",
    location: "",
    color: "blue"
  });
  const [isSavingManual, setIsSavingManual] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // current time logic
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);
  const currentDay = now.getDay();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  const fetchSchedules = async () => {
    try {
      const res = await fetch("/api/schedules");
      if (res.ok) {
        setSchedules(await res.json());
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta asignatura?")) return;
    await fetch("/api/schedules?id=" + id, { method: "DELETE" });
    fetchSchedules();
  };

  // --- UPLOAD LOGIC ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && (selected.type === "application/pdf" || selected.type.startsWith("image/"))) {
      setFile(selected);
      setSuccessCount(null);
      setPreviewEvents(null);
    } else if (selected) {
      toast.error("Por favor, sube solo archivos PDF o imágenes (JPG/PNG).");
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsProcessing(true);
    setSuccessCount(null);
    setPreviewEvents(null);
    
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/schedule/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      
      if (res.ok) {
        setPreviewEvents(data.events);
        toast.success("¡Horario analizado! Revisa las clases.");
      } else {
        toast.error(data.error || "Error al procesar el horario.");
      }
    } catch (error) {
      toast.error("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmPreview = async () => {
    if (!previewEvents) return;
    setIsSavingPreview(true);
    
    try {
      const res = await fetch("/api/schedules/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ events: previewEvents })
      });
      
      const data = await res.json();
      if (res.ok) {
        setSuccessCount(data.count);
        toast.success(`¡Se han importado ${data.count} clases!`);
        setFile(null);
        setPreviewEvents(null);
        fetchSchedules();
        setTimeout(() => {
          setIsUploadModalOpen(false);
          setSuccessCount(null);
        }, 3000);
      } else {
        toast.error(data.error || "Error al guardar el horario.");
      }
    } catch (error) {
      toast.error("Error de conexión al guardar.");
    } finally {
      setIsSavingPreview(false);
    }
  };

  // --- MANUAL LOGIC ---
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.title.trim()) return toast.error("Falta el nombre");

    setIsSavingManual(true);
    try {
      const isEdit = isEditMode && manualForm.id;
      const res = await fetch("/api/schedules", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(isEdit && { id: manualForm.id }),
          title: manualForm.title,
          dayOfWeek: manualForm.dayOfWeek,
          startTime: manualForm.startTime,
          endTime: manualForm.endTime,
          location: manualForm.location || null,
          color: manualForm.color,
        }),
      });

      if (res.ok) {
        toast.success(isEdit ? "¡Asignatura actualizada!" : "¡Asignatura guardada!");
        setManualForm(prev => ({ ...prev, id: "", title: "", location: "" }));
        setIsEditMode(false);
        fetchSchedules();
        setIsManualModalOpen(false);
      } else {
        toast.error("Error al guardar la clase");
      }
    } catch (err) {
      toast.error("Error de red");
    } finally {
      setIsSavingManual(false);
    }
  };

  const handleEditClick = (schedule: any) => {
    setManualForm({
      id: schedule.id,
      title: schedule.title,
      dayOfWeek: schedule.dayOfWeek.toString(),
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      location: schedule.location || "",
      color: schedule.color
    });
    setIsEditMode(true);
    setIsManualModalOpen(true);
  };

  const days = [
    { id: 1, name: "Lunes" },
    { id: 2, name: "Martes" },
    { id: 3, name: "Miércoles" },
    { id: 4, name: "Jueves" },
    { id: 5, name: "Viernes" }
  ];

  return (
    <div className="p-6 md:p-8 h-full flex flex-col relative z-10 overflow-hidden">
      {/* Background Blobs */}
      <div className="fixed inset-0 pointer-events-none -z-10 flex justify-center">
        <div className="absolute top-0 -left-20 w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full mix-blend-screen" />
        <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
            Tu Horario Semanal
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Añade tus clases o sube un archivo para que la IA lo organice por ti.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setManualForm({ id: "", title: "", dayOfWeek: "1", startTime: "09:00", endTime: "10:30", location: "", color: "blue" });
              setIsEditMode(false);
              setIsManualModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-xl transition shadow-sm font-medium"
          >
            <Plus className="w-5 h-5" />
            Añadir Clase
          </button>
          <button
            onClick={() => { setIsUploadModalOpen(true); setFile(null); setPreviewEvents(null); setSuccessCount(null); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl transition shadow-lg shadow-blue-500/25 font-medium"
          >
            <Sparkles className="w-5 h-5" />
            Importar con IA
          </button>
        </div>
      </header>

      {/* SCHEDULE GRID */}
      <div className="flex-1 overflow-x-auto pb-4">
        <div className="min-w-[900px] h-full grid grid-cols-5 gap-4">
          {days.map(day => (
            <div key={day.id} className="flex flex-col h-full">
              <div className="py-3 text-center rounded-t-2xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border border-white/20 dark:border-gray-700/30 mb-3 shadow-sm">
                <h3 className="font-bold text-gray-900 dark:text-white text-lg tracking-wide">{day.name}</h3>
              </div>
              
              <div className="flex-1 bg-white/20 dark:bg-gray-800/10 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 rounded-b-2xl p-3 flex flex-col gap-3">
                {loading ? (
                  <div className="flex flex-col gap-3">
                    {[1, 2].map(i => (
                      <div key={i} className="animate-pulse bg-gray-200/50 dark:bg-gray-700/30 h-24 rounded-xl border border-gray-100 dark:border-gray-800" />
                    ))}
                  </div>
                ) : (
                  schedules
                    .filter(s => s.dayOfWeek === day.id)
                    .sort((a, b) => a.startTime.localeCompare(b.startTime))
                    .map(s => {
                      const isActive = s.dayOfWeek === currentDay && s.startTime <= currentTime && s.endTime >= currentTime;
                      return (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          key={s.id}
                          className={`group relative bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm hover:shadow-md transition-all border-l-4 overflow-hidden ${isActive ? 'ring-2 ring-blue-500 ring-offset-1 dark:ring-offset-gray-900' : ''}`}
                          style={{ borderLeftColor: `var(--color-${s.color}-500)` }}
                        >
                          <div className="absolute top-2 right-2 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEditClick(s)} className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(s.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex items-center justify-between mb-1 pr-14">
                            <h4 className="font-bold text-gray-900 dark:text-white leading-tight">{s.title}</h4>
                          </div>
                          {isActive && (
                            <div className="mb-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 text-xs font-semibold">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                              En curso
                            </div>
                          )}
                          <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 mb-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{s.startTime} - {s.endTime}</span>
                          </div>
                          {s.location && (
                            <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                              <MapPin className="w-3.5 h-3.5" />
                              <span className="truncate">{s.location}</span>
                            </div>
                          )}
                        </motion.div>
                      );
                    })
                )}
                
                {!loading && schedules.filter(s => s.dayOfWeek === day.id).length === 0 && (
                  <div className="text-center py-8 text-sm text-gray-400 dark:text-gray-600 font-medium border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
                    Libre
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODALS */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setIsUploadModalOpen(false)} />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: -20 }}
              className={`relative w-full ${previewEvents ? 'max-w-2xl' : 'max-w-lg'} bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl p-8 transition-all duration-300 max-h-[90vh] flex flex-col`}
            >
              <button onClick={() => setIsUploadModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 dark:hover:text-white z-10">
                <X className="w-6 h-6" />
              </button>
              
              {!previewEvents && successCount === null && (
                <>
                  <h2 className="text-2xl font-bold mb-2">Importar con IA</h2>
                  <p className="text-gray-500 mb-8">Sube tu PDF o una imagen del horario y la IA extraerá las clases por ti.</p>
                </>
              )}
              
              {successCount !== null ? (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-3xl p-8 text-center my-auto">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">¡Todo listo!</h3>
                  <p className="text-green-700 dark:text-green-400">Se han importado {successCount} clases a tu horario.</p>
                </div>
              ) : previewEvents ? (
                <div className="flex flex-col h-full min-h-0">
                  <h2 className="text-xl font-bold mb-1">Vista Previa</h2>
                  <p className="text-sm text-gray-500 mb-4">Revisa las {previewEvents.length} clases identificadas antes de importarlas.</p>
                  
                  <div className="flex-1 overflow-y-auto min-h-[300px] bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 space-y-3">
                    {previewEvents.map((evt, idx) => (
                      <div key={idx} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-3 rounded-xl flex items-center justify-between shadow-sm border-l-4" style={{ borderLeftColor: `var(--color-${evt.color}-500)` }}>
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-white text-sm">{evt.title}</h4>
                          <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                            <span className="flex items-center gap-1 font-medium"><BookOpen className="w-3.5 h-3.5"/> {daysMap[evt.dayOfWeek] || "Otro"}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5"/> {evt.startTime} - {evt.endTime}</span>
                            {evt.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5"/> {evt.location}</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <button onClick={() => setPreviewEvents(null)} disabled={isSavingPreview} className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-xl font-medium transition">
                      Volver
                    </button>
                    <button onClick={handleConfirmPreview} disabled={isSavingPreview} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-2 transition shadow-md hover:shadow-lg">
                      {isSavingPreview ? <><Loader2 className="w-4 h-4 animate-spin"/> Guardando...</> : <><CheckCircle className="w-5 h-5"/> Confirmar e Importar</>}
                    </button>
                  </div>
                </div>
              ) : (
                <div className={`relative overflow-hidden border-2 border-dashed rounded-3xl p-10 text-center transition-all duration-300 ${isDragging ? "border-blue-500 bg-blue-500/10" : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"}`}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files?.[0]; if (f) { setFile(f); setSuccessCount(null); setPreviewEvents(null); } }}
                >
                  <input type="file" ref={fileInputRef} className="hidden" accept="application/pdf,image/png,image/jpeg,image/webp" onChange={handleFileChange} />
                  
                  <div className="mx-auto w-20 h-20 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6">
                    {file ? (file.type.startsWith("image/") ? <ImageIcon className="w-10 h-10" /> : <FileType className="w-10 h-10" />) : <UploadCloud className="w-10 h-10" />}
                  </div>

                  {file ? (
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white truncate px-2">{file.name}</h4>
                        <p className="text-sm text-gray-500">{(file.size/1024/1024).toFixed(2)} MB</p>
                      </div>
                      <div className="flex gap-3 justify-center">
                        <button onClick={() => setFile(null)} disabled={isProcessing} className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl font-medium transition">Cancelar</button>
                        <button onClick={handleUpload} disabled={isProcessing} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-2 transition shadow-md">
                          {isProcessing ? <><Loader2 className="w-4 h-4 animate-spin"/> Procesando...</> : <><Sparkles className="w-4 h-4"/> Analizar</>}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="font-medium text-gray-700 dark:text-gray-300">Arrastra tu PDF o Imagen aquí</p>
                      <button onClick={() => fileInputRef.current?.click()} className="px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium transition shadow-md">Examinar archivos</button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}

        {isManualModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setIsManualModalOpen(false)} />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: -20 }}
              className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl p-8"
            >
              <button onClick={() => setIsManualModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 dark:hover:text-white">
                <X className="w-6 h-6" />
              </button>
              
              <h2 className="text-2xl font-bold mb-6">{isEditMode ? "Editar Asignatura" : "Añadir Asignatura"}</h2>
              
              <form onSubmit={handleManualSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-1">Nombre</label>
                  <input type="text" required value={manualForm.title} onChange={e => setManualForm(p => ({...p, title: e.target.value}))} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="Ej: Álgebra" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Día</label>
                    <select value={manualForm.dayOfWeek} onChange={e => setManualForm(p => ({...p, dayOfWeek: e.target.value}))} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition">
                      {days.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Horario</label>
                    <div className="flex items-center gap-2">
                      <input type="time" required value={manualForm.startTime} onChange={e => setManualForm(p => ({...p, startTime: e.target.value}))} className="w-full px-2 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" />
                      <span>-</span>
                      <input type="time" required value={manualForm.endTime} onChange={e => setManualForm(p => ({...p, endTime: e.target.value}))} className="w-full px-2 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Aula / Ubicación</label>
                  <input type="text" value={manualForm.location} onChange={e => setManualForm(p => ({...p, location: e.target.value}))} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="Ej: Laboratorio 3" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Color</label>
                  <div className="flex gap-2">
                    {["blue", "cyan", "green", "yellow", "orange", "red", "pink", "purple"].map(c => (
                      <button key={c} type="button" onClick={() => setManualForm(p => ({...p, color: c}))} className={`w-8 h-8 rounded-full transition-transform ${manualForm.color === c ? "scale-125 ring-2 ring-offset-2 ring-gray-900 dark:ring-white" : "hover:scale-110"}`} style={{ backgroundColor: `var(--color-${c}-500)` }} />
                    ))}
                  </div>
                </div>

                <button type="submit" disabled={isSavingManual} className="w-full py-3 mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex justify-center items-center gap-2 transition shadow-md hover:shadow-lg">
                  {isSavingManual ? <Loader2 className="w-5 h-5 animate-spin" /> : "Guardar Asignatura"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
