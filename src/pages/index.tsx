import { type NextPage } from "next";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "../utils/api";
import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import Header from "../components/Header";

const Home: NextPage = () => {
  const { ref: myRef, inView: myVis } = useInView({});
  return (
    <>
      <section className="h-full w-[100%]">
        <div className="-z-10 h-screen w-[100%] bg-[url('/dog-bg.jpg')] bg-auto bg-left bg-no-repeat">
          <Header></Header>

          <div className="center-thing h-[80%]">
            {/* <div className="absolute right-[-5%] bottom-0 -z-0 ">
              <img
                src="/dogwalking.png"
                width={560}
                height={560}
                className="invisible md:visible"
                alt="cat"
              />
            </div> */}
            {/* <div className="absolute left-[10%] top-[20%] -z-0 ">
              <img
                src="/dogpaw1.png"
                width={160}
                height={160}
                className="invisible md:visible"
                alt="cat"
              />
            </div>
            <div className="absolute right-[5%] bottom-[30%] -z-0 ">
              <img
                src="/dogpaw1.png"
                width={140}
                height={140}
                className="invisible md:visible"
                alt="cat"
              />
            </div>
            <div className="absolute right-[0%] top-[40%] -z-0 ">
              <img
                src="/dogpaw2.png"
                width={80}
                height={80}
                className="invisible md:visible"
                alt="cat"
              />
            </div>
            <div className="absolute left-[0%] top-[30%] -z-0 ">
              <img
                src="/dogpaw3.png"
                width={120}
                height={120}
                className="invisible md:visible"
                alt="cat"
              />
            </div> */}

            <div className="mx-5 grid h-[50%]  w-[75%] grid-cols-3 grid-rows-5 rounded-2xl bg-white bg-opacity-50 px-6 py-4 shadow-2xl md:w-[50%] ">
              <h1 className="center-thing col-span-3 row-span-2 text-[2rem]">
                &quot;Let us take care your loves&quot;
              </h1>

              <hr className="center-thing testt invisible h-1 w-full rounded md:visible  md:my-10" />
              <h2 className="center-thing col-span-1 mt-3 w-full text-[1.3rem]">
                WigglePaw
              </h2>
              <hr className="center-thing testt invisible h-1 w-full rounded md:visible md:my-10" />
              <h3 className="items-top col-span-3 flex w-full justify-center text-[1rem]">
                A matching platform for pet sitters and pet owners
              </h3>
              <div className="col-span-3 grid grid-cols-1">
                <div className="center-thing  w-full ">
                  <Link href="/matching" className="find-link rounded-xl">
                    Find Pet Sitters &gt;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="center-thing absolute top-[100.01%]  w-[100%] bg-[#EAE7DC]   md:h-[60%]">
        <div className=" flex h-[100%] w-[80%] items-center justify-center ">
          <div className="grid  w-[100%] justify-items-center md:grid-cols-3 md:grid-rows-2 ">
            <div className="center-thing md:col-span-3">
              <h1 className=" text-[2.5rem]">
                10 billion users, 234 million members
              </h1>
            </div>
            <div>
              <img src="/secure.png" className="circlerec object-cover "></img>

              <h1 className="center-thing mt-7">SECURE</h1>
            </div>
            <div>
              <img
                src="/paws.png"
                className="circlerec object-cover object-left"
              ></img>
              <h1 className="center-thing mt-7">WORRY-FREE</h1>
            </div>
            <div>
              <img
                src="/price-tag.png"
                className="h-[9rem] w-[9rem] overflow-visible "
              ></img>
              <h1 className="center-thing mt-7">REASONABLE PRICE</h1>
            </div>
            {/* <div
            ref={myRef}
            className={
              "flex items-center justify-center text-[5rem] "
              //+(myVis ? "animate-[wiggle_3s_ease-in-out_]" : "")
            }
          ></div> */}
          </div>
        </div>
      </section>
    </>
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
