import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { api } from "../../../utils/api";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Header from "../../../components/Header";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import SideTab from "../../../components/SideTab";
import { UserType } from "../../../types/user";
import ResponsePopup from "../../../components/ResponsePopup";
import { Pet } from "@prisma/client";
import AddPet from "../../../components/Pet/AddPet";

import { HiPencilAlt } from "react-icons/hi";

const formDataSchema = z.object({
  datetimefrom: z.date(),
  datetimeto: z.date(),
  petIdList: z.array(z.string()), //TODO: Use state
  totalPrice: z.number().gt(0),
  note: z.string().optional(),
});

type FormData = z.infer<typeof formDataSchema>;

const booking: NextPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { username } = router.query;

  const [isBookSuccess, setIsBookSuccess] = useState(false);

  const requestBooking = api.booking.request.useMutation();
  const myPetList = api.pet.getMyPetList.useQuery().data;

  const [selectedPetList, setSelectedPetList] = useState(new Array());

  useEffect(() => {
    // Update the document title using the browser API
    if (myPetList != undefined) {
      setSelectedPetList([
        myPetList.map(
          function (pet: Pet) {
            return { id: pet.petId, name: pet.name, selected: false };
          }.bind(this)
        ),
      ]);
      console.log(selectedPetList);
    }
  }, myPetList);

  const toggleCheckbox = (id: string) => {
    setSelectedPetList(
      selectedPetList.map((pet) =>
        pet.id === id ? { ...pet, selected: !pet.selected } : pet
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
  } = useForm<FormData>();
  const onSubmit = async (data: FormData) => {
    if (petSitterData) {
      await requestBooking.mutateAsync({
        petSitterId: petSitterData?.userId,
        startDate: new Date(data.datetimefrom),
        endDate: new Date(data.datetimeto),
        petIdList: [], //TODO: Add Pets
        totalPrice: data.totalPrice,
        note: data.note,
      });
      setIsBookSuccess(true);
      setTimeout(function () {
        setIsBookSuccess(false);
        router.push("/schedule");
      }, 1500);
    }
  };

  return (
    <>
      <div className="min-h-screen">
        <Header />
        <div className="flex min-h-[90vh]">
          <SideTab
            user={petSitterData}
            isPetOwner={session?.user?.userType == UserType.PetOwner}
          />
          <div className="mx-auto mt-10 h-fit w-5/12 min-w-fit max-w-[96rem] rounded-md border-[4px] border-blue-500 px-3 py-4">
            <div className="relative mb-2 flex justify-center">
              <h1 className="text-2xl font-bold">Booking</h1>
            </div>
            <h2 className="text-lg font-semibold sm:hidden">
              Pet Sitter: {username}
            </h2>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-1 flex flex-col gap-1"
            >
              <div>
                <label htmlFor="datetimefrom" className="mr-1">
                  Start Date:
                </label>
                <input
                  id="datetimefrom"
                  className="rounded-md border-2"
                  type="datetime-local"
                  {...register("datetimefrom", { required: true })}
                />
              </div>
              <div>
                <label htmlFor="datetimeto" className="mr-1">
                  End Date:
                </label>
                <input
                  id="datetimeto"
                  className="rounded-md border-2"
                  type="datetime-local"
                  {...register("datetimeto", { required: true })}
                />
              </div>
              <div className="flex">
                <label htmlFor="petIdList" className="mr-1">
                  Pets:
                </label>
                <span className="block">
                  {myPetList != undefined &&
                    myPetList.map((pet: Pet, index) => (
                      <div
                        key={index}
                        className="mb-1 flex w-fit items-center rounded-md border-2 px-1"
                        // onClick={()=>()}
                      >
                        <input id={pet.petId} className="" type="checkbox" />
                        <p className="mx-2">{pet.name}</p>

                        <HiPencilAlt />
                      </div>
                    ))}

                  <AddPet />
                </span>
              </div>
              <div>
                <label htmlFor="totalPrice" className="mr-1">
                  Total Price:
                </label>
                <input
                  id="totalPrice"
                  type="number"
                  className="w-40 rounded-md border-2 px-1 text-right"
                  step="0.01"
                  min={0}
                  {...register("totalPrice", { required: true })}
                />
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
