import Header from "../Header";
import type { User, PetSitter, PetHotel } from "@prisma/client";
import { useEffect } from "react";

type PetHotelProfileProps = {
  editable: boolean;
  user: User & PetSitter & PetHotel;
};

const PetHotelProfile = (props: PetHotelProfileProps) => {
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

export default PetHotelProfile;
