import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { UserType } from "../types/user";

export default function Redirector() {
  const session = useSession();
  const router = useRouter();

  if (session.data?.user?.userType === UserType.Admin) {
    void router.push("/admin");
  } else {
    void router.push(
      typeof router.query.prev === "string" ? router.query.prev : "/"
    );
  }
  return <>redirecting woiii</>;
}
