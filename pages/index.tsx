import { Button } from "@mui/material";
import { useClient } from "Hooks/supabase";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const { push } = useRouter();
  const { auth } = useClient();

  useEffect(() => {
    auth.getSessionFromUrl({ storeSession: true }).then((data) => {
      if (auth.user() && data.data) {
        push("/lobby/groups");
      }
    });
  }, [push, auth]);

  return (
    <Button onClick={() => auth.signIn({ provider: "google" })}>Sign in</Button>
  );
}
