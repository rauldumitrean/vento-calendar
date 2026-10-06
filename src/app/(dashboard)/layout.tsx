import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="flex h-[100dvh] bg-gray-100 dark:bg-gray-900 overflow-hidden p-0 sm:p-4 md:p-6 lg:p-8">
      {/* Subtle macOS-style abstract background blob (blue/teal) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden flex justify-center z-0">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-blue-400/20 dark:bg-blue-600/10 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-lighten will-change-transform transform-gpu" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-cyan-400/20 dark:bg-cyan-600/10 blur-[150px] rounded-full mix-blend-multiply dark:mix-blend-lighten will-change-transform transform-gpu" />
      </div>

      {/* Floating App Window */}
      <div className="flex w-full h-full bg-white/70 dark:bg-gray-800/80 backdrop-blur-xl md:backdrop-blur-3xl border border-white/50 dark:border-gray-700/50 sm:rounded-[2rem] shadow-2xl overflow-hidden relative z-10" style={{ contentVisibility: 'auto' }}>
        <Sidebar user={session.user} />
        <div className="flex-1 flex flex-col min-w-0 bg-white/40 dark:bg-black/40 sm:rounded-l-3xl border-l border-white/30 dark:border-gray-800/50 shadow-inner">
          <TopBar user={session.user} />
          <main className="flex-1 overflow-auto pb-20 md:pb-0" style={{ contentVisibility: 'auto' }}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

