import { supabaseClient } from "utils";

export default function Login() {
  supabaseClient.auth.signIn({ provider: "google" }, { redirectTo: "/lobby" });

  return <h1>hello</h1>;
}
