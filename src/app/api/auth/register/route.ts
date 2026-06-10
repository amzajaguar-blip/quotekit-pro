import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
const { hash } = bcrypt;
import prisma from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const r = schema.safeParse(body);
    if (!r.success) return NextResponse.json({ error: r.error.errors[0].message }, { status: 400 });
    const { email, password, name } = r.data;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    const hashed = await hash(password, 12);
    const user = await prisma.user.create({ data: { email, password: hashed, name: name || null } });
    return NextResponse.json({ id: user.id, email: user.email, name: user.name }, { status: 201 });
  } catch { return NextResponse.json({ error: "Registration failed" }, { status: 500 }); }
}
