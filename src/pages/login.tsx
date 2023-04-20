import * as React from "react";
import type { NextPage } from "next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Header from "../components/Header";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";

const LoginPage: NextPage = () => {
  const router = useRouter();

  // Define form schema
  const formDataSchema = z.object({
    username: z.string().min(1),
    password: z.string().min(1),
  });
  type FormData = z.infer<typeof formDataSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formDataSchema),
  });

  const onSubmit = async (data: FormData) => {
    console.log(data);
    const result = await signIn("credentials", {
      redirect: false,
      username: data.username,
      password: data.password,
    });

    if (result?.ok) {
      // redict to previous page
      const previousPage: string = router.query.previousPage
        ? router.query.previousPage.toString()
        : "/";
      await router.push(previousPage);
    } else {
      alert(`Login failed: ${result?.error ?? "unknown error"}`);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Header></Header>
      <div className="mx-auto my-[10vh] rounded-xl bg-slate-300 px-4 py-3 text-xl">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-fit border-b-2 border-b-gray-400 pb-3 leading-10"
        >
          <h1 className="font-semibold">Username</h1>
          <input
            id="username-input"
            {...register("username", { required: true })}
            placeholder="Username"
            type="text"
            className="w-full rounded px-1"
          />
          <p className="text-[1rem] text-red-400">{errors.username?.message}</p>
          <h1 className="font-semibold">Password</h1>
          <input
            id="password-input"
            {...register("password", { required: true })}
            placeholder="********"
            type="password"
            className="w-full rounded px-1"
          />
          <p className="text-[1rem] text-red-400">{errors.password?.message}</p>
          {/*errors. && <span>This field is required</span>*/}
          <button
            id="login-button"
            className="mx-auto mt-6 flex rounded-full bg-sky-900 px-4 py-2 text-base font-bold text-white transition-all hover:bg-sky-700"
          >
            Login
          </button>
        </form>
        <div className="mx-auto mt-3">
          <Link
            href="/registerPetOwner"
            className="register-pet-owner-button mx-auto my-1 flex h-fit w-[13rem] justify-center whitespace-nowrap rounded-lg bg-green-700 p-2 text-base font-semibold text-white transition-all hover:bg-green-600"
          >
            Register Pet Owner
          </Link>
          <Link
            href="/registerPetSitter"
            className="register-pet-sitter-button mx-auto my-1 flex h-fit w-[13rem] justify-center whitespace-nowrap rounded-lg bg-green-700 p-2 text-base font-semibold text-white transition-all hover:bg-green-600"
          >
            Register Pet Sitter
          </Link>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
