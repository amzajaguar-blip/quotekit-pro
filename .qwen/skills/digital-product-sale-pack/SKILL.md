---
name: digital-product-sale-pack
description: Create a clean, organized sale-ready package for any digital product (source code, assets, docs, marketing materials) — structure, catalog, and marketplace-ready output
source: auto-skill
extracted_at: '2026-06-10T01:20:59.305Z'
---

# Digital Product Sale Pack — Reusable Approach

When the user asks to organize a project into a sale-ready pack with visual assets, everything ordered and easy to find, use this method.

## Step 1 — Extract and Inventory Existing Assets

If the project has `.zip` or `.tar.gz` archives containing marketing/graphics assets:
- Extract to a temp directory (e.g. `/tmp/<project>-assets/`)
- Inventory all extracted files: format, dimensions, file sizes
- Identify categories: GIFs/demos, screenshots, mockups, covers/banners

## Step 2 — Create the Organized Asset Directory

Create a semantic structure under `marketing-assets/`:

```
marketing-assets/
├── ASSETS.md              ← Catalog file (create this last)
├── gifs/                  ← Animated product demos (screen recordings)
├── screenshots/           ← Static UI screenshots (prefer WebP for web)
├── mockups/               ← High-res device mockups (PNG, 3K+ px wide)
└── covers/                ← Marketplace cover images (Gumroad, CodeCanyon, etc.)
```

Copy assets into the matching subdirectory based on their content and format.

## Step 3 — Create the Sale Pack Structure

```
sale-pack/
├── README.md                      ← Entry point: quick overview, marketplace setup table
├── PACKAGE.md                     ← Full sales guide: features, pricing, checklist, where to sell
├── source-code/
│   └── <project>-source.tar.gz    ← Clean source (exclude node_modules, .next, .qwen, archives)
├── documentation/
│   ├── README.md                  ← Copy of original project README
│   └── QUICK_START.md             ← Buyer onboarding: install, configure, run in 5 minutes
├── marketing-assets/              ← Copy of the full marketing-assets/ tree (self-contained)
└── archives/                      ← Original backup archives (optional, for reference)
```

### Source Archive Creation

When creating the clean source archive, exclude:
- `node_modules/`
- `.next/`
- `.qwen/`
- `marketing-assets/` and `sale-pack/` (output folders)
- Any existing `.tar.gz` / `.zip` archives
- Build artifacts (`tsconfig.tsbuildinfo`, `next-env.d.ts`)

## Step 4 — Create the ASSETS.md Catalog

The `ASSETS.md` file should include:

1. **Full directory tree** with file sizes
2. **Table per category** — files, sizes, and their best use case
3. **Quick Reference Table** — which asset to use for each platform (Gumroad cover, gallery slot N, CodeCanyon preview, Twitter/X, LinkedIn, documentation, landing page hero)
4. **Technical specifications** — formats, resolutions, optimization status

## Step 5 — Create the PACKAGE.md Sales Guide

Include:
- **Package contents tree** (what's in the sale-pack)
- **Product summary** with key features and tech stack
- **Where to sell** table — platforms matched with best-fit assets
- **Pre-publish checklist** (secret rotation, build verification, asset upload)
- **Pricing suggestions** — 3 tiers (Basic/Standard/Extended) with what's included

## Step 6 — Create the QUICK_START.md

For buyer onboarding, cover:
- Prerequisites (Node.js version, etc.)
- Extract → Install → Configure → Setup DB → Start (5 steps max)
- Demo credentials in a clean table
- "What's Next" table: common customizations mapped to files
- Help links (official docs)

## Step 7 — Create the Entry README.md

In `sale-pack/README.md`, provide:
- One-line description of what this is
- Directory tree of the sale pack
- Marketplace setup table (which asset in which slot for each platform)
- Pricing table (compact)
- "Go sell" sentiment

## Step 8 — Clean the Root

- Move any `.tar.gz` / `.zip` archives from the project root into `sale-pack/archives/`
- Leave the project source directory clean and uncluttered

## Key Principles

- **Self-contained:** The `sale-pack/` should contain everything needed to sell — copy assets into it, don't just link
- **Double documentation:** The root `marketing-assets/` serves as working catalog; `sale-pack/marketing-assets/` is the buyer-facing copy
- **Status flags:** Use `✅` and `🚀` to signal readiness throughout
- **Tables over prose:** For marketplace setup and pricing, use tables — they're scannable
