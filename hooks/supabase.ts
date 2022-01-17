import { createClient } from "@supabase/supabase-js";
import { SUPABASE_KEY, SUPABASE_REST_URL } from "../project.config";

const client = createClient(SUPABASE_REST_URL, SUPABASE_KEY, {
  autoRefreshToken: true,
});

export function useClient() {
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
