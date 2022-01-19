import { Card, CardActionArea } from "@mui/material";
import { Box } from "@mui/system";
import { SmallTitle } from "common";
import Styles from "./AddMovieCard.module.scss";
import PlusOneRoundedIcon from "@mui/icons-material/PlusOneRounded";

export default function AddMovieCard({ onClick }) {
  // const [overview, setOverview] = useState(oldOverview);
  // const [title, setTitle] = useState(oldTitle);
  // const [image, setImage] = useState(
  //   `https://image.tmdb.org/t/p/w500${backdropImage}`
  // );

  // function splitText(what: string, length: number): string {
  //   const oldWhat = what;
  //   const overviewArr = what.split("");
  //   overviewArr[length] = "§";
  //   const stringOverview = overviewArr.join("");
  //   const niceOverview = stringOverview.split("§")[0];
  //   if (!(oldWhat === niceOverview)) {
  //     return `${niceOverview}... `;
  //   }
  //   return niceOverview;
  // }

  // useEffect(() => {
  //   if (oldOverview.length > 80) {
  //     setOverview(splitText(oldOverview, 80));
  //   }
  //   if (title.length > 20) {
  //     setTitle(splitText(oldTitle, 20));
  //   }
  // }, []);

  return (
    <Card className={Styles.card}>
      <CardActionArea className={Styles["card-wrapper"]} onClick={onClick}>
        {/* <CardMedia
          component="img"
          onError={() => {
            setImage(`/img/jpg/not-available.jpg`);
          }}
          image={image}
          className={Styles.img}
        /> */}
        <Box className={Styles["card--container"]}>
          <PlusOneRoundedIcon
            fontSize="large"
            className={Styles.icon}
          ></PlusOneRoundedIcon>
          <SmallTitle>Add Movie!</SmallTitle>
        </Box>
      </CardActionArea>
    </Card>
  );
}
