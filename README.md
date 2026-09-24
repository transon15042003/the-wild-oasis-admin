# The Wild Oasis (Admin)

Vite + React admin console for a fictional boutique hotel, published as a **Demo Sandbox**: visitors use **Try Demo**, share one **Hotel Data** set, and accept periodic **Demo Resets**.

| | |
|---|---|
| **Live app** | [the-wild-oasis-admin-transon.vercel.app](https://the-wild-oasis-admin-transon.vercel.app) |
| **Stack** | React 18, Vite, React Query, Styled Components, Supabase, CASL, Vercel |
| **Domain words** | [CONTEXT.md](CONTEXT.md) |
| **Docs** | [docs/README.md](docs/README.md) |

## What this project is

- **Demo Operators** enter with **Try Demo** on `/login` (Edge Function `try-demo` mints a session for one shared demo Auth user).
- **Account login** stays on `/login` (email/password). **Owner** (`app_metadata.role=owner`) uses that form for Account updates and manual Demo Reset. Public Sign up is off.
- **CASL** gates privileged UI (Account, manual Demo Reset); Postgres RLS and write triggers remain authoritative.
- Everyone shares the same **Hotel Data** (cabins, guests, bookings, settings).
- A daily **Demo Reset** restores the **Seed**; Auth identities are kept.
- During a **Maintenance Window**, writes and normal signed-in use are blocked.
- A **Write Quota** limits mutating actions per Auth user (the shared demo user shares one quota bucket).

This is **not** a multi-tenant real hotel system. Design decisions: [docs/adr/](docs/adr/).

## Quick start (local)

```bash
# 1. Install
npm install

# 2. Env — copy and fill (see comments in the file)
cp .env.example .env

# 3. Dev server
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

| Script | Purpose |
|--------|---------|
| `npm run dev` | Local development |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | ESLint |

## Environment (frontend)

Only variables prefixed with `VITE_` are available in the browser. Full notes: [docs/configuration.md](docs/configuration.md).

| Variable | Required | Purpose |
|----------|----------|---------|
| `VITE_SUPABASE_URL` | Yes | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Yes | Public anon key (safe for browser; RLS still applies) |
| `VITE_TURNSTILE_SITE_KEY` | No | Optional Turnstile for Try Demo when Edge `TURNSTILE_SECRET_KEY` is set |

**Do not** put `service_role`, `DEMO_USER_PASSWORD`, or `RESET_CRON_SECRET` in the frontend `.env`. Those belong in Supabase Edge Function secrets and GitHub Actions ([docs/configuration.md](docs/configuration.md)).

## Documentation map

| Doc | Contents |
|-----|----------|
| [CONTEXT.md](CONTEXT.md) | Ubiquitous language (glossary) |
| [docs/architecture.md](docs/architecture.md) | System diagram and components |
| [docs/configuration.md](docs/configuration.md) | Env, Edge secrets, Auth URLs, optional Turnstile |
| [docs/operations.md](docs/operations.md) | Keep-alive, Demo Reset, quotas, troubleshooting |
| [docs/deploy.md](docs/deploy.md) | Step-by-step Vercel + Supabase checklist |
| [docs/adr/](docs/adr/) | Architecture Decision Records |

## App routes (after Try Demo or owner login)

| Path | Screen |
|------|--------|
| `/login` | Try Demo + account email/password login |
| `/dashboard` | Overview |
| `/bookings`, `/bookings/:id` | Bookings |
| `/cabins` | Cabins |
| `/settings` | Hotel settings; manual Demo Reset (owner only) |
| `/account` | Demo Operator profile (owner only) |

## Deploy

Production is intended on **Vercel** with **Supabase** Free and **GitHub Actions** for keep-alive + nightly Demo Reset. Follow [docs/deploy.md](docs/deploy.md) (deploy `try-demo`, set demo Edge secrets, create owner user).
