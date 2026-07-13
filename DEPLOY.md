# Deploy checklist (Demo Sandbox)

Student-friendly steps to put this app in production on **Vercel + Supabase Free**.

## 1. Supabase Auth

1. Open [Auth → Providers → Email](https://supabase.com/dashboard/project/tpzkqxwytqlubdvdszlz/auth/providers).
2. **Disable "Confirm email"** so Demo Operators can sign up and use the app immediately.
3. Under [Auth → URL configuration](https://supabase.com/dashboard/project/tpzkqxwytqlubdvdszlz/auth/url-configuration):
   - **Site URL**: your Vercel URL (e.g. `https://your-app.vercel.app`)
   - **Redirect URLs**: add the same URL (and `http://localhost:5173` for local dev)

## 2. Supabase Edge Function secrets

In [Edge Functions → Secrets](https://supabase.com/dashboard/project/tpzkqxwytqlubdvdszlz/settings/functions):

| Secret | Purpose |
|--------|---------|
| `RESET_CRON_SECRET` | Shared secret for GitHub nightly reset (generate a long random string) |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile secret (optional until you enable Turnstile) |

`SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` are usually injected automatically for Edge Functions.

Deployed functions (already in project if migration/deploy ran):

- `signup-demo` — Sign up with optional Turnstile verify
- `reset-demo` — Demo Reset (manual JWT or cron secret)

## 3. GitHub Actions secrets

Repo → **Settings → Secrets and variables → Actions**:

| Secret | Value |
|--------|--------|
| `SUPABASE_URL` | `https://tpzkqxwytqlubdvdszlz.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Project Settings → API → `service_role` |
| `RESET_CRON_SECRET` | Same value as the Edge Function secret |

Workflows:

- `.github/workflows/keep-supabase-alive.yml` — keep Free tier awake
- `.github/workflows/nightly-demo-reset.yml` — daily Demo Reset at 00:00 UTC

## 4. Cloudflare Turnstile (recommended for public Sign up)

1. Create a widget at [Cloudflare Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile).
2. Set `VITE_TURNSTILE_SITE_KEY` on Vercel (and locally in `.env`).
3. Set `TURNSTILE_SECRET_KEY` on Supabase Edge Function secrets.
4. Without these keys, local Sign up still works (dev bypass).

## 5. Vercel

1. Import this GitHub repo into [Vercel](https://vercel.com).
2. Framework preset: Vite.
3. Environment variables:

| Name | Value |
|------|--------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase `anon` / publishable key |
| `VITE_TURNSTILE_SITE_KEY` | Turnstile site key (optional) |

4. Deploy, then update Supabase Auth Site URL to the Vercel domain.

## 6. Quick smoke test

1. Open the Vercel URL → Sign up a new account → land on Dashboard.
2. Create/edit a cabin (counts toward 60 writes/hour).
3. Settings → **Reset demo data** → confirm Maintenance Window (~5 min).
4. GitHub Actions → **Nightly Demo Reset** → Run workflow → confirm HTTP 200.
5. GitHub Actions → **Keep Supabase Alive** → Run workflow → confirm HTTP 200.

## Behaviour summary

- Shared hotel data for all Demo Operators
- Auth accounts survive Demo Reset
- Scheduled reset daily 00:00 UTC with 30-minute Maintenance Window
- Manual reset: 5-minute window, once per user per 24 hours
- Write quota: 60 mutating operations per user per hour
