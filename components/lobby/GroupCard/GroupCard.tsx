import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Container, SmallTitle } from "common";
import _ from "./GroupCard.module.css";
import {
  Button,
  CardMedia,
  IconButton,
  Menu,
  MenuItem,
  Skeleton,
} from "@mui/material";
import { useRouter } from "next/router";
import Link from "next/link";
import MoreVertIcon from "@mui/icons-material/MoreVert";

export default function MovieCard({ data, image }) {
  const { name, id } = data;
  const { push } = useRouter();

  return (
    <Card className={_.card}>
      {image ? (
        <CardMedia
          component="img"
          image={image}
          alt="Paella dish"
          height="150"
          loading="lazy"
          className={_.image}
        />
      ) : (
        <Skeleton variant={"rectangular"} height={150} />
      )}
      <CardContent className={_["card--container"]}>
        {image ? (
          // <Link href={`groups/${id}/m`} passHref>
          //   <a className={_.btn}>

          <h1 className={_.title} onClick={() => push(`groups/${id}/m`)}>
            {name}
          </h1>
        ) : (
          //   </a>
          // </Link>
          <Skeleton variant={"text"} height={40} />
        )}

        <IconButton
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <MoreVertIcon />
        </IconButton>
      </CardContent>
    </Card>
  );
}
