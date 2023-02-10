import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import FreelancePetSitterProfile from "../../components/Profile/FreelancePetSitterProfile";
import PetHotelProfile from "../../components/Profile/PetHotelProfile";
import PetOwnerProfile from "../../components/Profile/PetOwnerProfile";

const Profile: NextPage = () => {
  const router = useRouter();
  const { username } = router.query;

  const { data: session, status } = useSession();
  const editable = session?.user?.username
    ? session?.user?.username == username
    : false;

  const userType: number = 1; //TODO: get user type

  switch (userType) {
    case 0:
      return (
        <PetOwnerProfile
          username={username}
          editable={editable}
        ></PetOwnerProfile>
      );

    case 1:
      return (
        <FreelancePetSitterProfile
          username={username}
          editable={editable}
        ></FreelancePetSitterProfile>
      );

    case 2:
      return (
        <PetHotelProfile
          username={username}
          editable={editable}
        ></PetHotelProfile>
      );

    default:
      return <div>Error จ้า</div>;
  }
};

export default Profile;
