import Styles from "./LobbyLayout.module.css";
import { BigTitle, Container } from "common";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useClient } from "Hooks/supabase";
import Avatar from "@mui/material/Avatar";
import { User } from "@supabase/supabase-js";
import useSwr from "swr";

const fetcher = (link: string) => fetch(link).then((res) => res.json());

export default function Layout({
  children,
  title,
  buttons = null,
  middle = null,
  className = "",
}) {
  const [user, setUser] = useState<User>();
  const client = useClient();
  const router = useRouter();

  useEffect(() => setUser(client.auth.user()), [client.auth]);

  useEffect(() => {
    if (user === null) router.push("/");
  }, [router, user]);

  client.auth.onAuthStateChange((type, session) => {
    setUser(session as any);
  });

  function signOut() {
    client.auth.signOut();
  }

  return (
    <main className={`${Styles.wrapper} ${className}`}>
      <Container className={Styles["header-container"]}>
        <BigTitle>{title}</BigTitle>
        <Container className={Styles.middle}>{middle}</Container>
        <Container className={Styles.rightContainer}>
          <Container className={Styles["btn-container"]}>{buttons}</Container>
          {user ? (
            <>
              <Button onClick={signOut}>Sign out</Button>
              <UserAvatar user={user} />
            </>
          ) : null}
        </Container>
      </Container>
      <Container>{children}</Container>
    </main>
  );
}

function UserAvatar({ user }) {
  function getAvatarFromUser() {
    return user.user_metadata.avatar_url;
  }

  return <Avatar src={getAvatarFromUser()} sx={{ width: 50, height: 50 }} />;
}
