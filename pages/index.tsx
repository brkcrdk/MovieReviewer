import {
  CircleNotificationsRounded,
  SignpostOutlined,
} from "@mui/icons-material";
import { Button } from "@mui/material";
import { useClient } from "Hooks/supabase";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const client = useClient();

  function signIn() {
    client.auth.signIn({ provider: "google" });
  }

  useEffect(() => {
    client.auth.getSessionFromUrl({ storeSession: true }).then((data) => {
      if (client.auth.user() && data.data) {
        router.push("/lobby/groups");
      }
    });
  }, [router, client.auth]);

  return <Button onClick={signIn}>Sign in</Button>;
}
