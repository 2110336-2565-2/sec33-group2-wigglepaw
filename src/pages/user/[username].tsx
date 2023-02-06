import { NextPage } from "next";
import { useRouter } from "next/router";
import FreelancePetSitterProfile from "../../components/FreelancePetSitterProfile";
import Header from "../../components/Header";
import PetHotelProfile from "../../components/PetHotelProfile";
import PetOwnerProfile from "../../components/PetOwnerProfile";

const Profile: NextPage = () => {
  const router = useRouter();
  const { username } = router.query;
  const userType: number = 0; //TODO: get user type

  switch (userType) {
    case 0:
      return <PetOwnerProfile username={username}></PetOwnerProfile>;

    case 1:
      return (
        <FreelancePetSitterProfile
          username={username}
        ></FreelancePetSitterProfile>
      );

    case 2:
      return <PetHotelProfile username={username}></PetHotelProfile>;

    default:
      return <div>Error จ้า</div>;
  }
};

export default Profile;
