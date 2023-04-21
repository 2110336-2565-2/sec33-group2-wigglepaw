import { useEffect, useState } from "react";
import type { GetServerSidePropsContext, NextPage } from "next";
import { api } from "../../../utils/api";
import { useForm } from "react-hook-form";
import { boolean, custom, z } from "zod";
import Header from "../../../components/Header";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import SideTab from "../../../components/SideTab";
import { UserType } from "../../../types/user";
import ResponsePopup from "../../../components/ResponsePopup";
import { Pet } from "@prisma/client";
import AddPet from "../../../components/Pet/AddPet";
import { bookingFields } from "../../../schema/schema";
import { getServerAuthSession } from "../../../server/auth";
import { zodResolver } from "@hookform/resolvers/zod";

const formDataSchema = bookingFields.extend({ selectedPet: z.any() });

type FormData = z.infer<typeof formDataSchema>;

const booking: NextPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { username } = router.query;

  const [isBookSuccess, setIsBookSuccess] = useState(false);

  const requestBooking = api.booking.request.useMutation();
  const { data: myPetList, refetch: refetchMyPetList } =
    api.pet.getMyPetList.useQuery();

  const [selectedPetList, setSelectedPetList] = useState(new Array());

  useEffect(() => {
    if (myPetList != undefined) {
      setSelectedPetList(
        myPetList.map((pet: Pet) => ({
          ...pet,
          selected: false,
        }))
      );
    }
  }, [myPetList]);

  const toggleCheckbox = (id: string) => {
    setSelectedPetList(
      selectedPetList.map((pet) =>
        pet.petId === id ? { ...pet, selected: !pet.selected } : pet
      )
    );
  };

  const { data: petSitterData, error: userError } =
    api.user.getByUsername.useQuery(
      { username: typeof username === "string" ? username : "" },
      { enabled: typeof username === "string" }
    );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<FormData>({
    resolver: zodResolver(formDataSchema),
    mode: "onSubmit",
  });

  const onSubmit = async (data: FormData) => {
    if (petSitterData) {
      const petIdList = selectedPetList.reduce(function (result, pet) {
        if (pet.selected) {
          result.push(pet.petId);
        }
        return result;
      }, []);

      if (petIdList.length == 0) {
        //Throw error to use form
        setError("selectedPet", {
          type: "custom",
          message: "Please select at least 1 pet",
        });
        return;
      }

      try {
        const response = await requestBooking.mutateAsync({
          petSitterId: petSitterData?.userId,
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate),
          petIdList: petIdList,
          totalPrice: data.totalPrice,
          note: data.note,
        });
        console.log(JSON.stringify(errors));
        if (response.status == "ERROR") {
          alert(response.reason);
        } else {
          setIsBookSuccess(true);
          setTimeout(function () {
            setIsBookSuccess(false);
            router.push("/schedule");
          }, 1500);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <>
      <div className="min-h-screen">
        <Header />
        <div className="flex min-h-[90vh]">
          <SideTab
            booking
            user={petSitterData}
            isPetOwner={session?.user?.userType == UserType.PetOwner}
          />
          <div className="content-with-sidetab my-6 w-5/12 min-w-fit max-w-[96rem]">
            <div className="my-4 h-fit rounded-md border-[4px] border-blue-500 px-3 py-4">
              <div className="relative mb-2 flex justify-center">
                <h1 className="text-2xl font-bold">Booking</h1>
              </div>
              <h2 className="text-lg font-semibold sm:hidden">
                Pet Sitter: {username}
              </h2>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-1 flex flex-col gap-2"
              >
                <div>
                  <label htmlFor="startDate" className="mr-1">
                    Start Date:
                  </label>
                  <input
                    id="startDate"
                    className="rounded-md border-2"
                    type="datetime-local"
                    {...register("startDate", { required: true })}
                  />
                  {errors.startDate && (
                    <div className="w-full text-red-600">
                      Please enter Start Date
                    </div>
                  )}
                </div>
                <div>
                  <label htmlFor="endDate" className="mr-1">
                    End Date:
                  </label>
                  <input
                    id="endDate"
                    className="rounded-md border-2"
                    type="datetime-local"
                    {...register("endDate", { required: true })}
                  />
                  {errors.endDate && (
                    <div className="w-full text-red-600">
                      Please enter End Date
                    </div>
                  )}
                </div>
                <div className="flex">
                  <label htmlFor="petIdList" className="mr-1">
                    Pets:
                  </label>
                  <span className="block">
                    {selectedPetList.length != 0 &&
                      selectedPetList.map((pet, index) => {
                        const { petId, name, petType, selected } = pet;
                        return (
                          <div
                            key={index}
                            className="mb-1 flex w-fit items-center rounded-md border-2 px-2"
                            onClick={() => {
                              toggleCheckbox(petId);
                              clearErrors("selectedPet");
                            }}
                          >
                            <input
                              id={petId}
                              className=""
                              type="checkbox"
                              checked={selected}
                              readOnly
                            />
                            <p className="ml-2">
                              {name} ({petType})
                            </p>
                          </div>
                        );
                      })}
                  </span>
                </div>
                {/* Display Error to choose at least one pet */}
                {errors.selectedPet && (
                  <div className="w-full text-red-600">
                    Please select at least 1 pet
                  </div>
                )}
                <div>
                  <label htmlFor="totalPrice" className="mr-1">
                    Total Price:
                  </label>
                  <input
                    id="totalPrice"
                    type="number"
                    className="w-40 rounded-md border-2 px-1 text-right"
                    {...register("totalPrice", {
                      required: true,
                      valueAsNumber: true,
                    })}
                  />
                  {errors.totalPrice && (
                    <div className="w-full text-red-600">
                      {errors.totalPrice?.message ==
                      "Expected number, received nan"
                        ? "Please enter Total Price"
                        : errors.totalPrice?.message}
                    </div>
                  )}
                </div>
                <label htmlFor="note" className="">
                  Note:
                </label>
                <textarea
                  id="note"
                  className="mb-2 max-h-[10rem] min-h-[2rem] w-full border-2 p-1"
                  placeholder="Note to the pet sitter"
                  {...register("note")}
                />
                <div className="flex w-full justify-between">
                  <button
                    className="rounded-full bg-red-800 px-2 py-1 font-semibold text-white hover:bg-red-600"
                    onClick={() => {
                      reset();
                    }}
                    type="reset"
                  >
                    Cancel Request
                  </button>
                  <button
                    className="rounded-full bg-sky-800 px-2 py-1 font-semibold text-white hover:bg-sky-600"
                    type="submit"
                  >
                    Send Request
                  </button>
                </div>
              </form>
            </div>
            <div className="mb-4 rounded-md border-[4px] border-teal-500 px-4 py-2">
              <h2 className="mb-2 text-lg font-semibold">Manage My Pet</h2>
              {selectedPetList.length != 0 &&
                selectedPetList.map((pet, index) => {
                  const { name, petType } = pet;
                  return (
                    <div
                      key={index}
                      className="mb-2 flex w-fit items-center rounded-md border-2 px-1"
                    >
                      <p className="mx-2">
                        {name} ({petType})
                      </p>
                      <AddPet edit refetch={refetchMyPetList} pet={pet} />
                    </div>
                  );
                })}
              <AddPet refetch={refetchMyPetList} />
            </div>
          </div>
        </div>
      </div>

      <ResponsePopup
        show={isBookSuccess}
        setShow={setIsBookSuccess}
        doBeforeClose={() => {
          router.push("/schedule");
        }}
        panelCSS={"bg-green-400 text-green-700"}
      >
        <div className="font-bold">Book Successful!</div>
      </ResponsePopup>
    </>
  );
};
export default booking;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getServerAuthSession(ctx);

  if (
    session?.user?.userType == UserType.FreelancePetSitter ||
    session?.user?.userType == UserType.PetHotel
  ) {
    const { username } = ctx.query;
    return {
      redirect: {
        destination: `/user/${username}/profile`,
        permanent: false,
      },
    };
  }

  // Default return
  return { props: {} };
}
