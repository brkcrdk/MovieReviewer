import supabaseClient from "Utils/supabaseClient";

// I think that we could work on the adding and
// viewing a icon to the group would be nice?

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

export const getMovieRatingFromGroup = async (groupId, movieId) => {
  const { data, error } = await supabaseClient
    .from("reviews")
    .select()
    .eq("group_id", groupId)
    .eq("movie_id", movieId);
  return [data, error];
};
