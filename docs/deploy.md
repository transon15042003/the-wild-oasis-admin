# Checklist deploy (Demo Sandbox)

Các bước đưa app lên **Vercel + Supabase Free**. Kiến trúc: [architecture.md](architecture.md). Cấu hình chi tiết: [configuration.md](configuration.md).

Production hiện tại (tham khảo): `https://the-wild-oasis-admin-transon.vercel.app`

## 1. Supabase Auth

1. [Auth → Providers → Email](https://supabase.com/dashboard/project/tpzkqxwytqlubdvdszlz/auth/providers) — **tắt Confirm email**.
2. [Auth → URL configuration](https://supabase.com/dashboard/project/tpzkqxwytqlubdvdszlz/auth/url-configuration):
   - **Site URL**: domain Vercel production
   - **Redirect URLs**: Site URL + `http://localhost:5173`

## 2. Shared demo user + owner (một lần)

1. Tạo user demo trong Authentication → Users (email/password dùng cho Edge secrets — **không** commit, **không** `VITE_*`).
2. Gán `app_metadata.role` = `"demo"` nếu tạo thủ công (hoặc để `try-demo` tạo lần đầu).
3. Tạo user **owner** riêng (email/mật khẩu khác demo). Gán `app_metadata.role` = `"owner"` (SQL Editor hoặc Admin API `updateUserById`).

## 3. Supabase Edge Function secrets

[Edge Functions → Secrets](https://supabase.com/dashboard/project/tpzkqxwytqlubdvdszlz/settings/functions):

| Secret | Mục đích |
|--------|----------|
| `RESET_CRON_SECRET` | Nightly Demo Reset từ GitHub Actions |
| `DEMO_USER_EMAIL` | Email user demo dùng chung (`try-demo`) |
| `DEMO_USER_PASSWORD` | Mật khẩu user demo (Edge only) |
| `TURNSTILE_SECRET_KEY` | **Không set cho Try Demo v1** — client gửi `{}`; set secret sẽ làm Try Demo fail (Edge-ready, chưa client-wired) |

Deploy functions:

```bash
supabase functions deploy try-demo
supabase functions deploy reset-demo
supabase secrets set DEMO_USER_EMAIL=... DEMO_USER_PASSWORD='...'
```

Functions trong project:

- `try-demo` — Try Demo session mint (entry công khai)
- `reset-demo` — Demo Reset (JWT owner hoặc cron secret)

**Nightly reset:** GitHub Action `.github/workflows/nightly-demo-reset.yml` vẫn **chỉ** gọi `reset-demo` (không đổi).

## 4. GitHub Actions secrets

Repo → **Settings → Secrets and variables → Actions**:

| Secret | Giá trị |
|--------|---------|
| `SUPABASE_URL` | `https://tpzkqxwytqlubdvdszlz.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Dashboard → API → `service_role` |
| `RESET_CRON_SECRET` | Cùng giá trị secret trên Supabase |

Workflows:

- `.github/workflows/keep-supabase-alive.yml`
- `.github/workflows/nightly-demo-reset.yml` → `reset-demo` scheduled

## 5. Cloudflare Turnstile (bỏ qua cho Try Demo v1)

SPA `tryDemo()` gửi `body: {}` — không có `turnstileToken`. **Không** set `TURNSTILE_SECRET_KEY` trên Supabase cho production Try Demo; nếu set, Edge yêu cầu token và Try Demo trả lỗi.

Turnstile trên Edge `try-demo` là tuỳ chọn cho tương lai (site key + client token). Chi tiết: [configuration.md — Turnstile](configuration.md).

## 6. Vercel

1. Repo đã gắn project `the-wild-oasis-admin` (framework Vite).
2. Environment Variables (Production):

| Name | Giá trị |
|------|---------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Anon key |
| `VITE_TURNSTILE_SITE_KEY` | (tuỳ chọn) |

3. Đảm bảo `vercel.json` (SPA rewrite) có trên nhánh deploy.
4. Push `main` → đợi deploy **READY** → cập nhật Auth Site URL nếu chưa đúng.

## 7. Smoke test

1. Mở production → **Try Demo** → Dashboard.  
2. Tạo/sửa cabin (role demo).  
3. Owner gate → login → Settings → Reset demo data → Maintenance Window ngắn.  
4. Actions → Nightly Demo Reset → HTTP 200 (endpoint `reset-demo` only).  
5. Actions → Keep Supabase Alive → HTTP 200.  

## Tóm tắt hành vi

- Shared hotel data cho mọi Demo Operator (một session demo dùng chung)  
- Auth accounts sống sót qua Demo Reset  
- Reset lịch: 00:00 UTC, Maintenance ~30 phút (`reset-demo` từ Actions)  
- Reset thủ công: owner + CASL, Maintenance ~5 phút, 1 lần/user/24h  
- Write quota: 60 mutate/giờ/user (demo user chia một bucket)
