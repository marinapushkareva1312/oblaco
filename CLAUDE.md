# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

OBLACO is a Next.js 16 (App Router) marketplace web app (list/buy/sell items, chat, semantic search). It originated from v0.app (Vercel) generation — `metadata.generator: 'v0.app'` in `app/layout.tsx` and the v0-sandbox ignores in `.gitignore` are remnants of that.

## Commands

Package manager: **npm** (`package-lock.json` is authoritative — use `npm install`/`npm install <pkg>` when changing dependencies). The project previously had a stray `pnpm-lock.yaml`/`pnpm-workspace.yaml` left over from earlier work; those were removed because the coexisting lockfiles confused Next.js's workspace-root inference (`next dev` would warn/error that it couldn't find `next/package.json` from the project directory). Don't reintroduce a pnpm lockfile here.

```
npm run dev     # start dev server (next dev)
npm run build   # production build (next build)
npm run start   # run production build
npm run lint    # eslint .
```

There is no test suite/framework configured in this repo.

To backfill embeddings for listings missing them (run manually, not part of any build step):
```
npx ts-node generateEmbeddings.ts
```
This loads `.env.local` via `dotenv` and requires `SUPABASE_SERVICE_ROLE_KEY` + `VOYAGE_API_KEY`.

`next.config.mjs` sets `typescript.ignoreBuildErrors: true` — `npm run build` will succeed even with type errors, so don't rely on a successful build as proof of type correctness; check `tsc`/editor diagnostics separately when it matters.

## Environment variables

Defined in `.env.local` (gitignored): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `VOYAGE_API_KEY`.

- Client-side code and most API routes use the **anon key** (`lib/supabase.ts`, `app/api/search/route.ts`) — subject to Supabase RLS policies.
- `app/api/generate-embedding/route.ts` and `generateEmbeddings.ts` use the **service role key** to bypass RLS when writing embeddings.

## Architecture

**Data layer (Supabase Postgres + pgvector).** The `listings` table holds an `embedding` column (pgvector). Semantic search is done via a Postgres RPC function `match_listings(query_embedding, match_threshold, match_count)` called from `app/api/search/route.ts` — this RPC is defined in the Supabase project itself, not in this repo, so search behavior changes (thresholds, ranking) require either editing the RPC call site here or the SQL function in Supabase.

**Embeddings (Voyage AI).** `lib/embeddings.ts` wraps `voyageai` with `voyage-3-lite`, using `inputType: "document"` when embedding a listing's title+description and `inputType: "query"` when embedding a user's search string — keep this distinction when adding new embedding call sites. New/edited listings need their embedding generated (via `/api/generate-embedding`) for search to find them; `generateEmbeddings.ts` is the one-off backfill script for existing rows where `embedding is null`.

**Listings fallback pattern.** `lib/listings.ts` exports a static `listings` array (with matching `Listing` type and `categories` list) that both seeds the UI before data loads and acts as a fallback if `fetchListings()` (Supabase) errors or returns empty. When changing the `Listing` shape, update the static array, the Supabase mapping in `fetchListings`, and the `/api/search` result mapping in `app/api/search/route.ts` together — they're independently hand-maintained, not derived from a shared schema.

**Client-side search flow.** `app/page.tsx` debounces `searchQuery` (500ms) and calls `searchListings()` (`lib/embeddings.ts`), which POSTs to `/api/search`, which embeds the query and calls `match_listings`. `searchResults` (not category/nav filters) takes precedence in the `visibleListings` memo whenever a search is active.

**i18n.** `lib/language-context.tsx` provides a `LanguageProvider`/`useLanguage()` context (wraps the whole app in `app/layout.tsx`), backed by the `translations` object in `lib/translations.ts` (`Language = "en" | "ru" | "ko" | "zh" | "vi"`, keys typed as `TranslationKey`). Selected language persists to `localStorage` under `oblaco-language`. Some older pages (e.g. `app/auth/page.tsx`) still hold their own local `language` state instead of using this context — prefer `useLanguage()`/`t()` for any new or edited UI text rather than hardcoding strings or re-adding local language state.

**Responsive layout convention.** Pages share a `mx-auto max-w-md ... md:max-w-6xl` shell: mobile is a single narrow column with `BottomNav` + a compact header search/filter row; `md:` breakpoint switches to a wider desktop layout with inline top nav and search in `MarketplaceHeader` instead of the bottom nav. When adding a page or component, follow this same mobile-first-then-`md:`-override pattern rather than building a separate desktop component.

**UI components.** shadcn/ui (`components.json`: style `base-nova`, neutral base color, no separate `tailwind.config` — Tailwind v4 config lives in `app/globals.css` via `@theme inline` and CSS variables) with `lucide-react` icons. Path aliases: `@/components`, `@/components/ui`, `@/lib`, `@/hooks` (see `tsconfig.json` `paths` / `components.json` `aliases`). Only `components/ui/button.tsx` exists under `ui/` so far — install additional shadcn primitives via the `shadcn` CLI rather than hand-rolling them.

**Auth.** Supabase Auth (email/password + Google OAuth) in `app/auth/page.tsx`; user profile data (name, location, avatar) lives in a separate `profiles` table keyed by the auth user id, read/written directly from `app/profile/page.tsx`.
