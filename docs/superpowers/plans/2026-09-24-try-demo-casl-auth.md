# Try Demo + CASL Auth Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace public Sign up/Login with Try Demo (Edge Function session mint) plus CASL `demo`/`owner` UI gates, keeping nightly Demo Reset.

**Architecture:** Public visitors call Edge Function `try-demo`, which ensures a shared Auth user (`app_metadata.role=demo`) and returns session tokens; the SPA calls `setSession` and loads CASL abilities. Owner uses a hidden email/password form on `/login`. Manual Demo Reset and Account UI are CASL-gated to `owner`. Postgres RLS, Write Quota, and nightly `reset-demo` stay as-is.

**Tech Stack:** React 18, Vite, Supabase JS + Edge Functions (Deno), `@casl/ability` + `@casl/react`, React Query, Styled Components, existing GitHub Actions nightly reset.

## Global Constraints

- No demo password or `service_role` in `VITE_*` / frontend bundle.
- Roles only from `user.app_metadata.role`: `"demo"` | `"owner"`; missing/unknown → treat as `demo`.
- CASL is UI-only; DB RLS + write triggers remain authoritative.
- Do not remove or break nightly GitHub Action → `reset-demo`.
- Do not add public “Try as Owner”.
- Prefer smallest diff; reuse existing Login / apiAuth / ProtectedRoute patterns.
- Commits: only when the human explicitly asks (user git rule); otherwise stop at “ready to commit” and show `git status` / suggested message.

---

## File map

| File | Responsibility |
|------|----------------|
| `src/features/casl/ability.js` | Pure `defineAbilityFor(user)` |
| `src/features/casl/AbilityContext.jsx` | AbilityProvider + `Can` re-export |
| `src/features/casl/ability.check.mjs` | Node assert self-check for abilities |
| `supabase/functions/try-demo/index.ts` | Mint shared demo session |
| `src/services/apiAuth.js` | Add `tryDemo()`; keep login/logout/getUser |
| `src/features/authentication/useTryDemo.js` | Mutation hook for Try Demo |
| `src/pages/Login.jsx` | Try Demo CTA + hidden owner form |
| `src/ui/Logo.jsx` | Optional `onSecretClick` for owner gate |
| `src/App.jsx` | Wrap authenticated tree with AbilityProvider; account route guard |
| `src/ui/HeaderMenu.jsx` | Hide Account when cannot `update` `Account` |
| `src/features/demo/DemoResetPanel.jsx` | Render only when can `reset` `DemoSandbox` |
| `src/pages/Account.jsx` | Redirect if cannot update Account |
| Docs: `CONTEXT.md`, `README.md`, `docs/architecture.md`, `docs/configuration.md`, `docs/deploy.md`, `.env.example` | Auth flow + secrets |

**Out of scope for code deletion (follow-up OK):** deleting `signup-demo` function files / `SignupForm.jsx` hard-delete — remove from Login UX only; leave unused files unless trivial to delete in the same task.

---

### Task 1: CASL ability module + self-check

**Files:**
- Create: `src/features/casl/ability.js`
- Create: `src/features/casl/ability.check.mjs`
- Modify: `package.json` (add `@casl/ability`, `@casl/react`; add script `check:ability`)

**Interfaces:**
- Produces: `defineAbilityFor(user)` → CASL `Ability`
  - `user.app_metadata.role === "owner"` → `can("manage", "all")`
  - otherwise → hotel CRUD on `Cabin` | `Booking` | `Settings` | `HotelGuest`; **cannot** `update` `Account`; **cannot** `reset` `DemoSandbox`

- [ ] **Step 1: Install CASL packages**

```bash
cd "c:/Users/trans/OneDrive/Desktop/GitHub/the-wild-oasis-admin"
npm install @casl/ability @casl/react
```

Expected: packages appear in `package.json` dependencies.

- [ ] **Step 2: Write failing self-check**

Create `src/features/casl/ability.check.mjs`:

```js
import assert from "node:assert/strict";
import { defineAbilityFor } from "./ability.js";

const demo = defineAbilityFor({ app_metadata: { role: "demo" } });
assert.equal(demo.can("create", "Cabin"), true);
assert.equal(demo.can("update", "Account"), false);
assert.equal(demo.can("reset", "DemoSandbox"), false);

const owner = defineAbilityFor({ app_metadata: { role: "owner" } });
assert.equal(owner.can("update", "Account"), true);
assert.equal(owner.can("reset", "DemoSandbox"), true);

const unknown = defineAbilityFor({ app_metadata: {} });
assert.equal(unknown.can("update", "Account"), false);

console.log("ability.check: ok");
```

Add to `package.json` scripts: `"check:ability": "node src/features/casl/ability.check.mjs"`

