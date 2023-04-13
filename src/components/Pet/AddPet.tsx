import { Dialog, Listbox, Transition } from "@headlessui/react";
import { useSession } from "next-auth/react";
import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { petFields } from "../../schema/schema";
import { api } from "../../utils/api";
import ResponsePopup from "../ResponsePopup";
import { HiPencilAlt } from "react-icons/hi";

type FormData = z.infer<typeof petFields>;

const sex = [{ name: "Male" }, { name: "Female" }];

type AddPetProps = {
  refetch: () => void;
  edit?: boolean;
  pet?: any;
};

const AddPet = (props: AddPetProps) => {
  const [addingPet, setAddingPet] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);
  const [selected, setSelected] = useState(
    props.edit ? { name: props.pet.sex } : sex[0]
  );

  const { data: session } = useSession();

  const addPet = api.pet.create.useMutation();
  const editPet = api.pet.update.useMutation();

  // Form ==================================================
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    const user = session?.user;
    if (!user) {
      alert("No user found");
      return;
    }

    if (props.edit) {
      try {
        await editPet.mutateAsync({
          petId: props.pet.petId,
          data: {
            petType: data.petType,
            name: data.name,
            sex: selected?.name,
            breed: data.breed,
            weight: data.weight,
          },
        });
        setAddingPet(false);
        setAddSuccess(true);
        setTimeout(function () {
          reset();
          setAddSuccess(false);
          props.refetch();
        }, 1500);
      } catch (e) {
        alert(e);
        return;
      }
    } else {
      try {
        await addPet.mutateAsync({
          pet: {
            petType: data.petType,
            name: data.name,
            sex: selected?.name,
            breed: data.breed,
            weight: data.weight,
          },
          petOwnerId: user.userId,
        });
        setAddingPet(false);
        setAddSuccess(true);
        setTimeout(function () {
          reset();
          setAddSuccess(false);
          props.refetch();
        }, 1500);
      } catch (e) {
        alert(e);
        return;
      }
    }
  };

  return (
    <>
      {props.edit ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setAddingPet(true);
          }}
          className="h-full"
        >
          <HiPencilAlt />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => {
            setAddingPet(true);
          }}
          className="flex w-fit items-center rounded-md border-2 px-1"
        >
          + Add Pet
        </button>
      )}
      <Transition show={addingPet} as={Fragment}>
        <Dialog onClose={() => undefined}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            {/* The backdrop, rendered as a fixed sibling to the panel container */}
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            {/* Full-screen scrollable container */}
            <div className="fixed inset-0 overflow-y-auto">
              {/* Container to center the panel */}
              <div className="flex min-h-full items-center justify-center">
                <Dialog.Panel className="mx-auto w-[90vw] max-w-[30rem] rounded bg-white p-4">
                  <Dialog.Title className="mb-2 flex justify-between text-xl font-bold">
                    {props.edit ? (
                      <>
                        <div>
                          Edit Pet
                          <p className="text-xs text-gray-400">
                            Pet ID: {props.pet.petId}
                          </p>
                        </div>
                      </>
                    ) : (
                      <div>Add New Pet</div>
                    )}
                  </Dialog.Title>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mx-auto mb-2 grid w-min grid-cols-[5rem,minmax(10rem,15rem)] items-center gap-2">
                      <label htmlFor="petType">Pet Type*:</label>
                      <input
                        id="petType"
                        className="max-w-full rounded border-2 p-1 text-lg placeholder-gray-400"
                        placeholder="Cat/Dog"
                        {...register("petType", { required: true })}
                        defaultValue={props.edit ? props.pet.petType : null}
                      />
                      <label htmlFor="name">Name:</label>
                      <input
                        id="name"
                        className="rounded border-2 p-1 text-lg placeholder-gray-400"
                        {...register("name")}
                        defaultValue={props.edit ? props.pet.name : null}
                      />
                      <label htmlFor="sex">Sex:</label>
                      {/* <input
                        id="sex"
                        className="rounded border-2 p-1 text-lg placeholder-gray-400"
                        type=""
                        {...register("sex")}
                      /> */}
                      <Listbox value={selected} onChange={setSelected}>
                        <div className="relative mt-1">
                          <Listbox.Button className="relative w-full rounded border-2 p-1 text-lg placeholder-gray-400">
                            <span className="block truncate">
                              {selected?.name}
                            </span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"></span>
                          </Listbox.Button>
                          <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                              {sex.map((person, personIdx) => (
                                <Listbox.Option
                                  key={personIdx}
                                  className={({ active }) =>
                                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                      active
                                        ? "bg-amber-100 text-amber-900"
                                        : "text-gray-900"
                                    }`
                                  }
                                  value={person}
                                >
                                  {({ selected }) => (
                                    <>
                                      <span
                                        className={`block truncate ${
                                          selected
                                            ? "font-medium"
                                            : "font-normal"
                                        }`}
                                      >
                                        {person.name}
                                      </span>
                                      {selected ? (
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600"></span>
                                      ) : null}
                                    </>
                                  )}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </Listbox>
                      <label htmlFor="Breed">Breed:</label>
                      <input
                        className="rounded border-2 p-1 text-lg placeholder-gray-400"
                        {...register("breed")}
                        defaultValue={props.edit ? props.pet.breed : null}
                      />
                      <label htmlFor="weight">Weight:</label>
                      <input
                        id="weight"
                        type="number"
                        min={0}
                        className="rounded border-2 p-1 text-lg placeholder-gray-400"
                        placeholder="(kg)"
                        {...register("weight", { valueAsNumber: true })}
                        defaultValue={props.edit ? props.pet.weight : null}
                      />
                    </div>

                    <div className="flex w-full justify-between">
                      <button
                        className="rounded-full bg-red-800 px-2 py-1 font-semibold text-white hover:bg-red-600"
                        onClick={() => {
                          setAddingPet(false);
                          reset();
                        }}
                        type="reset"
                      >
                        Cancel
                      </button>
                      <button
                        className="rounded-full bg-sky-800 px-2 py-1 font-semibold text-white hover:bg-sky-600"
                        type="submit"
                      >
                        {props.edit ? "Edit" : "Add"}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </div>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>

      {/* Upload Success Dialog */}
      <ResponsePopup
        show={addSuccess}
        setShow={setAddSuccess}
        doBeforeClose={() => {
          props.refetch();
        }}
        clickToClose
        panelCSS={"bg-green-400 text-green-700"}
      >
        <div className="font-bold">
          {props.edit ? "Edit Pet Successful!" : "Add Pet Successful!"}
        </div>
      </ResponsePopup>
    </>
  );
};

export default AddPet;
