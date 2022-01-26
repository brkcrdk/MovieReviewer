import {
  Button,
  TextField,
  Typography,
  Modal as MModal,
  Box,
  ClickAwayListener,
} from "@mui/material";
import Styles from "./Modal.module.css";

export function Modal({ isOpen, children, removeModal = () => {} }) {
  return (
    <MModal className={Styles.modal} open={isOpen} tabIndex={-1}>
      <Box className={Styles["modal--container"]}>{children}</Box>
    </MModal>
  );
}
