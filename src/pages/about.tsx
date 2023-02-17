import { type NextPage } from "next";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "../utils/api";
import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import Header from "../components/Header";

const About: NextPage = () => {
  return (
    <div className="absolute z-[-20] h-[200%] w-[100%] bg-[#EAE7DC] ">
      <section className="h-full">
        <Header />
        <div className="h-full">
          <div className="center-thing">
            <h1 className="text-bold mt-3 text-5xl">With Us, Worry Not</h1>
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

          <div className=" relative top-[-1%] z-[-10] h-[100%] w-[35%] border-r-4 border-black  "></div>
          <div className="center-thing absolute top-[60%] left-[31.1%] h-16 w-24 bg-[#EAE7DC]">
            <div className=" h-7 w-7 rounded-full bg-black"></div>
          </div>
          <div className=" absolute top-[57%] left-[5%] h-[10%] w-[20%] rounded-3xl border-2 border-bg-box-main bg-white bg-opacity-50 text-center ">
            <h1 className="mt-8 text-2xl">Explore Their Profile</h1>
            <div className="center-thing h-[50%] ">
              <p>Find who is right for your pets!</p>
            </div>
          </div>
          <div className="absolute top-[52%] left-[40%] h-[20%] w-[50%] rounded-3xl bg-white bg-opacity-50 ">
            <img
              src="/about2.png"
              className="rounded-3xl border-2 border-bg-box-main object-cover "
            ></img>
          </div>
        </div>
      </section>
    </div>
  );
};
export default About;
