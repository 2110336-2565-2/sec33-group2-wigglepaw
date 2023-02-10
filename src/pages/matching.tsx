import * as React from "react";
import { useState } from "react";
import { NextPage } from "next";
import Header from "../components/Header";
import SearchBox from "../components/SearchBox";

import { PrismaClient, User } from "@prisma/client";
import PetSitterCard from "../components/PetSitterCard";
import { useForm } from "react-hook-form";
import SearchResult from "../components/SearchResult";

const prisma = new PrismaClient();

export async function getStaticProps() {
  const allusers = await prisma.user.findMany();

  return {
    props: {
      users: allusers,
    },
  };
}

const matching: NextPage = (props: any) => {
  // const users = props.users;
  const pageNum = 1;

  const [petSitters, setPetSitters] = useState(props.users);

  const useFormReturn = useForm({
    defaultValues: {
      name: "lnwJoZa",
      priceRange: 50.0,
    },
    // resolver: zodResolver(formDataSchema),
  });

  return (
    <div>
      <Header></Header>
      <SearchBox useFormReturn={useFormReturn}></SearchBox>
      <SearchResult useFormReturn={useFormReturn} />
    </div>
  );
};

export default matching;
