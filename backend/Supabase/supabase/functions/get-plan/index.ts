// deno-lint-ignore-file
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "GET") return json(405, { error: "Use GET" });

  const url = new URL(req.url);
  const phone = url.searchParams.get("phone")?.trim();
  if (!phone) return json(400, { error: "Missing ?phone=" });

  const supabaseUrl = Deno.env.get("PROJECT_URL");
  const serviceRoleKey = Deno.env.get("SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    return json(500, { error: "Missing PROJECT_URL or SERVICE_ROLE_KEY" });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await supabase
    .from("meal_plans")
    .select("id, phone, meal_plan, created_at")
    .eq("phone", phone)
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) return json(500, { error: error.message });

  const latest = data?.[0] ?? null;
  return json(200, { phone, latest });
});

