import { Button } from "@mui/material";
import { useRouter } from "next/router";
import { supabaseClient } from "utils";

export default function Home() {
  const { push } = useRouter();

  const handleLogin = async () => {
    await supabaseClient.auth.signIn({ provider: "google" });
    push("/lobby/groups");
  };

  return <Button onClick={handleLogin}>Sign in</Button>;
}
