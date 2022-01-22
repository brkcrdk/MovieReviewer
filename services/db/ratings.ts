import supabaseClient from "Utils/supabaseClient";

export const getRatingFromAuthor = async (
  authorId: string,
  movieId: string,
  groupId: string
) => {
  const { data, error } = await supabaseClient
    .from("reviews")
    .select()
    .eq("owner_id", authorId)
    .eq("movie_id", movieId)
    .eq("group_id", groupId);
  return [...data, error];
};
