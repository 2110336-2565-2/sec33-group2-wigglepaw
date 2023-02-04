import { NextPage } from "next";
import Header from "../components/Header";
import SearchBox from "../components/SearchBox";

import { PrismaClient } from "@prisma/client";

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

  return (
    <div>
      <Header></Header>
      <SearchBox></SearchBox>
      <div>
        {users.map((user: any) => (
          <div className="card">{user.name}</div>
        ))}
      </div>
    </div>
  );
};

export default matching;
