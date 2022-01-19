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
import Skeleton from "@mui/material/Skeleton";
import Styles from "Styles/lobby/groups/[groupId]/movie/[movieId].module.scss";
import { useClient } from "Hooks/supabase";
import { Button, Rating } from "@mui/material";
import Review from "Components/lobby/Review/Review";
import useMediaQuery from "@mui/material/useMediaQuery";

export async function getServerSideProps({ query }) {
  return {
    props: {},
  };
}

export default function MovieDet() {
  const [ytUrl, setYtUrl] = useState("");
  const [reviews, setReviews] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [movie, setMovie] = useState({
    title: "",
    overview: "",
    poster_path: "",
  });

  const {
    query: { groupId, movieId },
    push,
  } = useRouter();

  const client = useClient();
  const matches = useMediaQuery("(max-width: 550px)");

  useEffect(() => {
    if (movieId && groupId) {
      const getUrl = async () => {
        const prom = await fetch("/api/movie/clips/" + movieId);
        const { key } = await prom.json();
        setYtUrl(key);
      };
      getUrl();

      const getReviews = async () => {
        const prom = await fetch(`/api/movie/reviews/${movieId}`);
        const reviews = await prom.json();
        setReviews(reviews);
      };
      getReviews();

      client
        .from("movies")
        .select()
        .eq("group_id", groupId)
        .eq("movie_id", movieId)
        .then(({ data, error }) => {
          if (error && !data.length) push(`/lobby/groups/${groupId}/m`);
          else {
            setMovie(data[0]);
            setLoading(false);
          }
        });
    }
  }, [groupId, movieId, client, push]);

  function watch() {
    window.open("https://youtube.com/watch?v=" + ytUrl, "_blank");
  }

  return (
    <Layout
      title={"Details"}
      haveReviews={reviews.length}
      image={`https://image.tmdb.org/t/p/w300${movie?.poster_path}`}
      loading={isLoading}
    >
      <Container className={Styles.container}>
        <Container className={Styles.infoContainer}>
          <Container className={Styles.titleContainer}>
            {isLoading ? (
              <Skeleton variant="text" height={85} />
            ) : (
              <BiggestTitle>{movie?.title}</BiggestTitle>
            )}
            <Button
              variant="outlined"
              onClick={() => push(`/lobby/groups/${groupId}/m`)}
            >
              Go back
            </Button>
          </Container>
          <Container className={Styles.ratingContainer}>
            <Rating name="read-only" value={4} readOnly />{" "}
            <Button>Rate Movie</Button>
          </Container>
          {isLoading ? (
            <Skeleton variant="text" height={200}></Skeleton>
          ) : (
            <Text>{movie?.overview}</Text>
          )}
        </Container>
        {ytUrl ? (
          <Container
            className={`${Styles.videoContainer} ${
              matches ? Styles.isMobile : null
            }`}
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
                />
              ) : (
                <Button onClick={watch}>Watch the preview</Button>
              )}
            </Container>
          </Container>
        ) : (
          <SmallTitle>This movie does not have any clips</SmallTitle>
        )}
        {!!reviews.length && <SmallTitle>Reviews</SmallTitle>}

        <Container
          className={Styles.reviewContainer}
          id="reviews"
          style={{ scrollMarginTop: "5rem" }}
        >
          {reviews.length !== 0 &&
            reviews.map(({ author, author_details, content }, i) => {
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
              return <Review key={i} {...options} />;
            })}
        </Container>
      </Container>
    </Layout>
  );
}
