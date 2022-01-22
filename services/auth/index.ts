import { useClient as getClient } from "hooks/supabase";

const { auth } = getClient();

export const signIn = () => auth.signIn({ provider: "google" });

export const signOut = auth.signOut;

export const getUserFromUrl = auth.getSessionFromUrl({ storeSession: true });
