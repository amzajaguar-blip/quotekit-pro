# QuoteKit Pro

**Professional Quote & Estimate Generator for Freelancers and Agencies**

Send polished PDF quotes in minutes. Track status, set expiry dates, and know your conversion rate at a glance.

---

## Features

- ✅ Create, edit, and delete quotes with line items
- ✅ Quote status flow: Draft → Sent → Accepted / Declined / Expired
- ✅ PDF export with professional template
- ✅ Quote validity date with auto-expiry awareness
- ✅ Quote title for easy client communication
- ✅ Notes and Terms & Conditions per quote
- ✅ Multi-currency support (USD, EUR, GBP, JPY, CAD, AUD)
- ✅ Tax rate and flat discount
- ✅ Client management
- ✅ Dashboard with conversion rate metrics
- ✅ Auth (email/password via NextAuth)
- ✅ Multi-user ready

---

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Prisma ORM** + SQLite (swap to Postgres for production)
- **NextAuth.js** (session management)
- **@react-pdf/renderer** (PDF generation)
- **Zod** (input validation)

---

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:
```
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"
```

### 3. Setup database

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Demo credentials:** `demo@quotekit.pro` / `demo123`

---

## Deploy to Production

Switch `schema.prisma` datasource to PostgreSQL:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Deploy to Vercel, Railway, or any Node.js host.

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/          # NextAuth endpoints
│   │   ├── clients/       # Client CRUD
│   │   └── quotes/        # Quote CRUD + stats
│   └── dashboard/
│       ├── clients/       # Client management pages
│       └── quotes/        # Quote pages (list, new, view, edit)
├── components/
│   ├── QuoteForm.tsx      # Quote creation/edit form
│   ├── QuoteList.tsx      # Quotes table with filters
│   ├── ClientManager.tsx  # Client CRUD
│   ├── ProtectedRoute.tsx # Auth guard
│   └── pdf/
│       └── QuoteTemplate.tsx  # PDF template
├── lib/
│   ├── auth.ts            # NextAuth config
│   ├── prisma.ts          # Prisma client
│   ├── quote-utils.ts     # API helpers
│   └── utils.ts           # Formatting utilities
└── types/
    └── index.ts           # TypeScript types
```

---

## License

Commercial license — single developer use. Source code provided for personal projects and client work. Redistribution or resale of the source code is not permitted.

---

*Part of the Freelancer Business Suite by [Your Name]*
# uotekit-pro
