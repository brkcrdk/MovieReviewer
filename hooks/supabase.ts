import { createClient } from "@supabase/supabase-js";

const REST_URL = process.env.NEXT_PUBLIC_SUPABASE_REST_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY;

const client = createClient(REST_URL, KEY, {
  autoRefreshToken: true,
});

export function useClient() {
  return client;
}

// This is for getServerSideProps because they dont allow a react hook in that function
export function getClient() {
  return client;
}
