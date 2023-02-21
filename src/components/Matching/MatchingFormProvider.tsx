import { zodResolver } from "@hookform/resolvers/zod";
import { createContext } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";
import { useForm } from "react-hook-form";
import { searchField } from "../../schema/schema";

export const MatchingFormContext = createContext<UseFormReturn>(
  {} as UseFormReturn
);

const MatchingFormProvider: React.FunctionComponent<{
  children: React.ReactNode;
}> = ({ children }) => {
  const useFormReturn = useForm({
    resolver: zodResolver(searchField),
  });

  const onSubmit = (data: FieldValues) => {
    alert(data);
    console.log(data);
  };

  const contextValue = useFormReturn;

  return (
    <form onSubmit={useFormReturn.handleSubmit(onSubmit)}>
      <MatchingFormContext.Provider value={contextValue}>
        {children}
      </MatchingFormContext.Provider>
    </form>
  );
};

export default MatchingFormProvider;
