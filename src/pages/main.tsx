import * as React from "react";
import { useState } from "react";
import type { NextPage } from "next";
import { api } from "../utils/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PetKind } from "@prisma/client";
import Header from "../components/Header";
import Link from "next/link";
const MainPage: NextPage = () => {
  return (
    <div>
      <Header></Header>
      <div className="mx-auto w-2/5">
        <h1 className="text-2xl">&quot;Let us take care your loves&quot;</h1>
        <h2 className="text-xl">WigglePaw</h2>
        <h3>A matching platform for pet sitters and pet owners</h3>
        <br />
        {/* TODO Sent Link to matching pages */}
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
export default MainPage;
