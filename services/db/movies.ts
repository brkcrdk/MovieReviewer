import { useClient as getClient } from "hooks/supabase";

const client = getClient();

export const getAllMovies = async (groupId: string) => {
  const { data, error } = await client
    .from("movies")
    .select()
    .eq("group_id", groupId);

  return [data, error];
};

export const getMovieFromAuthor = async (author_id: string) => {
  const { data, error } = await client
    .from("movies")
    .select()
    .eq("owner_id", author_id);
  return [data, error];
};

export const getMovie = async (groupId, movieId) => {
  const { data, error } = await client
    .from("movies")
    .select()
    .eq("group_id", groupId)
    .eq("movie_id", movieId);
  return [...data, error];
};
