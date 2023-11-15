"use client";
import { useState, Fragment, useRef, FormEvent } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useModalStore } from "@/store/ModalStore";
import { useBoardStore } from "@/store/BoardStore";
import TaskTypeRadioGroup from "./TaskTypeRadioGroup";
import Image from "next/image";
import { PhotoIcon } from "@heroicons/react/24/solid";
import TaskPriorityGroup from "./TaskPriorityGroup";
import { Bars3BottomRightIcon } from "@heroicons/react/24/solid";
function Modal() {
  const user =
    typeof window !== "undefined"
      ? JSON.parse(window.localStorage.getItem("trello")!)
      : undefined;

  const imagePickerRef = useRef<HTMLInputElement>(null);
  const [closeModal, isOpen] = useModalStore((state) => [
    state.closeModal,
    state.isOpen,
  ]);
  const [
    inputTask,
    setInputTask,
    imageTask,
    setImageTask,
    addTask,
    newTaskType,
    inputDescription,
    setInputDescription,
    priorityTask,
  ] = useBoardStore((state) => [
    state.inputTask,
    state.setInputTask,
    state.imageTask,
    state.setImageTask,
    state.addTask,
    state.newTaskType,
    state.inputDescription,
    state.setInputDescription,
    state.priorityTask,
  ]);

  const handelSubmit = (e: any) => {
    e.preventDefault();
    if (!inputTask) return;
    addTask(
      inputTask,
      priorityTask,
      user.userID,
      inputDescription,
      newTaskType,
      imageTask
    );
    setImageTask(null);
    closeModal();
  };
  const bullet = "\u2022";
  const bulletWithSpace = `${bullet} `;
  const enter = 13;

  const handleInput = (e: any) => {
    const { keyCode, target } = e;
    const { selectionStart, value } = target;

    if (keyCode === enter) {
      target.value = [...value]
        .map((c, i) => (i === selectionStart - 1 ? `\n${bulletWithSpace}` : c))
        .join("");

      target.selectionStart = selectionStart + bulletWithSpace.length;
      target.selectionEnd = selectionStart + bulletWithSpace.length;
    }

    if (value[0] !== bullet) {
      target.value = `${bulletWithSpace}${value}`;
    }
  };
  return (
    // Use the `Transition` component at the root level
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="form" onClose={closeModal} className={"relative z-10"}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30"></div>
        </Transition.Child>
        <div className="fixed inset-0 w-screen overflow-y-auto">
          {/* Container to center the panel */}
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-xl p-6 text-left align-middle shadow-md bg-white">
                <Dialog.Title
                  as={"h3"}
                  className={"text-lg leading-6 font-bold text-gray-900 pb-2"}
                >
                  Add a task
                </Dialog.Title>

                <div className="mt-2">
                  <div className="flex items-center justify-start font-semibold">
                    <Bars3BottomRightIcon className="w-5 h-5"></Bars3BottomRightIcon>
                    Title
                  </div>
                  <input
                    type="text"
                    placeholder="Enter a task here..."
                    className="w-full border border-gray-300 rounded-md outline-none p-5"
                    value={inputTask}
                    onChange={(e) => setInputTask(e.target.value)}
                  />
                  <div className="flex items-center justify-start font-semibold mt-2">
                    <Bars3BottomRightIcon className="w-5 h-5"></Bars3BottomRightIcon>
                    DesCription
                  </div>
                  <textarea
                    onKeyUp={handleInput}
                    id="message"
                    rows={4}
                    className="outline-none block p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:outline-none  dark:bg-white dark:border-gray-300 dark:placeholder-gray-400 dark:text-gray-900"
                    placeholder="Write description..."
                    value={inputDescription}
                    onChange={(e) => setInputDescription(e.target.value)}
                  ></textarea>
                </div>

                {/* Priority */}
                <TaskPriorityGroup />

                <TaskTypeRadioGroup />

                <div
                  onClick={() => imagePickerRef.current?.click()}
                  className="flex justify-center align-middle w-full border border-gray-300 rounded-md outline-none p-5 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible: ring-offset-2 cursor-pointer"
                >
                  <button
                    className="font-semibold"
                    onClick={(e) => e.preventDefault()}
                  >
                    <PhotoIcon className="w-6 h-6 inline-block mr-2" />
                    Upload Image
                  </button>

                  <input
                    type="file"
                    hidden
                    ref={imagePickerRef}
                    onChange={(e) => {
                      if (!e.target.files![0].type.startsWith("image/")) return;
                      setImageTask(e.target.files![0]);
                    }}
                  />
                </div>

                {imageTask && (
                  <Image
                    src={URL.createObjectURL(imageTask)}
                    alt="Upload image task"
                    width={200}
                    height={200}
                    className="w-full h-44 object-cover mt-2 filter hover:grayscale transition-all duration-150 cursor-not-allowed"
                    onClick={() => setImageTask(null)}
                  />
                )}

                <div className="w-full flex justify-center align-middle mt-4">
                  <button
                    onClick={handelSubmit}
                    type="submit"
                    className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-md disabled:cursor-not-allowed disabled:bg-gray-300 transition-all"
                    disabled={!inputTask}
                  >
                    Add task
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
export default Modal;
