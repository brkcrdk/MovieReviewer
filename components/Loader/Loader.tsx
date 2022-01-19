import { SpinnerDotted } from "spinners-react";
import Backdrop from "@mui/material/Backdrop";

export default function Loader({ open }) {
  return (
    <Backdrop component={"div"} open={open}>
      <SpinnerDotted
        enabled={true}
        size={90}
        thickness={180}
        speed={75}
        color="var(--accent)"
      />
    </Backdrop>
  );
}
