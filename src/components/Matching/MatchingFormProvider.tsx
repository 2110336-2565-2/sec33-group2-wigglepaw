import { createContext, useEffect, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { searchPetSitterField } from "../../schema/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { api } from "../../utils/api";
import { z } from "zod";
import { useRef } from "react";

import { useInView } from "react-intersection-observer";
import type {
  FreelancePetSitter,
  PetHotel,
  PetSitter,
  User,
} from "@prisma/client";
import { match } from "assert";

// TODO: heavily document this code

export type SearchPetSittersUseQueryReturnElement = PetSitter & {
  user: User;
  freelancePetSitter: FreelancePetSitter | null;
  petHotel: PetHotel | null;
};
interface MatchingFormContextT {
  useFormReturn: UseFormReturn;
  setMatchedPetSitters: React.Dispatch<SearchPetSittersUseQueryReturnElement[]>;
  // FIXME: would be nice if we could do type inference here, no idea how to do it for now,
  //
  // this also doesn't work, seems like the types in the schema/schema.ts and types/user.ts are in conflict
  // SetStateAction<z.infer<typeof petSitterFields>[]>
}

export const MatchingFormContext = createContext<MatchingFormContextT>(
  {} as MatchingFormContextT
);

const MatchingFormProvider: React.FunctionComponent<{
  children: React.ReactNode;
  setMatchedPetSitters: React.Dispatch<SearchPetSittersUseQueryReturnElement[]>;
  num: number;
}> = ({ children, setMatchedPetSitters, num }) => {
  const useFormReturn = useForm({
    resolver: zodResolver(
      z
        .object({
          searchName: z.string().optional(),
          searchRating: z.number().optional(),
          searchPriceMin: z.number().min(1).optional().default(250),
          searchPriceMax: z.number().max(9999).optional().default(7000),
          searchLocation: z.string().optional(),
          searchPetTypes: z.array(z.string()).optional(),
          searchStartSchedule: z.string().optional(),
          searchEndSchedule: z.string().optional(),
          searchIncludePetSitterType: z.string().optional(),
          searhcIncludePetHotel: z.boolean().default(true),
          searhcIncludeFreelancePetSitter: z.boolean().default(true),
          searchSortBy: z.string().default(""),
        })
        .refine((obj) => obj.searchPriceMin <= obj.searchPriceMax, {
          path: ["searchPriceMin", "searchPriceMax"],
        })
    ),
  });

  // Set the reference to the child component
  useEffect(() => {
    void handleFetchNextPage();
  }, [num]);
  const [page, setPage] = useState(0);

  //Don't use page as a current page, page is previous stage of current page :()

  const { data, fetchNextPage } =
    api.petSitter.searchPetSitter.useInfiniteQuery(
      { ...useFormReturn.watch(), limit: 5, userId: "" }, // getValues doesn't work because it subscribe to the latest input changes

      {
        getNextPageParam: (lastpage) => lastpage.nextCursor,
        enabled: false,
        onSuccess: (data) => {
          console.log("hihihhih...", data?.pages[page + 1]?.items);
          if (data?.pages[page + 1]?.items == undefined) {
            let allPages = [];
            for (let i = 0; i <= page; i++) {
              allPages = [...allPages, ...data?.pages[i]?.items];
            }
            setMatchedPetSitters(allPages);
            console.log("sasaa", allPages.length);
          } else {
            setPage(page + 1);

            let allPages = [];
            for (let i = 0; i <= page + 1; i++) {
              allPages = [...allPages, ...data?.pages[i]?.items];
            }
            setMatchedPetSitters(allPages);
            console.log("sasaa", allPages.length);
          }
        },
      }
    );

  const onSubmit = async () => {
    setPage(-1);
    await fetchNextPage();
  };

  const contextValue = {
    useFormReturn,
    setMatchedPetSitters,
  };

  const handleFetchNextPage = async () => {
    await fetchNextPage();

    console.log(page + 1);
  };

  const handleFetchPreviousPage = () => {
    console.log("zzz", page - 1);
    setMatchedPetSitters(data?.pages[page - 1]?.items);
    setPage(page - 1);
  };

  return (
    <form onSubmit={useFormReturn.handleSubmit(onSubmit)}>
      <MatchingFormContext.Provider value={contextValue}>
        {children}
      </MatchingFormContext.Provider>
    </form>
  );
};

export default MatchingFormProvider;
