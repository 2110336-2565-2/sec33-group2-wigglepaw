import { createContext, useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";
import { searchField } from "../../schema/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { api } from "../../utils/api";
import type {
  FreelancePetSitter,
  PetHotel,
  PetSitter,
  User,
} from "@prisma/client";

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
}> = ({ children, setMatchedPetSitters }) => {
  const useFormReturn = useForm({
    resolver: zodResolver(searchField),
  });

  const query = api.petSitter.searchPetSitter.useQuery(
    useFormReturn.watch(), // getValues doesn't work because it subscribe to the latest input changes
    {
      enabled: false,
      onSuccess: (data) => {
        setMatchedPetSitters(data);
      },
    }
  );

  const onSubmit = async () => {
    await query.refetch();
  };

  const contextValue = {
    useFormReturn,
    setMatchedPetSitters,
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
