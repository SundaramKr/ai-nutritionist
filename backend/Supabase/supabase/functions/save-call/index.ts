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
  if (req.method !== "POST") return json(405, { error: "Use POST" });

  let body: { call_id?: string };
  try {
    body = await req.json();
  } catch {
    return json(400, { error: "Body must be JSON" });
  }

  const callId = body.call_id?.trim();
  if (!callId) return json(400, { error: "Missing call_id" });

  const projectUrl = Deno.env.get("PROJECT_URL");
  const serviceRoleKey = Deno.env.get("SERVICE_ROLE_KEY");
  if (!projectUrl || !serviceRoleKey) {
    return json(500, { error: "Missing PROJECT_URL or SERVICE_ROLE_KEY" });
  }

  const supabase = createClient(projectUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { error } = await supabase.from("processed_calls").insert({ call_id: callId });

  // Duplicate primary key => return non-2xx so caller can skip.
  if (error) {
    if (error.code === "23505") {
      return json(409, { duplicate: true, call_id: callId });
    }
    return json(500, { error: error.message });
  }

  return json(201, { inserted: true, call_id: callId });
});