- [ ] **Step 3: Run check — expect FAIL**

```bash
npm run check:ability
```

Expected: FAIL (module `./ability.js` missing or `defineAbilityFor` not exported).

- [ ] **Step 4: Implement `defineAbilityFor`**

Create `src/features/casl/ability.js`:

```js
import { AbilityBuilder, createMongoAbility } from "@casl/ability";

export function defineAbilityFor(user) {
  const { can, cannot, build } = new AbilityBuilder(createMongoAbility);
  const role = user?.app_metadata?.role;

  if (role === "owner") {
    can("manage", "all");
  } else {
    can("read", ["Cabin", "Booking", "Settings", "HotelGuest"]);
    can("create", ["Cabin", "Booking", "Settings", "HotelGuest"]);
    can("update", ["Cabin", "Booking", "Settings", "HotelGuest"]);
    can("delete", ["Cabin", "Booking", "Settings", "HotelGuest"]);
    cannot("update", "Account");
    cannot("reset", "DemoSandbox");
  }

  return build();
}
```

- [ ] **Step 5: Run check — expect PASS**

```bash
npm run check:ability
```

Expected: `ability.check: ok`

- [ ] **Step 6: Ready to commit (ask human first)**

Suggested message: `feat: add CASL defineAbilityFor for demo and owner roles`

---

### Task 2: AbilityProvider

**Files:**
- Create: `src/features/casl/AbilityContext.jsx`
- Modify: `src/App.jsx` (wrap protected layout children)

**Interfaces:**
- Consumes: `defineAbilityFor` from `./ability.js`; `useUser` from authentication
- Produces: `<AbilityProvider>` wrapping authenticated app; re-exports `Can` from `@casl/react`

- [ ] **Step 1: Create AbilityContext**

```jsx
import { createContext } from "react";
import { createContextualCan } from "@casl/react";
import { defineAbilityFor } from "./ability";
import useUser from "../authentication/useUser";

export const AbilityContext = createContext();
export const Can = createContextualCan(AbilityContext.Consumer);

export function AbilityProvider({ children }) {
  const { user } = useUser();
  const ability = defineAbilityFor(user);

  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
}
```

- [ ] **Step 2: Wire into ProtectedRoute tree in `App.jsx`**

Wrap `AppLayout` (inside `ProtectedRoute`) so abilities only load when authenticated:

```jsx
import { AbilityProvider } from "./features/casl/AbilityContext";

// inside the authenticated layout route element:
<ProtectedRoute>
  <AbilityProvider>
    <AppLayout />
  </AbilityProvider>
</ProtectedRoute>
```

- [ ] **Step 3: Smoke check**

```bash
npm run lint
npm run check:ability
```

Expected: lint clean (or only pre-existing issues); ability check OK. Dev server still boots (`npm run dev`).

- [ ] **Step 4: Ready to commit (ask human first)**

Suggested message: `feat: wire CASL AbilityProvider into authenticated app tree`

---

### Task 3: Edge Function `try-demo`

**Files:**
- Create: `supabase/functions/try-demo/index.ts`
- Modify: `docs/configuration.md` (document `DEMO_USER_EMAIL`, `DEMO_USER_PASSWORD` Edge secrets)
- Modify: `.env.example` (note those secrets are Edge-only, not Vite)

