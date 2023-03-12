import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import ErrorComponent from "../../../components/ErrorComponent";
import Header from "../../../components/Header";

import FreelancePetSitterProfile from "../../../components/Profile/FreelancePetSitterProfile";
import PetHotelProfile from "../../../components/Profile/PetHotelProfile";
import PetOwnerProfile from "../../../components/Profile/PetOwnerProfile";
import { UserType } from "../../../types/user";
import { api } from "../../../utils/api";

const ProfilePage: NextPage = () => {
  const router = useRouter();
  const { username } = router.query;
  const { data: session } = useSession();
  const editable = session?.user?.username
    ? session?.user?.username == username
    : false;

  const { data, error: userError } = api.user.getForProfilePage.useQuery(
    { username: typeof username === "string" ? username : "" },
    {
      enabled: typeof username === "string",
    }
  );

  if (userError)
    return <ErrorComponent message={userError.message}></ErrorComponent>;
  if (data === undefined)
    return (
      <div>
        <Header></Header>
        Loading...
      </div>
    );
  if (data === null)
    return <ErrorComponent message={"User Not Found"}></ErrorComponent>;

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
      return <ErrorComponent message={"User Type Not Found"}></ErrorComponent>;
  }
};

export default ProfilePage;
