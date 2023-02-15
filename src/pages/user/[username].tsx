import { FreelancePetSitter, PetSitter, User } from "@prisma/client";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import FreelancePetSitterProfile from "../../components/Profile/FreelancePetSitterProfile";
import PetHotelProfile from "../../components/Profile/PetHotelProfile";
import PetOwnerProfile from "../../components/Profile/PetOwnerProfile";
import { UserSubType, UserType } from "../../types/user";
import { api } from "../../utils/api";

const Profile: NextPage = () => {
  const router = useRouter();
  const { username } = router.query;
  const { data: session, status } = useSession();
  const editable = session?.user?.username
    ? session?.user?.username == username
    : false;

  const { data, error: userError } = api.user.getForProfilePage.useQuery(
    { username: typeof username === "string" ? username : "" },
    {
      enabled: typeof username === "string",
    }
  );

  if (userError) return <div>Error จ้า: {userError.message}</div>;
  if (data === undefined) return <div>Loading...</div>;
  if (data === null) return <div>Not found</div>;

  switch (data.userType) {
    case UserType.PetOwner:
      return (
        <PetOwnerProfile user={data} editable={editable}></PetOwnerProfile>
      );

    case UserType.FreelancePetSitter:
      return (
        <FreelancePetSitterProfile
          user={data}
          editable={editable}
        ></FreelancePetSitterProfile>
      );

    case UserType.PetHotel:
      return (
        <PetHotelProfile user={data} editable={editable}></PetHotelProfile>
      );

    default:
      return <div>Error จ้า</div>;
  }
};

export default Profile;
