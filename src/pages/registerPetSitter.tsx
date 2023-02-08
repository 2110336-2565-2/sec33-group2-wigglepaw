import * as React from "react";
import { useState } from "react";
import type { NextPage } from "next";
import { api } from "../utils/api";
import {
  FieldValues,
  SubmitHandler,
  useForm,
  UseFormRegister,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PetKind } from "@prisma/client";
import Header from "../components/Header";
import { useRouter } from "next/router";

export default function RegisterPetSitter() {
  const createFreelancePetSitter = api.freelancePetSitter.create.useMutation();
  const createPetHotel = api.petHotel.create.useMutation();
  const router = useRouter();

  const [page1, setPage1] = useState({
    username: "",
    password: "",
    phoneNumber: "",
    email: "",
    address: "",
    type: "",
  });
  const [page2hotel, setPage2hotel] = useState({
    hotelName: "",
    businessLicenseUri: "",
  });
  const [page2free, setPage2free] = useState({
    firstName: "",
    lastName: "",
  });
  // const [page3, setPage3] = useState({
  //   bankAccount: "",
  //   bankName: "",
  //   cvv: "",
  //   exp: "",
  //   cardno: "",
  // });

  const [state, setState] = useState(0); //0=main info 1=freelance 2=hotelpet

  const onSubmitpage3 = async (e: {
    target: any;
    preventDefault(): unknown;
    e: { preventDefault: any };
    cat: string;
  }) => {
    e.preventDefault();

    var data = {
      bankAccount: e.target.bankno.value,
      bankName: e.target.bankname.value,
      cvv: e.target.cvv.value,
      exp: e.target.exp.value,
      cardno: e.target.cardno.value,
    };

    // registering to the backend
    try {

      if (page1.type === "petfreelance") {
        const newFreelancePetsitter = await createFreelancePetSitter.mutateAsync({
        user: {
          username: page1.username,
          password: page1.password,
          email: page1.email,
          phoneNumber: page1.phoneNumber,
          address: page1.address,
          bankAccount: data.bankAccount,
          bankName: data.bankName,
        },
        petSitter: {
          petTypes: ["dog", "cats"], // temporary for now
          verifyStatus: false,
          certificationUri: "testCertURI",
        },
        freelancePetSitter: page2free,
      })
    } else {
      const newPetHotel = await createPetHotel.mutateAsync({
        user: {
          username: page1.username,
          password: page1.password,
          email: page1.email,
          phoneNumber: page1.phoneNumber,
          address: page1.address,
          bankAccount: data.bankAccount,
          bankName: data.bankName,
        },
        petSitter: {
          petTypes: ["dog", "cats"], // temporary for now
          verifyStatus: false,
          certificationUri: "testCertURI",
        },
        petHotel: page2hotel,
      })
    }

    
    router.push('/');
  } catch(error) {
    console.log(error);
  }
    setState(3);
  };

  const FirstPage = () => {
    if (state === 1) {
      const validationSchema = z.object({
        // like a schema for register in form
        firstName: z.string().min(1, { message: "please provide details" }),
        lastName: z.string().min(1, { message: "please provide details" }),
      });
      type ValidationSchema = z.infer<typeof validationSchema>;

      const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm<ValidationSchema>({
        resolver: zodResolver(validationSchema), //using zod object above and link it with react hook
      });

      const onSubmit: SubmitHandler<ValidationSchema> = (data, e?: Event) => {
        e?.preventDefault();

        setPage2free({
          firstName: data.firstName,
          lastName: data.lastName,
        });

        //console.log(page2free, page2hotel);
        setState(3);
        console.log(JSON.stringify(data));
      };

      return (
        <>
        <Header/>
          <h1 className="py-2 text-3xl">Register Pet Sitter</h1>
          <h1 className="py-2 text-3xl">2/3</h1>
          <form className="w-4/5" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid  grid-cols-1 grid-rows-6">
              <div className="m-2">
                <Input
                  id="firstName"
                  label="firstName"
                  defaultValue={page2free.firstName}
                  register={register}
                  validationRules={{ required: true }}
                  placeholder="John"
                  type="text"
                />
                {errors.firstName && (
                  <p className="errorstyle"> {errors.firstName?.message}</p>
                )}
              </div>
              <div className="m-2">
                <Input
                  id="lastName"
                  label="lastName"
                  defaultValue={page2free.lastName}
                  register={register}
                  validationRules={{ required: true }}
                  placeholder="Wick"
                  type="text"
                />
                {errors.lastName && (
                  <p className="errorstyle"> {errors.lastName?.message}</p>
                )}
              </div>
              <div className="mx-3 flex flex-wrap content-end items-center justify-evenly">
                <button
                  type="button"
                  onClick={(e: { target: any }) => {
                    setState(0);
                  }}
                  className="buttonstyle"
                >
                  <p>Back</p>
                </button>
                <button type="submit" className="buttonstyle">
                  <p>Next</p>
                </button>
              </div>
            </div>
          </form>
        </>
      );
    } else if (state === 2) {
      const validationSchema = z.object({
        // like a schema for register in form
        hotelname: z.string().min(1, { message: "please provide details" }),
        businessLicenseUri: z
          .string()
          .min(1, { message: "please provide details" }),
      });
      type ValidationSchema = z.infer<typeof validationSchema>;

      const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm<ValidationSchema>({
        resolver: zodResolver(validationSchema), //using zod object above and link it with react hook
      });

      const onSubmit: SubmitHandler<ValidationSchema> = (data, e?: Event) => {
        e?.preventDefault();

        setPage2hotel({
          hotelName: data.hotelname,
          businessLicenseUri: data.businessLicenseUri,
        });

        //console.log(page2free, page2hotel);
        setState(3);
        console.log(JSON.stringify(data));
      };

      return (
        <>
          <Header/>
          <h1 className="py-2 text-3xl">Register Pet Sitter</h1>
          <h1 className="py-2 text-3xl">2/3</h1>
          <form className="w-4/5" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid  grid-cols-1 grid-rows-6">
              <div className="m-3">
                <Input
                  id="hotelname"
                  label="Hotel Name"
                  defaultValue={page2hotel.hotelName}
                  register={register}
                  validationRules={{ required: true }}
                  placeholder="Letsingitout resort and spa"
                  type="text"
                />
                {errors.hotelname && (
                  <p className="errorstyle"> {errors.hotelname?.message}</p>
                )}
              </div>
              <div className="m-3">
                <Input
                  id="businessLicenseUri"
                  label="Business License"
                  defaultValue={page2hotel.businessLicenseUri}
                  register={register}
                  validationRules={{ required: true }}
                  placeholder="I dont even know what to put here :<"
                  type="text"
                />
                {errors.businessLicenseUri && (
                  <p className="errorstyle">
                    {" "}
                    {errors.businessLicenseUri?.message}
                  </p>
                )}
              </div>
              <div className="mx-3 flex flex-wrap content-end items-center justify-evenly">
                <button
                  type="button"
                  onClick={(e: { target: any }) => {
                    setState(0);
                  }}
                  className="buttonstyle"
                >
                  <p>Back</p>
                </button>
                <button type="submit" className="buttonstyle">
                  <p>Next</p>
                </button>
              </div>
            </div>
          </form>
        </>
      );
    } else if (state === 3) {
      z;
      return (
        <>
          <Header/>
          <h1 className="py-2 text-3xl">Register Pet Sitter</h1>
          <h1 className="py-2 text-3xl">3/3</h1>
          <div className="flex w-2/3 justify-center">
            <form className=" h-full w-full pt-5 " onSubmit={onSubmitpage3}>
              <div className="mx-auto grid w-full grid-cols-2 grid-rows-6 gap-5 md:grid-cols-2 md:gap-2">
                <div className="col-span-4 flex items-center">
                  <input className="mr-2" type="checkbox"></input>
                  <label>By Card</label>
                  <div className="ml-4 h-6 w-8 rounded  bg-blue-300"></div>
                  <div className="ml-2 h-6 w-8 rounded  bg-blue-300"></div>
                  <div className="ml-2 h-6 w-8 rounded  bg-blue-300"></div>
                </div>
                <div className="col-span-2 flex w-full  flex-col">
                  <label>Card No*</label>
                  <input
                    id="cardno"
                    placeholder="xxxx xxxx xxxx xxxx"
                    type="number"
                    className="block w-full rounded border border-gray-100 bg-gray-100 p-1 px-2 text-sm text-gray-900 drop-shadow-md focus:border-blue-500 focus:bg-white focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-2"></div>

                <div className="flex w-full flex-col">
                  <label>Expiration Date*</label>
                  <input
                    id="exp"
                    className="block w-full rounded border border-gray-100 bg-gray-100 p-1 px-2 text-sm text-gray-900 drop-shadow-md focus:border-blue-500 focus:bg-white focus:ring-blue-500"
                    type="date"
                  />
                </div>
                <div className="flex w-full flex-col">
                  <label>CVV / CVN*</label>
                  <input
                    id="cvv"
                    className="block w-full rounded border border-gray-100 bg-gray-100 p-1 px-2 text-sm text-gray-900 drop-shadow-md focus:border-blue-500 focus:bg-white focus:ring-blue-500"
                    type="number"
                  />
                </div>
                <div className="col-span-2"></div>
                <div className="col-span-4 flex w-full items-center">
                  <input className="mr-2" type="checkbox"></input>
                  <label>Mobile banking</label>
                  <div className="ml-4 h-7 w-7 rounded-full bg-blue-300"></div>
                  <div className="ml-2 h-7 w-7 rounded-full bg-blue-300"></div>
                  <div className="ml-2 h-7 w-7 rounded-full bg-blue-300"></div>
                  <div className="ml-2 h-7 w-7 rounded-full bg-blue-300"></div>
                </div>
                <div className="flex w-full flex-col">
                  <label>Bank No*</label>
                  <input
                    id="bankno"
                    className="block w-full rounded border border-gray-100 bg-gray-100 p-1 px-2 text-sm text-gray-900 drop-shadow-md focus:border-blue-500 focus:bg-white focus:ring-blue-500"
                    placeholder="xxx-x-xxxxx-x"
                    type="number"
                  />
                </div>
                <div className=" flex w-full flex-col">
                  <label>Bank Name*</label>
                  <input
                    id="bankname"
                    placeholder="ABC"
                    className="block w-full rounded border border-gray-100 bg-gray-100 p-1 px-2 text-sm text-gray-900 drop-shadow-md focus:border-blue-500 focus:bg-white focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-2"></div>
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
              <div className="mt-5 flex w-full justify-evenly">
                <button
                  type="button"
                  onClick={() => {
                    if (page1.type === "petfreelance") {
                      setState(1);
                    } else {
                      setState(2);
                    }
                  }}
                  className="buttonstyle"
                >
                  Back
                </button>
                <button className="buttonstyle">Register</button>
              </div>
            </form>
          </div>
        </>
      );
    } else {
      const validationSchema = z.object({
        // like a schema for register in form
        username: z.string().min(2, { message: "come on! longer than that!" }),
        email: z
          .string()
          .min(2, { message: "longer" })
          .max(30, { message: "shorter" }),
        password: z.string().min(1, { message: "Don't leave it blank" }),
        phonenumber: z.string(),
        // .length(10, { message: "phoenumber must have a fix length of 10" }),   For the sake of the tester, for real case don't forget to remove comment
        address: z.string().min(1, { message: "required" }),
        type: z.string(),
      });
      type ValidationSchema = z.infer<typeof validationSchema>;

      const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm<ValidationSchema>({
        resolver: zodResolver(validationSchema), //using zod object above and link it with react hook
      });

      const onSubmit: SubmitHandler<ValidationSchema> = (data, e?: Event) => {
        e?.preventDefault();
        setPage1({
          username: data.username,
          password: data.password,
          phoneNumber: data.phonenumber,
          email: data.email,
          address: data.address,
          type: data.type,
        }); ///save data in page1, in case user want to go back and edit page 1,
        if (data.type === "petfreelance") {
          setState(1);
        } else {
          setState(2);
        }

        console.log(JSON.stringify(data));
      };

      return (
        <>
          <Header/>
          <h1 className="py-2 text-3xl">Register Pet Sitter</h1>
          <h1 className="py-2 text-3xl">1/3</h1>
          <form className="w-4/5" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid  grid-cols-1 grid-rows-6">
              <div className="mx-2">
                <Input
                  id="username"
                  label="Username"
                  defaultValue={page1.username}
                  register={register}
                  validationRules={{ required: true }}
                  placeholder="goddamn"
                  type="text"
                />
                {errors.username && (
                  <p className="errorstyle"> {errors.username?.message}</p>
                )}
              </div>
              <div className="mx-2">
                <Input
                  id="email"
                  label="Email"
                  defaultValue={page1.email}
                  register={register}
                  validationRules={{ required: true }}
                  placeholder="gg@ggwp"
                  type="email"
                />
                {errors.email && (
                  <p className="errorstyle"> {errors.email?.message}</p>
                )}
              </div>
              <div className="mx-2">
                <Input
                  id="password"
                  label="Password"
                  register={register}
                  validationRules={{ required: true }}
                  type="password"
                />
                {errors.password && (
                  <p className="errorstyle"> {errors.password?.message}</p>
                )}
              </div>
              <div className="mx-2">
                <Input
                  id="phonenumber"
                  label="Phone Number"
                  defaultValue={page1.phoneNumber}
                  register={register}
                  validationRules={{ required: true }}
                  type="number"
                />
                {errors.phonenumber && (
                  <p className="errorstyle"> {errors.phonenumber?.message}</p>
                )}
              </div>
              <div className="mx-2">
                <Input
                  id="address"
                  label="Address"
                  register={register}
                  defaultValue={page1.address}
                  validationRules={{ required: true }}
                  type="text"
                />
                {errors.address && (
                  <p className="errorstyle"> {errors.address?.message}</p>
                )}
              </div>
              <div className=" mx-2 flex justify-between py-2 pb-6">
                <div className="flex flex-wrap content-center items-center">
                  <label className="mb-2 block text-sm font-medium text-gray-900 ">
                    Choose your role here
                  </label>
                  <select
                    {...register("type")}
                    defaultValue={page1.type}
                    className="block w-full rounded border border-gray-100 bg-gray-100 p-1 px-2 text-sm text-gray-900 drop-shadow-md focus:border-blue-500 focus:bg-white focus:ring-blue-500"
                  >
                    <option value="petfreelance">Freelance Pet Sitter</option>
                    <option value="pethotel">Pet Hotel</option>
                  </select>
                </div>
              </div>

              <div className="mx-3 flex flex-wrap content-center items-center justify-evenly">
                <button
                  type="submit"
                  // onClick={() => {
                  //   console.log("??");
                  //   setState(1);
                  // }}
                  className=" buttonstyle"
                >
                  <p>Next</p>
                </button>
                {/* <button
                  type="submit"
                  className="buttonstyle"
                >
                  <p>Next As Freelance Pet</p>
                </button> */}
              </div>
            </div>
          </form>
        </>
      );
    }
  };

  return (
    <>
      <div className="content-star flex h-screen flex-col items-center  px-20 pt-20">
        <FirstPage />
      </div>
    </>
  );
}
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  //this is TS stuff (atleast that is what I think)
  id: string;
  label: string;
  register: UseFormRegister<FieldValues>; // declare register props
  validationRules?: object;
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  register,
  validationRules,
  type = "text",
  defaultValue,
  ...rest
}) => (
  <>
    <label htmlFor={id}>{label}</label>

    <input
      className="block w-full rounded border border-gray-100 bg-gray-100 p-1 px-2 text-sm text-gray-900 drop-shadow-md focus:border-blue-500 focus:bg-white focus:ring-blue-500"
      id={id}
      type={type}
      defaultValue={defaultValue}
      {...rest}
      {...register(id, validationRules)}
    />
  </>
);
