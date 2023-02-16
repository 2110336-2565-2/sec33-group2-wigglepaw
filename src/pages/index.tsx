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
              <div className="center-thing">
                <hr className="center-thing testt invisible h-1 w-full rounded md:visible  " />
              </div>
              <div className="center-thing">
                <h2 className=" col-span-1 text-[1.3rem]">WigglePaw</h2>
              </div>
              <div className="center-thing">
                <hr className=" testt invisible h-1 w-full rounded md:visible " />
              </div>
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
      <section className="center-thing w-[100%] bg-[#EAE7DC]  md:absolute md:top-[100.01%]   md:h-[60%]">
        <div className=" flex h-[100%] w-[80%] items-center justify-center ">
          <div className="mb-16 grid  w-[100%] justify-items-center md:grid-cols-3 md:grid-rows-2 ">
            <div className="center-thing md:col-span-3">
              <h1 className="py-12 px-4 text-[2.5rem] md:py-0">
                10 billion users, 234 million members
              </h1>
            </div>
            <div>
              <div className="center-thing">
                <img
                  src="/secure.png"
                  className="circlerec object-cover "
                ></img>
              </div>
              <h1 className="center-thing mt-7">SECURE</h1>
              <p className="mt-2 text-center text-sm">
                With 35 authentication levels, even admins cannot access your
                data{" "}
              </p>
            </div>
            <div>
              <div className="center-thing">
                <img
                  src="/paws.png"
                  className="circlerec object-cover object-left"
                ></img>
              </div>
              <h1 className="center-thing mt-7">WORRY-FREE</h1>
              <p className="mt-2 text-center text-sm">
                No pet ever died from us, Be happy
              </p>
            </div>
            <div>
              <img
                src="/price-tag.png"
                className="circlerec overflow-visible "
              ></img>
              <h1 className="center-thing mt-7">REASONABLE PRICE</h1>
              <p className="mt-2 text-center text-sm">Only 99.99$ a month</p>
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
      <section className="w-[100%] md:absolute md:top-[160%] md:h-[90%]">
        <div className="h-full w-full md:grid md:grid-cols-2 md:grid-rows-2">
          <div className="bg-bg-box-main p-16">
            <h1>INTRODUCING CHAT SYSTEM!</h1>
            <p className="mt-5   text-sm">
              You can chat to those you want, ask a question, inquire more
              details and make a deal with them
            </p>
            <p className="mt-5 text-sm">
              Block those you don't want, report and help us make a better
              community for everyone
            </p>
            <button className="find-link mx-0 mt-8 rounded-xl px-3 text-base">
              <p className="text-white">TO CHAT SYSTEM!</p>
            </button>
          </div>
          <div className="bg-bg-main">
            <img src="/doghappy1.jpg" className="object-cover"></img>
          </div>
          <div className="">
            <img src="/cathappy1.jpg" className="object-cover"></img>
          </div>
          <div className="bg-bg-box-main p-16">
            <h1>INTRODUCING BOOKING SYSTEM!</h1>
            <p className="mt-5   text-sm">
              Find and book those you interested in, free booking cancellation!
            </p>
            <p className="mt-5 text-sm">
              You have your very own schedule, make organize thing a lot easier!
            </p>
            <button className="find-link mx-0 mt-8 rounded-xl px-3 text-base">
              <p className="text-white">TO BOOKING SYSTEM!</p>
            </button>
          </div>
        </div>
      </section>
      <section className="w-[100%] bg-[#EAE7DC] py-12 md:absolute md:top-[250%]">
        <div className="  px-12 ">
          <h1 className="center-thing text-[2.5rem]">ABOUT</h1>
          <p className="px-16 pt-5">
            I don't know hat to write, so just write something repeatly for 5
            times then so just write something repeatly for 5 times then so just
            write something repeatly for 5 times then so just write something
            repeatly for 5 times then so just write something repeatly for 5
            times then
          </p>
          <div className="center-thing">
            <button className="find-link mx-0 mt-5 rounded-xl px-3 text-base">
              <p className="text-white">MORE ABOUT US!</p>
            </button>
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
