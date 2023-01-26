import * as React from "react";
import { useState } from "react";
import type { NextPage } from "next";
import { api } from "../utils/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PetKind } from "@prisma/client";
const MainPage:NextPage = ()=>{
    return (<div>
            <button>About</button>
            <button>Log in</button>
            <button>Register</button>
            <h1 className="text-2xl">"Let us take care your loves"</h1>
            <h2 className="text-xl">WigglePaw</h2>
            <h3>a matching platform for pet sitters and pet owners</h3>
            <br/>
            <button className="text-xl">Finding Petsitter</button>{" "}
            <button className="text-xl">Finding Pethotel</button>
    </div>
    )
}
export default MainPage;