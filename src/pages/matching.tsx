import * as React from "react";
import { useState } from "react";
import { NextPage } from "next";
import Header from "../components/Header";
import SearchBox from "../components/SearchBox";

import { PrismaClient, User } from "@prisma/client";
import PetSitterCard from "../components/PetSitterCard";
import { useForm } from "react-hook-form/dist/useForm";

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

  return (
    <div>
      <Header></Header>
      <SearchBox></SearchBox>
      <div className="flex justify-center pt-5">
        <div className=" w-[60%]    ">
          <div className="flex justify-center ">
            <h1 className="text-2xl font-bold">Results</h1>
          </div>
          <div className="mt-5 md:grid md:grid-cols-2">
            {petSitters.map((user: any) => (
              <PetSitterCard pet_sitter={user}></PetSitterCard>
            ))}

            <PetSitterCard pet_sitter={null}></PetSitterCard>
            <PetSitterCard pet_sitter={null}></PetSitterCard>
            <PetSitterCard pet_sitter={null}></PetSitterCard>
            <PetSitterCard pet_sitter={null}></PetSitterCard>
            <PetSitterCard pet_sitter={null}></PetSitterCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default matching;
