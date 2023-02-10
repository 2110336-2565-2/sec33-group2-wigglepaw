import Image from "next/image";
import Link from "next/link";

const PetSitterCard = (props: any) => {
  const name = props.pet_sitter ? props.pet_sitter.username : "NAME";
  const profile_link = props.pet_sitter
    ? "/profile/" + props.pet_sitter.username
    : "/profile/lmao";
  return (
    <Link
      href={profile_link} // TODO: Link to correct user
      className="m-2 flex h-fit rounded-2xl bg-amber-200 p-3 transition-colors hover:bg-amber-100 md:p-5"
    >
      <div className="relative flex w-[4rem] md:w-[5rem]">
        <Image
          src={"/profile_icon.png"}
          alt={"Profile Pic"}
          fill
          className="object-contain"
        ></Image>
      </div>
      <div className="mx-3 w-fit leading-6">
        <p>Pet Sitter: {name} </p>
        <p>Pet Type</p>
        <p>Rating</p>
      </div>
      <div className="my-auto ml-auto w-fit text-center md:mr-4">
        <p>Distance:</p>
        <p>5.0 km</p>
      </div>
    </Link>
  );
};

export default PetSitterCard;
