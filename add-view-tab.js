const fs = require('fs');
let content = fs.readFileSync('src/app/(dashboard)/schedule/page.tsx', 'utf8');

const importsToAdd = `import { useEffect } from "react";
import { Trash2 } from "lucide-react";`;
content = content.replace('import { UploadCloud,', importsToAdd + '\nimport { UploadCloud,');

const stateToAdd = `  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
`;
content = content.replace('const [isSavingManual, setIsSavingManual] = useState(false);', 'const [isSavingManual, setIsSavingManual] = useState(false);\n' + stateToAdd);

const tabsToAdd = `<button
            onClick={() => setActiveTab("view")}
            className={\`relative z-10 flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl transition-colors \${
              activeTab === "view" 
                ? "text-blue-700 dark:text-blue-300" 
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            }\`}
          >
            <CalendarIcon className="w-4 h-4" />
            Mi Horario
            {activeTab === "view" && (
              <motion.div layoutId="tab-bubble" className="absolute inset-0 bg-blue-100 dark:bg-blue-900/40 rounded-xl -z-10" />
            )}
          </button>`;
content = content.replace(/<\/button>\s*<\/div>/, '</button>\n' + tabsToAdd + '\n        </div>');

// Ensure fetchSchedules is called after upload and manual save
content = content.replace('toast.success(`¡Se han importado ${data.count} clases al calendario!`);', 'toast.success(`¡Se han importado ${data.count} clases al horario!`);\n        fetchSchedules();\n        setActiveTab("view");');
content = content.replace('toast.success("¡Asignatura guardada en tu horario!");', 'toast.success("¡Asignatura guardada en tu horario!");\n        fetchSchedules();\n        setActiveTab("view");');

// Add "view" to activeTab types
content = content.replace('useState<"import" | "manual">("import")', 'useState<"import" | "manual" | "view">("view")');

const viewTabHtml = `          ) : activeTab === "view" ? (
            <motion.div
              key="view-tab"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full bg-white/60 dark:bg-gray-900/60 backdrop-blur-2xl rounded-[2rem] shadow-2xl border border-white/40 dark:border-gray-700/50 p-6 md:p-8"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-100/50 dark:bg-gray-800/50 dark:text-gray-300 rounded-xl">
                    <tr>
                      <th className="px-6 py-4 rounded-l-xl">Asignatura</th>
                      <th className="px-6 py-4">Día</th>
                      <th className="px-6 py-4">Horario</th>
                      <th className="px-6 py-4">Aula</th>
                      <th className="px-6 py-4 rounded-r-xl"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={5} className="text-center py-8 text-gray-500">Cargando horario...</td></tr>
                    ) : schedules.length === 0 ? (
                      <tr><td colSpan={5} className="text-center py-8 text-gray-500">No tienes asignaturas. ¡Añade una o importa un PDF!</td></tr>
                    ) : (
                      schedules.sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime)).map((s) => (
                        <tr key={s.id} className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                          <td className="px-6 py-4 font-medium flex items-center gap-3">
                            <span className={\`w-3 h-3 rounded-full bg-\${s.color}-500\`} />
                            {s.title}
                          </td>
                          <td className="px-6 py-4">
                            {["", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"][s.dayOfWeek]}
                          </td>
                          <td className="px-6 py-4">{s.startTime} - {s.endTime}</td>
                          <td className="px-6 py-4">{s.location || "-"}</td>
                          <td className="px-6 py-4 text-right">
                            <button onClick={() => handleDelete(s.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          ) : (
            <motion.form`;

content = content.replace(/\) : \(\s*<motion\.form/, viewTabHtml);

fs.writeFileSync('src/app/(dashboard)/schedule/page.tsx', content);