**Interfaces:**
- Produces: `POST` → `{ access_token, refresh_token, expires_in?, expires_at?, token_type? }` or `{ error }`
- Consumes secrets: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY`, `DEMO_USER_EMAIL`, `DEMO_USER_PASSWORD`
- Optional: if `TURNSTILE_SECRET_KEY` set, require `turnstileToken` in body and verify (same pattern as `signup-demo`); v1 default path skips when secret unset

- [ ] **Step 1: Implement function**

Create `supabase/functions/try-demo/index.ts` mirroring CORS/json helpers from `signup-demo`:

```ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return json({ error: "Method not allowed" }, 405);
    }

    const body = await req.json().catch(() => ({}));
    const turnstileSecret = Deno.env.get("TURNSTILE_SECRET_KEY");
    if (turnstileSecret) {
      const turnstileToken = body?.turnstileToken;
      if (!turnstileToken) {
        return json({ error: "Turnstile token required" }, 400);
      }
      const form = new FormData();
      form.append("secret", turnstileSecret);
      form.append("response", turnstileToken);
      const verifyRes = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        { method: "POST", body: form }
      );
      const verifyJson = await verifyRes.json();
      if (!verifyJson.success) {
        return json({ error: "Turnstile verification failed" }, 400);
      }
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const email = Deno.env.get("DEMO_USER_EMAIL");
    const password = Deno.env.get("DEMO_USER_PASSWORD");

    if (!email || !password) {
      return json({ error: "Demo user is not configured" }, 500);
    }

    const admin = createClient(supabaseUrl, serviceKey);

    const { data: created, error: createError } =
      await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        app_metadata: { role: "demo" },
        user_metadata: { full_name: "Demo Operator", avatar: "" },
      });

    if (createError) {
      const msg = createError.message?.toLowerCase() ?? "";
      const already =
        msg.includes("already") || msg.includes("registered") ||
        createError.status === 422;
      if (!already) {
        return json({ error: createError.message }, 400);
      }

      // Ensure role on existing user: list by email via generate lookup
      const { data: listed } = await admin.auth.admin.listUsers({
        page: 1,
        perPage: 200,
      });
      const existing = listed?.users?.find(
        (u) => u.email?.toLowerCase() === email.toLowerCase()
      );
      if (existing && existing.app_metadata?.role !== "demo") {
        await admin.auth.admin.updateUserById(existing.id, {
          app_metadata: { ...existing.app_metadata, role: "demo" },
        });
      }
    } else if (created.user && created.user.app_metadata?.role !== "demo") {
      await admin.auth.admin.updateUserById(created.user.id, {
        app_metadata: { role: "demo" },
      });
    }

    const anon = createClient(supabaseUrl, anonKey);
    const { data: sessionData, error: signError } =
      await anon.auth.signInWithPassword({ email, password });

    if (signError || !sessionData.session) {
      return json(
        { error: signError?.message ?? "Could not create demo session" },
        400
      );
    }

    const s = sessionData.session;
    return json({
      access_token: s.access_token,
      refresh_token: s.refresh_token,
      expires_in: s.expires_in,
      expires_at: s.expires_at,
      token_type: s.token_type ?? "bearer",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return json({ error: message }, 500);
  }
});
```

- [ ] **Step 2: Document secrets**

In `docs/configuration.md` and `.env.example`, add Edge-only secrets:

- `DEMO_USER_EMAIL`
- `DEMO_USER_PASSWORD`

State clearly: never put these in Vite `.env`.

Document one-time owner setup: create user in Supabase Auth dashboard; set `app_metadata.role` to `"owner"` via SQL or Admin API.

- [ ] **Step 3: Deploy note (manual ops)**

Document (do not auto-run unless human asks):

```bash
supabase functions deploy try-demo
supabase secrets set DEMO_USER_EMAIL=demo@example.com DEMO_USER_PASSWORD='...'
```

- [ ] **Step 4: Ready to commit (ask human first)**

Suggested message: `feat: add try-demo Edge Function to mint shared demo session`

---

### Task 4: Client `tryDemo` + Login UX

**Files:**
- Modify: `src/services/apiAuth.js`
- Create: `src/features/authentication/useTryDemo.js`
- Modify: `src/pages/Login.jsx`
- Modify: `src/ui/Logo.jsx` (accept optional `onClick` / `onSecretClick`)
- Modify: `src/features/authentication/LoginForm.jsx` only if needed for reuse on owner gate (prefer reuse as-is)

**Interfaces:**
- Consumes: `supabase.functions.invoke("try-demo")`, then `supabase.auth.setSession`
- Produces: `tryDemo()` → session user; `useTryDemo()` → `{ tryDemo, isPending }`

- [ ] **Step 1: Add `tryDemo` to apiAuth**

```js
export async function tryDemo() {
  const { data, error } = await supabase.functions.invoke("try-demo", {
    body: {},
  });

  if (error) {
    throw new Error(error.message || "Try Demo failed");
  }
  if (data?.error) {
    throw new Error(data.error);
  }
  if (!data?.access_token || !data?.refresh_token) {
    throw new Error("Try Demo returned no session");
  }

  const { data: sessionData, error: sessionError } =
    await supabase.auth.setSession({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    });

  if (sessionError) {
    throw new Error(sessionError.message);
  }

  return sessionData;
}
```

Keep `Login`, `logout`, `getCurrentUser`, `UpdateCurrentUser`. Leave `signup` in file unused or delete only if nothing imports it after Login rewrite (grep first).

- [ ] **Step 2: Hook `useTryDemo`**

Mirror `useLogin.js`: on success invalidate `["user"]`, `navigate("/dashboard")`, toast error on failure.

- [ ] **Step 3: Logo secret click**

Update `Logo.jsx` to accept optional `onClick` on the image/wrapper so Login can count clicks.

- [ ] **Step 4: Rewrite `Login.jsx`**

- Default: Logo, DemoStatusBanner, heading (“Try the Demo Sandbox”), short copy (shared data + nightly reset), primary **Try Demo** button.
- State `showOwner`: true if `useSearchParams().get("owner") === "1"` OR Logo clicked 5 times.
- When `showOwner`: render existing `LoginForm` below (no Sign up toggle, no SignupForm).
- Remove public Sign up mode entirely.

- [ ] **Step 5: Manual verify (local, after function deployed or mocked)**

With function available:

1. Open `/login` → only Try Demo visible.
2. Click Try Demo → `/dashboard`, authenticated.
3. Click Logo 5× → owner form appears; `?owner=1` also shows form.

Without live function: unit-level — `tryDemo` throws clear error; toast shows; stay on `/login`.

- [ ] **Step 6: Ready to commit (ask human first)**

Suggested message: `feat: replace public signup with Try Demo and hidden owner login`

---

### Task 5: Gate Account + Demo Reset with CASL

**Files:**
- Modify: `src/ui/HeaderMenu.jsx`
- Modify: `src/pages/Account.jsx`
- Modify: `src/features/demo/DemoResetPanel.jsx` (or `src/pages/Settings.jsx` wrapping the panel)

**Interfaces:**
- Consumes: `Can` from `features/casl/AbilityContext`; `useAbility` / `useContext(AbilityContext)` for redirect

- [ ] **Step 1: HeaderMenu — hide Account**

```jsx
import { Can } from "../features/casl/AbilityContext";

