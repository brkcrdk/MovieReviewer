import { supabaseClient } from "utils";

export default async function handler(req, res) {
  await supabaseClient.auth.api.setAuthCookie(req, res);
}
