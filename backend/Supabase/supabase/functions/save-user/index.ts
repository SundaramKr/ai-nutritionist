// deno-lint-ignore-file
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

type SaveUserBody =
  | {
      type: "details";
      name?: string | null;
      user_details: unknown;
    }
  | {
      type: "plan";
      meal_plan: unknown;
      name?: string | null;
      user_details?: unknown;
    };

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function getPhone(url: URL) {
  const phone = url.searchParams.get("phone")?.trim();
  if (!phone) return null;
  return phone;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json(405, { error: "Use POST" });

  const url = new URL(req.url);
  const phone = getPhone(url);
  if (!phone) return json(400, { error: "Missing ?phone=" });

  let body: SaveUserBody;
  try {
    body = await req.json();
  } catch {
    return json(400, { error: "Body must be JSON" });
  }

  const supabaseUrl = Deno.env.get("PROJECT_URL");
  const serviceRoleKey = Deno.env.get("SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    return json(500, { error: "Missing PROJECT_URL or SERVICE_ROLE_KEY" });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // Always ensure user exists (upsert).
  const baseUserRow: Record<string, unknown> = { phone };
  if ("name" in body && typeof body.name !== "undefined") baseUserRow.name = body.name;
  if (body.type === "details") baseUserRow.user_details = body.user_details;
  if (body.type === "plan" && typeof body.user_details !== "undefined") {
    baseUserRow.user_details = body.user_details;
  }

  const { error: upsertErr } = await supabase
    .from("users")
    .upsert(baseUserRow, { onConflict: "phone" });

  if (upsertErr) return json(500, { error: upsertErr.message });

  if (body.type === "plan") {
    // Keep only ONE row per phone (latest overwrites previous).
    const { error: planErr } = await supabase.from("meal_plans").upsert({
      phone,
      meal_plan: body.meal_plan,
      created_at: new Date().toISOString(),
    }, { onConflict: "phone" });
    if (planErr) return json(500, { error: planErr.message });
  } else if (body.type !== "details") {
    return json(400, { error: "Body.type must be 'details' or 'plan'" });
  }

  return json(200, { ok: true, phone });
});

