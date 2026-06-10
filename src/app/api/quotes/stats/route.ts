import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const quotes = await prisma.quote.findMany({
      where: { userId: session.user.id },
      include: { items: true },
    });

    const calcTotal = (q: any) => {
      const sub = q.items.reduce((s: number, i: any) => s + i.quantity * i.unitPrice, 0);
      const tax = sub * (q.taxRate / 100);
      return sub + tax - q.discount;
    };

    const totalQuotes   = quotes.length;
    const sentQuotes    = quotes.filter(q => q.status === "sent").length;
    const acceptedQuotes = quotes.filter(q => q.status === "accepted").length;
    const totalValue    = quotes.reduce((s, q) => s + calcTotal(q), 0);
    const acceptedValue = quotes.filter(q => q.status === "accepted").reduce((s, q) => s + calcTotal(q), 0);
    const conversionRate = totalQuotes > 0 ? Math.round((acceptedQuotes / totalQuotes) * 100) : 0;

    return NextResponse.json({ totalQuotes, sentQuotes, acceptedQuotes, totalValue, acceptedValue, conversionRate });
  } catch {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
