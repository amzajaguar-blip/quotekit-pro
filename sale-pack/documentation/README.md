# InvoicePDF Pro — Invoice System Starter Kit

Full-stack invoice management with professional PDF generation. Clean Next.js 14 source code.

## Quick Start (5 min)

```bash
npm install
cp .env.example .env.local
npx prisma db push
npx prisma db seed
npm run dev
```

Open http://localhost:3000 — Login: `demo@invoicepdf.com` / `demo123456`

## Features

- 3 PDF Templates (Minimal, Modern, Corporate)
- Invoice & Client CRUD
- Dashboard with revenue stats
- Payment status tracking (Draft/Sent/Paid/Overdue/Cancelled)
- Auto invoice numbering (INV-0001...)
- Multi-currency (USD/EUR/GBP/JPY/CAD/AUD)
- Tax & discount calculations
- Auth (login/register)
- Responsive design

## Tech Stack

Next.js 14 · React 18 · Prisma + SQLite · NextAuth.js · @react-pdf/renderer · Tailwind CSS · Zod · Lucide Icons

## Swap Database & Auth (2 min)

**Database:** Edit `prisma/schema.prisma` — change `provider = "sqlite"` to `"postgresql"` (or `"mysql"`). Update `DATABASE_URL` in `.env`. Run `npx prisma db push`. Done.

**Auth:** Edit `src/lib/auth.ts` — swap `CredentialsProvider` with any [NextAuth provider](https://next-auth.js.org/providers/) (Google, GitHub, Azure AD, Okta…). The rest of the app uses `getServerSession()` — it stays the same.

## Customization

**Company Name:** Edit "Your Company" in `src/components/pdf/*.tsx`
**Logo:** Replace placeholder in CorporateTemplate with `<Image src="/logo.png"/>`
**Colors:** Change `headerBg` in ModernTemplate
**New Template:** Copy existing pattern, add to selector + PDF route

## Env

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="change-me"
NEXTAUTH_URL="http://localhost:3000"
```

## License

Personal & commercial use. Customize freely. Do not resell unmodified source code.
