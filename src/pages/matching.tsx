import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../components/Header";
import { useRef } from "react";
import MatchingFormProvider, {
  type SearchPetSittersUseQueryReturnElement,
} from "../components/Matching/MatchingFormProvider";
import MatchingPanel from "../components/Matching/MatchingPanel";
import PetsitterCard from "../components/Matching/PetsitterCard";

import { useInView } from "react-intersection-observer";
// TODO: document this page structure, use cases
const Matching: NextPage = () => {
  const [matchedPetSitters, setMatchedPetSitters] = useState<
    SearchPetSittersUseQueryReturnElement[]
  >([]);
  const [num, setNum] = useState(0);
  const { ref: myRef, inView: myVis } = useInView({
    threshold: 1,
    delay: 1200, //?? NOt working
  });
  useEffect(() => {
    if (myVis) {
      console.log("TIME TO CALL");
      setNum(num + 1);
    }
  }, [myVis]);
  return (
    <>
      <Header />
      <div
        id="content-wrapper"
        className="-mt-4 mb-8 flex flex-row justify-center gap-8 pt-4"
      >
        <MatchingFormProvider
          num={num}
          setMatchedPetSitters={setMatchedPetSitters}
        >
          <MatchingPanel />
        </MatchingFormProvider>
        <div id="main-wrapper" className="pt-8">
          <p className="mb-5  text-[16px] text-[#485B6F]">
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
            className=" flex w-full  flex-col gap-6 "
          >
            {matchedPetSitters?.map((matchedPetSitter) => (
              <PetSitterCardFactory
                key={matchedPetSitter.user.username}
                petSitter={matchedPetSitter}
              />
            ))}
            {/* <PetsitterCard /> */}
          </div>
          <div className="invisible">
            <button
              ref={myRef}
              onClick={() => {
                setNum(num + 1);
              }}
              className="h-10 w-20 bg-black px-5 py-2 text-white"
            >
              Load
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

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
    profileImageUri: petSitter.user.imageUri,
    avgRating: petSitter.avgRating,
    reviewCount: petSitter.reviewCount,
  };

  return <PetsitterCard {...props} />;
};

export default Matching;
