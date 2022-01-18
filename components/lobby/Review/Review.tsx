import { Avatar, Paper, Rating } from "@mui/material";
import { Container, SmallText, SmallTitle, Title } from "common";
import Styles from "./Review.module.scss";

const Review = ({ author, authorDetails, content, className = "", rating }) => {
  return (
    <Paper className={`${Styles.paperContainer} ${className}`}>
      <Container className={Styles.paperHeader}>
        <Avatar
          src={`https://${authorDetails.avatar_path.replace("/https://", "")}`}
        />
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
};

export default Review;
