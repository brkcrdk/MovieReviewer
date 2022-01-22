import { supabaseClient } from "utils";

export const signIn = () => supabaseClient.auth.signIn({ provider: "google" });

export const signOut = supabaseClient.auth.signOut;

export const getUserFromUrl = supabaseClient.auth.getSessionFromUrl({
  storeSession: true,
});
