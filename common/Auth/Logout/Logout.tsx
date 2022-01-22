import { Button } from "@mui/material";
import { useRouter } from "next/router";
import { supabaseClient } from "utils";

interface Inputs {
  variant: "text" | "outlined" | "contained";
  toRoute: string;
}
export function SignOut({ variant, toRoute }: Inputs) {
  const router = useRouter();
  // Come to the movie details page
  function signOut() {
    supabaseClient.auth.signOut();
    router.push(toRoute);
  }

  return (
    <Button variant={variant} onClick={signOut}>
      Sign out
    </Button>
  );
}
