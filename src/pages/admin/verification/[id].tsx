import Error from "next/error";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { UserType } from "../../../types/user";
import { api } from "../../../utils/api";
import Header from "../../../components/Header";
import { useSession } from "next-auth/react";

export default function VerifyPetSitter() {
  // ctx
  const utils = api.useContext();

  // session
  const session = useSession();

  // router
  const router = useRouter();

  // query
  const approvalRequest: any = api.approvalRequest.getByPetSitterId.useQuery({
    petSitterId: typeof router.query.id === "string" ? router.query.id : "",
  });
  const approvePetSitter = api.approvalRequest.approve.useMutation({
    async onSettled() {
      utils.approvalRequest.getAll.invalidate();
    },
  });

  const petSitter: any = approvalRequest.data?.petSitter;

  if (session.data?.user?.userType !== UserType.Admin)
    return <Error statusCode={404} />;
  if (approvalRequest.isLoading) return <Header />;
  if (
    !approvalRequest.data ||
    (!petSitter.freelancePetSitter && !petSitter.petHotel)
  )
    return <Error statusCode={404} />;
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-grow">
        {/* SIDE TAB */}
        <div className="flex h-full w-[200px] border-2">
          Please connect sidetab given I am done with my life.
        </div>
        <div className="w-full overflow-scroll sm:px-[40px] sm:pt-[20px] sm:pb-[40px] xl:px-[80px] xl:pt-[40px] xl:pb-[60px]">
          <div className="flex h-full flex-col gap-5">
            {/* HEADER */}
            <h1 className="text-[40px] font-semibold">
              Pet Sitter Verification
            </h1>
            <div className="flex h-full w-full flex-col justify-between gap-10 rounded-md border-2 border-black sm:px-[20px] sm:py-[20px] xl:p-[40px]">
              {/* TOP SIDE */}
              <div className="flex h-full w-full gap-8">
                {/* LEFT SIDE */}
                <div className="flex flex-grow flex-col gap-6 text-[24px]">
                  <div className="flex w-full items-end leading-none">
                    <div className="w-[30%] font-semibold">Type</div>
                    <div className="w-[70%] text-[30px]">
                      {petSitter.freelancePetSitter ? "Freelance" : "Hotel"}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex w-full items-end leading-none">
                      <div className="w-[30%] font-semibold">Name</div>
                      <div className="flex w-[70%] flex-col">
                        {petSitter.freelancePetSitter ? (
                          <div className="text-[30px]">
                            {petSitter.freelancePetSitter.firstName}{" "}
                            {petSitter.freelancePetSitter.lastName}
                          </div>
                        ) : (
                          <div className="text-[30px]">
                            {petSitter.petHotel.hotelName}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex w-full items-end leading-none">
                      <div className="w-[30%]"></div>
                      <div className="flex w-[70%] flex-col text-[22.5px] text-wp-blue">
                        #{petSitter.user.username}
                      </div>
                    </div>
                  </div>
                  <div className="flex w-full items-center leading-none">
                    <div className="w-[30%] font-semibold">Pet Types</div>
                    <div className="flex w-[70%] gap-2">
                      <PetTypes petTypes={petSitter.petTypes} />
                    </div>
                  </div>
                  <div className="flex w-full items-end leading-none">
                    <div className="w-[30%] font-semibold text-wp-blue">
                      Price Range
                    </div>
                    <div className="w-[70%]r">
                      ฿{petSitter.startPrice} - ฿{petSitter.endPrice}
                    </div>
                  </div>
                  <div className="flex w-full items-end leading-none">
                    <div className="w-[30%] font-semibold">Certification</div>
                    <div className="w-[70%] overflow-hidden text-ellipsis whitespace-nowrap">
                      <Link
                        href={petSitter.certificationUri || ""}
                        className="link"
                      >
                        {petSitter.certificationUri}
                      </Link>
                    </div>
                  </div>
                  <div className="flex w-full">
                    <div className="w-[30%] font-semibold">Introduction</div>
                    <div className="w-[70%]">
                      <textarea
                        className="-mb-[3px] w-[80%] resize-none rounded-sm border-2 p-[5px] text-[18px] text-[#434D54] focus:border-[#80bdff] focus:shadow-[0_0_0_0.2rem_rgba(0,123,255,.25)] focus:outline-none"
                        rows={4}
                        readOnly
                      >
                        I will eat your pets.\n.\n.
                      </textarea>
                    </div>
                  </div>
                  <div className="flex w-full">
                    <div className="w-[30%] font-semibold">Register Date</div>
                    <div className="w-[70%] text-wp-blue">
                      {approvalRequest.data?.createdAt.toLocaleString()}
                    </div>
                  </div>
                </div>
                {/* RIGHT SIDE */}
                <div className="flex w-[304px] flex-col gap-5 px-8 text-[24px]">
                  <div className="relative aspect-square w-full rounded-lg drop-shadow-lg">
                    <Image
                      src={petSitter.user.imageUri || "/profiledummy.png"}
                      alt=""
                      fill
                      className="rounded-lg object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-[10px]">
                    <div className="font-semibold">Address</div>
                    <div className="text-[20px] text-[#434D54]">
                      {petSitter.user.address}
                    </div>
                  </div>
                  <div className="flex flex-col gap-[10px]">
                    <div className="font-semibold">Phone Number</div>
                    <div className="text-wp-blue">
                      {petSitter.user.phoneNumber}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <button
                  className="h-[60px] w-[200px] rounded-md bg-good text-[30px] font-semibold text-white drop-shadow-md hover:bg-[#3BAD5A]"
                  onClick={async () => {
                    if (petSitter.data) {
                      await approvePetSitter.mutateAsync({
                        requestId: approvalRequest.requestId,
                        adminId: session.data?.user?.userId ?? "",
                      });
                      router.replace(
                        {
                          pathname: "/admin/verification",
                          query: {
                            code: 6901,
                            notice: `${
                              petSitter.data.userType ===
                              UserType.FreelancePetSitter
                                ? "Freelance pet sitter"
                                : "Pet hotel"
                            } #${petSitter.data.username} has been verified.`,
                          },
                        },
                        "/admin/verification"
                      );
                    }
                  }}
                >
                  Verify
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const coloredPetTypes = [
  "cat",
  "dog",
  "iguana",
  "snake",
  "ferret",
  "bird",
  "fish",
  "mouse",
  "hamster",
];

interface PetTypesProps {
  petTypes: string[];
}

function PetTypes({ petTypes }: PetTypesProps) {
  function tagColor(petType: string) {
    switch (petType.toLowerCase()) {
      case "cat":
        return "#C58A8A";
      case "dog":
        return "#C0BE7C";
      case "iguana":
        return "#7AA3A0";
      case "snake":
        return "#A075AB";
      case "ferret":
        return "#6F7AA6";
      case "bird":
        return "#89D2D1";
      case "fish":
        return "#6CB8ED";
      case "mouse":
        return "#7AA38D";
      case "hamster":
        return "#A37A7A";
      default:
        return "#C0A57C";
    }
  }

  function format(petType: string) {
    petType = petType.toLowerCase();
    petType = petType.charAt(0).toUpperCase() + petType.slice(1).toLowerCase();
    return petType;
  }

  petTypes = [...petTypes].sort(sortFn);

  const used: { [key: string]: boolean } = [
    "cat",
    "dog",
    "iguana",
    "snake",
    "ferret",
    "bird",
    "fish",
    "mouse",
    "hamster",
  ].reduce((a, v) => ({ ...a, [v]: false }), {});

  petTypes.forEach((petType) => {
    used[petType] = true;
  });

  const [dot, setDot] = useState("");

  useEffect(() => {
    if (Object.keys(petTypes).length > 3) {
      Object.keys(used).every((petType) => {
        if (!used[petType]) {
          setDot(petType);
          return false;
        }
        return true;
      });
    }
  }, []);

  return (
    <div className="flex w-[70%] gap-2">
      {[...petTypes]
        .sort(sortFn)
        .slice(0, 3)
        .map((petType) => (
          <div
            className={`flex h-[40px] items-center justify-center rounded-lg border px-4 text-[20px] text-white drop-shadow-md bg-[${tagColor(
              petType
            )}]`}
          >
            {format(petType)}
          </div>
        ))}
      {dot && (
        <div
          className={`flex h-[40px] items-center justify-center rounded-lg border px-2 text-[20px] text-white drop-shadow-md bg-[${tagColor(
            dot
          )}]`}
        >
          ...
        </div>
      )}
    </div>
  );
}

function sortFn(petType1: string, petType2: string) {
  const inc1 = coloredPetTypes.includes(petType1.toLowerCase());
  const inc2 = coloredPetTypes.includes(petType2.toLowerCase());
  return inc1 && inc2
    ? petType1 < petType2
      ? -1
      : petType1 > petType2
      ? 1
      : 0
    : inc1
    ? -1
    : inc2
    ? 1
    : petType1 < petType2
    ? -1
    : petType1 > petType2
    ? 1
    : 0;
}

//
function TailwindBugFix() {
  return (
    <div>
      <div className="bg-[#C58A8A]"></div>
      <div className="bg-[#C0BE7C]"></div>
      <div className="bg-[#7AA3A0]"></div>
      <div className="bg-[#A075AB]"></div>
      <div className="bg-[#6F7AA6]"></div>
      <div className="bg-[#89D2D1]"></div>
      <div className="bg-[#6CB8ED]"></div>
      <div className="bg-[#A37A7A]"></div>
      <div className="bg-[#C0A57C]"></div>
      <div className="bg-[#7AA38D]"></div>
    </div>
  );
}
