import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const updSchema = z.object({
  clientId: z.string().optional(), invoiceNo: z.string().optional(),
  status: z.enum(["draft","sent","paid","overdue","cancelled"]).optional(),
  issueDate: z.string().optional(), dueDate: z.string().optional(), notes: z.string().optional(),
  taxRate: z.number().min(0).max(100).optional(), discount: z.number().min(0).optional(),
  currency: z.enum(["USD","EUR","GBP","JPY","CAD","AUD"]).optional(),
  items: z.array(z.object({ id: z.string().optional(), description: z.string().min(1), quantity: z.number().min(0.01), unitPrice: z.number().min(0) })).optional(),
});

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const inv = await prisma.invoice.findUnique({ where: { id: params.id }, include: { client: true, items: true } });
    if (!inv || inv.userId !== session.user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(inv);
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const inv = await prisma.invoice.findUnique({ where: { id: params.id } });
    if (!inv || inv.userId !== session.user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const body = await req.json();
    const r = updSchema.safeParse(body);
    if (!r.success) return NextResponse.json({ error: r.error.errors[0].message }, { status: 400 });
    const { items, ...data } = r.data;
    const updated = await prisma.invoice.update({
      where: { id: params.id },
      data: {
        ...data,
        issueDate: data.issueDate ? new Date(data.issueDate) : undefined,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        ...(items ? { items: { deleteMany: {}, create: items.map(i => ({ description: i.description, quantity: i.quantity, unitPrice: i.unitPrice })) } } : {}),
      },
      include: { client: true, items: true },
    });
    return NextResponse.json(updated);
  } catch (e) { console.error(e); return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const inv = await prisma.invoice.findUnique({ where: { id: params.id } });
    if (!inv || inv.userId !== session.user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });
    await prisma.invoice.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
