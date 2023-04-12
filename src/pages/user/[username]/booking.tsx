import { useEffect, useState } from "react";
import type { NextPage } from "next";
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

const formDataSchema = z.object({
  petSitterId: z.string().cuid(),
  totalPrice: z.number().gt(0),
  startDate: z.date(),
  endDate: z.date(),
  petIdList: z.array(z.string().cuid()),
  note: z.string().nullable().default(null),
  selectedPet: z.any(),
});

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
    if (myPetList != undefined && myPetList.length != selectedPetList.length) {
      setSelectedPetList(
        myPetList.map((pet: Pet) => ({
          id: pet.petId,
          name: pet.name,
          type: pet.petType,
          selected: false,
        }))
      );
    }
  }, [myPetList]);

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
    setError,
    clearErrors,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    if (petSitterData) {
      const petIdList = selectedPetList.reduce(function (result, pet) {
        if (pet.selected) {
          result.push(pet.id);
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
        await requestBooking.mutateAsync({
          petSitterId: petSitterData?.userId,
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate),
          petIdList: petIdList,
          totalPrice: data.totalPrice,
          note: data.note,
        });
        setIsBookSuccess(true);
        setTimeout(function () {
          setIsBookSuccess(false);
          router.push("/schedule");
        }, 1500);
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
          <div className="content-with-sidetab my-10 h-fit w-5/12 min-w-fit max-w-[96rem] rounded-md border-[4px] border-blue-500 px-3 py-4">
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
                <label htmlFor="startDate" className="mr-1">
                  Start Date:
                </label>
                <input
                  id="startDate"
                  className="rounded-md border-2"
                  type="datetime-local"
                  {...register("startDate", { required: true })}
                />
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
              </div>
              <div className="flex">
                <label htmlFor="petIdList" className="mr-1">
                  Pets:
                </label>
                <span className="block">
                  {selectedPetList.length != 0 &&
                    selectedPetList.map((pet, index) => {
                      const { id, name, type, selected } = pet;
                      return (
                        <div
                          key={index}
                          className="mb-1 flex w-fit items-center rounded-md border-2 px-1"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleCheckbox(id);
                            clearErrors("selectedPet");
                          }}
                        >
                          <input
                            id={id}
                            className=""
                            type="checkbox"
                            checked={selected}
                            readOnly
                          />
                          <p className="mx-2">
                            {name} ({type})
                          </p>
                          {/* TODO: Edit pet */}
                          <AddPet edit refetch={refetchMyPetList} />
                        </div>
                      );
                    })}
                  <AddPet refetch={refetchMyPetList} />
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
                  step="0.01"
                  min={0}
                  {...register("totalPrice", {
                    required: true,
                    valueAsNumber: true,
                  })}
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
