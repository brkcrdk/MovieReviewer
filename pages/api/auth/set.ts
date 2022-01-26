import { supabaseClient } from "utils";

export default function handler(req, res) {
  supabaseClient.auth.api.setAuthCookie(req, res);
}
