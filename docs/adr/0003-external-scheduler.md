# External scheduler for keep-alive and Demo Reset

Supabase Free projects can pause after roughly a week of inactivity. Schedulers that live only inside the paused database (for example pg_cron alone) stop with it. We use GitHub Actions as an external scheduler: keep-alive pings the REST API, and a nightly job calls the `reset-demo` Edge Function with a shared cron secret.

**Status:** accepted

## Considered Options

- **GitHub Actions** (chosen) — free for this repo, already used for keep-alive, easy to run manually.
- **pg_cron only** — fails when the project is paused; unreliable for Free tier keep-alive.
- **Third-party cron (cron-job.org, etc.)** — also valid; Actions keeps ops in one place with the codebase.

## Consequences

- GitHub and Supabase must share `RESET_CRON_SECRET`.
- Action schedules can drift slightly; daily reset plus keep-alive twice weekly still stay under the pause window.
