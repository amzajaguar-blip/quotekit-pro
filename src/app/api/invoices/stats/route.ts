import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const invoices = await prisma.invoice.findMany({ where: { userId: session.user.id }, include: { items: true } });
    const totalInvoices = invoices.length;
    const calc = (inv: typeof invoices[0]) => { const s = inv.items.reduce((a,i)=>a+i.quantity*i.unitPrice,0); const t = s*(inv.taxRate/100); return s+t-inv.discount; };
    const totalRevenue = invoices.reduce((s,i)=>s+calc(i),0);
    const paidAmount = invoices.filter(i=>i.status==="paid").reduce((s,i)=>s+calc(i),0);
    const pendingAmount = invoices.filter(i=>i.status==="sent"||i.status==="draft").reduce((s,i)=>s+calc(i),0);
    return NextResponse.json({ totalInvoices, totalRevenue, paidAmount, pendingAmount });
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
