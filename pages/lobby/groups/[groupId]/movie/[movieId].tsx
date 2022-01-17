import Layout from "Layouts/movie/MovieLayout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  Container,
  BigTitle,
  Text,
  Title,
  SmallTitle,
  BiggestTitle,
} from "common";
import Styles from "Styles/lobby/groups/[groupId]/movie/[movieId].module.scss";
import { useClient, getClient } from "Hooks/supabase";
import Image from "next/image";
import { Button, Link, Paper, Rating } from "@mui/material";
import Review from "Components/lobby/Review/Review";
import useMediaQuery from "@mui/material/useMediaQuery";

export async function getServerSideProps({ query }) {
  const client = getClient();

  const { data } = await client
    .from("movies")
    .select()
    .eq("group_id", query.groupId)
    .eq("id", query.movieId);
  return {
    props: {
      movie: data[0],
    },
  };
}

export default function MovieDet({ movie }) {
  const [ytUrl, setYtUrl] = useState("");
  const [reviews, setReviews] = useState([]);

  const router = useRouter();

  const client = useClient();
  const matches = useMediaQuery("(max-width: 550px)");

  useEffect(() => {
    if (router.query.movieId && router.query.movieId) {
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

  const getGroupId = () => router.query.groupId;

  function watch() {
    window.open("https://youtube.com/watch?v=" + ytUrl, "_blank");
  }

  return (
    <Layout
      title={"Details"}
      haveReviews={reviews.length}
      image={`https://image.tmdb.org/t/p/w300${movie?.poster_path}`}
      buttons={
        <Button
          onClick={() => router.push(`/lobby/groups/${getGroupId()}/movies`)}
        >
          Go Back
        </Button>
      }
    >
      <Container className={Styles.container}>
        <Container className={Styles.infoContainer}>
          <BiggestTitle>{movie.title}</BiggestTitle>
          <Container className={Styles.ratingContainer}>
            <Rating name="read-only" value={4} readOnly />{" "}
            <Button>Rate Movie</Button>
          </Container>

          <Text>{movie.overview}</Text>
        </Container>

        {ytUrl ? (
          <Container
            className={
              (Styles.videoContainer, matches ? Styles.isMobile : null)
            }
          >
            <SmallTitle>Preview</SmallTitle>
            <Container id="video" style={{ scrollMarginTop: "10rem" }}>
              {!matches ? (
                <iframe
                  width="100%"
                  style={{ aspectRatio: "16 / 9", maxWidth: 600 }}
                  src={`https://www.youtube-nocookie.com/embed/${ytUrl}`}
                  title={`Youtube | ${movie.title}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                  allowFullScreen
                  className={Styles.iframe}
                ></iframe>
              ) : (
                <Button onClick={watch}>Watch the preview</Button>
              )}
            </Container>
          </Container>
        ) : (
          <SmallTitle>This movie does not have any clips</SmallTitle>
        )}
        {reviews.length ? <SmallTitle>Reviews</SmallTitle> : null}

        <Container
          className={Styles.reviewContainer}
          id="reviews"
          style={{ scrollMarginTop: "5rem" }}
        >
          {reviews.map(({ author, author_details, content }, i) => {
            let rating: number;
            if (author_details.rating) {
              rating = author_details.rating / 2;
            }
            const options = {
              author,
              authorDetails: author_details,
              content,
              rating,
            };
            return <Review key={i} {...options}></Review>;
          })}
        </Container>
      </Container>
    </Layout>
  );
}
