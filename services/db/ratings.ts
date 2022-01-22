import { useClient as getClient } from "hooks/supabase";

const client = getClient();

export const getRatingFromAuthor = async (
  authorId: string,
  movieId: string,
  groupId: string
) => {
  const { data, error } = await client
    .from("reviews")
    .select()
    .eq("owner_id", authorId)
    .eq("movie_id", movieId)
    .eq("group_id", groupId);
  return [...data, error];
};
