import LobbyLayout from "Layouts/lobby/LobbyLayout";
import { useCallback, useRef } from "react";
import { SmallTitle } from "common";
import { useEffect, useState } from "react";
import GroupCard from "Components/lobby/GroupCard/GroupCard";
import { IconButton, TextField } from "@mui/material";
import { Container } from "common";
import { Button } from "@mui/material";
import Styles from "Styles/lobby/index.module.css";
import { Modal } from "common";
import { Replay as ReplayIcon } from "@mui/icons-material";
import { getGroupIconFromId, getGroupsFromAuthor } from "Services/db";
import { supabaseClient } from "utils";
import { useRouter } from "next/router";

export default function Lobby() {
  const [groups, setGroups] = useState([]);

  const getGroups = useCallback(async () => {
    const { id: userId } = supabaseClient.auth.user();
    const [data, error] = await getGroupsFromAuthor(userId);

    setGroups(data as any);
    if (error) console.error(error);
  }, []);

  useEffect(() => {
    if (!supabaseClient.auth.user()) {
      supabaseClient.auth.signIn({ provider: "google" });
    }
    getGroups();
  }, [getGroups]);

  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <>
      <LobbyLayout
        title="Groups"
        buttons={
          <HeaderButtons updateGroups={getGroups} toggleOpen={toggleOpen} />
        }
      >
        <Container className={Styles["groups-container"]}>
          {groups?.map((v, i) => (
            <GroupCard data={v} key={i} />
          ))}
        </Container>
      </LobbyLayout>
      <ModalComponent
        isOpen={isOpen}
        toggleOpen={toggleOpen}
        update={getGroups}
      />
    </>
  );
}

function HeaderButtons({ updateGroups, toggleOpen }) {
  return (
    <>
      <IconButton
        className={Styles["reload-btn-container"]}
        onClick={updateGroups}
      >
        <ReplayIcon className={Styles["reload-btn"]} />
      </IconButton>

      <Button size="large" variant="outlined" onClick={toggleOpen}>
        Add a group
      </Button>
    </>
  );
}

function ModalComponent({ isOpen, toggleOpen, update }) {
  // NOTE: Thomas, i h

  const [selectedImage, setSelectedImage] = useState(null);

  async function createGroup(event) {
    // start loading process
    event.preventDefault();
    const user = supabaseClient.auth.user();
    const groupImage = selectedImage;
    const [{ value: groupName }] = event.target;

    const { data: imageUrl } = await supabaseClient.storage
      .from("images")
      // groups/test123 is images name -> so it should be unique i suppose
      // for now i add unique number to it
      .upload(`groups/${Math.random() * 1000}.jpeg`, groupImage, {
        cacheControl: "3600",
        upsert: false,
      });
    // returns this: images/groups/test123.jpeg
    // NOTE: below url dont work if you dont have required token, so it already protected by supabase
    // works like this: https://kmarruxsftatjzjjuddt.supabase.co/storage/v1/object/images/groups/test123.jpeg

    // after loading image to database we need to add this url or key to group object.
    // after adding to image to our group object, final result should be like this

    // {
    //  created_at: "2022-01-25T19:55:24.571621+00:00",
    //  id: 81,
    //  members: [],
    //  name: "xxx",
    //  owner_id: "ae034ff3-4cf1-473d-be44-e02a617ed4b0",
    //  groupIcon: "images/groups/test123.jpeg",
    // }

    const { data } = await supabaseClient
      .from("groups")
      .insert([{ name: groupName, owner_id: user.id, groupIcon: imageUrl }]);
  }

  const onImageUpload = ({ target }) => {
    const selectedFile = target.files[0];
    setSelectedImage(selectedFile);

    if (target.files[0]) {
      const imageContainer = document.getElementById("image-upload");
      const objectURL = URL.createObjectURL(selectedFile);
      const img = document.createElement("img");
      img.style.maxWidth = "320px";
      img.src = objectURL;
      imageContainer.appendChild(img);
    }
  };

  return (
    <Modal isOpen={isOpen}>
      <SmallTitle>Add a group</SmallTitle>
      <form className={Styles["form"]} onSubmit={createGroup}>
        <TextField
          className={Styles["input--groupname"]}
          label="Group Name"
          name="groupName"
          variant="filled"
          required
        />

        <div id="image-upload">
          <input
            accept="image/jpeg"
            className={Styles.input}
            style={{ display: "none" }}
            id="raised-button-file"
            type="file"
            name="input"
            required
            onChange={onImageUpload}
          />
        </div>

        <label htmlFor="raised-button-file">
          <Button
            variant="text"
            component="span"
            style={{ width: "100%", background: "rgba(144, 202, 249, 0.08)" }}
            className={Styles.button}
          >
            Upload
          </Button>
        </label>
        <div className={Styles["btn-container"]}>
          <Button size="medium" onClick={toggleOpen}>
            close
          </Button>

          <Button size="large" variant="contained" type="submit">
            Create Group
          </Button>
        </div>
      </form>
    </Modal>
  );
}
