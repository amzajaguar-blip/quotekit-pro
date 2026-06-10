import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { calculateSubtotal, calculateTax, calculateTotal, formatDate } from "@/lib/utils";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const inv = await prisma.invoice.findUnique({ where: { id: params.id }, include: { client: true, items: true } });
    if (!inv || inv.userId !== session.user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const { searchParams } = new URL(req.url);
    const tpl = searchParams.get("template") || "minimal";

    const sub = calculateSubtotal(inv.items);
    const tax = calculateTax(sub, inv.taxRate);
    const tot = calculateTotal(sub, tax, inv.discount);

    const data = {
      invoiceNo: inv.invoiceNo, status: inv.status,
      issueDate: formatDate(inv.issueDate), dueDate: inv.dueDate ? formatDate(inv.dueDate) : null,
      clientName: inv.client.name, clientEmail: inv.client.email, clientAddress: inv.client.address,
      clientCity: inv.client.city, clientState: inv.client.state, clientZip: inv.client.zip, clientCountry: inv.client.country,
      items: inv.items.map(i => ({ description: i.description, quantity: i.quantity, unitPrice: i.unitPrice })),
      subtotal: sub, taxRate: inv.taxRate, tax, discount: inv.discount, total: tot, currency: inv.currency, notes: inv.notes,
    };

    const { renderToStream } = await import("@react-pdf/renderer");
    const React = await import("react");

    let cmp;
    if (tpl === "modern") { const { ModernTemplate } = await import("@/components/pdf/ModernTemplate"); cmp = React.createElement(ModernTemplate, data); }
    else if (tpl === "corporate") { const { CorporateTemplate } = await import("@/components/pdf/CorporateTemplate"); cmp = React.createElement(CorporateTemplate, data); }
    else { const { MinimalTemplate } = await import("@/components/pdf/MinimalTemplate"); cmp = React.createElement(MinimalTemplate, data); }

    const stream = await renderToStream(cmp as any);
    const chunks: Buffer[] = [];
    const buffer = await new Promise<Buffer>((resolve, reject) => {
      stream.on("data", (c: Buffer) => chunks.push(c));
      stream.on("end", () => resolve(Buffer.concat(chunks)));
      stream.on("error", reject);
    });

    return new NextResponse(new Uint8Array(buffer), {
      headers: { "Content-Type": "application/pdf", "Content-Disposition": `inline; filename="${inv.invoiceNo}.pdf"` },
    });
  } catch (e) { console.error("PDF error:", e); return NextResponse.json({ error: "PDF generation failed" }, { status: 500 }); }
}
