import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-reset-cron-secret",
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
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const cronSecret = Deno.env.get("RESET_CRON_SECRET") ?? "";
    const admin = createClient(supabaseUrl, serviceKey);

    const cronHeader = req.headers.get("x-reset-cron-secret");
    const isCron = Boolean(cronSecret && cronHeader === cronSecret);

    let mode: "scheduled" | "manual" = isCron ? "scheduled" : "manual";
    let userId: string | null = null;

    if (!isCron) {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader?.startsWith("Bearer ")) {
        return json({ error: "Unauthorized" }, 401);
      }

      const anon = createClient(
        supabaseUrl,
        Deno.env.get("SUPABASE_ANON_KEY")!,
        { global: { headers: { Authorization: authHeader } } }
      );
      const {
        data: { user },
        error: userError,
      } = await anon.auth.getUser();
      if (userError || !user) {
        return json({ error: "Unauthorized" }, 401);
      }
      userId = user.id;

      const body = await req.json().catch(() => ({}));
      if (body?.mode === "scheduled") {
        return json({ error: "Scheduled mode requires cron secret" }, 403);
      }

      const { data: canReset, error: canErr } = await admin.rpc(
        "can_manual_demo_reset",
        { p_user_id: userId }
      );
      if (canErr) return json({ error: canErr.message }, 500);
      if (canReset === false) {
        return json(
          { error: "Manual Demo Reset allowed once per 24 hours per user." },
          429
        );
      }
      mode = "manual";
    }

    const minutes = mode === "scheduled" ? 30 : 5;
    const { data, error } = await admin.rpc("run_demo_reset", {
      p_maintenance_minutes: minutes,
    });
    if (error) return json({ error: error.message }, 500);

    if (userId) {
      const hourStart = new Date();
      hourStart.setMinutes(0, 0, 0);
      await admin.from("write_quota").upsert({
        user_id: userId,
        last_manual_reset_at: new Date().toISOString(),
        window_start: hourStart.toISOString(),
        write_count: 0,
      });
    }

    return json({ ok: true, mode, result: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return json({ error: message }, 500);
  }
});
