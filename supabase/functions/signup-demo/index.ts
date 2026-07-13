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

    const { fullName, email, password, turnstileToken } = await req.json();
    if (!fullName || !email || !password) {
      return json({ error: "Missing required fields" }, 400);
    }

    const turnstileSecret = Deno.env.get("TURNSTILE_SECRET_KEY");
    if (turnstileSecret) {
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

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        avatar: "",
      },
    });

    if (error) {
      return json({ error: error.message }, 400);
    }

    return json({ ok: true, userId: data.user?.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return json({ error: message }, 500);
  }
});
