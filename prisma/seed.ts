import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Demo user
  const password = await bcrypt.hash("demo123", 10);
  const user = await prisma.user.upsert({
    where: { email: "demo@quotekit.pro" },
    update: {},
    create: { email: "demo@quotekit.pro", name: "Demo User", password },
  });

  // Demo client
  const client = await prisma.client.upsert({
    where: { id: "demo-client-1" },
    update: {},
    create: {
      id: "demo-client-1",
      name: "Acme Corp",
      email: "billing@acme.com",
      address: "123 Main Street",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "USA",
      userId: user.id,
    },
  });

  // Demo quote
  await prisma.quote.upsert({
    where: { quoteNo: "QT-0001" },
    update: {},
    create: {
      quoteNo: "QT-0001",
      title: "Website Redesign Project",
      status: "sent",
      issueDate: new Date(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      notes: "Prices include all revisions up to 3 rounds.",
      terms: "50% deposit required before work begins. Remaining 50% on completion.",
      taxRate: 10,
      discount: 0,
      currency: "USD",
      clientId: client.id,
      userId: user.id,
      items: {
        create: [
          { description: "UI/UX Design", quantity: 1, unitPrice: 1500 },
          { description: "Frontend Development", quantity: 1, unitPrice: 2500 },
          { description: "SEO Setup", quantity: 1, unitPrice: 500 },
        ],
      },
    },
  });

  console.log("✅ Seed completed — demo@quotekit.pro / demo123");
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
