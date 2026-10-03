import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";

const sql = neon(process.env.DATABASE_URL!);

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Nombre, email y contraseña son obligatorios" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 6 caracteres" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existing = await sql`
      SELECT id FROM "User" WHERE email = ${email} LIMIT 1
    `;
    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Ya existe una cuenta con ese correo electrónico" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const newUser = await sql`
      INSERT INTO "User" (name, email, password, "createdAt", role, "isPremium", "authProvider")
      VALUES (${name}, ${email}, ${hashedPassword}, NOW(), 'user', false, 'credentials')
      RETURNING id, name, email
    `;

    // Send welcome email (fire and forget)
    try {
      const { sendWelcomeEmail } = await import("@/lib/email");
      await sendWelcomeEmail({ name, email });
    } catch (emailErr) {
      console.warn("Welcome email failed (non-critical):", emailErr);
    }

    return NextResponse.json(
      { success: true, user: { id: newUser[0].id, name: newUser[0].name, email: newUser[0].email } },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Register error:", error?.message ?? error);
    return NextResponse.json(
      { error: "Error interno al crear la cuenta" },
      { status: 500 }
    );
  }
}
