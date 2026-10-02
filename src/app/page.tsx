/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/no-unescaped-entities */
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarDays, Sparkles, CheckSquare, Zap, ArrowRight, ShieldCheck, Mail, Smartphone } from "lucide-react";

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 100 } },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans overflow-hidden selection:bg-blue-500/30">
      
      {/* Background gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden flex justify-center">
        <div className="absolute -top-40 -z-10 w-[800px] h-[400px] bg-blue-500/20 dark:bg-blue-600/20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-lighten" />
        <div className="absolute top-40 -right-40 -z-10 w-[600px] h-[600px] bg-cyan-500/20 dark:bg-cyan-600/20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-lighten" />
      </div>

      {/* Navbar */}
      <header className="relative z-50 pt-6 px-6 lg:px-8 max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <CalendarDays className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
            Ventoo Calendar
          </span>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition">
            Iniciar Sesión
          </Link>
          <Link href="/calendar" className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium text-sm hover:scale-105 transition-transform shadow-xl shadow-gray-900/20 dark:shadow-white/10">
            Abrir App
            <ArrowRight className="w-4 h-4" />
          </Link>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="max-w-3xl flex flex-col items-center"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider mb-8">
              <Sparkles className="w-3.5 h-3.5" />
              Impulsado por Inteligencia Artificial
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
              Tu tiempo, <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-600">
                inteligentemente organizado.
              </span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl leading-relaxed">
              La forma más fluida y rápida de gestionar tus eventos y tareas. 
              Pídele a la IA que cree tu horario en lenguaje natural. Sincronizado en todos tus dispositivos.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
              <Link href="/calendar" className="px-8 py-4 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 hover:scale-105 transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 text-lg">
                Comenzar ahora
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Floating Hero UI Elements */}
          <div className="relative w-full max-w-5xl mt-24 h-[400px] sm:h-[500px]">
            {/* Main Mockup Window */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, type: "spring" as const, stiffness: 50 }}
              className="absolute inset-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/30 shadow-2xl shadow-blue-900/10 dark:shadow-black/40 overflow-hidden flex flex-col"
            >
              {/* Window Header */}
              <div className="h-12 border-b border-gray-200/50 dark:border-gray-800/50 flex items-center px-4 gap-2 bg-gray-50/50 dark:bg-gray-950/50">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              {/* Fake Calendar Grid */}
              <div className="flex-1 p-6 grid grid-cols-7 gap-4 opacity-50">
                {Array.from({ length: 35 }).map((_, i) => (
                  <div key={i} className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20" />
                ))}
              </div>
            </motion.div>

            {/* Floating Event Card */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute -top-12 -left-6 sm:left-10 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-xl shadow-black/5 border border-gray-100 dark:border-gray-700 w-64 z-10"
            >
              <div className="flex gap-3">
                <div className="w-1.5 rounded-full bg-blue-500" />
                <div>
                  <h4 className="font-semibold text-sm">Diseño de MVP</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">10:00 - 12:30</p>
                </div>
              </div>
            </motion.div>

            {/* Floating AI Chat Bubble */}
            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="absolute top-32 -right-6 sm:right-0 md:-right-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-5 rounded-3xl shadow-xl shadow-blue-500/10 border border-blue-100 dark:border-blue-900/30 w-72 z-10"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <p className="text-xs font-medium">IA de Ventoo</p>
              </div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-snug">
                "He añadido la reunión del viernes a las 16:00 y he pospuesto tus tareas de diseño."
              </p>
            </motion.div>
            
            {/* Floating Task Card */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 2 }}
              className="absolute bottom-10 left-10 md:-left-8 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 flex items-center gap-4 z-10"
            >
              <div className="w-6 h-6 rounded-md border-2 border-green-500 bg-green-500 flex items-center justify-center">
                <CheckSquare className="w-4 h-4 text-white" />
              </div>
              <p className="text-sm font-semibold">Subir proyecto a Vercel</p>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white dark:bg-gray-900/50 border-y border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-3xl font-bold mb-4">Todo lo que necesitas, en un solo lugar</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                No más aplicaciones separadas. Combina tu calendario y tus listas de tareas potenciados con Inteligencia Artificial.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Sparkles,
                  title: "Creación NLP",
                  desc: "Escribe 'Cena con Juan mañana a las 21h' y el asistente se encargará de crear el evento automáticamente.",
                  color: "text-blue-500",
                  bg: "bg-blue-100 dark:bg-blue-900/30",
                },
                {
                  icon: CheckSquare,
                  title: "Tareas Integradas",
                  desc: "Gestiona exámenes, entregas y tareas pendientes con prioridades. Visualízalas junto a tus eventos.",
                  color: "text-emerald-500",
                  bg: "bg-emerald-100 dark:bg-emerald-900/30",
                },
                {
                  icon: Smartphone,
                  title: "Sincronización Real",
                  desc: "Mueve un evento en tu ordenador y velo actualizarse al instante en tu móvil. (SSE In-Memory).",
                  color: "text-blue-500",
                  bg: "bg-blue-100 dark:bg-blue-900/30",
                },
                {
                  icon: Mail,
                  title: "Resumen Diario",
                  desc: "Recibe un correo automático a primera hora de la mañana con tu agenda del día para no perderte nada.",
                  color: "text-orange-500",
                  bg: "bg-orange-100 dark:bg-orange-900/30",
                },
                {
                  icon: ShieldCheck,
                  title: "Auditoría de Accesos",
                  desc: "Control total de tu cuenta. Recibe notificaciones y registra todos los inicios y cierres de sesión.",
                  color: "text-red-500",
                  bg: "bg-red-100 dark:bg-red-900/30",
                },
                {
                  icon: Zap,
                  title: "Flujo Apple-like",
                  desc: "Una interfaz limpia, rápida y amigable, con un diseño fluido inspirado en los estándares de Apple.",
                  color: "text-gray-700 dark:text-gray-300",
                  bg: "bg-gray-100 dark:bg-gray-800",
                },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-gray-50 dark:bg-gray-800/40 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${feature.bg}`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-600" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          
          <div className="relative max-w-4xl mx-auto px-6 text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Empieza a organizar tu vida hoy.</h2>
            <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
              Únete y descubre cómo la Inteligencia Artificial puede ahorrarte horas de gestión a la semana. Accede con tu cuenta de Ventoo.
            </p>
            <Link href="/calendar" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-blue-600 font-bold text-lg hover:bg-gray-50 hover:scale-105 transition-all shadow-xl shadow-black/10">
              Abrir Calendario
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-white dark:bg-gray-950 py-12 text-center border-t border-gray-200 dark:border-gray-900">
        <div className="flex items-center justify-center gap-2 mb-4 text-gray-900 dark:text-white font-bold text-lg">
          <CalendarDays className="w-5 h-5 text-blue-500" />
          Ventoo Calendar
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          © 2026 Ventoo. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
}

