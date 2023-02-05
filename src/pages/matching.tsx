import { NextPage } from "next";
import Header from "../components/Header";
import SearchBox from "../components/SearchBox";

import { PrismaClient } from "@prisma/client";
import PetSitterCard from "../components/PetSitterCard";

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
  const users = props.users;
  const pageNum = 1;

  return (
    <div>
      <Header></Header>
      <SearchBox></SearchBox>
      <div className="mx-auto mt-3 w-1/2">
        <h1 className="font-bold">Results</h1>
        {users.map((user: any) => (
          <PetSitterCard pet_sitter={user}></PetSitterCard>
        ))}
        <PetSitterCard pet_sitter={null}></PetSitterCard>
      </div>
    </div>
  );
};

export default matching;
