import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const updSchema = z.object({
  name: z.string().min(1).optional(), email: z.string().email().optional().or(z.literal("")).optional(),
  phone: z.string().optional(), address: z.string().optional(),
  city: z.string().optional(), state: z.string().optional(), zip: z.string().optional(), country: z.string().optional(),
});

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const s = await getServerSession(authOptions);
    if (!s?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const c = await prisma.client.findUnique({ where: { id: params.id }, include: { invoices: true } });
    if (!c || c.userId !== s.user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(c);
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const s = await getServerSession(authOptions);
    if (!s?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const c = await prisma.client.findUnique({ where: { id: params.id } });
    if (!c || c.userId !== s.user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const b = await req.json();
    const r = updSchema.safeParse(b);
    if (!r.success) return NextResponse.json({ error: r.error.errors[0].message }, { status: 400 });
    const updated = await prisma.client.update({ where: { id: params.id }, data: { ...r.data, email: r.data.email || null } });
    return NextResponse.json(updated);
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const s = await getServerSession(authOptions);
    if (!s?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const c = await prisma.client.findUnique({ where: { id: params.id } });
    if (!c || c.userId !== s.user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const count = await prisma.invoice.count({ where: { clientId: params.id } });
    if (count > 0) return NextResponse.json({ error: `Client has ${count} invoices. Delete invoices first.` }, { status: 400 });
    await prisma.client.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
