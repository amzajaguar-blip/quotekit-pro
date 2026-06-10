# ⚡ InvoicePDF Pro — Quick Start Guide

Get InvoicePDF Pro running locally in under 5 minutes.

---

## Prerequisites

- **Node.js** 18+ installed
- **npm** (comes with Node.js)

---

## Step 1 — Extract the source

```bash
tar -xzf invoicepdf-pro-source.tar.gz
cd invoice-pdf-pro
```

---

## Step 2 — Install dependencies

```bash
npm install
```

---

## Step 3 — Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local` and set a secure secret:
```env
NEXTAUTH_SECRET="your-random-secret-here"
```

> Generate a secure secret: `openssl rand -base64 32`

---

## Step 4 — Setup database

```bash
npx prisma db push
npx prisma db seed
```

This creates the SQLite database and seeds it with:
- Demo user: `demo@invoicepdf.com` / `demo123456`
- 3 sample clients
- 3 sample invoices

---

## Step 5 — Start the app

```bash
npm run dev
```

Open **http://localhost:3000** and login with the demo credentials.

---

## What's Next

| Goal | File / Action |
|------|---------------|
| Swap to PostgreSQL | Edit `prisma/schema.prisma` → change `provider` to `"postgresql"` |
| Change company name | Edit `src/components/pdf/*.tsx` → search "Your Company" |
| Add your logo | Replace placeholder in `CorporateTemplate.tsx` |
| Customize colors | Edit `headerBg` in `ModernTemplate.tsx` |
| Add new PDF template | Copy existing template pattern, add to selector |
| Deploy to production | `npm run build` → deploy `.next/` to Vercel, Railway, or your server |

---

## Demo Credentials

| Field | Value |
|-------|-------|
| Email | `demo@invoicepdf.com` |
| Password | `demo123456` |

---

## Need Help?

- Next.js docs: https://nextjs.org/docs
- Prisma docs: https://www.prisma.io/docs
- NextAuth.js docs: https://next-auth.js.org
- @react-pdf/renderer: https://react-pdf.org

---

*Setup complete. You're ready to customize and deploy!* 🚀
