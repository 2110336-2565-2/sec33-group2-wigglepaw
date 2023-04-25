import * as React from "react";
import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextPage,
} from "next";
import { api } from "../../utils/api";
import {
  type FieldErrorsImpl,
  useForm,
  useWatch,
  type UseFormRegister,
  UseFormWatch,
  UseFormStateReturn,
  FormState,
  RegisterOptions,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Header from "../../components/Header";
import { useState, useRef, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { getServerAuthSession } from "../../server/auth";
import type { OmiseTokenParameters } from "omise-js-typed/dist/lib/omise";
import { useOmise } from "use-omise";
import { env } from "../../env/client.mjs";

// Schema for first page of form
const formDataSchema1 = z.object({
  email: z.string().min(1, { message: "Required" }).email(),
  username: z.string().min(1, { message: "Required" }),
  password: z.string().min(1, { message: "Required" }),
  confirmPassword: z.string().min(1, { message: "Required" }),
});

// Schema for second page of form
const formDataSchema2 = z.object({
  firstName: z.string().min(1, { message: "Required" }),
  lastName: z.string().min(1, { message: "Required" }),
  address: z.string().min(1, { message: "Required" }),
  phoneNumber: z
    .string()
    .min(1, { message: "Required" })
    .regex(/^\d{10}$/, { message: "Invalid phone number" }),
  // type: z.string().min(1, { message: "Required" }),
  // breed: z.string().min(1, { message: "Required" }),
  // weight: z
  //   .string()
  //   .trim()
  //   .regex(/^\d+/, { message: "Invalid number" })
  //   .transform((val) => parseInt(val)),
});

// Schema for third page of form
const formDataSchema3 = z.object({
  holderName: z.string().min(1, { message: "Required" }),
  cardNo: z.string(), //.regex(/^\d{16}$/),
  expDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  cvv: z.string().regex(/^\d{3}$/),
  // bankno: z.string(), //.regex(/^\d{12}$/),
  // bankname: z.string(),
});

// Schema for entire form, includes validation for password confirmation
const formDataSchema = formDataSchema1
  .merge(formDataSchema2)
  .merge(formDataSchema3)
  .refine(
    (data) => {
      return data.password === data.confirmPassword;
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

// Type for entire form
type FormData = z.infer<typeof formDataSchema>;

const RegisterPage: NextPage = () => {
  const {
    register,
    handleSubmit,
    trigger,
    formState,
    setValue,
    setError,
    setFocus,
    clearErrors,
    control,
  } = useForm<FormData>({
    resolver: zodResolver(formDataSchema),
    mode: "onChange",
  });
  const [username, email, password, confirmPassword] = useWatch({
    control,
    name: ["username", "email", "password", "confirmPassword"],
  });

  const router = useRouter();
  const mutation = api.petOwner.create.useMutation();
  const { createTokenPromise } = useOmise({
    publicKey: env.NEXT_PUBLIC_OMISE_PUBLISHABLE_KEY,
  });

  const onSubmit = async (data: FormData) => {
    // alert(JSON.stringify(tag));

    // Collect card into omise
    // follow the offical guide: https://www.omise.co/collecting-card-information
    const exp_month = +data.expDate.slice(5, 7);
    const exp_year = +data.expDate.slice(0, 4);
    if (exp_month < 1 || exp_month > 12) {
      throw new Error("Invalid expiration month");
    }
    if (exp_year < 2000 || exp_year > 2100) {
      throw new Error("Invalid expiration year");
    }

    let cardToken;
    try {
      // Fix very strange omise bug
      // Poll omise's createTokenPromise, with a timeout of 2 second
      console.log("token" + createTokenPromise?.toString());
      await Promise.race([
        (async () => {
          while (createTokenPromise === null) {
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
        })(),
        new Promise((resolve) => setTimeout(resolve, 2000)),
      ]);

      if (createTokenPromise === null) {
        alert("OmiseJS is not loaded yet, please wait and try again");
        return;
      }

      cardToken = await createTokenPromise("card", {
        name: data.holderName,
        number: data.cardNo,
        expiration_month: exp_month,
        expiration_year: exp_year,
        security_code: +data.cvv,
      } satisfies OmiseTokenParameters);
    } catch (e) {
      console.error("Card verification failed:", e);
      alert(`Card verification failed: ${JSON.stringify(e)}`);
      return;
    }

    //when send Pet type  send tag instead of data.type !!
    console.assert(data.password === data.confirmPassword);
    try {
      await mutation.mutateAsync({
        user: {
          username: data.username,
          password: data.confirmPassword,
          email: data.email,
          phoneNumber: data.phoneNumber,
          address: data.address,
        },
        petOwner: {
          firstName: data.firstName,
          lastName: data.lastName,
          // petTypes: [data.type], // TODO: Please correct this, it's currently just a placeholder
          petTypes: tag,
        },
        cardToken,
      });
    } catch (e) {
      console.error("Failed to register:", e);
      alert(`Failed to register: ${JSON.stringify(e)}`);
    }

    console.log(`Try signin with username ${data.username}`);
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

  const [tag, setTag] = useState<string[]>([]);
  const handleSpace = (e: any) => {
    if (e.keyCode === 32) {
      e.preventDefault();
      console.log(tag);
      if (e.target.value.trim() !== "") {
        setTag([...tag, e.target.value]);
      }
      //console.log(e.target.value);
      e.target.value = "";
    }
  };

  const { page, incPage, decPage, Pagination } = usePage();

  // const userByUsername = api.user.getByUsername.useQuery({
  //   username,
  // });

  // THERE IS OPENAPI BUG IN GETBYUSERNAME
  const userByUsername = {
    data: undefined,
    refetch() {
      console.log("Dummy refetch");
    },
  };
  const userByEmail = api.user.getByEmail.useQuery({
    email,
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="-mt-4 flex h-full w-full flex-1 items-center bg-[url('/maxsm-registerpetowner.jpg')] bg-cover bg-center bg-no-repeat sm:bg-[url('/registerpetowner.jpg')]">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto my-[64px] flex h-[600px] w-[85%] rounded-xl text-lg sm:h-[540px] md:mx-[10vw] md:w-[75%] lg:mx-[72px] lg:w-[60%] xl:w-[55%]"
        >
          <div className="py-12 max-sm:hidden">
            <Pagination />
          </div>
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 py-8">
            <h1 className="text-center text-3xl font-bold max-sm:max-w-[160px] max-sm:leading-normal sm:mb-4">
              Register Pet Owner
            </h1>
            <div className="w-fit">
              {page === 0 ? (
                <>
                  <div className="flex h-[360px] flex-col justify-center max-sm:mt-4 sm:h-[380px]">
                    <Input
                      id="username"
                      label="Username"
                      placeholder="username"
                      register={register}
                      formState={formState}
                      validationRules={{ required: true }}
                    />
                    <Input
                      id="email"
                      label="Email"
                      placeholder="someone@gmail.com"
                      register={register}
                      formState={formState}
                      validationRules={{ required: true }}
                      type="email"
                    />
                    <Input
                      id="password"
                      label="Password"
                      placeholder="********"
                      register={register}
                      formState={formState}
                      validationRules={{ required: true }}
                      type="password"
                    />
                    <Input
                      id="confirmPassword"
                      label="Confirm Password"
                      placeholder="********"
                      register={register}
                      formState={formState}
                      validationRules={{
                        required: true,
                        validate: (val: string) => {
                          if (val === password) return "FUCK YOU";
                        },
                      }}
                      type="password"
                    />
                  </div>
                  <div className="center-thing max-sm:mt-4">
                    <Button
                      id="next-button-1"
                      type="button"
                      className="w-full sm:w-[160px]"
                      // disabled={isLoading}
                      onClick={async () => {
                        // if (isLoading) return;
                        let ok = true;
                        // Trigger validation only for field in the first page
                        const validationResult = await trigger(
                          formDataSchema1.keyof().options,
                          { shouldFocus: true }
                        );
                        if (!validationResult) ok = false;

                        if (username) await userByUsername.refetch();
                        if (email) await userByEmail.refetch();

                        // NAIVE shit
                        if (
                          userByUsername.data ||
                          userByEmail.data ||
                          confirmPassword !== password
                        ) {
                          if (userByUsername.data) {
                            setError("username", { message: "Already exists" });
                            if (ok) {
                              setFocus("username");
                              ok = false;
                            }
                          }
                          if (userByEmail.data) {
                            setError("email", { message: "Already exists" });
                            if (ok) {
                              setFocus("email");
                              ok = false;
                            }
                          }
                          if (confirmPassword !== password) {
                            setError("confirmPassword", {
                              message: "Passwords do not match",
                            });
                            if (ok) {
                              setFocus("confirmPassword");
                              ok = false;
                            }
                          }
                          return;
                        }

                        // If validation passes, go to the next page
                        if (ok) incPage();
                      }}
                    >
                      Next
                    </Button>
                  </div>
                </>
              ) : page === 1 ? (
                <>
                  <div className="flex h-[360px] flex-col justify-center max-sm:mt-4 sm:h-[380px]">
                    <Input
                      id="firstName"
                      label="First Name"
                      placeholder="John"
                      register={register}
                      formState={formState}
                      validationRules={{ required: true }}
                    />
                    <Input
                      id="lastName"
                      label="Last Name"
                      placeholder="Greenwood"
                      register={register}
                      formState={formState}
                      validationRules={{ required: true }}
                    />
                    <Input
                      id="address"
                      label="Address"
                      placeholder="xxxxxxxxxxxxxxxxx"
                      register={register}
                      formState={formState}
                      validationRules={{ required: true }}
                    />
                    <Input
                      id="phoneNumber"
                      label="Phone Number"
                      placeholder="0123456789"
                      register={register}
                      formState={formState}
                      validationRules={{ required: true }}
                      className="font-mono text-lg"
                    />
                    <div className="flex h-[72px] flex-col">
                      <div className="relative flex h-[48px] w-full text-base">
                        <label
                          htmlFor="tag"
                          className="absolute left-0 z-20 flex h-[48px] w-[120px] items-center px-4 text-sm font-medium leading-tight"
                        >
                          <span>Pet types</span>
                        </label>
                        <div className="z-10 flex h-full w-[290px] items-center pl-4 sm:w-[414px]">
                          <div className="z-10 ml-[74px] flex gap-1 overflow-x-scroll sm:ml-[96px]">
                            {tag.map((value, index) => (
                              <div className="center-thing ml-1 rounded-full bg-slate-300 px-2 py-1 text-sm shadow">
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
                                  ⨉
                                </button>
                              </div>
                            ))}
                          </div>
                          <input
                            id="tag"
                            className="peer z-10 h-full min-w-[80px] flex-1 bg-inherit pl-2 pr-4 focus:outline-none"
                            placeholder="Dog"
                            onKeyDown={handleSpace}
                          />
                          <input
                            readOnly
                            disabled
                            className={`absolute left-0 h-[48px] w-[290px] flex-col rounded-xl border-2 border-gray-400 bg-gray-50 p-1 pr-12 text-gray-400 drop-shadow-md transition-all duration-200 peer-focus:border-[#4081FF] peer-focus:shadow-[0_0_0_0.2rem_rgba(0,128,255,.25)] peer-focus:outline-none sm:w-[414px]`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex w-full justify-evenly max-sm:mt-4 max-sm:flex-col max-sm:gap-4">
                    <Button
                      id="back-button"
                      type="button"
                      className="w-full sm:w-[120px]"
                      onClick={decPage}
                    >
                      Back
                    </Button>
                    <Button
                      id="next-button-2"
                      type="button"
                      className="w-full sm:w-[120px]"
                      onClick={async () => {
                        // Trigger validation only for field in the first page
                        const validationResult = await trigger(
                          formDataSchema2.keyof().options,
                          { shouldFocus: true }
                        );

                        // If validation passes, go to the next page
                        if (validationResult) {
                          incPage();
                        }
                      }}
                    >
                      Next
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex h-[360px] flex-col justify-center max-sm:mt-4 sm:h-[380px]">
                    <Input
                      id="holderName"
                      label="Holder Name"
                      labelWidth="140px"
                      placeholder="Adam Smith"
                      register={register}
                      formState={formState}
                      validationRules={{ required: true }}
                    />
                    <Input
                      id="cardNo"
                      label="Card No"
                      labelWidth="140px"
                      placeholder="xxxx xxxx xxxx xxxx"
                      register={register}
                      formState={formState}
                      validationRules={{ required: true }}
                      className="font-mono text-lg"
                    />
                    <Input
                      id="expDate"
                      label="Exp. Date"
                      labelWidth="140px"
                      register={register}
                      formState={formState}
                      validationRules={{ required: true }}
                      type="date"
                    />
                    <Input
                      id="cvv"
                      label="CVV / CVN"
                      labelWidth="140px"
                      register={register}
                      formState={formState}
                      validationRules={{ required: true }}
                    />
                  </div>
                  <div className="flex w-full justify-evenly max-sm:mt-4 max-sm:flex-col max-sm:gap-4">
                    <Button
                      id="back-button"
                      type="button"
                      className="w-full sm:w-[120px]"
                      onClick={decPage}
                    >
                      Back
                    </Button>
                    <Button
                      id="register-button"
                      type="submit"
                      className="w-full sm:w-[120px]"
                    >
                      Register
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </form>
        <div className="flex-grow flex-col max-lg:hidden"></div>
      </div>
    </div>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: keyof FormData;
  label: string;
  labelWidth?: string;
  register: UseFormRegister<FormData>; // declare register props
  formState: FormState<FormData>;
  validationRules?: RegisterOptions;
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  labelWidth,
  register,
  formState,
  validationRules,
  type = "text",
  className,
  ...rest
}) => (
  <div className="flex h-[72px] w-[290px] flex-col sm:w-[414px]">
    <div className="relative flex h-[48px] w-full text-base">
      <label
        htmlFor={id}
        className={`absolute left-0 z-10 flex h-[48px] items-center px-4 text-sm font-medium leading-tight max-sm:w-[90px] w-[${
          labelWidth ?? "120px"
        }]`}
      >
        {label}
      </label>
      <input
        className={`h-[48px] w-full rounded-xl border-2 bg-gray-50 pr-4 text-wp-blue drop-shadow-md transition-all duration-200 sm:pr-10 pl-[${
          labelWidth ?? "120px"
        }] max-sm:pl-[90px] ${
          formState.errors[id]
            ? "red-focus border-[#dc3545]"
            : "blue-focus border-gray-400"
        } ${className}`}
        id={id}
        key={id}
        type={type}
        // style={{ paddingLeft: labelWidth ?? "120px" }}
        {...rest}
        {...register(id, validationRules)}
      />
      <label
        htmlFor={id}
        className="center-thing absolute right-0 z-10 h-[48px] w-12 max-sm:hidden"
      >
        {/* {validationRules.required && !watch(id) && (
          <span className="center-thing h-[48px] w-1/2 bg-white text-2xl font-bold text-bad">
            ٭
          </span>
        )} */}
        {formState.dirtyFields[id] && formState.errors[id] && (
          <span className="center-thing h-[36px] w-1/2 bg-inherit text-2xl font-medium text-bad">
            !
          </span>
          // ) : (
          //   <span className="center-thing h-[36px] w-1/2 bg-inherit text-xl font-bold text-good">
          //     ✓
          //   </span>
        )}
      </label>
    </div>
    <span className="mx-4 text-sm font-medium text-bad">
      {formState.errors[id]?.message}
    </span>
  </div>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  id,
  className,
  children,
  ...rest
}) => (
  <button
    id={id}
    key={id}
    className={`rounded-lg bg-wp-blue py-2.5 text-center text-sm font-medium text-white drop-shadow-md hover:bg-wp-light-blue ${className}`}
    {...rest}
  >
    {children}
  </button>
);

function usePage() {
  const [page, setPage] = useState<0 | 1 | 2>(0);
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [progress, setProgress] = useState([0, 0]);

  // for animation
  const DURATION = 700; // the time it takes to fill progress bar
  const FREQUENCY = 5; // one iteration progress increases by this value

  const incPage = async () => {
    setPage((prev) => Math.min(2, prev + 1) as 0 | 1 | 2);
    let newProgress = 0;
    for (let i = 0; i < 100 / FREQUENCY; i++) {
      const tmp = [...progress];
      newProgress += 5;
      tmp[page] = newProgress;
      setProgress(tmp);

      await new Promise((resolve) => {
        setTimeout(resolve, 0.01 * DURATION * FREQUENCY);
      });
    }
    setStep((prev) => Math.min(2, prev + 1) as 0 | 1 | 2);
  };

  const decPage = () => {
    setPage((prev) => Math.max(0, prev - 1) as 0 | 1 | 2);
    setStep((prev) => Math.max(0, prev - 1) as 0 | 1 | 2);
  };

  const PageNode = ({ idx }: { idx: number }) => (
    <div
      className={`flex flex-col items-center gap-2 rounded-full py-2 text-center font-bold drop-shadow-sm ${
        page > idx ? "text-good" : step < idx ? "text-gray-400" : "text-wp-blue"
      }`}
    >
      {page > idx ? (
        <div className="center-thing">
          <div className="center-thing aspect-square w-[30px] gap-2 rounded-full bg-gradient-to-tr from-good to-good/[.9] font-bold text-white drop-shadow-md sm:w-[40px]">
            ✔
          </div>
        </div>
      ) : step < idx ? (
        <div className="center-thing">
          <div className="center-thing aspect-square w-[30px] gap-2 rounded-full bg-gradient-to-tr from-gray-400 to-gray-400/[.85] font-bold text-white drop-shadow-md sm:w-[40px]">
            {idx + 1}
          </div>
        </div>
      ) : (
        <div className="center-thing">
          <div className="center-thing aspect-square w-[30px] gap-2 rounded-full bg-gradient-to-tr from-wp-blue to-wp-blue/[.85] font-bold text-white drop-shadow-md sm:w-[40px]">
            {idx + 1}
          </div>
        </div>
      )}
      {idx === 0 ? (
        <div className="max-w-[80px] text-base">Account</div>
      ) : idx === 1 ? (
        <div className="max-w-[80px] text-base">Pet Owner</div>
      ) : (
        <div className="max-w-[80px] text-base">Payment</div>
      )}
    </div>
  );

  const PageEdge = ({ idx }: { idx: number }) =>
    page > idx ? (
      // <hr className="h-1 w-[13%] animate-flow rounded-xl bg-gradient-to-l from-good bg-for-flow" />
      <div className="w-1 flex-grow rounded-full bg-gray-300 shadow-sm">
        <div
          className="transition-height w-full rounded-full bg-gradient-to-l from-good to-good/[.8] shadow-sm"
          style={{ height: `${progress[idx]}%` }}
        ></div>
      </div>
    ) : (
      <div className="w-1 flex-grow rounded-full bg-gray-300 shadow-sm"></div>
    );

  const Pagination = () => (
    <div className="flex h-full flex-col items-center justify-between">
      <PageNode idx={0} />
      <PageEdge idx={0} />
      <PageNode idx={1} />
      <PageEdge idx={1} />
      <PageNode idx={2} />
    </div>
  );

  return {
    page,
    incPage,
    decPage,
    Pagination,
  };
}

function TailwindBugFix() {
  return (
    <div>
      <div className="w-[120px] pl-[120px]"></div>
      <div className="w-[130px] pl-[130px]"></div>
      <div className="w-[140px] pl-[140px]"></div>
    </div>
  );
}

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
