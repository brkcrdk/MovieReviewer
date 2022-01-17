import Styles from "./MovieLayout.module.scss";
import { BigTitle, Container } from "common";
import { Button, Link, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useClient } from "Hooks/supabase";
import Avatar from "@mui/material/Avatar";
import { User } from "@supabase/supabase-js";
import useSwr from "swr";
import LobbyLayout from "../lobby/LobbyLayout";
import Image from "next/image";

export default function Layout({
  children,
  title,
  buttons = null,
  middle = null,
  className = "",
  image,
  haveReviews,
}) {
  return (
    <LobbyLayout title={title} buttons={buttons} middle={middle}>
      <Container className={Styles.layout}>
        <Container className={Styles.leftContainer}>
          <Container className={Styles.move}>
            <Image
              className={Styles.image}
              src={image}
              width={300}
              height={450}
              alt=""
              layout={"fixed"}
            />
            <Paper className={Styles.btnContainer}>
              {image || haveReviews ? (
                <Link href="#header">Go to header</Link>
              ) : null}
              {image ? <Link href="#video">Go to Video</Link> : null}
              {haveReviews ? <Link href="#reviews">Go to reviews</Link> : null}
            </Paper>
          </Container>
        </Container>
        <Container className={Styles.left}>{children}</Container>
      </Container>
    </LobbyLayout>
  );
}
