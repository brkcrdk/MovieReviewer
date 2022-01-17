import Layout from "Layouts/movie/MovieLayout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Container, BigTitle, Text, Title, SmallTitle } from "common";
import Styles from "Styles/lobby/groups/[groupId]/movie/[movieId].module.scss";
import { useClient } from "Hooks/supabase";
import Image from "next/image";
import { Button, Link, Paper, Rating } from "@mui/material";
import Review from "Components/lobby/Review/Review";

export default function MovieDet() {
  const router = useRouter();

  const [ytUrl, setYtUrl] = useState("");
  const [reviews, setReviews] = useState([]);

  const [movie, setMovie] = useState({
    title: "Loading",
    backdrop_path: "",
    overview: "loading",
    poster_path: "",
  });

  useEffect(() => {
    console.log(movie);
  }, [movie]);

  const client = useClient();

  useEffect(() => {
    if (router.query.movieId && router.query.movieId) {
      client
        .from("movies")
        .select()
        .eq("group_id", router.query.groupId)
        .eq("id", router.query.movieId)
        .then(({ error, data }) => {
          if (error) console.log("ERROR: " + JSON.stringify(error));
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

  function getGroupId() {
    const { query } = router;
    console.log(query.groupId);
    return query.groupId;
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
        {/* <Container className={Styles.imageWrapper}>
          <Image
            className={Styles.image}
            src={`https://image.tmdb.org/t/p/w300${movie?.poster_path}`}
            width={300}
            height={450}
            alt=""
            layout={"fixed"}
          />
          <Paper className={Styles.btnContainer}>
            {ytUrl || reviews.length ? (
              <Link href="#header">Go to header</Link>
            ) : null}
            {ytUrl ? <Link href="#video">Go to Video</Link> : null}
            {reviews.length ? <Link href="#reviews">Go to reviews</Link> : null}
          </Paper>
        </Container> */}
        <Container className={Styles.infoContainer}>
          <BigTitle>{movie.title}</BigTitle>
          <Container className={Styles.ratingContainer}>
            <Rating name="read-only" value={4} readOnly />{" "}
            <Button>Rate Movie</Button>
          </Container>

          <Text>{movie.overview}</Text>
        </Container>

        {ytUrl ? (
          <>
            <SmallTitle>Preview</SmallTitle>
            <Container id="video" style={{ scrollMarginTop: "10rem" }}>
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
            </Container>
          </>
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
      {/* <Container className={Styles.headerContainer}>
        <Container className={Styles.imageWrapper}>
          <Image
            className={Styles.image}
            src={`https://image.tmdb.org/t/p/w300${movie?.poster_path}`}
            width={300}
            height={450}
            alt=""
            layout={"fixed"}
          />
          <Paper className={Styles.btnContainer}>
            {ytUrl || reviews.length ? (
              <Link href="#header">Go to header</Link>
            ) : null}
            {ytUrl ? <Link href="#video">Go to Video</Link> : null}
            {reviews.length ? <Link href="#reviews">Go to reviews</Link> : null}
          </Paper>
        </Container>
        <Container className={Styles.infoContainer}>
          <BigTitle>{movie.title}</BigTitle>
          <Container className={Styles.ratingContainer}>
            <Rating name="read-only" value={4} readOnly />{" "}
            <Button>Rate Movie</Button>
          </Container>

          <Text>{movie.overview}</Text>
        </Container>
        {ytUrl ? (
          <Container id="video" style={{ scrollMarginTop: "10rem" }}>
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
          </Container>
        ) : (
          <SmallTitle>This movie does not have any clips</SmallTitle>
        )}

        <Container>
          {reviews.length ? (
            <Title className={Styles.reviewTitle}>
              Reviews from other sources
            </Title>
          ) : (
            <SmallTitle>This movie does not have any reviews</SmallTitle>
          )}
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
      </Container> */}
    </Layout>
  );
}

//  <Layout
//     title={"Details"}
//     buttons={
//       <Button
//         onClick={() => router.push(`/lobby/groups/${getGroupId()}/movies`)}
//       >
//         Go Back
//       </Button>
//     }
//   >
//     <Container className={Styles.headerContainer}>
//       <Container className={Styles.imageWrapper}>
//         <Image
//           className={Styles.image}
//           src={`https://image.tmdb.org/t/p/w300${movie?.poster_path}`}
//           width={300}
//           height={450}
//           alt=""
//           layout={"fixed"}
//         />
//         <Paper className={Styles.btnContainer}>
//           {ytUrl || reviews.length ? (
//             <Link href="#header">Go to header</Link>
//           ) : null}
//           {ytUrl ? <Link href="#video">Go to Video</Link> : null}
//           {reviews.length ? <Link href="#reviews">Go to reviews</Link> : null}
//         </Paper>
//       </Container>
//       <Container className={Styles.infoContainer}>
//         <BigTitle>{movie.title}</BigTitle>
//         <Container className={Styles.ratingContainer}>
//           <Rating name="read-only" value={4} readOnly />{" "}
//           <Button>Rate Movie</Button>
//         </Container>

//         <Text>{movie.overview}</Text>
//       </Container>
//       {ytUrl ? (
//         <Container id="video" style={{ scrollMarginTop: "10rem" }}>
//           <iframe
//             width="100%"
//             style={{ aspectRatio: "16 / 9", maxWidth: 600 }}
//             src={`https://www.youtube-nocookie.com/embed/${ytUrl}`}
//             title={`Youtube | ${movie.title}`}
//             frameBorder="0"
//             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
//             allowFullScreen
//             className={Styles.iframe}
//           ></iframe>
//         </Container>
//       ) : (
//         <SmallTitle>This movie does not have any clips</SmallTitle>
//       )}

//       <Container>
//         {reviews.length ? (
//           <Title className={Styles.reviewTitle}>
//             Reviews from other sources
//           </Title>
//         ) : (
//           <SmallTitle>This movie does not have any reviews</SmallTitle>
//         )}
//         <Container
//           className={Styles.reviewContainer}
//           id="reviews"
//           style={{ scrollMarginTop: "5rem" }}
//         >
//           {reviews.map(({ author, author_details, content }, i) => {
//             let rating: number;
//             if (author_details.rating) {
//               rating = author_details.rating / 2;
//             }
//             const options = {
//               author,
//               authorDetails: author_details,
//               content,
//               rating,
//             };
//             return <Review key={i} {...options}></Review>;
//           })}
//         </Container>
//       </Container>
//     </Container>
//   </Layout>
