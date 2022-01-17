import Navbar from "Components/lobby/Navbar/Navbar";
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

export default function Lobby() {
  const client = useClient();
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    if (!client.auth.user()) {
      client.auth.signIn({ provider: "google" });
    }
    getGroups().then(({ data }) => {
      setGroups(data);
    });
  }, [client.auth]);

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

  async function createGroup({ groupName: name }) {
    const user = client.auth.user();
    await client
      .from("groups")
      .insert([{ name, icon: "tesing", owner_id: user.id }]);
    await updateGroups();
  }

  async function updateGroups() {
    const { data, error } = await getGroups();
    error
      ? console.error(`LOBBY: INDEX > ${JSON.stringify(error)}`)
      : setGroups(data);
  }

  const [isOpen, setIsOpen] = useState(false);

  function toggleOpen() {
    setIsOpen(!isOpen);
  }

  const validation = Val.object().shape({
    groupName: Val.string()
      .required()
      .min(3, "Can't be shorter than 3 characters!")
      .max(20, "Can't be longer than 20 characters!"),
  });

  const formik = useFormik({
    initialValues: {
      groupName: "",
      groupIcon: "",
    },
    validationSchema: validation,
    onSubmit: (values) => {
      console.log(values);
      // createGroup(values);
      toggleOpen();
    },
  });

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
      <ModalComp isOpen={isOpen} formik={formik} toggleOpen={toggleOpen} />
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

function ModalComp({ isOpen, toggleOpen, formik }) {
  return (
    <Modal isOpen={isOpen}>
      <SmallTitle>Add a group</SmallTitle>
      <FormContent formik={formik} toggleOpen={toggleOpen} />
    </Modal>
  );
}

function FormContent({ formik, toggleOpen }) {
  return (
    <form onSubmit={formik.handleSubmit} className={Styles["form"]}>
      <TextField
        className={Styles["input--groupname"]}
        label="Group Name"
        name="groupName"
        onChange={formik.handleChange}
        variant="filled"
        value={formik.values.groupName}
      />
      {formik.errors.groupName ? (
        <div className={Styles["error-msg"]}>
          <SmallText>{formik.errors.groupName}</SmallText>
        </div>
      ) : null}
      <input
        accept="image/*"
        className={Styles.input}
        style={{ display: "none" }}
        id="raised-button-file"
        multiple
        type="file"
        onChange={formik.handleChange}
        value={formik.values.groupIcon}
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

        <Button
          size="large"
          variant="contained"
          onClick={formik.submitForm}
          disabled={!formik.isValid}
        >
          Create Group
        </Button>
      </div>
    </form>
  );
}
