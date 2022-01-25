import { useRouter } from "next/router";
import { fromBase64 } from "Utils/other";

export default function InviteToGroup() {
  const {
    query: { id },
  }: any = useRouter();

  const realId = fromBase64(id);

  return null;
}
