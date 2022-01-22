import Styles from "./LobbyLayout.module.scss";
import { BigTitle, Container } from "common";
import { Button, StyledEngineProvider } from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Avatar from "@mui/material/Avatar";
import { User } from "@supabase/supabase-js";
import { Title } from "common";
import { supabaseClient } from "utils";

export default function Layout({
  children,
  title,
  buttons = null,
  middle = null,
  className = "",
  style = {},
}) {
  const [user, setUser] = useState<User>();
  const { push, pathname } = useRouter();

  useEffect(() => {
    const currentUser = supabaseClient.auth.user();
    setUser(currentUser);
  }, []);

  useEffect(() => {
    if (user === null) push("/");
  }, [push, user]);

  async function signOut() {
    await supabaseClient.auth.signOut();
    await fetch("/api/auth/remove", {
      method: "GET",
      credentials: "same-origin",
    });
    push("/");
  }

  return (
    <main className={`${Styles.wrapper} ${className}`} style={style}>
      <Container className={Styles["header-container"]} id="header">
        <Container className={Styles.left}>
          <Title className={Styles.title}>{title}</Title>
          {pathname !== "/lobby/groups" && (
            <Button onClick={() => push("/lobby/groups")}>To Groups</Button>
          )}
        </Container>
        <Container className={Styles.middle}>{middle}</Container>
        <Container className={Styles.rightContainer}>
          <Container className={Styles["btn-container"]}>{buttons}</Container>
          {user && (
            <>
              <Button onClick={signOut}>Sign out</Button>
              <UserAvatar user={user} className={Styles.avatar} />
            </>
          )}
        </Container>
      </Container>
      <Container>{children}</Container>
    </main>
  );
}

function UserAvatar({ user, className = "" }) {
  function getAvatarFromUser() {
    return user.user_metadata.avatar_url;
  }

  return (
    <Avatar
      src={getAvatarFromUser()}
      sx={{ width: 50, height: 50 }}
      className={className}
    />
  );
}
