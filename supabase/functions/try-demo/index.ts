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
        msg.includes("already") ||
        msg.includes("registered") ||
        createError.status === 422;
      if (!already) {
        return json({ error: createError.message }, 400);
      }

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
