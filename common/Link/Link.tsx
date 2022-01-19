import { Link } from "@mui/material";

export default function LinkToId({ to, children, color = "inherit" }) {
  return (
    <Link href={to} color={color}>
      {children}
    </Link>
  );
}
