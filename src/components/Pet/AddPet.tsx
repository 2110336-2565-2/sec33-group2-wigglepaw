import { Dialog, Transition } from "@headlessui/react";
import { useSession } from "next-auth/react";
import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "../../utils/api";
import ResponsePopup from "../ResponsePopup";

const AddPet = (props: any) => {
  const [addingPet, setAddingPet] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);

  const { data: session } = useSession();

  const addPet = api.pet.create.useMutation();

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

    try {
      //   await addPet.mutateAsync({
      //     pet: { name: data.name },
      //     petOwnerId: user.userId,
      //   });
    } catch (e) {
      alert(e);
      return;
    }
    setAddingPet(false);
    reset();
    setAddSuccess(true);
    setTimeout(function () {
      setAddSuccess(false);
    }, 1500);
  };

  return (
    <>
      <button
        onClick={() => setAddingPet(true)}
        className="flex w-fit items-center rounded-md border-2 px-1"
      >
        + Add Pet
      </button>
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
                <Dialog.Panel className="mx-auto box-border w-[90vw] max-w-[50rem] rounded bg-white p-4">
                  <Dialog.Title className="mb-2 text-xl font-bold">
                    Add Pet
                  </Dialog.Title>
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col"
                  >
                    <input
                      className="mb-2 rounded border-2 p-1 text-lg font-bold placeholder-gray-400"
                      placeholder="Title"
                      //   {...register("name")}
                    />

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
                        Post
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
        panelCSS={"bg-green-400 text-green-700"}
      >
        <div className="font-bold">Add Pet Successful!</div>
      </ResponsePopup>
    </>
  );
};

export default AddPet;
