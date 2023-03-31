import * as React from "react";
import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextPage,
} from "next";
import { api } from "../utils/api";
import {
  type FieldErrorsImpl,
  useForm,
  type UseFormRegister,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Header from "../components/Header";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { getServerAuthSession } from "../server/auth";
import type _ from "omise-js-typed"; // Import for global type declaration
import Script from "next/script";
import * as betterOmiseJs from "../utils/better-omise";

// Schema for first page of form
const formDataSchema1 = z.object({
  firstname: z.string().min(1, { message: "Required" }),
  lastname: z.string().min(1, { message: "Required" }),
  email: z.string().email(),
  address: z.string().min(1, { message: "Required" }),
  phone: z.string().regex(/^\d{10}$/, { message: "Invalid phone number" }),
  username: z.string().min(1, { message: "Required" }),
  password: z.string().min(1, { message: "Required" }),
  confirmpassword: z.string().min(1, { message: "Required" }),
  type: z.string().min(1, { message: "Required" }),
  breed: z.string().min(1, { message: "Required" }),
  weight: z
    .string()
    .trim()
    .regex(/^\d+/, { message: "Invalid number" })
    .transform((val) => parseInt(val)),
});
// Schema for second page of form
const formDataSchema2 = z.object({
  holdername: z.string().min(1, { message: "Required" }),
  cardno: z.string(), //.regex(/^\d{16}$/),
  expdate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  cvv: z.string().regex(/^\d{3}$/),
  // bankno: z.string(), //.regex(/^\d{12}$/),
  // bankname: z.string(),
});
// Schema for entire form, includes validation for password confirmation
const formDataSchema = formDataSchema1.merge(formDataSchema2).refine(
  (data) => {
    return data.password === data.confirmpassword;
  },
  {
    message: "Passwords do not match",
    path: ["confirmpassword"],
  }
);
// Type for entire form
type FormData = z.infer<typeof formDataSchema>;

const RegisterPage: NextPage = () => {
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formDataSchema),
    mode: "onChange",
  });

  const router = useRouter();
  const mutation = api.petOwner.create.useMutation();
  const onSubmit = async (data: FormData) => {
    alert(JSON.stringify(tag));

    // Collect card into omise
    // follow the offical guide: https://www.omise.co/collecting-card-information
    const exp_month = +data.expdate.slice(5, 7);
    const exp_year = +data.expdate.slice(0, 4);
    if (exp_month < 1 || exp_month > 12) {
      throw new Error("Invalid expiration month");
    }
    if (exp_year < 2000 || exp_year > 2100) {
      throw new Error("Invalid expiration year");
    }

    let cardToken;
    try {
      const [status, response] = await betterOmiseJs.createToken("card", {
        name: data.holdername,
        number: data.cardno,
        expiration_month: exp_month,
        expiration_year: exp_year,
        security_code: +data.cvv,
      });
      cardToken = response.id;
    } catch (e) {
      console.error("Card verification failed:", e);
      alert(`Card verification failed: ${JSON.stringify(e)}`);
      return;
    }

    //when send Pet type  send tag instead of data.type !!
    console.assert(data.password === data.confirmpassword);
    try {
      await mutation.mutateAsync({
        user: {
          username: data.username,
          password: data.confirmpassword,
          email: data.email,
          phoneNumber: data.phone,
          address: data.address,
        },
        petOwner: {
          firstName: data.firstname,
          lastName: data.lastname,
          petTypes: [data.type], // TODO: Please correct this, it's currently just a placeholder
        },
        cardToken,
      });
    } catch (e) {
      console.error("Failed to register:", e);
      alert(`Failed to register: ${JSON.stringify(e)}`);
    }

    console.log(`Try signin with ${data.username} and ${data.password}`);
    const result = await signIn("credentials", {
      redirect: false,
      username: data.username,
      password: data.password,
    });
    if (result?.ok) {
      // redict to home page
      await router.push("/");
    } else {
      alert(`Login failed: ${result?.error ?? "unknown error"}`);
    }
  };

  const handleSpace = (e) => {
    if (e.keyCode === 32) {
      console.log(tag);
      setTag([...tag, e.target.value]);
      //console.log(e.target.value);
      e.target.value = "";
    }
  };

  const [page, setPage] = useState(0);
  const [tag, setTag] = useState([]);
  const [pettype, setPettype] = useState([]);
  if (page === 0)
    return (
      <div className="flex h-screen flex-col">
        <div className="absolute top-[-4rem] -z-10 ">
          <img src="/Ipage1-1.png" width={468} height={315} alt="cat" />
        </div>
        <div className="absolute right-0 -z-10 ">
          <img src="/Ipage1-2.png" width={468} height={315} alt="cat" />
        </div>
        <Header></Header>
        <div className="mt-4 flex h-full flex-col items-center">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex h-full w-3/4 flex-col items-center md:w-1/2 "
          >
            <div className="flex w-full flex-col items-center">
              <h1 className="text-3xl font-bold">Register Pet Owner</h1>
              <h1 className="text-3xl font-bold">1/2</h1>
            </div>
            <div className="grid-rows-8 mx-auto grid w-full grid-cols-1 gap-5">
              <div className="flex justify-between gap-12">
                <div className="flex w-full flex-col">
                  <Input
                    id="firstname"
                    label="First Name*"
                    placeholder="John"
                    register={register}
                    errors={errors}
                    validationRules={{ required: true }}
                  />
                </div>
                <div className="flex w-full flex-col">
                  <Input
                    id="lastname"
                    label="Last Name*"
                    placeholder="Greenwood"
                    register={register}
                    errors={errors}
                    validationRules={{ required: true }}
                  />
                </div>
              </div>
              <div className="flex w-full flex-col">
                <Input
                  id="email"
                  label="Email*"
                  register={register}
                  errors={errors}
                  placeholder="someone@gmail.com"
                  validationRules={{ required: true }}
                  type="email"
                />
              </div>
              <div className="flex w-full flex-col">
                <Input
                  id="address"
                  label="Address*"
                  placeholder="xxxxxxxxxxxxxxxxx"
                  register={register}
                  errors={errors}
                  validationRules={{ required: true }}
                />
              </div>
              <div className="flex w-full flex-col">
                <Input
                  id="phone"
                  label="Phone No.*"
                  placeholder="0123456789"
                  register={register}
                  errors={errors}
                  validationRules={{ required: true }}
                  type="tel"
                />
              </div>
              <div className="flex w-full flex-col">
                <Input
                  id="username"
                  label="Username"
                  placeholder="username"
                  register={register}
                  errors={errors}
                  validationRules={{ required: true }}
                />
              </div>
              <div className="flex w-full flex-col">
                <Input
                  id="password"
                  label="Password"
                  register={register}
                  errors={errors}
                  validationRules={{ required: true }}
                  type="password"
                />
              </div>
              <div className="flex w-full flex-col">
                <Input
                  id="confirmpassword"
                  label="Confirm Password"
                  register={register}
                  errors={errors}
                  validationRules={{ required: true }}
                  type="password"
                />
              </div>

              <div className="flex w-full flex-col">
                <label htmlFor="type">
                  Type Of Pet* (Use Space to begin a new tag) :
                </label>

                <div className="flex w-full rounded border border-gray-100 bg-gray-100 p-1 px-2 text-sm text-gray-900 drop-shadow-md focus:border-blue-500 focus:bg-white focus:ring-blue-500">
                  <div className="center-thing ">
                    {tag.map((value, index) => (
                      <div className="center-thing mr-1 rounded-full bg-slate-300 px-2 py-1 text-sm  ">
                        <span>{value}</span>
                        <button
                          type="button"
                          onClick={() => {
                            console.log(index);
                            setTag((current) =>
                              current.filter((tag, i) => i !== index)
                            );
                          }}
                          className="center-thing ml-1 h-4 w-4 rounded-full bg-black text-[0.6rem] text-white"
                        >
                          x
                        </button>
                      </div>
                    ))}
                  </div>

                  <input
                    id="type"
                    className="w-full  rounded border border-black bg-gray-100 p-1 px-2 text-sm text-gray-900 focus:border-blue-500 focus:bg-white focus:ring-blue-500"
                    placeholder="Dogs"
                    {...register("type", { required: true })}
                    onKeyDown={handleSpace}
                  />
                </div>

                <span className=" text-sm text-red-500">
                  {errors["type"]?.message}
                </span>
              </div>
              <div className="flex gap-6">
                <div className="flex w-full flex-col">
                  <Input
                    id="breed"
                    label="Breed of pet* :"
                    placeholder="Corgi"
                    register={register}
                    errors={errors}
                    validationRules={{ required: true }}
                  />
                </div>
                <div className="flex w-full flex-col">
                  <Input
                    id="weight"
                    label="Weight of pet* :"
                    placeholder="5-10 kg"
                    register={register}
                    errors={errors}
                    validationRules={{ required: true }}
                    type="number"
                  />
                </div>
              </div>
            </div>
            <div className="my-5 mb-10 flex w-full justify-evenly">
              <Button>Back</Button>
              <Button
                type="button"
                onClick={async () => {
                  // Trigger validation only for field in the first page
                  const validationResult = await trigger(
                    formDataSchema1.keyof().options,
                    { shouldFocus: true }
                  );
                  // If validation passes, go to the next page
                  if (validationResult) {
                    setPage(1);
                  }
                }}
              >
                Next
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  else {
    return (
      <div className="flex h-screen flex-col">
        <Header></Header>
        <div className="absolute right-0 -z-10 ">
          <img src="/Ipage2-1.png" width={614} height={580} alt="cat" />
        </div>
        <div className="absolute right-0 top-[20%] -z-10 ">
          <img src="/Ipage2-2.png" width={200} height={315} alt="cat" />
        </div>
        <div className="mt-4 h-full items-center">
          <div className="w-full items-center ">
            <h1 className="mt-8 flex justify-center text-3xl font-bold">
              Register Pet Owner
            </h1>
            <h1 className="flex justify-center text-3xl font-bold">2/2</h1>
          </div>
          <div>
            <h1 className=" ml-[15%] text-2xl font-bold">Payment</h1>
          </div>
          <div className="flex justify-center">
            {/* Load Omise.js */}
            <Script
              type="text/javascript"
              src="https://cdn.omise.co/omise.js"
              onLoad={() => {
                if (!process.env.NEXT_PUBLIC_OMISE_PUBLISHABLE_KEY) {
                  throw new Error(
                    "NEXT_PUBLIC_OMISE_PUBLISHABLE_KEY is not defined"
                  );
                }
                window.Omise.setPublicKey(
                  process.env.NEXT_PUBLIC_OMISE_PUBLISHABLE_KEY
                );
                window.OmiseCard.configure({
                  publicKey: process.env.NEXT_PUBLIC_OMISE_PUBLISHABLE_KEY,
                });
              }}
            />

            <form onSubmit={handleSubmit(onSubmit)} className=" h-full w-2/3 ">
              <div className="mx-auto grid w-full grid-cols-2 grid-rows-6 gap-5 md:grid-cols-4 md:gap-2">
                <div className="col-span-4 flex items-center">
                  <input className="mr-2" type="checkbox"></input>
                  <label>By Card</label>
                  <div className="ml-4 h-6 w-8 rounded  bg-blue-300"></div>
                  <div className="ml-2 h-6 w-8 rounded  bg-blue-300"></div>
                  <div className="ml-2 h-6 w-8 rounded  bg-blue-300"></div>
                </div>
                <div className="col-span-2 flex w-full  flex-col">
                  <Input
                    id="holdername"
                    label="Holder Name *"
                    placeholder="Adam Smith"
                    register={register}
                    errors={errors}
                    validationRules={{ required: true }}
                    type="text"
                  />
                </div>
                <div className="col-span-2"></div>
                <div className="col-span-2 flex w-full  flex-col">
                  <Input
                    id="cardno"
                    label="Card No.*"
                    placeholder="xxxx xxxx xxxx xxxx"
                    register={register}
                    errors={errors}
                    validationRules={{ required: true }}
                    type="number"
                  />
                </div>
                <div className="col-span-2"></div>

                <div className="flex w-full flex-col">
                  <Input
                    id="expdate"
                    label="Expiration Date*"
                    register={register}
                    errors={errors}
                    validationRules={{ required: true }}
                    type="date"
                  />
                </div>
                <div className="flex w-full flex-col">
                  <Input
                    id="cvv"
                    label="CVV / CVN*"
                    register={register}
                    errors={errors}
                    validationRules={{ required: true }}
                    type="number"
                  />
                </div>
                <div className="col-span-2"></div>
                {/* <div className="col-span-4 flex w-full items-center">
                  <input className="mr-2" type="checkbox"></input>
                  <label>Mobile banking</label>
                  <div className="ml-4 h-7 w-7 rounded-full bg-blue-300"></div>
                  <div className="ml-2 h-7 w-7 rounded-full bg-blue-300"></div>
                  <div className="ml-2 h-7 w-7 rounded-full bg-blue-300"></div>
                  <div className="ml-2 h-7 w-7 rounded-full bg-blue-300"></div>
                </div>
                <div className="flex w-full flex-col">
                  <Input
                    id="bankno"
                    label="Bank No.*"
                    placeholder="xxx-x-xxxxx-x"
                    register={register}
                    errors={errors}
                    type="number"
                    validationRules={{ required: true }}
                  />
                </div>
                <div className=" flex w-full flex-col">
                  <Input
                    id="bankname"
                    label="Bank Name*"
                    register={register}
                    errors={errors}
                    validationRules={{ required: true }}
                    placeholder="ABC"
                  />
                </div>
                <div className="col-span-2"></div> */}
                <div className="col-span-2 flex items-center">
                  <input className="mr-2" type="checkbox"></input>
                  <div>
                    <label>I agree to the &nbsp;</label>
                    <label className="text-red-600 underline">
                      terms, conditions and privacy policy
                    </label>
                  </div>
                </div>

                <div className="flex gap-6"></div>
              </div>
              <div className="flex w-full justify-evenly">
                <Button
                  type="button"
                  onClick={() => {
                    setPage(0);
                  }}
                >
                  Back
                </Button>
                <Button type="submit">Register</Button>
              </div>
            </form>
          </div>
          <div className="relative flex justify-center">
            <div className="absolute top-[-4rem] -z-10 ">
              <img
                className="invisible md:visible"
                src="/dogcat.png"
                width={468}
                height={285}
                alt="cat"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: keyof FormData;
  label: string;
  register: UseFormRegister<FormData>; // declare register props
  errors: FieldErrorsImpl<FormData>; // declare errors props
  validationRules?: object;
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  register,
  errors,
  validationRules,
  type = "text",
  ...rest
}) => (
  <>
    <label htmlFor={id}>{label}</label>

    <input
      className="block w-full rounded border border-gray-100 bg-gray-100 p-1 px-2 text-sm text-gray-900 drop-shadow-md focus:border-blue-500 focus:bg-white focus:ring-blue-500"
      id={id}
      type={type}
      {...rest}
      {...register(id, validationRules)}
    />

    <span className=" text-sm text-red-500">{errors[id]?.message}</span>
  </>
);

const Button: React.FC<ButtonProps> = ({ children, ...props }) => (
  <button
    className=" rounded bg-[#98AAB4] px-6  py-2.5 text-center text-sm font-semibold text-[#213951] drop-shadow-md hover:bg-[#8b9ba3] focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto md:px-16"
    {...props}
  >
    {children}
  </button>
);

export default RegisterPage;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  // Redirect to home page if user is already logged in
  const session = await getServerAuthSession(ctx);
  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  // Default return
  return { props: {} };
}
