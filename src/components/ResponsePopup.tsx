import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useMemo, ReactNode } from "react";
import { useForm } from "react-hook-form";
import { boolean, z } from "zod";
import { Gallery, type Image } from "react-grid-gallery";
import { useAsync } from "react-async-hook";
import { useSession } from "next-auth/react";

type ResponsePopupProps = {
  show: boolean;
  setShow: Function;
  children?: ReactNode;
  doBeforeClose?: Function;
  clickToClose?: boolean;
  panelCSS?: string;
};

const ResponsePopup = (props: ResponsePopupProps) => {
  return (
    <Transition show={props.show} as={Fragment}>
      <Dialog
        onClose={() => {
          if (props.doBeforeClose != null) {
            props.doBeforeClose();
          }
          props.setShow(false);
        }}
      >
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
              <Dialog.Panel
                className={
                  "mx-auto box-border w-fit cursor-default rounded p-6 text-lg " +
                  props.panelCSS
                }
                onClick={() => {
                  if (props.clickToClose) {
                    props.setShow(false);
                  }
                }}
              >
                {props.children}
              </Dialog.Panel>
            </div>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

export default ResponsePopup;
