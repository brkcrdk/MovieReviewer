import { createClient } from "@supabase/supabase-js";

const REST_URL = process.env.NEXT_PUBLIC_SUPABASE_REST_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY;

export default function handler(req, res) {
  const client = createClient(REST_URL, KEY);
  return res.status(200).json(client.auth.api.getUserByCookie(req));
}
