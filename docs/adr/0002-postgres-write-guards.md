# Enforce maintenance and write quota in Postgres

Demo Operators call Supabase from the browser. UI-only limits are easy to bypass. We enforce Maintenance Windows and the 60 writes/hour quota with Postgres triggers (and `demo_meta` / `write_quota`), so rejected writes happen at the database even if a bot skips the React app.

**Status:** accepted

## Considered Options

- **Postgres triggers / guards** (chosen) — keeps the existing PostgREST client; hard to bypass; fits a student-sized stack.
- **Proxy all mutates through Edge Functions** — stronger gateway control, but rewrites every service call and adds latency/complexity.
- **Frontend-only checks** — insufficient against tools/bots.

## Consequences

- Clear error messages from the DB must be surfaced in the UI/toasts.
- Service role / security-definer reset paths must bypass or satisfy the same guards intentionally (Edge Function + `run_demo_reset`).
