// deno-lint-ignore-file
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function getPhone(url: URL) {
  return url.searchParams.get("phone")?.trim() ?? null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json(405, { error: "Use POST" });

  const url = new URL(req.url);
  const queryPhone = getPhone(url);

  let body: { phone?: string; name?: string | null; user_details?: unknown } = {};
  try {
    body = await req.json();
  } catch {
    return json(400, { error: "Body must be JSON" });
  }

  const phone = body.phone?.trim() || queryPhone;
  if (!phone) return json(400, { error: "Missing phone (body.phone or ?phone=)" });

  const projectUrl = Deno.env.get("PROJECT_URL");
  const serviceRoleKey = Deno.env.get("SERVICE_ROLE_KEY");
  if (!projectUrl || !serviceRoleKey) {
    return json(500, { error: "Missing PROJECT_URL or SERVICE_ROLE_KEY" });
  }

  const supabase = createClient(projectUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const row: Record<string, unknown> = { phone };
  if (typeof body.name !== "undefined") row.name = body.name;
  if (typeof body.user_details !== "undefined") row.user_details = body.user_details;

  const { error } = await supabase.from("users").upsert(row, { onConflict: "phone" });
  if (error) return json(500, { error: error.message });

  return json(200, { ok: true, phone });
});

