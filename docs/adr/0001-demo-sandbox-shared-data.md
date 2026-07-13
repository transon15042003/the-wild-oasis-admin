# Shared Demo Sandbox data model

The product is a public portfolio Demo Sandbox, not a real multi-tenant hotel. We keep one shared set of hotel tables for every Demo Operator and restore it with a global Demo Reset, instead of isolating data per account.

**Status:** accepted

## Considered Options

- **Shared sandbox + global reset** (chosen) — simple schema/RLS; matches course-style demo UX; dirty data is expected until the next reset.
- **Per-user tenant** — cleaner isolation, but much heavier schema, seed, reset, and Free-tier cost.

## Consequences

- Manual “Reset demo data” must warn that it affects everyone.
- Rate limits, Maintenance Windows, and Turnstile matter more because abuse hits the same dataset.
