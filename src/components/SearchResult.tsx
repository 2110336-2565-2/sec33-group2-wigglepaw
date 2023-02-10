import { UseFormReturn } from "react-hook-form";
import { SearchValues } from "../common/interfaces";
import { api } from "../utils/api";
import PetSitterCard from "./PetSitterCard";

interface SearchResultProps {
  useFormReturn: UseFormReturn<SearchValues>;
}

export default function SearchResult({ useFormReturn }: SearchResultProps) {
  // const petSitters = api.petSitter.dummySearchPetSitter.useQuery();
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useFormReturn;

  const petSitters = api.petSitter.searchPetSitter.useQuery({
    searchText: watch("name") as string,
  });

  if (!petSitters.data) return <></>;
  return (
    <div className="flex justify-center pt-5">
      <div className=" w-[60%]    ">
        <div className="flex justify-center ">
          <h1 className="text-2xl font-bold">Results</h1>
        </div>
        <div className="mt-5 md:grid md:grid-cols-2">
          {petSitters.data.map((petSitter) => (
            <PetSitterCard pet_sitter={petSitter}></PetSitterCard>
          ))}

          <PetSitterCard pet_sitter={null}></PetSitterCard>
          <PetSitterCard pet_sitter={null}></PetSitterCard>
          <PetSitterCard pet_sitter={null}></PetSitterCard>
          <PetSitterCard pet_sitter={null}></PetSitterCard>
          <PetSitterCard pet_sitter={null}></PetSitterCard>
        </div>
      </div>
    </div>
  );
}
