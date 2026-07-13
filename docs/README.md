# Tài liệu kỹ thuật

Mục lục tài liệu cho **The Wild Oasis Admin** (Demo Sandbox).

Giải thích viết bằng tiếng Việt; thuật ngữ domain giữ tiếng Anh theo [CONTEXT.md](../CONTEXT.md).

## Đọc trước

| File | Nội dung |
|------|----------|
| [../CONTEXT.md](../CONTEXT.md) | Glossary (Demo Operator, Demo Sandbox, …) |
| [architecture.md](architecture.md) | Kiến trúc tổng thể và luồng dữ liệu |
| [configuration.md](configuration.md) | Env, secrets, Auth URL, Turnstile |
| [operations.md](operations.md) | Keep-alive, Demo Reset, Maintenance Window, quota |
| [deploy.md](deploy.md) | Checklist đưa lên Vercel + Supabase |

## Quyết định kiến trúc (ADR)

| ADR | Chủ đề |
|-----|--------|
| [adr/0001-demo-sandbox-shared-data.md](adr/0001-demo-sandbox-shared-data.md) | Shared hotel data + Demo Reset toàn cục |
| [adr/0002-postgres-write-guards.md](adr/0002-postgres-write-guards.md) | Enforce maintenance/quota tại Postgres |
| [adr/0003-external-scheduler.md](adr/0003-external-scheduler.md) | GitHub Actions thay vì chỉ pg_cron |
