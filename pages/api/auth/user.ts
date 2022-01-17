import { createClient } from "@supabase/supabase-js";
import { SUPABASE_KEY, SUPABASE_REST_URL } from "../../../project.config";

export default function handler(req, res) {
  const client = createClient(SUPABASE_REST_URL, SUPABASE_KEY);
  return res.status(200).json(client.auth.api.getUserByCookie(req));
}
