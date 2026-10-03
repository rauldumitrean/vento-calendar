"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Eye, EyeOff, Sparkles, ShieldCheck, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

export default function AuthPage() {
  const router = useRouter();
  
  // State
  const [isLogin, setIsLogin] = useState(true);
  
  // Login Form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  // Register Form
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [showRegPass, setShowRegPass] = useState(false);
  const [regLoading, setRegLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      const result = await signIn("credentials", {
        email: loginEmail,
        password: loginPassword,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Correo o contraseña incorrectos");
      } else {
        toast.success("¡Bienvenido de vuelta!");
        router.push("/calendar");
        router.refresh();
      }
    } catch {
      toast.error("Error al iniciar sesión");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: regName, email: regEmail, password: regPassword }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        toast.error(data.error || "Error al crear la cuenta");
        return;
      }
      
      // Auto-login after successful register
      const loginRes = await signIn("credentials", {
        email: regEmail,
        password: regPassword,
        redirect: false,
      });

      if (loginRes?.error) {
        toast.success("Cuenta creada. Por favor inicia sesión.");
        setIsLogin(true);
      } else {
        toast.success("¡Bienvenido a Ventoo Calendar!");
        router.push("/calendar");
        router.refresh();
      }
    } catch {
      toast.error("Error de conexión");
    } finally {
      setRegLoading(false);
    }
  };

  const handleGoogle = () => {
    signIn("google", { callbackUrl: "/calendar" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4 font-sans text-gray-900 overflow-hidden">
      <div className="relative w-full max-w-[960px] min-h-[640px] bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* =========================================================================
            REGISTER FORM (Left side on Desktop)
            ========================================================================= */}
        <div className={cn("w-full md:w-1/2 p-8 md:p-14 flex-col justify-center bg-white", isLogin ? "hidden md:flex" : "flex")}>
          <div className="mb-8">
            <h3 className="text-[10px] font-bold tracking-[0.2em] text-[#6919FF] mb-2 uppercase">Empieza en minutos</h3>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Crea tu cuenta</h2>
            <p className="text-gray-500 mt-1 text-sm">Únete a la IA de calendario</p>
          </div>
          
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Nombre</label>
              <input required type="text" value={regName} onChange={e=>setRegName(e.target.value)} placeholder="Tu nombre" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#6919FF] focus:ring-2 focus:ring-purple-200 outline-none transition-all text-sm" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Correo Electrónico</label>
              <input required type="email" value={regEmail} onChange={e=>setRegEmail(e.target.value)} placeholder="tu@email.com" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#6919FF] focus:ring-2 focus:ring-purple-200 outline-none transition-all text-sm" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Contraseña</label>
              <div className="relative">
                 <input required type={showRegPass ? "text" : "password"} value={regPassword} onChange={e=>setRegPassword(e.target.value)} placeholder="Mínimo 6 caracteres" minLength={6}
                   className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#6919FF] focus:ring-2 focus:ring-purple-200 outline-none transition-all text-sm" />
                 <button type="button" onClick={()=>setShowRegPass(!showRegPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                   {showRegPass ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                 </button>
              </div>
            </div>

            <button disabled={regLoading} type="submit" className="w-full py-3.5 mt-2 bg-[#6919FF] hover:bg-[#5811DE] text-white rounded-xl font-semibold flex justify-center items-center gap-2 transition-all shadow-md hover:shadow-lg hover:shadow-purple-500/25">
              {regLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Siguiente <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px bg-gray-200 flex-1" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">O registrarse con</span>
            <div className="h-px bg-gray-200 flex-1" />
          </div>

          <button onClick={handleGoogle} className="w-full py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold flex items-center justify-center gap-3 transition-colors shadow-sm">
            <GoogleIcon /> Continuar con Google
          </button>

          {/* Mobile only toggle */}
          <p className="mt-8 text-center text-sm text-gray-500 md:hidden">
            ¿Ya tienes cuenta? <button onClick={() => setIsLogin(true)} className="text-[#6919FF] font-bold hover:underline">Iniciar sesión aquí</button>
          </p>
        </div>

        {/* =========================================================================
            LOGIN FORM (Right side on Desktop)
            ========================================================================= */}
        <div className={cn("w-full md:w-1/2 p-8 md:p-14 flex-col justify-center bg-white", isLogin ? "flex" : "hidden md:flex")}>
          <div className="mb-8">
            <h3 className="text-[10px] font-bold tracking-[0.2em] text-[#6919FF] mb-2 uppercase">Tu workspace</h3>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Bienvenido de nuevo</h2>
            <p className="text-gray-500 mt-1 text-sm">Inicia sesión para continuar</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Correo Electrónico</label>
              <input required type="email" value={loginEmail} onChange={e=>setLoginEmail(e.target.value)} placeholder="tu@email.com" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#6919FF] focus:ring-2 focus:ring-purple-200 outline-none transition-all text-sm" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Contraseña</label>
              <div className="relative">
                 <input required type={showLoginPass ? "text" : "password"} value={loginPassword} onChange={e=>setLoginPassword(e.target.value)} placeholder="Introduce tu contraseña" 
                   className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#6919FF] focus:ring-2 focus:ring-purple-200 outline-none transition-all text-sm" />
                 <button type="button" onClick={()=>setShowLoginPass(!showLoginPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                   {showLoginPass ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                 </button>
              </div>
            </div>

            <button disabled={loginLoading} type="submit" className="w-full py-3.5 mt-2 bg-[#6919FF] hover:bg-[#5811DE] text-white rounded-xl font-semibold flex justify-center items-center gap-2 transition-all shadow-md hover:shadow-lg hover:shadow-purple-500/25">
              {loginLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Iniciar sesión <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px bg-gray-200 flex-1" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">O continuar con</span>
            <div className="h-px bg-gray-200 flex-1" />
          </div>

          <button onClick={handleGoogle} className="w-full py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold flex items-center justify-center gap-3 transition-colors shadow-sm">
            <GoogleIcon /> Continuar con Google
          </button>

          {/* Mobile only toggle */}
          <p className="mt-8 text-center text-sm text-gray-500 md:hidden">
            ¿No tienes cuenta? <button onClick={() => setIsLogin(false)} className="text-[#6919FF] font-bold hover:underline">Crear cuenta gratis</button>
          </p>
        </div>

        {/* =========================================================================
            ANIMATED PURPLE OVERLAY (Desktop Only)
            ========================================================================= */}
        <motion.div
          initial={false}
          animate={{ x: isLogin ? "0%" : "100%" }}
          transition={{ type: "spring", stiffness: 350, damping: 35, bounce: 0 }}
          className="hidden md:flex absolute top-0 left-0 w-1/2 h-full bg-[#6919FF] z-20 flex-col p-12 text-white overflow-hidden shadow-2xl"
        >
          {/* Decorative background gradients */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-black/10 blur-[80px] rounded-full -translate-x-1/3 translate-y-1/3 pointer-events-none" />
          
          {/* Header */}
          <div className="relative flex items-center gap-3 mb-12">
            <svg viewBox="0 0 512 512" className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="40" strokeLinejoin="round" strokeLinecap="round">
               <path d="M 366 396 H 196 A 140 140 0 1 1 331.98 222.68 A 90 90 0 1 1 366 396 Z" />
            </svg>
            <span className="font-bold tracking-[0.2em] text-sm mt-1">VENTOO</span>
          </div>

          {/* Center visual */}
          <div className="relative flex-1 flex flex-col justify-center items-center">
            <div className="w-56 h-36 rounded-3xl border border-white/20 bg-white/5 backdrop-blur-md flex items-center justify-center relative mb-12 shadow-xl">
               <Sparkles className="w-14 h-14 text-white opacity-90" strokeWidth={1.5} />
               <div className="absolute -bottom-4 right-6 bg-white/20 backdrop-blur-xl px-4 py-1.5 rounded-full border border-white/30 flex items-center gap-2 text-xs font-semibold shadow-lg">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  IA de Calendario
               </div>
            </div>
            
            <div className="w-full relative h-[180px]">
              <AnimatePresence mode="wait">
                {isLogin ? (
                  <motion.div
                    key="login-view"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 flex flex-col"
                  >
                    <h3 className="text-[10px] font-bold tracking-[0.2em] text-white/70 mb-3 uppercase">Bienvenido de vuelta</h3>
                    <h2 className="text-[2.2rem] font-bold mb-4 leading-tight tracking-tight">¿Listo para<br/>organizar tu día?</h2>
                    <p className="text-white/80 text-[13px] leading-relaxed max-w-sm mb-6">
                      Tu asistente de calendario con IA te está esperando. Accede y descubre cómo optimizar tu tiempo.
                    </p>
                    <button 
                      onClick={() => setIsLogin(false)}
                      className="self-start px-6 py-2.5 rounded-full border border-white/30 hover:bg-white/10 transition-colors text-sm font-semibold flex items-center gap-2"
                    >
                      Crear una cuenta <ArrowRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="register-view"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 flex flex-col"
                  >
                    <h3 className="text-[10px] font-bold tracking-[0.2em] text-white/70 mb-3 uppercase">¿Ya tienes cuenta?</h3>
                    <h2 className="text-[2.2rem] font-bold mb-4 leading-tight tracking-tight">Tu calendario inteligente<br/>te espera.</h2>
                    <p className="text-white/80 text-[13px] leading-relaxed max-w-sm mb-6">
                      Inicia sesión y recupera todos tus eventos, horarios y tareas sincronizadas al instante.
                    </p>
                    <button 
                      onClick={() => setIsLogin(true)}
                      className="self-start px-6 py-2.5 rounded-full border border-white/30 hover:bg-white/10 transition-colors text-sm font-semibold flex items-center gap-2"
                    >
                      Iniciar sesión <ArrowRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Footer */}
          <div className="relative text-[11px] text-white/50 font-medium tracking-wide">
            Acceso seguro · Siempre sincronizado
          </div>
        </motion.div>

      </div>
    </div>
  );
}
