import Header from "../Header";
import Image from "next/image";

const FreelancePetSitterProfile = (props: any) => {
  return (
    <div>
      <Header></Header>
      <div className="relative m-2 flex h-[4rem] w-[4rem]">
        <Image src={"/profile_icon.png"} alt={"Icon"} fill></Image>
      </div>
      {props.username}
    </div>
  );
};

export default FreelancePetSitterProfile;
