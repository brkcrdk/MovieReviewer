import {
  Button,
  TextField,
  Typography,
  Modal as MModal,
  Box,
} from "@mui/material";
import Styles from "./Modal.module.css";

export function Modal({ isOpen, children }) {
  return (
    <MModal className={Styles.modal} open={isOpen}>
      <Box className={Styles["modal--container"]}>{children}</Box>
    </MModal>
  );
}
