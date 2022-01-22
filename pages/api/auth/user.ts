import { supabaseClient } from "utils";

export default function handler(req, res) {
  return res.status(200).json(supabaseClient.auth.api.getUserByCookie(req));
}
