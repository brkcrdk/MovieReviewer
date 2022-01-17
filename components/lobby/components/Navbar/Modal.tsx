import { Button, TextField, Typography, Modal } from "@mui/material";
import { Box } from "@mui/material";
import Styles from "./Modal.module.css";
import { SmallTitle, SmallText } from "common";
import { useFormik } from "formik";
import * as Val from "yup";

interface Inputs {
  isOpen: boolean;
  toggleOpen: Function;
  onSubmit: Function;
}

export default function NavbarModal({ isOpen, toggleOpen, onSubmit }: Inputs) {
  const validation = Val.object().shape({
    groupName: Val.string()
      .required()
      .min(3, "Can't be shorter than 3 characters!")
      .max(20, "Can't be longer than 20 characters!"),
  });

  const formik = useFormik({
    initialValues: {
      groupName: "",
    },
    validationSchema: validation,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <Modal
      open={isOpen}
      className={Styles["modal"]}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className={Styles["modal--container"]}>
        <SmallTitle>Create a Movie Group!</SmallTitle>
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
            >
              Create Group
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
}
