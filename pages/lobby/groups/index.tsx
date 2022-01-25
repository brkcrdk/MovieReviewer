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
    if (!supabaseClient.auth.user())
      supabaseClient.auth.signIn({ provider: "google" });
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
  const { query } = useRouter();

  async function createGroup(event) {
    function load(id, { currentTarget }) {
      const file = currentTarget.result;
      supabaseClient.storage.from("images").upload(`groups/${id}.jpeg`, file);
      console.log(getGroupIconFromId(id));
    }

    event.preventDefault();
    const [
      { value: groupName },
      {
        files: [file],
      },
    ] = event.target;

    const user = supabaseClient.auth.user();
    const {
      data: [data],
    } = await supabaseClient
      .from("groups")
      .insert([{ name: groupName, owner_id: user.id }]);
    await update();
    toggleOpen();

    const { type } = file;
    const reader = new FileReader();
    reader.onload = load.bind(this, data.id);
    reader.readAsArrayBuffer(file);
  }

  const fileRef = useRef();

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

        <input
          accept="image/jpeg"
          className={Styles.input}
          style={{ display: "none" }}
          id="raised-button-file"
          multiple
          type="file"
          name="input"
          required
          ref={fileRef}
        />
        <label htmlFor="raised-button-file">
          <Button variant="text" component="span" className={Styles.button}>
            Upload
          </Button>
        </label>
        <div className={Styles["btn-container"]}>
          <Button size="medium" onClick={() => toggleOpen()}>
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
