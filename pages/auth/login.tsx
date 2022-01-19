import { useClient } from "Hooks/supabase";

export default function Login() {
  const client = useClient();

  client.auth.signIn({ provider: "google" }, { redirectTo: "/lobby" });

  return <h1>hello</h1>;
}
