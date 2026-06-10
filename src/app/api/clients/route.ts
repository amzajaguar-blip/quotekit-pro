import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const clientSchema = z.object({
  name: z.string().min(1), email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(), address: z.string().optional(),
  city: z.string().optional(), state: z.string().optional(), zip: z.string().optional(), country: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const s = await getServerSession(authOptions);
    if (!s?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const b = await req.json();
    const r = clientSchema.safeParse(b);
    if (!r.success) return NextResponse.json({ error: r.error.errors[0].message }, { status: 400 });
    const d = r.data;
    const client = await prisma.client.create({
      data: { ...d, email: d.email||null, phone: d.phone||null, address: d.address||null, city: d.city||null, state: d.state||null, zip: d.zip||null, country: d.country||null, userId: s.user.id },
    });
    return NextResponse.json(client, { status: 201 });
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}

export async function GET() {
  try {
    const s = await getServerSession(authOptions);
    if (!s?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const clients = await prisma.client.findMany({ where: { userId: s.user.id }, orderBy: { createdAt: "desc" } });
    return NextResponse.json(clients);
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
