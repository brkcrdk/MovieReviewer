import supabaseClient from "Utils/supabaseClient";

export const getGroupsFromAuthor = async (authorId: string) => {
  const { data, error } = await supabaseClient
    .from("groups")
    .select()
    .eq("owner_id", authorId)
    .order("created_at", { ascending: false });

  return [data, error];
};

export const getGroupIconFromId = (id: string) => {
  const { data, error } = supabaseClient.storage
    .from("images")
    .getPublicUrl(`groups/${id}.jpeg`);
  console.log(data);
  return [data, error];
};
