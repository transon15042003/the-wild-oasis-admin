# Cấu hình

Tài liệu env, secrets và cấu hình dashboard. Checklist từng bước deploy: [deploy.md](deploy.md).

## Frontend (Vite / Vercel)

Biến `VITE_*` phải có **lúc build** trên Vercel (Settings → Environment Variables → Production), rồi Redeploy.

| Biến | Bắt buộc | Mô tả |
|------|----------|--------|
| `VITE_SUPABASE_URL` | Có | URL project Supabase |
| `VITE_SUPABASE_ANON_KEY` | Có | Anon / publishable key |
| `VITE_TURNSTILE_SITE_KEY` | Không | Cloudflare Turnstile site key |

Mẫu local: [.env.example](../.env.example). **Không** commit `.env`.

## Supabase Auth

| Setting | Giá trị khuyến nghị |
|---------|---------------------|
| Confirm email | **Tắt** (Demo Operator vào app ngay sau Sign up) |
| Site URL | Domain Vercel production, ví dụ `https://the-wild-oasis-admin-transon.vercel.app` |
| Redirect URLs | Site URL + `http://localhost:5173` |

## Supabase Edge Function secrets

| Secret | Bắt buộc | Mô tả |
|--------|----------|--------|
| `RESET_CRON_SECRET` | Có (cho nightly) | Header `x-reset-cron-secret` khi gọi `reset-demo` từ Actions |
| `TURNSTILE_SECRET_KEY` | Khi bật Turnstile | Verify token phía server trong `signup-demo` |

`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` thường được platform gắn sẵn cho Edge Functions.

## GitHub Actions secrets

Repo → Settings → Secrets and variables → Actions:

| Secret | Dùng cho |
|--------|----------|
| `SUPABASE_URL` | keep-alive + nightly reset |
| `SUPABASE_SERVICE_ROLE_KEY` | keep-alive (REST ping) |
| `RESET_CRON_SECRET` | nightly → Edge `reset-demo` (cùng giá trị với secret Supabase) |

## Workflows

| File | Lịch | Việc |
|------|------|------|
| `.github/workflows/keep-supabase-alive.yml` | CN + T4 00:00 UTC | Ping REST `settings` để tránh pause Free tier |
| `.github/workflows/nightly-demo-reset.yml` | Mỗi ngày 00:00 UTC | Gọi `reset-demo` (scheduled, Maintenance ~30 phút) |

## Vercel / SPA

[`vercel.json`](../vercel.json) rewrite mọi path về `index.html` để React Router (`/login`, `/dashboard`, …) không bị 404 khi refresh.

## Turnstile (tuỳ chọn)

1. Tạo widget tại Cloudflare Turnstile.  
2. `VITE_TURNSTILE_SITE_KEY` trên Vercel (+ `.env` local).  
3. `TURNSTILE_SECRET_KEY` trên Supabase.  

Không có key: Sign up local vẫn chạy (widget ghi `dev-bypass`).
