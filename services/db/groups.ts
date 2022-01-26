import supabaseClient from "Utils/supabaseClient";

export const getGroupsFromAuthor = async (authorId: string) => {
  const { data, error } = await supabaseClient
    .from("groups")
    .select()
    .eq("owner_id", authorId)
    .order("created_at", { ascending: false });

  return [data, error];
};

export const getGroupFromId = async (groupId: string) => {
  const { data, error } = await supabaseClient
    .from("groups")
    .select()
    .eq("id", groupId);
  return [...data, error];
};

export const getGroupIconFromGroupId = async (id: string) => {
  const [group] = await getGroupFromId(id);
  const [bucket, ...pathArr] = group.groupIcon.split("/");
  const path = pathArr.join("/");
  const res = supabaseClient.storage.from(bucket).getPublicUrl(path);
  return [res.data?.publicURL, res.error];
};

export const addUserToGroup = async (groupId, userId) => {
  const { data, error } = await supabaseClient
    .from("groups")
    .select()
    .eq("group_id", groupId);
  console.log(data);

  return [data, error];
  // const {data ,error} = await supabaseClient.from("groups").update({group_id: groupId, })
};
