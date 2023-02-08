import Header from "../Header";
import Image from "next/image";
import Link from "next/link";

const infomationSection = "flex flex-wrap";

const FreelancePetSitterProfile = (props: any) => {
  return (
    <div>
      <Header></Header>
      <div className={infomationSection}>
        <div className="flex w-screen flex-col">
          <div className="relative mx-auto flex h-[4rem] w-[4rem]">
            <Image src={"/profile_icon.png"} alt={"Icon"} fill></Image>
          </div>
          <p className="mx-auto text-center">{props.username}</p>
          <Link
            href={`/user/${props.username}/edit`}
            className="mx-auto text-center"
          >
            Edit my profile
          </Link>
        </div>
        <div className="justify-auto flex flex-wrap">
          <p>Name: Jhon Swogvagen</p>
          <p>Pet type</p>
          <p>Phone: 0123456789</p>
          <p>
            Address: 254 Phaya Thai Rd, Wang Mai, Khet Pathum Wan, Krung Thep
            Maha Nakhon 10330
          </p>
          <p>Email: wiggle-paw@chula.ac.th</p>
        </div>
      </div>
      <div className="mx-auto mt-3 w-screen max-w-md sm:w-1/2">
        <h1 className="font-bold">Posts</h1>
        {/* TODO: Posts display */}
        {/* {users.map((user: any) => (
          <PetSitterCard pet_sitter={user}></PetSitterCard>
        ))} */}
      </div>
    </div>
  );
};

export default FreelancePetSitterProfile;
