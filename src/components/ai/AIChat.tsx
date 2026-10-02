"use client";

import { useState, useRef, useEffect } from "react";
import { X, Sparkles, Send, Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIChatProps {
  onClose: () => void;
}

export function AIChat({ onClose }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "¡Hola! Soy tu asistente IA de Ventoo Calendar 🗓️\n\nPuedo ayudarte con:\n- Crear eventos con lenguaje natural\n- Sugerencias para organizar tu semana\n- Recordar tus tareas pendientes\n- Consejos de productividad\n\n¿En qué te puedo ayudar hoy?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });
            const data = await res.json();
      
      let finalContent = data.error ? `Error: ${data.error}` : (data.response ?? "Lo siento, hubo un error.");

      // Check if response contains a create_event JSON block
      const match = finalContent.match(/```json([\s\S]*?)```/);
      if (match) {
        try {
          const events = JSON.parse(match[1]);
          if (Array.isArray(events)) {
            let createdCount = 0;
            for (const evt of events) {
              if (evt.action === "create_event") {
                const res = await fetch("/api/events", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(evt),
                });
                if (res.ok) createdCount++;
              }
            }
            if (createdCount > 0) {
              window.dispatchEvent(new CustomEvent("ventoo-events-updated"));
              // Strip JSON block from content and add success message
              finalContent = finalContent = finalContent.replace(match[0], `\n\n✅ **¡He creado ${createdCount} evento(s) en tu calendario!**`);
            }
          }
        } catch(e) {
          console.error("Error parsing AI JSON action:", e);
        }
      }

      setMessages(prev => [...prev, {
        role: "assistant",
        content: finalContent,
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "⚠️ Error al conectar con el asistente. Inténtalo de nuevo.",
      }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-4 md:p-6 pointer-events-none">
      <div className="pointer-events-auto w-full max-w-sm bg-white/80 dark:bg-gray-900/80 backdrop-blur-3xl border border-white/50 dark:border-gray-700/50 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col max-h-[70vh]">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Asistente IA</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Gemini · Ventoo Calendar</p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-white ${msg.role === "user" ? "bg-blue-600" : "bg-gradient-to-br from-purple-500 to-blue-600"}`}>
                {msg.role === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>
              <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-tr-sm"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-tl-sm"
              }`}>
                {msg.role === "assistant" ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none text-inherit">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                <Bot className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-sm px-3 py-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="flex-shrink-0 p-3 border-t border-gray-100 dark:border-gray-800 flex gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Escribe un mensaje..."
            disabled={loading}
            className="flex-1 text-sm px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 transition"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

