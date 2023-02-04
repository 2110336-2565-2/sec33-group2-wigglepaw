import Image from "next/image";
import Link from "next/link";

const PetSitterCard = (pet_sitter: any) => {
  return (
    <Link
      href="/user/12345" // TODO: Link to correct user
      className="m-2 flex h-fit rounded-2xl bg-amber-200 p-2 transition-colors hover:bg-amber-100"
    >
      <div className="relative m-2 flex w-[5rem]">
        <Image
          src={"/profile_icon.png"}
          alt={"Profile Pic"}
          fill
          className="object-contain"
        ></Image>
      </div>
      <div className="ml-2 w-[40%] leading-8">
        <div>Pet Sitter: Tuchathum Sunkameka</div>
        <div>Pet Type</div>
        <div>Rating</div>
      </div>
    </Link>
  );
};

export default PetSitterCard;
