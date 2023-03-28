import { useRouter } from "next/router";

export default function VerifyUser() {
  const router = useRouter();
  const username =
    typeof router.query.username === "string" ? router.query.username : "";

  return <>Verifying {username}</>;
}
