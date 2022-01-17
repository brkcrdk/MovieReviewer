import { Avatar, Paper, Rating } from "@mui/material";
import { Container, SmallText, SmallTitle, Title } from "common";
import Styles from "./Review.module.scss";

const Review = ({ author, authorDetails, content, className = "", rating }) => (
  <Paper className={`${Styles.paperContainer} ${className}`}>
    <Container className={Styles.paperHeader}>
      <Avatar src={authorDetails.avatar_path.replace("/", "", 1)} />
      <SmallTitle>{author}</SmallTitle>
      <Container className={Styles.ratingContainer}>
        {rating === undefined ? (
          "No Rating"
        ) : (
          <Rating
            value={rating}
            precision={0.5}
            className={Styles.rating}
            readOnly
            disabled={rating === undefined}
          ></Rating>
        )}
      </Container>
    </Container>
    <SmallText>{content}</SmallText>
  </Paper>
);

export default Review;
