import { Button, TextField } from "@mui/material";
import Layout from "Layouts/lobby/LobbyLayout";
import { useRouter } from "next/router";
import { Suspense, useEffect, useState } from "react";
import { Container } from "common";
import Styles from "styles/lobby/groups/[groupId]/movies/index.module.scss";
import { NoMoviesFound, MovieCard } from "Components/lobby";
import { debounce } from "lodash-es";
import Loader from "Components/Loader/Loader";
import { supabaseClient } from "utils";
import { SearchOutlined } from "@mui/icons-material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { IconButton } from "@mui/material";
import { getMovie, getMovieRatingFromGroup } from "Services/db";
// * The option to invite others in to a group and then view all the movies together
//   The invited members should also be able to add movies
// * That people can give a movie a rating and then display the average rating in the ui

export default function Movies() {
  const [movies, setMovies] = useState<any>(null);
  let searchMatches = useMediaQuery("(min-width:640px)");

  const {
    query: { groupId },
    push,
  } = useRouter();

  useEffect(() => {
    supabaseClient
      .from("movies")
      .select()
      .eq("group_id", groupId)
      .then(({ data, error }) => {
        console.log(data);
        console.log("ERROR", error);
        setMovies(data);
      });
  }, [groupId]);

  function newMovie() {
    push(`/lobby/groups/${groupId}/m/search`);
  }

  const handleChange = async ({ target }) => {
    const { value } = target;

    if (value === "") {
      const { data } = await supabaseClient
        .from("movies")
        .select()
        .eq("group_id", groupId);

      setMovies(data);
    } else {
      const { data } = await supabaseClient
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
      leftButtons={
        !searchMatches ? (
          <Container className={Styles.searchButtonContainer}>
            <IconButton size="large">
              <SearchOutlined />
            </IconButton>
          </Container>
        ) : null
      }
      title="Movies"
      buttons={
        <>
          <Button onClick={newMovie} variant="outlined" size="large">
            Add movie
          </Button>
        </>
      }
      middle={
        searchMatches ? (
          <TextField
            className={Styles.input}
            placeholder="Search added movies"
            size="medium"
            fullWidth
            onChange={handleDebounce}
          />
        ) : null
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
                id={movie_id}
              />
            );
          })
        )}

        {!!movies && movies.length === 0 ? <NoMoviesFound /> : null}
      </Container>
    </Layout>
  );
}
