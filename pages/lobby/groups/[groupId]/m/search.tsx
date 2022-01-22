import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import LobbyLayout from "Layouts/lobby/LobbyLayout";
import { Button, Snackbar, TextField } from "@mui/material";
import Styles from "Styles/lobby/groups/[groupId]/movies/search.module.scss";
import MovieSearchCard from "Components/lobby/MovieSearchCard/MovieSearchCard";
import { Container, Title } from "common";
import { Alert } from "@mui/material";

import { VariantType, useSnackbar } from "notistack";
/**
  import LobbyLayout from "Layouts/lobby/LobbyLayout";
  could be imported like this

  import { LobbyLayout,MovieLayout } from 'Layouts'
 */

export function getServerSideProps() {
  return {
    props: {}, // will be passed to the page component as props
  };
}


const HeaderButton = ({ goBack }) => (
  <Button size="large" variant="outlined" onClick={goBack}>
    Go Back
  </Button>
);

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

export default function Group() {
  const [search, setSearch] = useState({
    results: null,
    title: null,
    errors: null,
  });
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    async function main() {
      if (search.results === null || search.errors?.length > 0) {
        const prom = await fetch(`/api/movie/popular`);
        const data = await prom.json();
        data.title = "Popular movies";

        setSearch(data);
      }
    }
    main();
  }, [search]);

  const handleChange = async (e: any) => {
    const { value } = e.target;
    try {
      const prom = await fetch(`/api/movie/search?name=${value}`);
      const json = await prom.json();
      setSearch(json);
    } catch {
      setSearch({ results: null, title: null, errors: null });
    }
  };

  const debounceChange = debounce(handleChange);

  function goBack() {
    const { groupId } = router.query;
    router.push(`/lobby/groups/${groupId}/m`);
  }

  // const handleClose = (
  //   event?: React.SyntheticEvent | Event,
  //   reason?: string
  // ) => {
  //   if (reason === "clickaway") {
  //     return;
  //   }

  //   setIsOpen(false);
  //   setErrorIsOpen(false);
  // };

  const showAlert = () =>
    enqueueSnackbar("Movie Added!", { variant: "success" });

  const showErrorAlert = () =>
    enqueueSnackbar("Movie already added!", { variant: "error" });

  return (
    <LobbyLayout title="Movies">
      <Container className={Styles.wrapper}>
        <Container className={Styles.container}>
          <Button>Sort By</Button>
          <TextField
            onChange={debounceChange}
            variant="outlined"
            size="medium"
            placeholder="Props to themoviedb"
            label="Search Movies"
          />
          <HeaderButton goBack={goBack} />
        </Container>
        <Title>{search.title as string}</Title>
        {search.results?.map((v: any, i: number) => (
          <MovieSearchCard
            title={v.title}
            key={i}
            adoult={v.adoult}
            overview={v.overview}
            image={v.poster_path}
            release={v.release_date}
            backdrop={v.backdrop_path}
            id={v.id}
            onClick={showAlert}
            onError={showErrorAlert}
          />
        ))}
      </Container>
      {/* <Snackbar open={isOpen} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Movie Added!
        </Alert>
      </Snackbar>
      <Snackbar
        open={isErrorOpen}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          Movie already added!
        </Alert>
      </Snackbar> */}
    </LobbyLayout>
  );
}
