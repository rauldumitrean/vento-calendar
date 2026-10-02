# 📅 Ventoo Calendar

Tu calendario inteligente con IA, estilo Apple Calendar.

## Stack

- **Framework**: Next.js 15 (App Router)
- **UI**: Tailwind CSS v4
- **Auth**: NextAuth.js v5 — conectado a BD Ventoo
- **BD**: Neon PostgreSQL + Drizzle ORM
- **IA**: Google Gemini 2.0 Flash
- **Email**: Nodemailer + Gmail SMTP
- **Cron**: Vercel Cron Jobs
- **Sync**: Server-Sent Events (SSE)

## Funcionalidades

- 🗓️ Calendario con vistas Mes / Semana / Día
- ✅ Módulo de Tareas (exámenes, proyectos, etc.)
- 🤖 IA con Gemini: lenguaje natural, chat, sugerencias
- 📧 Email diario con resumen del día (cron 8:00 AM)
- 🔔 Auditoría por email: login / logout / actividad
- 🔄 Sincronización en tiempo real (SSE)
- 🔁 Eventos recurrentes (diario, semanal, mensual, anual)
- 👥 Invitar usuarios de Ventoo a eventos
- 🌙 Dark mode
- 📱 PWA instalable

## Configuración

### 1. Variables de entorno

Copia `.env.example` a `.env.local` y rellena todos los valores:

```bash
cp .env.example .env.local
```

#### Variables requeridas

| Variable | Descripción | Dónde obtenerla |
|---|---|---|
| `DATABASE_URL` | Connection string Neon | [console.neon.tech](https://console.neon.tech) |
| `NEXTAUTH_SECRET` | Secret JWT (32 chars) | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | URL de la app | `https://ventoo-calendar.vercel.app` |
| `GOOGLE_AI_API_KEY` | API Key Gemini | [aistudio.google.com](https://aistudio.google.com) |
| `GMAIL_USER` | Tu email de Gmail | Tu cuenta Google |
| `GMAIL_APP_PASSWORD` | Contraseña de app Gmail | [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords) |
| `AUDIT_EMAIL` | Email para auditoría | Tu email admin |
| `CRON_SECRET` | Secret para cron | `openssl rand -hex 32` |

### 2. Base de datos

La app usa las tablas de usuarios existentes de Ventoo. Solo necesitas crear las tablas nuevas:

```bash
npm run db:push
```

### 3. Desarrollo local

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## Deploy en Vercel

1. Sube el código a GitHub
2. Importa el repo en [vercel.com](https://vercel.com)
3. Añade todas las variables de entorno en Vercel Dashboard
4. Deploy automático ✅

El cron job de email diario (`/api/cron/daily-digest`) se ejecuta automáticamente a las 8:00 AM UTC gracias a `vercel.json`.

## Estructura del proyecto

```
src/
├── app/
│   ├── (auth)/login/          # Página de login
│   ├── (dashboard)/
│   │   ├── calendar/          # Vista calendario
│   │   └── tasks/             # Vista tareas
│   └── api/
│       ├── auth/              # NextAuth
│       ├── events/            # CRUD eventos
│       ├── tasks/             # CRUD tareas
│       ├── ai/chat|parse/     # Gemini IA
│       ├── cron/daily-digest/ # Email diario
│       └── sse/               # Real-time sync
├── components/
│   ├── calendar/              # MonthView, WeekView, DayView, EventModal
│   ├── tasks/                 # TasksView, TaskItem, TaskModal
│   ├── ai/                    # AIChat
│   └── layout/                # Sidebar, TopBar
└── lib/
    ├── auth.ts                # NextAuth config
    ├── db/                    # Drizzle + schema
    ├── email.ts               # Nodemailer + templates
    ├── gemini.ts              # Google AI SDK
    └── audit.ts               # Auditoría
```
