import Header from "../Header";
import type { User, PetSitter, PetOwner } from "@prisma/client";
import { useEffect } from "react";

type PetOwnerProfileProps = {
  editable: boolean;
  user: User & PetOwner;
};

const PetOwnerProfile = (props: PetOwnerProfileProps) => {
  // TODO: Remove once done
  // Show the user data, for dev and debug
  useEffect(() => {
    console.log(props.user);
  }, [props.user]);

  return (
    <div>
      <Header></Header>
      {props.user.username}
    </div>
  );
};

export default PetOwnerProfile;
