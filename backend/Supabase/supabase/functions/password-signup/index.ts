// deno-lint-ignore-file
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as bcrypt from "https://esm.sh/bcryptjs@2.4.3";
import { corsHeaders } from "../_shared/cors.ts";

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  try {
    if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
    if (req.method !== "POST") return json(405, { error: "Use POST" });

    let body: {
      phone?: string;
      name?: string | null;
      password?: string;
      user_details?: unknown;
    };
    try {
      body = await req.json();
    } catch {
      return json(400, { error: "Body must be JSON" });
    }

    const phone = body.phone?.trim();
    const password = body.password;
    if (!phone) return json(400, { error: "Missing phone" });
    if (!password || typeof password !== "string" || password.length < 6) {
      return json(400, { error: "Password must be at least 6 characters" });
    }

    const projectUrl = Deno.env.get("PROJECT_URL");
    const serviceRoleKey = Deno.env.get("SERVICE_ROLE_KEY");
    if (!projectUrl || !serviceRoleKey) {
      return json(500, {
        error: "Missing PROJECT_URL or SERVICE_ROLE_KEY",
        projectUrlPresent: Boolean(projectUrl),
        serviceRoleKeyPresent: Boolean(serviceRoleKey),
      });
    }

    const supabase = createClient(projectUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // esm.sh can expose bcryptjs in different shapes (sometimes under `default`).
    const bcryptLib: any = (bcrypt as any).default ?? bcrypt;
    const passwordHash = await bcryptLib.hash(password, 10);
    const row: Record<string, unknown> = { phone, password_hash: passwordHash };
    if (typeof body.name !== "undefined") row.name = body.name;
    if (typeof body.user_details !== "undefined") row.user_details = body.user_details;

    const { error } = await supabase.from("users").upsert(row, { onConflict: "phone" });
    if (error) return json(500, { error: error.message });

    return json(200, { ok: true, phone });
  } catch (err) {
    return json(500, {
      error: "Unhandled exception",
      details: err instanceof Error ? err.message : String(err),
    });
  }
});

