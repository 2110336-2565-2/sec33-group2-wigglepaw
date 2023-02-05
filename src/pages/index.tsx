import { type NextPage } from "next";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "../utils/api";

import Header from "../components/Header";

const Home: NextPage = () => {
  return (
    <div>
      <Header></Header>
      <div className="mx-auto w-fit rounded-2xl bg-amber-100 p-4">
        <h1 className="text-2xl">&quot;Let us take care your loves&quot;</h1>
        <h2 className="text-xl">WigglePaw</h2>
        <h3>A matching platform for pet sitters and pet owners</h3>
        <br />
        <div className="flex">
          <Link href="/match=?pet_sitter" className="find-link">
            Finding Pet Sitter
          </Link>
          <Link href="/match=?pet_hotel" className="find-link">
            Finding Pet Hotel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
