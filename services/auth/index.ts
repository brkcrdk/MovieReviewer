import { supabaseClient } from "utils";

export const signIn = async () => {
  const { user } = await supabaseClient.auth.signIn(
    { provider: "google" },
    { redirectTo: "/lobby/groups" }
  );
  console.log(user);
};

export const signOut = supabaseClient.auth.signOut;

export const getUserFromUrl = supabaseClient.auth.getSessionFromUrl({
  storeSession: true,
});

export const getUserFromUUID = async (uuid: string) => {
  const { data, error } = await supabaseClient
    .from("users")
    .select()
    .eq("user_id", uuid);
  return [...data, error];
};

export const setUser = async (uuid: string) => {
  const { id, email, user_metadata } = supabaseClient.auth.user();
  const { avatar_url, name, full_name } = user_metadata;
  const { data, error } = await supabaseClient.from("users").upsert({
    user_id: id,
    profile_icon: avatar_url,
    email,
    name,
    full_name,
  });
  return [data, error];
};