// wrap the Account <li>:
<Can I="update" a="Account">
  <li>
    <ButtonIcon onClick={() => navigate("/account")}>
      <HiOutlineUser />
    </ButtonIcon>
  </li>
</Can>
```

Keep DarkMode + Logout always.

- [ ] **Step 2: Account page redirect**

In `Account.jsx`, if ability cannot `update` `Account`, `<Navigate to="/dashboard" replace />`.

- [ ] **Step 3: DemoResetPanel**

Wrap entire panel return in `<Can I="reset" a="DemoSandbox">...</Can>` (renders nothing for demo).

- [ ] **Step 4: Acceptance against matrix**

As `demo` session: no Account icon; `/account` redirects; Settings has no Reset panel; cabin CRUD still works.  
As `owner`: Account + Reset visible.

- [ ] **Step 5: Ready to commit (ask human first)**

Suggested message: `feat: gate Account and Demo Reset behind CASL owner abilities`

---

### Task 6: Docs + CONTEXT language

**Files:**
- Modify: `CONTEXT.md` — Demo Operator = visitor who enters via Try Demo (shared demo session), not self-registered account
- Modify: `README.md` — remove public Sign up wording; document Try Demo + owner gate + CASL briefly
- Modify: `docs/architecture.md` — replace Sign up flow with `try-demo`; keep reset diagram
- Modify: `docs/configuration.md` — Edge secrets; deprecate Turnstile-for-signup as required path
- Modify: `docs/deploy.md` — deploy `try-demo`, set secrets, create owner user with `app_metadata.role=owner`

- [ ] **Step 1: Update glossary + README + architecture to match spec**

- [ ] **Step 2: Deploy checklist adds**

1. Deploy `try-demo`
2. Set `DEMO_USER_EMAIL` / `DEMO_USER_PASSWORD`
3. Create owner user + `role=owner`
4. Confirm nightly Action still calls `reset-demo` only

- [ ] **Step 3: Ready to commit (ask human first)**

Suggested message: `docs: document Try Demo, CASL roles, and demo Edge secrets`

---

### Task 7: End-to-end acceptance

**Files:** none (verification only)

- [ ] **Step 1: Run automated checks**

```bash
npm run check:ability
npm run lint
npm run build
```

Expected: all succeed.

- [ ] **Step 2: Manual checklist (from spec)**

1. Try Demo → dashboard as `demo`
2. `demo`: hotel CRUD OK; no Account; no manual Reset UI
3. Owner gate → Account + Reset; manual reset works
4. Confirm `.github/workflows` nightly reset unchanged
5. Grep frontend for `DEMO_USER_PASSWORD` / `service_role` — must be absent from `src/` and `VITE_*`

- [ ] **Step 3: Stop and report**

List any gaps (e.g. function not deployed yet). Do not commit unless human asks.

---

## Spec coverage (self-review)

| Spec requirement | Task |
|------------------|------|
| Try Demo button / no public Sign up | 4 |
| Edge `try-demo` session mint | 3 |
| No password in Vite | 3, 4, 7 |
| CASL demo/owner matrix | 1, 5 |
| AbilityProvider | 2 |
| Hidden owner gate | 4 |
| Gate Account + Reset | 5 |
| Keep nightly reset | 3 (no change to reset), 6–7 verify |
| Docs / CONTEXT | 6 |
| Acceptance checks | 7 |

**Placeholders:** none intentional.  
**Type consistency:** `tryDemo` / `defineAbilityFor` / subjects `Account` & `DemoSandbox` used consistently across tasks.
