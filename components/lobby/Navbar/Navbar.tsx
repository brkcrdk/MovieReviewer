import Styles from "./Navbar.module.scss";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { useClient } from "Hooks/supabase";
import { useRouter } from "next/router";
import { SignOut, SmallTitle } from "common";

export default function Navbar() {
  const client = useClient();

  const [userId, changeUserId] = useState<string>();
  const router = useRouter();

  function getUser() {
    return client.auth.user();
  }

  client.auth.onAuthStateChange((_, session) => {
    if (!session) {
      router.push("/");
      return;
    }
    const { user } = session;
    changeUserId(user?.id);
  });

  useEffect(() => {
    changeUserId(getUser()?.id);
  }, []);

  function signIn() {
    client.auth.signIn({ provider: "google" }, { redirectTo: "/lobby/groups" });
  }

  async function signOut() {
    client.auth.signOut();
  }

  return (
    <>
      <header className={Styles.headerContainer}>
        <h2>MovieReviewer</h2>
      </header>
      {/* <header className={Styles.container}>
        <h2 className={Styles.title}>MovieReviewer</h2>
        <nav className={Styles["nav-container"]}>
          {userId ? (
            <Button onClick={signOut}>Log Out</Button>
          ) : (
            <SignOut variant="outlined" toRoute="/" />
          )}
          <Button variant="contained" disableElevation>
            Invite someone!
          </Button>
        </nav>
      </header> */}
    </>
  );
}
