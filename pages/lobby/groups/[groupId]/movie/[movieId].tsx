import Layout from "Layouts/lobby/LobbyLayout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Container, BiggestTitle, BigTitle, Text } from "common";
import Styles from "Styles/lobby/groups/[groupId]/movie/[movieId].module.scss";
import { useClient } from "Hooks/supabase";
import Image from "next/image";
import { Button, Rating } from "@mui/material";

export default function MovieDet() {
  const router = useRouter();
  const [movie, setMovie] = useState({
    title: "Loading",
    backdrop_path: "",
    overview: "loading",
    poster_path: "",
  });

  const [ytUrl, setYtUrl] = useState("");
  const [reviews, setReviews] = useState([]);

  const client = useClient();

  useEffect(() => {
    if (router.query.movieId) {
      client
        .from("movies")
        .select()
        .eq("group_id", router.query.groupId)
        .eq("id", router.query.movieId)
        .then(({ error, data }) => {
          console.log(data);
          if (data) setMovie(data[0]);
        });

      const getUrl = async () => {
        const prom = await fetch("/api/movie/clips/" + router.query.movieId);
        const { key } = await prom.json();
        setYtUrl(key);
      };
      getUrl();

      const getReviews = async () => {
        const prom = await fetch(`/api/movie/reviews/${router.query.movieId}`);
        const reviews = await prom.json();
        setReviews(reviews);
      };
      getReviews();
    }
  }, [router.query, client]);

  useEffect(() => {
    console.log(movie);
  }, [movie]);

  return (
    <Layout title={"Details"} buttons={<Button>Go Back</Button>}>
      {/* <Container className={Styles.imageWrapper}> */}
      {/* <Image
        className={Styles.image}
        src={`https://image.tmdb.org/t/p/w500${movie?.backdrop_path}`}
        alt="teisng"
        layout="responsive"
        width={500}
        height={281}
      /> */}
      {/* </Container> */}
      <Container className={Styles.headerContainer}>
        <Container className={Styles.imageWrapper}>
          <Image
            className={Styles.image}
            src={`https://image.tmdb.org/t/p/w300${movie?.poster_path}`}
            width={300}
            height={450}
            alt=""
            layout={"fixed"}
          />
        </Container>
        <Container className={Styles.infoContainer}>
          <BigTitle>{movie.title}</BigTitle>
          <Rating name="read-only" value={4} readOnly />

          <Text>{movie.overview}</Text>
        </Container>
        <iframe
          width="90%"
          style={{ aspectRatio: "16 / 9" }}
          src={`https://www.youtube-nocookie.com/embed/${ytUrl}`}
          title={`Youtube | ${movie.title}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
          allowFullScreen
        ></iframe>
        {JSON.stringify(reviews)}
      </Container>
    </Layout>
  );
}
