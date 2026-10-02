// auth.ts — Node.js Runtime only (NOT imported by middleware)
// Adds Credentials provider, bcryptjs and nodemailer audit events.
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import { authConfig } from "@/lib/auth.config";

const sql = neon(process.env.DATABASE_URL!);

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const users = await sql`
            SELECT id, name, email, password, "profilePicture" as image
            FROM "User"
            WHERE email = ${credentials.email as string}
            LIMIT 1
          `;
          if (!users?.length) return null;
          const user = users[0];
          const isValid = await bcrypt.compare(credentials.password as string, user.password);
          if (!isValid) return null;
          return { id: String(user.id), name: user.name, email: user.email, image: user.image ?? null };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  events: {
    async signIn({ user }) {
      if (user?.id) {
        // Dynamic import to avoid Edge Runtime issues
        const { logAuditEvent } = await import("@/lib/audit");
        await logAuditEvent({ userId: user.id, action: "login", metadata: { email: user.email } }).catch(console.error);
      }
    },
    async signOut(message) {
      const token = "token" in message ? message.token : null;
      if (token?.id) {
        const { logAuditEvent } = await import("@/lib/audit");
        await logAuditEvent({ userId: token.id as string, action: "logout" }).catch(console.error);
      }
    },
  },
});
