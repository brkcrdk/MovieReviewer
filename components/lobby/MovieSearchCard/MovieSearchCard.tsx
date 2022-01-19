import { SmallText, Title } from "common";
import Image from "next/image";
import Styles from "./MovieSearchCard.module.scss";
import Card from "@mui/material/Card";
import {
  Alert,
  backdropClasses,
  Box,
  Button,
  CardActions,
  CardMedia,
} from "@mui/material";
import { useClient } from "Hooks/supabase";
import { useRouter } from "next/router";

export default function MovieSearchCard({
  id,
  title,
  adoult,
  overview,
  image,
  release,
  backdrop,
}) {
  const client = useClient();
  const router = useRouter();

  function addMovie() {
    const group_id = router.query.groupId;
    console.log(group_id);
    client
      .from("movies")
      .insert({
        movie_id: id,
        made_at: release,
        poster_path: image,
        backdrop_path: backdrop,
        overview,
        group_id,
        title,
      })
      .then(({ data, error }) => {
        console.log(data, error);
      });
  }

  return (
    <Card className={Styles.card}>
      <CardMedia
        component="img"
        image={`https://image.tmdb.org/t/p/w200${image}`}
        alt="Live from space album cover"
        className={Styles.img}
      />
      <Box className={Styles["card--container"]}>
        <Title>{title}</Title>
        <p className={Styles["date"]}>{release}</p>
        {adoult ? (
          <Alert severity="warning">This movie is for adoults!</Alert>
        ) : null}
        <SmallText className={Styles["small-text"]}>{overview}</SmallText>
        <CardActions className={Styles["btn-container"]}>
          <Button
            size="large"
            variant="outlined"
            disableElevation
            onClick={addMovie}
          >
            Add to Group
          </Button>
        </CardActions>
      </Box>
    </Card>
  );
}
