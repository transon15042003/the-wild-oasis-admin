# Vận hành (operations)

Cách hệ thống chạy hàng ngày sau khi đã deploy. Cấu hình chi tiết: [configuration.md](configuration.md). Thuật ngữ: [CONTEXT.md](../CONTEXT.md).

## Keep-alive (Supabase Free)

Free tier có thể **pause** project sau ~7 ngày ít hoạt động. Workflow **Keep Supabase Alive** ping:

`GET /rest/v1/settings?select=id&limit=1`

với `service_role`, lịch Chủ nhật và thứ Tư. Có thể chạy thủ công từ tab Actions.

**Lưu ý:** `pg_cron` trong DB **không** đủ một mình — khi project pause thì cron trong DB cũng dừng. Xem [ADR-0003](adr/0003-external-scheduler.md).

## Demo Reset theo lịch

- **Khi:** 00:00 UTC mỗi ngày (`nightly-demo-reset.yml`).
- **Làm gì:** Edge `reset-demo` + RPC `run_demo_reset` → seed lại hotel data.
- **Maintenance Window:** khoảng **30 phút** (`maintenance_until`).
- **Giữ nguyên:** Auth accounts, avatars.

Trong cửa sổ bảo trì:

- UI: `MaintenanceScreen` chặn toàn app (kể cả login).
- DB: trigger từ chối mọi mutate trên hotel tables (kể cả session cũ).

## Demo Reset thủ công

- **Ở đâu:** Settings → “Reset demo data”.
- **Cảnh báo:** ảnh hưởng **mọi** Demo Operator (shared data).
- **Maintenance:** ~**5 phút**.
- **Cooldown:** 1 lần / user / 24 giờ (`write_quota.last_manual_reset_at` + RPC `can_manual_demo_reset`).

## Write quota

- **Đếm:** INSERT / UPDATE / DELETE trên `cabins`, `guests`, `bookings`, `settings`.
- **Giới hạn:** **60 write / giờ / user** (cửa sổ theo giờ).
- **Không siết:** SELECT / đọc dashboard.
- **Enforce:** trigger Postgres — bot bỏ qua UI vẫn bị chặn. Xem [ADR-0002](adr/0002-postgres-write-guards.md).

## Bảng trạng thái

| Bảng / cột | Ý nghĩa |
|------------|---------|
| `demo_meta.maintenance_until` | Hết hạn Maintenance Window |
| `demo_meta.last_reset_at` | Lần Demo Reset gần nhất |
| `demo_meta.next_scheduled_reset_at` | Mốc reset lịch tiếp theo (UI banner) |
| `write_quota.write_count` | Số write trong `window_start` hiện tại |
| `write_quota.last_manual_reset_at` | Cooldown nút reset thủ công |

## Smoke test định kỳ

1. Sign up / login trên production.  
2. Sửa một cabin (kiểm tra write bình thường).  
3. (Tuỳ chọn) Manual reset → thấy Maintenance → sau vài phút dùng lại.  
4. Actions → chạy Keep Alive và Nightly Reset → HTTP 200.  

## Khi có sự cố

| Hiện tượng | Kiểm tra |
|------------|----------|
| App trắng / thiếu data | Env `VITE_SUPABASE_*` trên Vercel đã set + Redeploy chưa? |
| `/login` 404 | `vercel.json` đã deploy chưa? |
| Sign up lỗi Turnstile | Site key + `TURNSTILE_SECRET_KEY` khớp? |
| Write bị reject | Đang Maintenance? Hết quota 60/giờ? |
| Nightly fail | `RESET_CRON_SECRET` trùng giữa GitHub và Supabase? |
| Project pause | Keep-alive secrets + workflow có chạy? |
