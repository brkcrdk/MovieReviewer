import Styles from "./MovieLayout.module.scss";
import { BigTitle, Container } from "common";
import { Button, Link, Paper } from "@mui/material";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/router";
// import { useClient } from "Hooks/supabase";
// import Avatar from "@mui/material/Avatar";
// import { User } from "@supabase/supabase-js";
// import useSwr from "swr";
import LobbyLayout from "../lobby/LobbyLayout";
import Image from "next/image";
import Skeleton from "@mui/material/Skeleton";
import { NoEncryption } from "@mui/icons-material";

export default function Layout({
  children,
  title,
  buttons = null,
  middle = null,
  className = "",
  image,
  haveReviews,
  loading,
}) {
  return (
    <LobbyLayout
      title={title}
      buttons={buttons}
      middle={middle}
      style={{ paddingBottom: 0 }}
    >
      <Container className={Styles.layout}>
        <Container className={Styles.leftContainer}>
          <Container className={Styles.move}>
            {loading ? (
              <Skeleton variant="rectangular" width={300} height={450} />
            ) : (
              <Image
                className={Styles.image}
                src={image}
                width={300}
                height={450}
                alt=""
                layout={"fixed"}
                priority={true}
              />
            )}
            <Paper className={Styles.btnContainer}>
              {image || haveReviews ? (
                <Link href="#header">Go to header</Link>
              ) : null}
              {image ? <Link href="#video">Go to Video</Link> : null}
              {haveReviews ? <Link href="#reviews">Go to reviews</Link> : null}
            </Paper>
          </Container>
        </Container>
        <Container className={Styles.rightContainer}>{children}</Container>
      </Container>
    </LobbyLayout>
  );
}
