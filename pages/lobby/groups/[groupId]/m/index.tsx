import { Button, TextField } from "@mui/material";
import { useClient } from "Hooks/supabase";
import Layout from "Layouts/lobby/LobbyLayout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Container } from "common";
import Styles from "Styles/lobby/groups/[groupId]/movies/index.module.scss";
import { NoMoviesFound, MovieCard } from "Components/lobby";
import { debounce } from "lodash-es";
import Loader from "Components/Loader/Loader";

export default function Movies() {
  const client = useClient();

  const [movies, setMovies] = useState<any>(null);

  const {
    query: { groupId },
    query,
    push,
  } = useRouter();

  useEffect(() => {
    client
      .from("movies")
      .select()
      .eq("group_id", groupId)
      .then(({ data }) => setMovies(data));
  }, [client, groupId]);

  function newMovie() {
    push(`/lobby/groups/${groupId}/m/search`);
  }

  const handleChange = async ({ target }) => {
    const { value } = target;

    if (value === "") {
      const { data } = await client
        .from("movies")
        .select()
        .eq("group_id", groupId);

      setMovies(data);
    } else {
      const { data } = await client
        .from("movies")
        .select()
        .eq("group_id", groupId)
        .textSearch("title", value, { type: "phrase" });
      setMovies(data);
    }
  };

  const handleDebounce = debounce(handleChange, 500);

  return (
    <Layout
      title="Movies"
      buttons={
        <Button onClick={newMovie} variant="outlined" size="large">
          Add movie
        </Button>
      }
      middle={
        <TextField
          className={Styles.input}
          placeholder="Search added movies"
          size="medium"
          fullWidth
          onChange={handleDebounce}
        />
      }
    >
      <Container className={Styles["movie-container"]}>
        {movies === null ? (
          <Loader open />
        ) : (
          movies.map((data, index) => {
            const { title, backdrop_path, poster_path, overview, movie_id } =
              data;

            return (
              <MovieCard
                key={index}
                title={title}
                backdropImage={backdrop_path}
                posterImage={poster_path}
                overview={overview}
                to={`/lobby/groups/${groupId}/m/${movie_id}`}
              />
            );
          })
        )}

        {!!movies && movies.length === 0 ? <NoMoviesFound /> : null}
      </Container>
    </Layout>
  );
}
