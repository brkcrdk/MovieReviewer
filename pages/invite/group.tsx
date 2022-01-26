import { Button } from "@mui/material";
import { Container, Modal, SmallTitle, Text, Title } from "common";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getUserFromUUID } from "Services/auth";
import { getGroupFromId, getGroupIconFromGroupId } from "Services/db";
import { fromBase64 } from "Utils/other";
import Styles from "styles/invite/group.module.scss";
import Lottie from "react-lottie";
import Animation from "common/lotties/ani.json";
export default function InviteToGroup() {
  const {
    query: { id, user_id: userId },
  }: any = useRouter();

  const [user, setUser] = useState(null);
  const [group, setGroup] = useState(null);
  const [icon, setIcon] = useState(null);
  const [owner, setOwner] = useState(null);
  const [answer, setAnswer] = useState(null);
  const { push } = useRouter();

  const groupId = fromBase64(id);

  useEffect(() => {
    const getUser = async () => {
      const [data, error] = await getUserFromUUID(userId);
      setUser(data);
    };

    const getGroup = async () => {
      const [data] = await getGroupFromId(groupId);
      setGroup(data);
      const [icon] = await getGroupIconFromGroupId(groupId);
      setIcon(icon);
    };
    const getOwner = async () => {
      const [{ name }] = await getUserFromUUID(group.owner_id);
      setOwner(name);
    };

    getUser();
    getGroup();
    if (group?.owner_id) getOwner();
  }, [userId, groupId, group?.owner_id]);

  useEffect(() => {
    if (answer === true) {
      setAnswer(true);
      setTimeout(() => push(`/lobby/groups/${groupId}/m`), 3000);
    } else if (answer === false) {
      console.log("no");
    }
  }, [answer, groupId, push]);

  return (
    <Modal isOpen={true}>
      {answer === null ? (
        <Base
          onTrue={() => setAnswer(true)}
          onFalse={() => setAnswer(false)}
          owner={owner}
          user={user}
          icon={icon}
          groupId={groupId}
          group={group}
        />
      ) : answer === true ? (
        <Done />
      ) : (
        <Reject onFalse={() => {}} onTrue={() => {}} />
      )}
    </Modal>
  );
}

function Done() {
  const options = {
    loop: false,

    autoplay: true,
    animationData: Animation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return <Lottie options={options} height={400} width={400} />;
}

function Reject({ onFalse, onTrue }) {
  return (
    <>
      <SmallTitle>Invitation</SmallTitle>
      <Text>Are you sure?</Text>
      <Container className={Styles.btnContainer}>
        <Button variant="outlined" size={"large"} onClick={onTrue}>
          Join
        </Button>
        <Button variant="contained" size={"large"} onClick={onFalse}>
          Reject
        </Button>
      </Container>
    </>
  );
}

function Base({ onTrue, onFalse, user, groupId, icon, group, owner }) {
  return (
    <>
      <SmallTitle>Invitation</SmallTitle>
      {user && groupId ? (
        <>
          <Text>
            <code>{user.name}</code> would like to invite you to their group!
          </Text>

          <Container className={Styles.groupContainer}>
            {icon && (
              <Image
                src={icon}
                width={120}
                height={100}
                className={Styles.image}
                alt="Group icon"
              />
            )}
            {group && (
              <Container className={Styles.groupInfo}>
                <Title>{group.name}</Title>
                <Text>{owner}</Text>
              </Container>
            )}
          </Container>
        </>
      ) : (
        <Text>Loading</Text>
      )}
      <Container className={Styles.btnContainer}>
        <Button variant="outlined" size={"large"} onClick={onFalse}>
          Reject
        </Button>
        <Button variant="contained" size={"large"} onClick={onTrue}>
          Join
        </Button>
      </Container>
    </>
  );
}

//
