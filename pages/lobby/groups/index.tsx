import LobbyLayout from "Layouts/lobby/LobbyLayout";
import { BigTitle, SmallText, SmallTitle } from "common";
import { useClient } from "Hooks/supabase";
import { useCallback, useEffect, useState } from "react";
import GroupCard from "Components/lobby/GroupCard/GroupCard";
import { Divider, IconButton, TextField } from "@mui/material";
import { Container } from "common";
import { Button } from "@mui/material";
import Styles from "Styles/lobby/index.module.css";
import { Modal } from "common";
import { useFormik } from "formik";
import ReplayIcon from "@mui/icons-material/Replay";

import * as Val from "yup";

export function getServerSideProps() {
  return {
    props: {}, // will be passed to the page component as props
  };
}

export default function Lobby() {
  const client = useClient();
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    if (!client.auth.user()) {
      client.auth.signIn({ provider: "google" });
    }

    async function getGroups() {
      const user = client.auth.user();
      const { data, error } = await client
        .from("groups")
        .select()
        .filter("owner_id", "like", user.id)
        .order("created_at", { ascending: false });
      if (error) console.log(error);
      return { data, error };
    }
    getGroups().then(({ data }) => {
      setGroups(data);
    });
  }, [client]);

  async function getGroups() {
    const user = client.auth.user();
    const { data, error } = await client
      .from("groups")
      .select()
      .filter("owner_id", "like", user.id)
      .order("created_at", { ascending: false });
    if (error) console.log(error);
    return { data, error };
  }

  async function updateGroups() {
    const { data, error } = await getGroups();
    error
      ? console.error(`LOBBY: INDEX > ${JSON.stringify(error)}`)
      : setGroups(data);
  }

  const [isOpen, setIsOpen] = useState(false);

  // const validation = Val.object().shape({
  //   groupName: Val.string()
  //     .required()
  //     .min(3, "Can't be shorter than 3 characters!")
  //     .max(20, "Can't be longer than 20 characters!"),
  // });

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <>
      <LobbyLayout
        title="Groups"
        buttons={
          <HeaderButtons updateGroups={updateGroups} toggleOpen={toggleOpen} />
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
        update={updateGroups}
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
        <ReplayIcon className={Styles["reload-btn"]}></ReplayIcon>
      </IconButton>

      <Button size="large" variant="outlined" onClick={toggleOpen}>
        Add a group
      </Button>
    </>
  );
}

function ModalComponent({ isOpen, toggleOpen, update }) {
  const client = useClient();

  async function createGroup(event) {
    event.preventDefault();
    const [{ value: groupName }] = event.target;
    const user = client.auth.user();
    await client
      .from("groups")
      .insert([{ name: groupName, icon: "tesing", owner_id: user.id }]);
    await update();
    toggleOpen();
  }

  return (
    <Modal isOpen={isOpen}>
      <SmallTitle>Add a group</SmallTitle>
      <form className={Styles["form"]} onSubmit={createGroup}>
        <TextField
          className={Styles["input--groupname"]}
          label="Group Name"
          name="groupName"
          variant="filled"
        />

        <input
          accept="image/*"
          className={Styles.input}
          style={{ display: "none" }}
          id="raised-button-file"
          multiple
          type="file"
          name="input"
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

{
  /* {formik.errors.groupName ? (
        <div className={Styles["error-msg"]}>
          <SmallText></SmallText>
        </div>
      ) : null} */
}
