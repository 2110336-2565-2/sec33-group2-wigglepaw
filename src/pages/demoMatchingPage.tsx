import type { NextPage } from "next";
import type { z } from "zod";
import type { petSitterFields } from "../schema/schema";
import { useState } from "react";
import Link from "next/link";
import Header from "../components/Header";
import MatchingFormProvider, {
  SearchPetSittersUseQueryReturnElement,
} from "../components/Matching/MatchingFormProvider";
import MatchingPanel from "../components/Matching/MatchingPanel";
import PetsitterCard from "../components/Matching/PetsitterCard";
import type {
  FreelancePetSitter,
  PetHotel,
  PetSitter,
  User,
} from "@prisma/client";

// TODO: document this page structure, use cases
const DemoMatchingPage: NextPage = () => {
  const [matchedPetSitters, setMatchedPetSitters] = useState<
    SearchPetSittersUseQueryReturnElement[]
  >([]);

  return (
    <>
      {/* Uncommeting header for debug, currently it over calls user.getByUsername Query */}
      {/* <Header /> */}
      <div
        id="content-wrapper"
        className="mb-8 flex flex-row justify-start gap-8"
      >
        <MatchingFormProvider setMatchedPetSitters={setMatchedPetSitters}>
          <MatchingPanel />
        </MatchingFormProvider>
        <div id="main-wrapper" className="pt-8">
          <p className="mb-5 text-[16px] text-[#485B6F]">
            📍Explore our list of experienced sitters & hotels for your beloved
            pets.{" "}
            <Link href="/registerPetSitter">
              <span className="text-[#3C8DE1] underline hover:text-[#285686]">
                Want to become our sitters ?
              </span>
            </Link>
          </p>
          <div
            id="pet-sitter-cards-wrapper"
            className="flex w-full flex-col gap-6"
          >
            {matchedPetSitters?.map((matchedPetSitter) => (
              <PetSitterCardFactory
                key={matchedPetSitter.user.username}
                petSitter={matchedPetSitter}
              />
            ))}
            {/* <PetsitterCard /> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default DemoMatchingPage;

const PetSitterCardFactory: React.FunctionComponent<{
  petSitter: SearchPetSittersUseQueryReturnElement;
}> = ({ petSitter }) => {
  let name: string;
  let typeTagText: string;
  let typeTagColor: string;

  if (petSitter.freelancePetSitter) {
    const { firstName, lastName } = petSitter.freelancePetSitter;
    name = firstName + " " + lastName;
    typeTagText = "Freelance";
    typeTagColor = "#169C64";
  } else if (petSitter.petHotel) {
    name = petSitter.petHotel.hotelName;
    typeTagText = "Pet Hotel";
    typeTagColor = "#C3177E";
  } else {
    console.log("error pet sitter type");
    return <></>;
  }

  const props = {
    name,
    typeTagText,
    typeTagColor,
    username: petSitter.user.username,
    address: petSitter.user.address,
    startPrice: petSitter.startPrice,
    endPrice: petSitter.endPrice,
    petTypes: petSitter.petTypes,
    // TODO: reviews
    // TODO: profilePicImage
  };

  return <PetsitterCard {...props} />;
};
