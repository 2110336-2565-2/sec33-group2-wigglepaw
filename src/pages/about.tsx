import { type NextPage } from "next";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "../utils/api";
import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import Header from "../components/Header";

const About: NextPage = () => {
  const { ref: myRef, inView: myVis } = useInView({});
  const { ref: myRef2, inView: myVis2 } = useInView({});
  return (
    <>
      <div className="absolute z-[-20] h-[200%] w-[100%] bg-[#EAE7DC] ">
        <section className="h-full">
          <Header />
          <div className="h-full">
            <div className="center-thing">
              <h1 className="text-bold mt-3 text-4xl">With Us, Worry Not</h1>
            </div>
            <div className="center-thing mt-8">
              <p className="text-2xl"> Find you best pet-sitter</p>
            </div>
            <div className="center-thing mt-10">
              <div className="h-[25rem] w-[70%]  ">
                <img
                  src="/about1.png"
                  className="rounded-3xl border-2 border-bg-box-main object-cover "
                ></img>
              </div>
            </div>

            <div className=" relative top-[-1%] z-[-10] h-[60%] w-[30%] border-r-4 border-black  "></div>
            <div className="center-thing absolute top-[60%] left-[26.1%] h-16 w-24 bg-[#EAE7DC]">
              <div className=" h-7 w-7 rounded-full bg-black"></div>
            </div>
            <div className=" absolute top-[57%] left-[5%] h-[10%] w-[20%] rounded-3xl border-2 border-bg-box-main bg-white bg-opacity-50 text-center ">
              <h1 className="mt-8 text-2xl">Explore Their Profile</h1>
              <div className="center-thing h-[50%] ">
                <p>Find who is right for your pets!</p>
              </div>
            </div>
            <div className="absolute top-[52%] left-[35%] h-[20%] w-[50%] rounded-3xl bg-white bg-opacity-50 ">
              <img
                src="/about2.png"
                className="rounded-3xl border-2 border-bg-box-main object-cover "
              ></img>
            </div>
            <div className="center-thing absolute top-[87%] left-[26.1%] h-16 w-24 bg-[#EAE7DC]">
              <div className=" h-7 w-7 rounded-full bg-black"></div>
            </div>
            <div className=" absolute top-[84%] left-[5%] h-[10%] w-[20%] rounded-3xl border-2 border-bg-box-main bg-white bg-opacity-50 text-center ">
              <h1 className="mt-8 text-2xl">Book Them!</h1>
              <div className="center-thing h-[50%] ">
                <p>Ready to ...</p>
              </div>
            </div>
            <div className="absolute top-[80%] left-[35%] h-[20%] w-[50%] rounded-3xl bg-white bg-opacity-50 ">
              <img
                src="/about2.png"
                className="rounded-3xl border-2 border-bg-box-main object-cover "
              ></img>
            </div>
          </div>
        </section>
      </div>
      <div className="absolute top-[200%] z-[-20] h-[200%] w-[100%] bg-[#EAE7DC]">
        <div className=" relative z-[-10] h-[10%] w-[30%] border-r-4 border-black  "></div>
        <hr className="relative left-[29.7%] h-[4px] w-[20.1%]  border-t-0  bg-gradient-to-r from-black via-violet-800 to-purple-500"></hr>
        <div className=" relative  h-[4%] w-[49.8%] bg-gradient-to-b from-purple-700 to-red-700  ">
          <div className=" h-full w-[99.4%] bg-[#EAE7DC]"></div>
        </div>
        <div className=" relative left-[48.7%] top-[0.8%] z-[-10] h-6 w-6 rotate-45 bg-gradient-to-br from-red-700 to-pink-400">
          <div className=" absolute top-[15%] left-[15%] h-[70%] w-[70%]  bg-[#EAE7DC]"></div>
        </div>
        <div className="center-thing pt-10">
          <h1
            ref={myRef2}
            className={
              "bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text py-4 text-5xl text-transparent opacity-0 " +
              (myVis2 ? "animate-showing" : "")
            }
          >
            {" "}
            Make Everything Easier With Scheulde
          </h1>
        </div>
        <div className="mt- relative left-[15%] mt-6 h-[30%] w-[70%] ">
          <img
            src="/about3.png"
            className="h-[100%] w-full rounded-3xl border-2 border-bg-box-main object-cover "
          ></img>
        </div>

        <div className="relative mt-6  h-[8%] w-[49.8%] bg-gradient-to-b from-pink-400 to-sky-500  ">
          <div className="h-full w-[99.4%] bg-[#EAE7DC]"></div>
        </div>
        <div className="relative left-[48.7%] top-[0.8%] z-[-10]  h-6 w-6 rotate-45 bg-gradient-to-br from-sky-500 to-blue-700">
          <div className=" absolute top-[15%] left-[15%] h-[70%] w-[70%]  bg-[#EAE7DC]"></div>
        </div>
        <div className="center-thing pt-10">
          <h1
            ref={myRef}
            className={
              "bg-gradient-to-r from-blue-500 to-indigo-800 bg-clip-text py-4 text-5xl text-transparent opacity-0 " +
              (myVis ? "animate-showing" : "")
            }
          >
            {" "}
            Clear All Confusion With Chat
          </h1>
        </div>
        <div className="mt- relative left-[15%] mt-6 h-[30%] w-[70%] ">
          <img
            src="/about4.png"
            className="h-[100%] w-full rounded-3xl border-2 border-bg-box-main object-cover "
          ></img>
        </div>
        {/* <div
          ref={myRef}
          className={
            "relative flex items-center justify-center text-[5rem] "
            //+(myVis ? "animate-[wiggle_3s_ease-in-out_]" : "")
          }
        ></div> */}
      </div>
      <div className="absolute top-[400%] z-[-30] h-[200%] w-[100%] bg-[#EAE7DC]"></div>
    </>
  );
};
export default About;
