import { SmallText, Title } from "common";
import Styles from "./MovieSearchCard.module.scss";
import Card from "@mui/material/Card";
import { Alert, Box, Button, CardActions, CardMedia } from "@mui/material";
import { useClient } from "Hooks/supabase";
import { useRouter } from "next/router";
import { getMovie } from "Services/db/movies";

export default function MovieSearchCard({
  id: movieId,
  title,
  adoult,
  overview,
  image,
  release,
  onClick,
  backdrop,
  onError,
}) {
  const client = useClient();
  const router = useRouter();

  async function addMovie() {
    const { groupId } = router.query;

    const [data, error] = await getMovie(groupId, movieId);

    if (!data) {
      client
        .from("movies")
        .insert({
          movie_id: movieId,
          made_at: release,
          poster_path: image,
          backdrop_path: backdrop,
          overview,
          group_id: groupId,
          title,
        })
        .then(({ data, error }) => {
          console.log(data, error);
          onClick(error);
        });
    } else {
      onError();
    }
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
