import { createClient } from "@supabase/supabase-js";

const REST_URL = process.env.NEXT_PUBLIC_SUPABASE_REST_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY;

const client = createClient(REST_URL, KEY, {
  autoRefreshToken: true,
});

export function useClient() {
  return client;
}

export function getClient() {
  return client;
}

export function useGetDB(table) {
  const client = useClient();
  return client.from(table).select();
}

export function useAddDB(
  table: string,
  query: Partial<any> | Partial<any>[],
  options?: {
    returning?: "minimal" | "representation";
    count?: "exact" | "planned" | "estimated";
  }
) {
  const client = useClient();
  return client.from(table).insert(query, options);
}

export function useListenDB(table: string, fn: (data: any) => void) {
  const client = useClient();
  return client.from(table).on("*", fn).subscribe();
}
