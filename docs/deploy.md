# Checklist deploy (Demo Sandbox)

Các bước đưa app lên **Vercel + Supabase Free**. Kiến trúc: [architecture.md](architecture.md). Cấu hình chi tiết: [configuration.md](configuration.md).

Production hiện tại (tham khảo): `https://the-wild-oasis-admin-transon.vercel.app`

## 1. Supabase Auth

1. [Auth → Providers → Email](https://supabase.com/dashboard/project/tpzkqxwytqlubdvdszlz/auth/providers) — **tắt Confirm email**.
2. [Auth → URL configuration](https://supabase.com/dashboard/project/tpzkqxwytqlubdvdszlz/auth/url-configuration):
   - **Site URL**: domain Vercel production
   - **Redirect URLs**: Site URL + `http://localhost:5173`

## 2. Supabase Edge Function secrets

[Edge Functions → Secrets](https://supabase.com/dashboard/project/tpzkqxwytqlubdvdszlz/settings/functions):

| Secret | Mục đích |
|--------|----------|
| `RESET_CRON_SECRET` | Nightly Demo Reset từ GitHub Actions |
| `TURNSTILE_SECRET_KEY` | Verify Turnstile (tuỳ chọn) |

Functions đã có trong project:

- `signup-demo` — Sign up + Turnstile (nếu bật)
- `reset-demo` — Demo Reset (JWT hoặc cron secret)

## 3. GitHub Actions secrets

Repo → **Settings → Secrets and variables → Actions**:

| Secret | Giá trị |
|--------|---------|
| `SUPABASE_URL` | `https://tpzkqxwytqlubdvdszlz.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Dashboard → API → `service_role` |
| `RESET_CRON_SECRET` | Cùng giá trị secret trên Supabase |

Workflows:

- `.github/workflows/keep-supabase-alive.yml`
- `.github/workflows/nightly-demo-reset.yml`

## 4. Cloudflare Turnstile (khuyến nghị)

1. Tạo widget tại [Cloudflare Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile).
2. `VITE_TURNSTILE_SITE_KEY` trên Vercel (và `.env` local).
3. `TURNSTILE_SECRET_KEY` trên Supabase.
4. Không có key → Sign up local vẫn chạy (dev bypass).

## 5. Vercel

1. Repo đã gắn project `the-wild-oasis-admin` (framework Vite).
2. Environment Variables (Production):

| Name | Giá trị |
|------|---------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Anon key |
| `VITE_TURNSTILE_SITE_KEY` | (tuỳ chọn) |

3. Đảm bảo `vercel.json` (SPA rewrite) có trên nhánh deploy.
4. Push `main` → đợi deploy **READY** → cập nhật Auth Site URL nếu chưa đúng.

## 6. Smoke test

1. Mở production → Sign up → Dashboard.  
2. Tạo/sửa cabin.  
3. Settings → Reset demo data → Maintenance Window ngắn.  
4. Actions → Nightly Demo Reset → HTTP 200.  
5. Actions → Keep Supabase Alive → HTTP 200.  

## Tóm tắt hành vi

- Shared hotel data cho mọi Demo Operator  
- Auth accounts sống sót qua Demo Reset  
- Reset lịch: 00:00 UTC, Maintenance ~30 phút  
- Reset thủ công: Maintenance ~5 phút, 1 lần/user/24h  
- Write quota: 60 mutate/giờ/user  
