import { type NextPage } from "next";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "../utils/api";

import Header from "../components/Header";

const Home: NextPage = () => {
  return (
    <div className="w-screen h-screen bg-bg-main -z-10">
    <div className="mx-auto bg-bg-main flex h-screen w-fit items-center justify-center">
      <div className="absolute right-[-5%] bottom-0 -z-0 ">
          <img src="/dogwalking.png" width={560} height={560}  className="invisible md:visible" alt="cat" />
        </div>
        <div className="absolute left-[10%] top-[20%] -z-0 ">
          <img src="/dogpaw1.png" width={160} height={160}  className="invisible md:visible" alt="cat" />
        </div>
        <div className="absolute right-[5%] bottom-[30%] -z-0 ">
          <img src="/dogpaw1.png" width={140} height={140}  className="invisible md:visible" alt="cat" />
        </div>
        <div className="absolute right-[0%] top-[40%] -z-0 ">
          <img src="/dogpaw2.png" width={80} height={80}  className="invisible md:visible" alt="cat" />
        </div>
        <div className="absolute left-[0%] top-[30%] -z-0 ">
          <img src="/dogpaw3.png" width={120} height={120}  className="invisible md:visible" alt="cat" />
        </div>
        
      <Header></Header>
      <div className="mx-auto flex h-screen items-center justify-center">
        <div></div>
        <div className="mx-5 grid h-[50%]  w-[80%] grid-cols-3 grid-rows-5 shadow-2xl rounded-2xl bg-bg-box-main px-6 py-4 ">
          <h1 className="center-thing col-span-3 row-span-2 text-[3rem]">
            &quot;Let us take care your loves&quot;
          </h1>
          <hr className="center-thing testt h-1 w-full rounded border-0 bg-gray-100 dark:bg-gray-700 md:my-10" />
          <h2 className="center-thing col-span-1 mb-4 w-full text-[2.2rem]">
            WigglePaw
          </h2>
          <hr className="center-thing testt h-1 w-full rounded border-0 bg-gray-100 dark:bg-gray-700 md:my-10" />
          <h3 className="items-top col-span-3 flex w-full justify-center text-[1.5rem]">
            A matching platform for pet sitters and pet owners
          </h3>

          <div className="center-thing w-full">
            <Link href="/match=?pet_freelance" className="find-link rounded-xl">
              Finding Pet Sitter >
            </Link>
          </div>
          <div className="center-thing w-full">
            <Link href="/match=?pet_hotel" className="find-link rounded-xl">
              Finding Pet Hotel >
            </Link>
          </div>
          <div className="center-thing w-full">
            <Link href="/registerPetOwner" className="find-link rounded-xl">
              Register Pet Owner (temp)
            </Link>
          </div>
        </div>
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
