# Cấu hình

Tài liệu env, secrets và cấu hình dashboard. Checklist từng bước deploy: [deploy.md](deploy.md).

## Frontend (Vite / Vercel)

Biến `VITE_*` phải có **lúc build** trên Vercel (Settings → Environment Variables → Production), rồi Redeploy.

| Biến | Bắt buộc | Mô tả |
|------|----------|--------|
| `VITE_SUPABASE_URL` | Có | URL project Supabase |
| `VITE_SUPABASE_ANON_KEY` | Có | Anon / publishable key |
| `VITE_TURNSTILE_SITE_KEY` | Không | Cloudflare Turnstile site key (dự phòng; **Try Demo v1 chưa gửi token** — xem mục Turnstile) |

Mẫu local: [.env.example](../.env.example). **Không** commit `.env`.

## Supabase Auth

| Setting | Giá trị khuyến nghị |
|---------|---------------------|
| Confirm email | **Tắt** (Demo Operator vào app ngay sau Try Demo) |
| Site URL | Domain Vercel production, ví dụ `https://the-wild-oasis-admin-transon.vercel.app` |
| Redirect URLs | Site URL + `http://localhost:5173` |

## Supabase Edge Function secrets

| Secret | Bắt buộc | Mô tả |
|--------|----------|--------|
| `RESET_CRON_SECRET` | Có (cho nightly) | Header `x-reset-cron-secret` khi gọi `reset-demo` từ Actions |
| `DEMO_USER_EMAIL` | Có (cho Try demo) | Email user Auth dùng chung cho demo; chỉ Edge `try-demo` |
| `DEMO_USER_PASSWORD` | Có (cho Try demo) | Mật khẩu user demo; **không** đưa vào `VITE_*` hay `.env` frontend |
| `TURNSTILE_SECRET_KEY` | **Không set (Try Demo v1)** | Edge `try-demo` có sẵn verify Turnstile, nhưng client `tryDemo()` gửi `body: {}` — nếu set secret, Try Demo trả 400. Giữ **unset** đến khi client gửi `turnstileToken`. |

`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` thường được platform gắn sẵn cho Edge Functions.

**Không bao giờ** đặt `DEMO_USER_EMAIL` / `DEMO_USER_PASSWORD` trong file `.env` Vite hoặc biến `VITE_*` trên Vercel — chỉ Supabase Edge Function secrets.

Deploy `try-demo` (thủ công):

```bash
supabase functions deploy try-demo
supabase secrets set DEMO_USER_EMAIL=demo@example.com DEMO_USER_PASSWORD='your-secure-password'
```

### Owner (một lần)

Tạo user owner trong Supabase Dashboard → Authentication → Users (email/mật khẩu riêng, **không** dùng chung với demo). Gán `app_metadata.role` = `"owner"` (SQL Editor hoặc Admin API `updateUserById`). Owner đăng nhập qua form ẩn trên `/login`; vào demo qua nút **Try Demo** → Edge `try-demo`.

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

## Turnstile (Edge sẵn sàng; client Try Demo v1 chưa nối)

Try Demo v1 **không** gửi Turnstile từ browser: `tryDemo()` invoke `try-demo` với `body: {}` (không có `turnstileToken`). Edge vẫn có nhánh verify nếu `TURNSTILE_SECRET_KEY` được set — khi đó mọi Try Demo sẽ lỗi cho đến khi SPA gửi token.

**Production Try Demo:** giữ `TURNSTILE_SECRET_KEY` **unset** trên Supabase. Không cần `VITE_TURNSTILE_SITE_KEY` cho luồng Try Demo hiện tại.

Khi sau này client gửi `turnstileToken` (widget + site key): tạo widget Cloudflare, set `VITE_TURNSTILE_SITE_KEY` trên Vercel, rồi mới set `TURNSTILE_SECRET_KEY` trên Edge.

Public Sign up / `signup-demo` **không** còn là đường vào production.
