import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Container, SmallTitle } from "common";
import Styles from "./GroupCard.module.css";
import { Button, CardMedia, IconButton, Menu, MenuItem } from "@mui/material";
import { useRouter } from "next/router";
import Link from "next/link";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState } from "react";

export default function MovieCard({ data }) {
  const { name, id } = data;

  return (
    <Card className={Styles.card}>
      <Container>
        <CardMedia
          component="img"
          image="/temp_group.jpg"
          alt="Paella dish"
          height="150"
          className={Styles.image}
        />
        <CardContent className={Styles["card--container"]}>
          <Link href={`groups/${id}/m`} passHref>
            <a className={Styles.btn}>
              <SmallTitle className={Styles.title}>{name}</SmallTitle>
            </a>
          </Link>
          <IconButton
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <MoreVertIcon></MoreVertIcon>
          </IconButton>
          {/* <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>My account</MenuItem>
            <MenuItem onClick={handleClose}>Logout</MenuItem>
          </Menu> */}
        </CardContent>
      </Container>
    </Card>
  );
}
