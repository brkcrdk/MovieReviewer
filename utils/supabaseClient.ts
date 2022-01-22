import { createClient } from "@supabase/supabase-js";

const REST_URL = process.env.NEXT_PUBLIC_SUPABASE_REST_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY;

const supabaseClient = createClient(REST_URL, KEY, {
  autoRefreshToken: true,
});

export default supabaseClient;
