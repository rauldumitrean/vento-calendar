"use client";

import { useState, useRef, useEffect } from "react";
import { UploadCloud, FileType, CheckCircle, Loader2, Plus, Sparkles, BookOpen, Trash2, X, Clock, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manual state
  const [manualForm, setManualForm] = useState({
    title: "",
    dayOfWeek: "1",
    startTime: "09:00",
    endTime: "10:30",
    location: "",
    color: "blue"
  });
  const [isSavingManual, setIsSavingManual] = useState(false);

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
    if (selected && selected.type === "application/pdf") {
      setFile(selected);
      setSuccessCount(null);
    } else if (selected) {
      toast.error("Por favor, sube solo archivos PDF.");
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsProcessing(true);
    setSuccessCount(null);
    
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/schedule/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      
      if (res.ok) {
        setSuccessCount(data.count);
        toast.success(`¡Se han importado ${data.count} clases!`);
        setFile(null);
        fetchSchedules();
        setTimeout(() => {
          setIsUploadModalOpen(false);
          setSuccessCount(null);
        }, 3000);
      } else {
        toast.error(data.error || "Error al procesar el horario.");
      }
    } catch (error) {
      toast.error("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setIsProcessing(false);
    }
  };

  // --- MANUAL LOGIC ---
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.title.trim()) return toast.error("Falta el nombre");

    setIsSavingManual(true);
    try {
      const res = await fetch("/api/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: manualForm.title,
          dayOfWeek: manualForm.dayOfWeek,
          startTime: manualForm.startTime,
          endTime: manualForm.endTime,
          location: manualForm.location || null,
          color: manualForm.color,
        }),
      });

      if (res.ok) {
        toast.success("¡Asignatura guardada!");
        setManualForm(prev => ({ ...prev, title: "", location: "" }));
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
            Añade tus clases o sube un PDF para que la IA lo organice por ti.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsManualModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-xl transition shadow-sm font-medium"
          >
            <Plus className="w-5 h-5" />
            Añadir Clase
          </button>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl transition shadow-lg shadow-blue-500/25 font-medium"
          >
            <Sparkles className="w-5 h-5" />
            Importar PDF
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
                    .map(s => (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={s.id}
                        className="group relative bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow border-l-4 overflow-hidden"
                        style={{ borderLeftColor: `var(--color-${s.color}-500)` }}
                      >
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleDelete(s.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-1 pr-6 leading-tight">{s.title}</h4>
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
                    ))
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
              className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl p-8"
            >
              <button onClick={() => setIsUploadModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 dark:hover:text-white">
                <X className="w-6 h-6" />
              </button>
              
              <h2 className="text-2xl font-bold mb-2">Importar con IA</h2>
              <p className="text-gray-500 mb-8">Sube el PDF de tu colegio o universidad y extraeremos las clases automáticamente.</p>
              
              {successCount !== null ? (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-3xl p-8 text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">¡Todo listo!</h3>
                  <p className="text-green-700 dark:text-green-400">Se han añadido {successCount} clases a tu horario.</p>
                </div>
              ) : (
                <div className={`relative overflow-hidden border-2 border-dashed rounded-3xl p-10 text-center transition-all duration-300 ${isDragging ? "border-blue-500 bg-blue-500/10" : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"}`}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files?.[0]; if (f) { setFile(f); setSuccessCount(null); } }}
                >
                  <input type="file" ref={fileInputRef} className="hidden" accept="application/pdf" onChange={handleFileChange} />
                  
                  <div className="mx-auto w-20 h-20 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6">
                    {file ? <FileType className="w-10 h-10" /> : <UploadCloud className="w-10 h-10" />}
                  </div>

                  {file ? (
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white truncate px-2">{file.name}</h4>
                        <p className="text-sm text-gray-500">{(file.size/1024/1024).toFixed(2)} MB</p>
                      </div>
                      <div className="flex gap-3 justify-center">
                        <button onClick={() => setFile(null)} disabled={isProcessing} className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl font-medium">Cancelar</button>
                        <button onClick={handleUpload} disabled={isProcessing} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium flex items-center gap-2">
                          {isProcessing ? <><Loader2 className="w-4 h-4 animate-spin"/> Procesando...</> : <><Sparkles className="w-4 h-4"/> Extraer</>}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="font-medium text-gray-700 dark:text-gray-300">Arrastra tu PDF aquí</p>
                      <button onClick={() => fileInputRef.current?.click()} className="px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium">Examinar archivos</button>
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
              
              <h2 className="text-2xl font-bold mb-6">Añadir Asignatura</h2>
              
              <form onSubmit={handleManualSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-1">Nombre</label>
                  <input type="text" required value={manualForm.title} onChange={e => setManualForm(p => ({...p, title: e.target.value}))} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl" placeholder="Ej: Álgebra" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Día</label>
                    <select value={manualForm.dayOfWeek} onChange={e => setManualForm(p => ({...p, dayOfWeek: e.target.value}))} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl outline-none">
                      {days.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Horario</label>
                    <div className="flex items-center gap-2">
                      <input type="time" required value={manualForm.startTime} onChange={e => setManualForm(p => ({...p, startTime: e.target.value}))} className="w-full px-2 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl outline-none" />
                      <span>-</span>
                      <input type="time" required value={manualForm.endTime} onChange={e => setManualForm(p => ({...p, endTime: e.target.value}))} className="w-full px-2 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl outline-none" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Aula / Ubicación</label>
                  <input type="text" value={manualForm.location} onChange={e => setManualForm(p => ({...p, location: e.target.value}))} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl" placeholder="Ej: Laboratorio 3" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Color</label>
                  <div className="flex gap-2">
                    {["blue", "cyan", "green", "yellow", "orange", "red", "pink", "purple"].map(c => (
                      <button key={c} type="button" onClick={() => setManualForm(p => ({...p, color: c}))} className={`w-8 h-8 rounded-full transition-transform ${manualForm.color === c ? "scale-125 ring-2 ring-offset-2 ring-gray-900 dark:ring-white" : "hover:scale-110"}`} style={{ backgroundColor: `var(--color-${c}-500)` }} />
                    ))}
                  </div>
                </div>

                <button type="submit" disabled={isSavingManual} className="w-full py-3 mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex justify-center items-center gap-2">
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
