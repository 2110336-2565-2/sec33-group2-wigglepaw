import type { NextPage } from "next";
import type { z } from "zod";
import type { petSitterFields } from "../schema/schema";
import { useState } from "react";
import Link from "next/link";
import Header from "../components/Header";
import MatchingFormProvider, {
  SearchPetSittersUseQueryReturn,
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
  const [matchedPetSitters, setMatchedPetSitters] =
    useState<SearchPetSittersUseQueryReturn>([]);

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
            <PetsitterCard />
            <PetsitterCard />
          </div>
        </div>
      </div>
    </>
  );
};

export default DemoMatchingPage;
