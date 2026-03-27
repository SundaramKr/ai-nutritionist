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
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json(405, { error: "Use POST" });

  let body: { phone?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return json(400, { error: "Body must be JSON" });
  }

  const phone = body.phone?.trim();
  const password = body.password;
  if (!phone) return json(400, { error: "Missing phone" });
  if (!password || typeof password !== "string") {
    return json(400, { error: "Missing password" });
  }

  const projectUrl = Deno.env.get("PROJECT_URL");
  const serviceRoleKey = Deno.env.get("SERVICE_ROLE_KEY");
  if (!projectUrl || !serviceRoleKey) {
    return json(500, { error: "Missing PROJECT_URL or SERVICE_ROLE_KEY" });
  }

  const supabase = createClient(projectUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await supabase
    .from("users")
    .select("password_hash, phone, name")
    .eq("phone", phone)
    .maybeSingle();

  if (error) return json(500, { error: error.message });
  if (!data?.password_hash) return json(401, { error: "Invalid phone or password" });

  const bcryptLib: any = (bcrypt as any).default ?? bcrypt;
  const ok = await bcryptLib.compare(password, data.password_hash);
  if (!ok) return json(401, { error: "Invalid phone or password" });

  return json(200, { ok: true, phone, name: data.name });
});

