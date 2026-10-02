// middleware.ts — uses auth.config.ts (Edge-compatible, no Node.js APIs)
import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/((?!api/auth|api/ai/parse|login|_next/static|_next/image|favicon.ico|manifest.json).*)"],
};
