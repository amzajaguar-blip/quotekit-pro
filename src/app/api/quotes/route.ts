import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const itemSchema = z.object({
  description: z.string().min(1),
  quantity: z.number().min(0.01),
  unitPrice: z.number().min(0),
});

const schema = z.object({
  clientId:   z.string().min(1),
  quoteNo:    z.string().min(1),
  title:      z.string().optional().nullable(),
  status:     z.enum(["draft", "sent", "accepted", "declined", "expired"]).default("draft"),
  issueDate:  z.string().optional(),
  validUntil: z.string().optional().nullable(),
  notes:      z.string().optional().nullable(),
  terms:      z.string().optional().nullable(),
  taxRate:    z.number().min(0).max(100).default(0),
  discount:   z.number().min(0).default(0),
  currency:   z.enum(["USD", "EUR", "GBP", "JPY", "CAD", "AUD"]).default("USD"),
  items:      z.array(itemSchema).min(1),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await request.json();
    const r = schema.safeParse(body);
    if (!r.success) return NextResponse.json({ error: r.error.errors[0].message }, { status: 400 });
    const { items, ...data } = r.data;
    const quote = await prisma.quote.create({
      data: {
        ...data,
        issueDate:  data.issueDate  ? new Date(data.issueDate)  : new Date(),
        validUntil: data.validUntil ? new Date(data.validUntil) : null,
        userId: session.user.id,
        items: { create: items },
      },
      include: { client: true, items: true },
    });
    return NextResponse.json(quote, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create quote" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const quotes = await prisma.quote.findMany({
      where: { userId: session.user.id },
      include: { client: true, items: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(quotes);
  } catch {
    return NextResponse.json({ error: "Failed to fetch quotes" }, { status: 500 });
  }
}
