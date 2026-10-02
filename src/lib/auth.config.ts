// auth.config.ts — Edge Runtime compatible (no Node.js APIs)
// Used by middleware. Does NOT import nodemailer, bcryptjs, or neon.
import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAuthPage = nextUrl.pathname.startsWith("/login");
      if (isAuthPage) return isLoggedIn ? Response.redirect(new URL("/calendar", nextUrl)) : true;
      return isLoggedIn;
    },
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token?.id) session.user.id = token.id as string;
      return session;
    },
  },
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  providers: [],
};
