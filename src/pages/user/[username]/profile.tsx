import { setDefaultResultOrder } from "dns";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import FreelancePetSitterProfile from "../../../components/Profile/FreelancePetSitterProfile";
import PetHotelProfile from "../../../components/Profile/PetHotelProfile";
import PetOwnerProfile from "../../../components/Profile/PetOwnerProfile";
import { UserType } from "../../../types/user";
import { api } from "../../../utils/api";

const ProfilePage: NextPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { username } = router.query;

  const { data, error: userError } = api.user.getForProfilePage.useQuery(
    { username: typeof username === "string" ? username : "" },
    {
      enabled: typeof username === "string",
    }
  );

  if (userError) return <div>Error จ้า: {userError.message}</div>;
  if (data === undefined) return <div>Loading...</div>;
  if (data === null) return <div>Not found</div>;

  const editable = session?.user?.username
    ? session?.user?.username == username
    : false;
  const isPetOwner = session?.user?.userType == UserType.PetOwner;

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
          isPetOwner={isPetOwner}
        ></FreelancePetSitterProfile>
      );

    case UserType.PetHotel:
      return (
        <PetHotelProfile
          user={data}
          editable={editable}
          isPetOwner={isPetOwner}
        ></PetHotelProfile>
      );

    default:
      return <div>Error จ้า</div>;
  }
};

export default ProfilePage;
