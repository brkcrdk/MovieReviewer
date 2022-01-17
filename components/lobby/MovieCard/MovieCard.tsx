import {
  Button,
  Card,
  CardActions,
  CardMedia,
  getToolbarUtilityClass,
} from "@mui/material";
import { Box } from "@mui/system";
import { SmallText, SmallTitle, Title } from "common";
import { useEffect, useState } from "react";
import { CardActionArea } from "@mui/material";
import Styles from "./MovieCard.module.scss";
import { useRouter } from "next/router";

interface Inputs {
  title: string;
  posterImage: string;
  backdropImage: string;
  overview: string;
  to: string;
}

export default function MovieCard({
  title: oldTitle,
  posterImage,
  backdropImage,
  overview: oldOverview,
  to,
}: Inputs) {
  const [overview, setOverview] = useState(oldOverview);
  const [title, setTitle] = useState(oldTitle);
  const [image, setImage] = useState(
    `https://image.tmdb.org/t/p/w500${backdropImage}`
  );
  const router = useRouter();

  function splitText(what: string, length: number): string {
    const oldWhat = what;
    const overviewArr = what.split("");
    overviewArr[length] = "§";
    const stringOverview = overviewArr.join("");
    const niceOverview = stringOverview.split("§")[0];
    if (!(oldWhat === niceOverview)) {
      return `${niceOverview}... `;
    }
    return niceOverview;
  }

  useEffect(() => {
    if (oldOverview.length > 80) {
      setOverview(splitText(oldOverview, 80));
    }
    if (title.length > 20) {
      setTitle(splitText(oldTitle, 20));
    }
  }, [oldOverview, oldTitle, title]);

  function goto() {
    router.push(to);
  }

  return (
    <Card className={Styles.card}>
      <CardActionArea className={Styles["card-wrapper"]} onClick={goto}>
        <CardMedia
          component="img"
          onError={() => {
            setImage(`/img/jpg/not-available.jpg`);
          }}
          image={image}
          className={Styles.img}
        />
        <Box className={Styles["card--container"]}>
          <SmallTitle>{title}</SmallTitle>

          <SmallText className={Styles["small-text"]}>
            {overview} <strong>Read more</strong>
          </SmallText>
        </Box>
      </CardActionArea>
    </Card>
  );
}
