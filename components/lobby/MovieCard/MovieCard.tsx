import { Card, CardMedia, Rating } from "@mui/material";
import { Box } from "@mui/system";
import { Container, SmallText, SmallTitle, Title } from "common";
import { useEffect, useState } from "react";
import { CardActionArea } from "@mui/material";
import Styles from "./MovieCard.module.scss";
import { useRouter } from "next/router";
import { splitText } from "Utils/other";
import { getMovieRatingFromGroup } from "Services/db";

interface Inputs {
  title: string;
  posterImage: string;
  backdropImage: string;
  overview: string;
  to: string;
  id: any;
}

export default function MovieCard({
  title: oldTitle,
  posterImage,
  backdropImage,
  overview: oldOverview,
  to,
  id,
}: Inputs) {
  const [overview, setOverview] = useState(oldOverview);
  const [title, setTitle] = useState(oldTitle);
  const [image, setImage] = useState(
    `https://image.tmdb.org/t/p/w500${backdropImage}`
  );
  const {
    push,
    query: { groupId },
  } = useRouter();

  const [rating, setRating] = useState(null);

  useEffect(() => {
    async function main() {
      const [data, error] = (await getMovieRatingFromGroup(groupId, id)) as any;
      const ratingCount = data.length;
      if (ratingCount) {
        const ratingArr = [];
        data.forEach((data) => ratingArr.push(data.rating));
        let totalRatings = ratingArr.reduce((pre, curr) => pre + curr.rating);
        console.log(totalRatings);
        setRating(totalRatings / ratingCount);
      }
    }
    main();
  }, [groupId, id]);

  useEffect(() => console.log(rating), [rating]);

  useEffect(() => {
    if (oldOverview.length > 80) setOverview(splitText(oldOverview, 80));
    if (title.length > 20) setTitle(splitText(oldTitle, 20));
  }, [oldOverview, oldTitle, title]);

  return (
    <Card className={Styles.card}>
      <CardActionArea
        className={Styles["card-wrapper"]}
        onClick={() => push(to)}
      >
        <CardMedia
          component="img"
          onError={() => {
            setImage(`/img/jpg/not-available.jpg`);
          }}
          image={image}
          className={Styles.img}
        />
        <Box className={Styles["card--container"]}>
          <Container className={Styles.ratingTitleWrapper}>
            <SmallTitle>{title}</SmallTitle>
            <Rating value={rating} readOnly precision={0.5} />
          </Container>

          <SmallText className={Styles["small-text"]}>
            {overview} <strong>Read more</strong>
          </SmallText>
        </Box>
      </CardActionArea>
    </Card>
  );
}
