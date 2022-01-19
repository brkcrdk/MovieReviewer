import { Button } from "@mui/material";
import { useClient } from "Hooks/supabase";
import { useRouter } from "next/router";

interface Inputs {
  variant: "text" | "outlined" | "contained";
  toRoute: string;
}
export function SignOut({ variant, toRoute }: Inputs) {
  const client = useClient();
  const router = useRouter();
  // Come to the movie details page
  function signOut() {
    client.auth.signOut();
    router.push(toRoute);
  }

  return (
    <Button variant={variant} onClick={signOut}>
      Sign out
    </Button>
  );
}
