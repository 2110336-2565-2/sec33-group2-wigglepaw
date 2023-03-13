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
    <div className="relative">
      <section className="h-[32rem] min-h-screen w-full md:h-screen">
        {/* <div className="-z-10 h-screen w-[100%] origin-bottom-right bg-[url('/dog-bg.jpg')] bg-auto bg-left bg-no-repeat"> */}
        <div className="-z-10 flex h-full w-full origin-bottom-right flex-col bg-[url('/dog-bg-2.jpg')] bg-cover bg-center bg-no-repeat md:h-full">
          <Header />

          <div className="center-thing -mt-4 flex-grow">
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

            <div className="mx-5 grid max-h-[80%] w-full max-w-lg grid-cols-3 grid-rows-5 rounded-2xl  bg-white bg-opacity-50 px-6 pt-4 pb-6 shadow-2xl ">
              <h1 className="center-thing col-span-3 row-span-2 text-center text-[2rem] font-semibold md:w-full">
                <span className="w-full">
                  &quot;Let us take care your loves&quot;
                </span>
              </h1>
              <div className="center-thing">
                {/* <hr className="center-thing testt invisible h-1 w-full rounded md:visible  " /> */}
                <hr className="center-thing testt invisible h-1 w-full rounded md:visible  " />
              </div>
              <div className="center-thing">
                <h2 className=" col-span-1 text-[1.3rem]">WigglePaw</h2>
              </div>
              <div className="center-thing">
                {/* <hr className=" testt invisible h-1 w-full rounded md:visible " /> */}
                <hr className=" testt invisible h-1 w-full rounded md:visible" />
              </div>
              <h3 className="items-top col-span-3 flex items-center justify-center text-center text-[1rem] max-md:row-span-2 md:w-full">
                <span className="w-7/8 md:w-full">
                  A matching platform for pet sitters and pet owners
                </span>
              </h3>
              <div className="col-span-3 grid grid-cols-1">
                <div className="center-thing w-full">
                  <Link href="/matching" className="find-link rounded-xl">
                    Find Pet Sitters &gt;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="center-thing min-h-[30vh] w-full bg-[#EAE7DC] pt-6 pb-16">
        <div className="center-thing h-full w-full max-w-[1800px]">
          <div className="grid w-[100%] justify-items-center text-center md:grid-cols-3 md:grid-rows-3">
            <div className="center-thing md:col-span-3">
              <div className="max-md:hidden">
                <h1 className="py-12 px-4 text-[2.5rem] font-semibold md:py-0 md:text-[2.5rem]">
                  10 billion users, 234 million members
                </h1>
              </div>
              <div className="md:hidden">
                <h1 className="py-12 px-4 text-[2rem] font-semibold md:py-0 md:text-[2.5rem]">
                  10 billion users,
                  <br />
                  234 million members
                </h1>
              </div>
            </div>
            <div className="flex w-full flex-col items-center md:row-span-2">
              <div className="center-thing scale-[70%]">
                <img src="/secure.png" className="circlerec object-cover"></img>
              </div>
              <h1 className="center-thing mt-6 text-[1.3rem] font-semibold">
                SECURE
              </h1>
              <p className="my-2 w-2/3 max-w-xs">
                With 35 authentication levels, even admins cannot access your
                data{" "}
              </p>
            </div>
            <div className="flex w-full flex-col items-center md:row-span-2">
              <div className="center-thing scale-[70%]">
                <img
                  src="/paws.png"
                  className="circlerec object-cover object-left"
                ></img>
              </div>
              <h1 className="center-thing mt-6 text-[1.3rem] font-semibold">
                WORRY-FREE
              </h1>
              <p className="my-2 w-2/3 max-w-xs text-center">
                No pet ever died from us, Be happy with your food
              </p>
            </div>
            <div className="flex w-full flex-col items-center md:row-span-2">
              <img
                src="/price-tag.png"
                className="circlerec scale-[70%] overflow-visible"
              ></img>
              <h1 className="center-thing mt-6 text-[1.3rem] font-semibold">
                REASONABLE PRICE
              </h1>
              <p className="my-2 w-4/5 border-2">Only 99.99$ a month</p>
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
      <section className="flex w-[100%] items-end bg-[#EAE7DC]">
        <div className="h-full w-full md:grid md:grid-cols-2 md:grid-rows-2">
          <div className="h-full max-w-[900px] place-self-end bg-bg-box-main p-16">
            <h1 className="text-[1.3rem] font-semibold">
              INTRODUCING CHAT SYSTEM!
            </h1>
            <p className="mt-5">
              You can chat to those you want, ask a question, inquire more
              details and make a deal with them
            </p>
            <p className="mt-5">
              Block those you don't want, report and help us make a better
              community for everyone
            </p>
            <button className="find-link mx-0 mt-8 rounded-lg px-3 text-base">
              <p className="text-white">TO CHAT SYSTEM!</p>
            </button>
          </div>
          <div className="max-w-[900px] bg-[#EAE7DC]">
            <img
              src="/doghappy1.jpg"
              className="h-full bg-center object-cover"
            ></img>
          </div>
          <div className="h-full place-self-end bg-[#EAE7DC]">
            <img
              src="/cathappy1.jpg"
              className="h-full bg-center object-cover"
            ></img>
          </div>
          <div className="max-w-[900px] bg-bg-box-main p-16">
            <h1 className="text-[1.3rem] font-semibold">
              INTRODUCING BOOKING SYSTEM!
            </h1>
            <p className="mt-5">
              Find and book those you interested in, free booking cancellation!
            </p>
            <p className="mt-5">
              You have your very own schedule, make organize thing a lot easier!
            </p>
            <button className="find-link mx-0 mt-8 rounded-lg px-3 text-base">
              <p className="text-white">TO BOOKING SYSTEM!</p>
            </button>
          </div>
        </div>
      </section>
      <section className="center-thing w-[100%] bg-[#EAE7DC] py-12">
        <div className="max-w-[1800px] px-12">
          <h1 className="center-thing text-[2.5rem]">ABOUT</h1>
          <p className="px-4 pt-5 md:px-16">
            I don't know hat to write, so just write something repeatly for 5
            times then so just write something repeatly for 5 times then so just
            write something repeatly for 5 times then so just write something
            repeatly for 5 times then so just write something repeatly for 5
            times then
          </p>
          <div className="center-thing">
            <button className="find-link mx-0 mt-5 rounded-lg px-3 text-base">
              <p className="text-white">MORE ABOUT US!</p>
            </button>
          </div>
        </div>
      </section>
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
