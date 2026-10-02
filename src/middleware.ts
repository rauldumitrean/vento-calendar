// middleware.ts — uses auth.config.ts (Edge-compatible, no Node.js APIs)
import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: ["/((?!api/auth|api/ai/parse|login|_next/static|_next/image|favicon.ico|manifest.json).*)"],
};
