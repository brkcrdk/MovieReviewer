import { useClient as getClient } from "hooks/supabase";

const client = getClient();

export const getGroupsFromAuthor = async (authorId: string) => {
  const { data, error } = await client
    .from("groups")
    .select()
    .eq("owner_id", authorId)
    .order("created_at", { ascending: false });

  return [data, error];
};
