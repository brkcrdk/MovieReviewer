import { Button, TextField } from "@mui/material";
import MovieCard from "Components/lobby/MovieCard/MovieCard";
import { useClient } from "Hooks/supabase";
import Layout from "Layouts/lobby/LobbyLayout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Container } from "common";
import Styles from "Styles/lobby/groups/[groupId]/movies/index.module.scss";
import AddMovieCard from "Components/lobby/AddMovieCard/AddMovieCard";
import NoMoviesFound from "Components/lobby/NoMoviesFound/NoMoviesFound";

const debounce = (fn: Function) => {
  let timer: NodeJS.Timeout;
  return function (...args) {
    const context = this;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      fn.apply(context, args);
    }, 500);
  };
};

export default function Movies() {
  const client = useClient();

  const [movies, setMovies] = useState([]);

  const router = useRouter();

  useEffect(() => {
    client
      .from("movies")
      .select()
      .then(({ data, error }) => {
        if (data.length) {
          setMovies(data);
        }
      });
  }, [client]);

  function newMovie() {
    const { groupId } = router.query;
    router.push(`/lobby/groups/${groupId}/movies/search`);
  }

  function getGroupId() {
    return router.query.groupId;
  }

  const handleChange = async (e: any) => {
    const id = getGroupId();
    const query = e.target.value;

    let data: any;

    if (query === "") {
      const result = await client.from("movies").select().eq("group_id", id);
      data = result.data;
    } else {
      const result = await client
        .from("movies")
        .select()
        .eq("group_id", id)

        .textSearch("title", query, { type: "websearch" });
      console.log(result);
      data = result.data;
    }
    console.log(data);
    setMovies(data);
  };

  const handleDebounce = debounce(handleChange);

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
        {movies.map((data, index) => {
          return (
            <MovieCard
              key={index}
              title={data.title}
              backdropImage={data.backdrop_path}
              posterImage={data.poster_path}
              overview={data.overview}
              to={`/lobby/groups/${getGroupId()}/movie/${data.id}`}
            ></MovieCard>
          );
        })}
        {movies.length ? (
          <AddMovieCard onClick={newMovie} />
        ) : (
          <NoMoviesFound />
        )}
      </Container>
    </Layout>
  );
}
