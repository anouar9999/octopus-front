import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useState, memo } from "react";
import Icon from "@/components/ui/Icon";

const Modal = memo(({
  activeModal,
  onClose,
  noFade = false,
  disableBackdrop = false,
  children,
  footerContent,
  submitButton,
  themeClass = "bg-slate-900 dark:bg-slate-800 dark:border-b dark:border-slate-700z",
  title = "Basic Modal",
  uncontrol = false,
  label = "Basic Modal",
  labelClass = "",
}) => {
  const [showModal, setShowModal] = useState(false);

  const closeModal = () => setShowModal(false);
  const openModal = () => setShowModal(true);
  const handleClose = uncontrol ? closeModal : onClose;

  const modalContent = (
    <Transition appear show={uncontrol ? showModal : activeModal} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-[99999]"
        onClose={disableBackdrop ? () => {} : handleClose}
      >
        <Transition.Child
          as={Fragment}
          enter={noFade ? "" : "ease-out duration-300"}
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave={noFade ? "" : "ease-in duration-200"}
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
          <Transition.Child
            as={Fragment}
            enter={noFade ? "" : "transform transition ease-in-out duration-500 sm:duration-700"}
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave={noFade ? "" : "transform transition ease-in-out duration-500 sm:duration-700"}
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="w-screen max-w-md">
              <div className="flex h-full flex-col bg-white shadow-xl">
                <div className={`px-4 py-4 sm:px-4 ${themeClass}`}>
                  <div className="flex items-start justify-between">
                    <Dialog.Title className="text-lg font-medium text-white">
                      {title}
                    </Dialog.Title>
                    <div className="ml-3 flex h-7 items-center">
                      <button
                        type="button"
                        className="rounded-md bg-white/10 text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white"
                        onClick={handleClose}
                      >
                        <span className="sr-only">Close panel</span>
                        <Icon icon="heroicons-outline:x" className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="relative flex-1 px-4 py-6 sm:px-6 overflow-y-auto">
                  {children}
                </div>
                {(footerContent || submitButton) && (
                  <div className="flex flex-shrink-0 flex-col border-t border-gray-200 px-4 py-4">
                    {footerContent && (
                      <div className="flex justify-end mb-4">
                        {footerContent}
                      </div>
                    )}
                    {submitButton && (
                      <div className="flex justify-end">
                        {submitButton}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );

  return uncontrol ? (
    <>
      <button
        type="button"
        onClick={openModal}
        className={labelClass}
      >
        {label}
      </button>
      {modalContent}
    </>
  ) : (
    modalContent
  );
});

Modal.displayName = "Modal";

export default Modal;