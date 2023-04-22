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
  type UseFormRegister,
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
  firstName: z.string().min(1, { message: "Required" }),
  lastName: z.string().min(1, { message: "Required" }),
  email: z.string().email(),
  address: z.string().min(1, { message: "Required" }),
  phone: z.string().regex(/^\d{10}$/, { message: "Invalid phone number" }),
  username: z.string().min(1, { message: "Required" }),
  password: z.string().min(1, { message: "Required" }),
  confirmPassword: z.string().min(1, { message: "Required" }),
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
  holderName: z.string().min(1, { message: "Required" }),
  cardNo: z.string(), //.regex(/^\d{16}$/),
  expDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  cvv: z.string().regex(/^\d{3}$/),
  // bankno: z.string(), //.regex(/^\d{12}$/),
  // bankname: z.string(),
});
// Schema for entire form, includes validation for password confirmation
const formDataSchema = formDataSchema1.merge(formDataSchema2).refine(
  (data) => {
    return data.password === data.confirmPassword;
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
  const { createTokenPromise } = useOmise({
    publicKey: env.NEXT_PUBLIC_OMISE_PUBLISHABLE_KEY,
  });

  const onSubmit = async (data: FormData) => {
    alert(JSON.stringify(tag));

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
          phoneNumber: data.phone,
          address: data.address,
        },
        petOwner: {
          firstName: data.firstName,
          lastName: data.lastName,
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

  const { page, setPage, Pagination } = usePage();
  const [tag, setTag] = useState([]);
  const [pettype, setPettype] = useState([]);

  return (
    <div className="flex h-screen flex-col">
      {/* <div className="absolute top-[-4rem] -z-10 ">
        <img src="/Ipage1-1.png" width={468} height={315} alt="cat" />
      </div>
      <div className="absolute right-0 -z-10 ">
        <img src="/Ipage1-2.png" width={468} height={315} alt="cat" />
      </div> */}
      <Header />
      <div className="mt-4 flex h-full w-full flex-col items-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="min-w-lg mx-auto my-[5vh] w-1/2 rounded-xl bg-slate-200 px-16 py-8 text-xl"
        >
          {/* <div className="flex w-full flex-col items-center">
            <h1 className="text-xl font-medium">Register Pet Owner</h1>
          </div> */}
          <div className="">
            <Pagination />
          </div>
          <div className="flex w-full flex-col gap-4 px-[100px] py-4">
            <Button
              id="next-button"
              type="button"
              onClick={async () => {
                // Trigger validation only for field in the first page
                // const validationResult = await trigger(
                //   formDataSchema1.keyof().options,
                //   { shouldFocus: true }
                // );
                // If validation passes, go to the next page
                // if (validationResult) {
                setPage((prev) => (prev % 3) + 1);
                // }
              }}
            >
              Next
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
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

function usePage() {
  const [page, setPage] = useState<1 | 2 | 3>(1);

  const incPage = () => {
    setPage((prev) => Math.min(3, prev + 1) as 1 | 2 | 3);
  };

  const decPage = () => {
    setPage((prev) => Math.max(1, prev - 1) as 1 | 2 | 3);
  };

  const PageNode = ({ idx }: { idx: number }) => (
    <div
      className={`flex items-center gap-2 font-bold drop-shadow-sm ${
        page > idx ? "text-good" : page < idx ? "text-gray-400" : "text-wp-blue"
      }`}
    >
      {page > idx ? (
        <div className="center-thing">
          <div className="center-thing aspect-square w-[40px] gap-2 rounded-full bg-gradient-to-tr from-good to-good/[.85] font-bold text-white drop-shadow-md">
            ✔
          </div>
        </div>
      ) : page < idx ? (
        <div className="center-thing">
          <div className="center-thing aspect-square w-[40px] gap-2 rounded-full bg-gradient-to-tr from-gray-400 to-gray-400/[.85] font-bold text-white drop-shadow-md">
            {idx}
          </div>
        </div>
      ) : (
        <div className="center-thing">
          <div className="center-thing aspect-square w-[40px] gap-2 rounded-full bg-gradient-to-tr from-wp-blue to-wp-blue/[.85] font-bold text-white drop-shadow-md">
            {idx}
          </div>
        </div>
      )}
      {idx === 1 ? (
        <div className="max-w-[100px] text-base">Account</div>
      ) : idx === 2 ? (
        <div className="max-w-[100px] text-base">Pet Sitter</div>
      ) : (
        <div className="max-w-[100px] text-base">Payment</div>
      )}
    </div>
  );

  const PageEdge = ({ idx }: { idx: number }) =>
    page > idx ? (
      // <hr className="h-1 w-[13%] animate-flow rounded-xl bg-gradient-to-l from-good bg-for-flow" />
      <hr className="h-1 w-[13%] animate-flow rounded-xl bg-gradient-to-l from-good bg-for-flow" />
    ) : (
      <hr className="h-1 w-[13%] rounded-xl bg-gray-400" />
    );

  const Pagination = () => (
    <div className="flex w-full items-center justify-between">
      <PageNode idx={1} />
      <PageEdge idx={1} />
      <PageNode idx={2} />
      <PageEdge idx={2} />
      <PageNode idx={3} />
    </div>
  );

  return {
    page,
    setPage,
    Pagination,
  };
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
      className="blue-focus w-full rounded bg-gray-50 p-1 px-2 text-sm transition-all duration-200"
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
    className=" blue-focus rounded bg-[#98AAB4] px-6 py-2.5 text-center text-sm font-semibold drop-shadow-md hover:bg-[#8b9ba3] sm:w-auto md:px-16"
    {...props}
  >
    {children}
  </button>
);

export default RegisterPage;

function useInterval(callback: Function, delay: number) {
  const intervalRef = useRef<NodeJS.Timer>();
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    intervalRef.current = setInterval(() => callbackRef.current(), delay);
    return () => clearInterval(intervalRef.current);
  }, [delay]);

  return intervalRef;
}

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
