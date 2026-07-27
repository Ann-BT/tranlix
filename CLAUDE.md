# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository

This repo is the TRANLIX frontend — one component of a larger monorepo (see `D:\NguyenPhung\Tranlix_VietAn\Dev\TRANLIX\CLAUDE.md` for the full-system picture: backend, infra, docs). TRANLIX is an on-premise document translation system (DOCX/PPTX/XLSX/PDF) that preserves layout/formatting via a local vLLM backend.

The actual app lives in `tranlix/` (this repo's root `README.md` is an unfilled GitLab template — ignore it; see `tranlix/README.md`, in Vietnamese, for the real project conventions).

Stack: React 19 + Vite + TypeScript + MUI + TanStack Query (server state) + Zustand (light UI/auth state) + react-router-dom + axios.

## Commands

Run from `tranlix/`:

```bash
npm install
npm run dev       # vite dev server (--host)
npm run build     # tsc -b && vite build
npm run lint      # eslint .
npm run preview
```

There is no test runner configured in this repo yet.

`.env` vars (see `tranlix/.env.example`): `VITE_API_BASE_URL` (default `/api/v1`), `VITE_ONLYOFFICE_URL`.

`vite.config.ts` proxies `/api` to `http://localhost:9000` in dev — point the backend at that port (or adjust the proxy) when running the API locally.

## Architecture

Feature-based structure under `tranlix/src/`:

```
app/            providers.tsx (QueryClientProvider → MUI ThemeProvider/CssBaseline → BrowserRouter → AuthProvider), router.tsx, queryClient.ts
config/         env.ts — single `env.apiBaseUrl` export
core/           static assets (logo/svg)
features/       auth/ glossary/ jobs/ translation/
pages/          route-level pages (HomePage, JobsPage, ComparePage, GlossaryPage, LoginPage, NotFoundPage)
shared/         api/client.ts (axios instance), components/ (AppLayout, Header, Sidebar, DocViewer, ErrorBoundary), hooks/, lib/, styles/ (MUI theme/tokens/palette), types/
```

### Feature module convention

Each feature under `features/` follows the same internal layout: `api/` (axios calls, one `*Api.ts` object per feature, e.g. `jobsApi.list()`), `hooks/` (TanStack Query hooks, `use*.ts`, each paired with a `*Keys` query-key factory, e.g. `jobKeys.detail(id)`), `components/`, `types.ts`, and a barrel `index.ts` re-exporting the feature's public surface. `auth/` additionally has a `store/` (Zustand).

**Cross-feature imports must go through the barrel `index.ts`** — don't reach into another feature's internal `api/`, `hooks/`, or `components/` directly. Path aliases `@/*`, `@app/*`, `@shared/*`, `@features/*` are configured in both `tsconfig.app.json` and `vite.config.ts` and must be kept in sync if changed.

### State

- Server state: TanStack Query only. `queryClient.ts` sets `staleTime: 30_000`, `retry: 1`, `refetchOnWindowFocus: false`.
- Client/auth state: Zustand. `features/auth/store/authStore.ts` is the only store; it does not use `zustand/persist` — it manually syncs the token to `localStorage` inside its setter.
- `shared/api/client.ts` reads the auth token directly from `localStorage` in its request interceptor (not from the Zustand store), and normalizes all errors to `new Error(error.response?.data?.detail ?? error.message)` in its response interceptor.
- Note: `AuthProvider` is exported from `shared/components/Layout/Header`, not from the `auth` feature — an existing quirk, not a convention to imitate in new code.

### Main flow

`HomePage → TranslationForm → useCreateTranslation → POST /translations → JobsPage polls job status via useJobPolling`. Translation job downloads/results are surfaced via `jobs/components/DownloadMenuButton` and viewed via `shared/components/DocViewer/OnlyOfficeViewer` (backed by the ONLYOFFICE service configured via `VITE_ONLYOFFICE_URL`).
