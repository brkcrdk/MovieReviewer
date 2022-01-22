import Layout from "layouts/movie/MovieLayout";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import {
  Container,
  Text,
  SmallTitle,
  Modal,
  SmallText,
  BigTitle,
} from "common";
import Skeleton from "@mui/material/Skeleton";
import Styles from "Styles/lobby/groups/[groupId]/movie/[movieId].module.scss";
import { supabaseClient } from "utils";
import { Button, Rating, useMediaQuery } from "@mui/material";
import Review from "Components/lobby/Review/Review";
import { getReviews } from "Services/api/reviews";
import { getMovie, getRatingFromAuthor } from "Services/db";

export async function getServerSideProps({ query }) {
  return {
    props: {},
  };
}

export default function MovieDet() {
  const [ytUrl, setYtUrl] = useState("");
  const [extReviews, setExtReviews] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isReviewModal, setReviewModal] = useState(false);
  const [rating, setRating] = useState<any>(null);
  const [movie, setMovie] = useState({
    title: "",
    overview: "",
    poster_path: "",
  });
  const matches = useMediaQuery("(max-width: 800px)");
  const titleMatches = useMediaQuery("(max-width: 800px)");

  function splitText(what: string, length: number): string {
    const oldWhat = what;
    const overviewArr = what.split("");
    overviewArr[length] = "§";
    const stringOverview = overviewArr.join("");
    const niceOverview = stringOverview.split("§")[0];
    if (!(oldWhat === niceOverview)) {
      return `${niceOverview}... `;
    }
    return niceOverview;
  }

  const client = supabaseClient;

  const {
    query: { groupId, movieId },
    push,
  } = useRouter();

  const getYtUrl = useCallback(async () => {
    const prom = await fetch("/api/movie/clips/" + movieId);
    const { key } = await prom.json();
    setYtUrl(key);
  }, [movieId]);

  useEffect(() => {
    async function main() {
      await getYtUrl();

      const data = await getReviews(movieId);
      setExtReviews(data);

      const [movie, error] = await getMovie(groupId, movieId);
      setMovie(movie);

      const user = client.auth.user();
      const [rating, reviewError] = await getRatingFromAuthor(
        user.id,
        movieId as string,
        groupId as string
      );

      setRating(rating?.rating || null);

      setLoading(false);
    }
    main();
  }, [getYtUrl, movieId, groupId, client.auth]);

  function watch() {
    window.open("https://youtube.com/watch?v=" + ytUrl, "_blank");
  }

  async function submitReview(e) {
    e.preventDefault();

    const user = client.auth.user();
    console.log(rating);
    if (rating) {
      const { error } = await client.from("reviews").upsert({
        owner_id: user.id,
        group_id: groupId,
        rating: rating,
        movie_id: movieId,
      });
      if (error) console.error(error);
    } else {
      await client
        .from("reviews")
        .delete()
        .eq("movie_id", movieId)
        .eq("group_id", groupId)
        .eq("owner_id", user.id);
    }
    setReviewModal(false);
  }

  return (
    <Layout
      title={"Details"}
      haveReviews={!!extReviews}
      image={`https://image.tmdb.org/t/p/w300${movie?.poster_path}`}
      loading={isLoading}
    >
      <Container className={Styles.container}>
        <Container className={Styles.infoContainer}>
          <Container className={Styles.titleContainer}>
            {isLoading ? (
              <Skeleton variant="text" height={85} />
            ) : (
              <BigTitle className={Styles.movieTitle}>
                {titleMatches ? splitText(movie.title, 10) : movie?.title}
              </BigTitle>
            )}
            <Button
              variant="outlined"
              onClick={() => push(`/lobby/groups/${groupId}/m`)}
            >
              Go back
            </Button>
          </Container>
          <Container className={Styles.ratingContainer}>
            {!!rating ? (
              <>
                <Container className={Styles.ratingWrapper}>
                  <SmallText className={Styles.rateText}>You rated:</SmallText>
                  <Rating value={rating} precision={0.5} readOnly />
                </Container>
                <Button onClick={() => setReviewModal(true)}>Edit</Button>
              </>
            ) : (
              <>
                <Rating name="read-only" value={4} readOnly />
                <Button onClick={() => setReviewModal(true)}>Rate Movie</Button>
              </>
            )}
            <Modal isOpen={isReviewModal}>
              <SmallTitle>What do you think of the movie?</SmallTitle>
              <form onSubmit={submitReview}>
                <Rating
                  name="simple-controlled"
                  value={rating}
                  precision={0.5}
                  onChange={(_, value) => {
                    setRating(value as any);
                  }}
                />
                <Container>
                  <Button type="submit">Submit</Button>
                  <Button onClick={() => setReviewModal(false)}>close</Button>
                </Container>
              </form>
            </Modal>
          </Container>
          {isLoading ? (
            <Skeleton variant="text" height={200} />
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
            <Container
              id="video"
              className={Styles.video}
              style={{ scrollMarginTop: "5rem" }}
            >
              {!matches ? (
                <iframe
                  width="100%"
                  style={{
                    aspectRatio: "16 / 9",
                    maxWidth: 600,
                  }}
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
        {!!extReviews.length && <SmallTitle>Reviews</SmallTitle>}

        <Container
          className={Styles.reviewContainer}
          id="reviews"
          style={{ scrollMarginTop: "5rem" }}
        >
          {!!extReviews &&
            extReviews.map(({ author, author_details, content }, i) => {
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
