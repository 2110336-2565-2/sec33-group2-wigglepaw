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

  if (!petSitters.data) return <>Loading...</>;
  return (
    <div className="mx-auto mt-3 w-fit max-w-md sm:w-1/2">
      <h1 className="font-bold">Results</h1>
      {petSitters.data.map((petSitter) => (
        <PetSitterCard pet_sitter={petSitter}></PetSitterCard>
      ))}
    </div>
  );
}
