"use client";
import { getUrl } from "@/lib/getURL";
import { useModalTaskDetail } from "@/store/ModalTaskDetail";
import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import TaskTypeRadioGroup from "./TaskTypeRadioGroup";
import { Fragment, useEffect, useState } from "react";
import {
  Bars3BottomRightIcon,
  PencilIcon,
  PhotoIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { useRef } from "react";
import { useBoardStore } from "@/store/BoardStore";
import TaskPriorityGroup from "./TaskPriorityGroup";
interface ImageFormat {
  bucketId: string;
  fileId: string;
}

function TaskDetail() {
  const imagePickerRef = useRef<HTMLInputElement>(null);
  const [isOpenDetail, closeModalDetail, todoDetail, indexTask, setIsOpeModal] =
    useModalTaskDetail((state) => [
      state.isOpenDetail,
      state.closeModalDetail,
      state.todoDetail,
      state.indexTask,
      state.setIsOpeModal,
    ]);

  const [
    imageTask,
    setImageTask,
    inputDescription,
    setInputDescription,
    setInputTask,
    inputTask,
    editTask,
    newTaskType,
    deleteTask,
    setPriorityTask,
    priorityTask,
  ] = useBoardStore((state) => [
    state.imageTask,
    state.setImageTask,
    state.inputDescription,
    state.setInputDescription,
    state.setInputTask,
    state.inputTask,
    state.editTask,
    state.newTaskType,
    state.deleteTask,
    state.setPriorityTask,
    state.priorityTask,
  ]);
  const [removeImage, setRemoveImage] = useState<ImageFormat[]>();
  const [image, setImage] = useState<string[]>([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isHideImage, setIsHideImage] = useState<boolean>(false);

  useEffect(() => {
    if (todoDetail?.image) {
      const fetchImage = async () => {
        todoDetail.image?.map(async (item) => {
          let imageValue = await getUrl(item);
          if (imageValue) {
            return setImage((oldImage) => [...oldImage, imageValue.toString()]);
          }
        });
      };
      fetchImage();
    }
  }, [todoDetail]);
  const handelCloseDetailTask = () => {
    closeModalDetail();
    setImage([]);
    setIsEdit(false);
    setInputDescription("");
    setInputTask("");
    setImageTask(null);
    setPriorityTask("1");
    setIsOpeModal(false);
  };
  const handelDescription = () => {
    const newArr = [];
    const array = todoDetail?.description.split("\n");
    for (let i = 0; i < array?.length!; i++) {
      newArr.push(array && array[i]);
      if (i % 2 === 0) {
        newArr.push("</br>");
      }
    }
    return newArr;
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

  const handelCheckButton = (): boolean => {
    const result =
      !imageTask &&
      todoDetail?.title === inputTask &&
      todoDetail?.description === inputDescription &&
      todoDetail?.status === newTaskType &&
      todoDetail?.priority === priorityTask;
    return result;
  };

  const handelCancelEdit = () => {
    setIsOpeModal(true);
    setIsEdit(false);
    setImageTask(null);
  };
  const handelSubmit = () => {
    if (handelCheckButton()) return;

    if (todoDetail && indexTask !== null) {
      editTask(
        todoDetail?.$id,
        priorityTask,
        indexTask,
        todoDetail,
        inputTask,
        inputDescription,
        todoDetail?.status,
        newTaskType,
        imageTask!,
        removeImage
      );
      handelCloseDetailTask();
    }
  };

  const handelDeleteTask = () => {
    if (indexTask !== null && todoDetail) {
      deleteTask(indexTask, todoDetail, todoDetail?.status);
      closeModalDetail();
    }
  };
  const handelOpenEdit = () => {
    setIsEdit(true);
    setIsOpeModal(false);
  };

  return (
    <Transition appear show={isOpenDetail} as={Fragment}>
      <Dialog
        as="form"
        onClose={handelCloseDetailTask}
        className={"relative z-10"}
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
          <div className="fixed inset-0 bg-black/30"></div>
        </Transition.Child>
        <div className="fixed inset-0 w-screen overflow-y-auto">
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
                  className={
                    "relative text-lg leading-6 font-bold text-gray-900 pb-2"
                  }
                >
                  Task Detail
                  <div className="absolute flex right-0 top-0 gap-1">
                    <PencilIcon
                      onClick={handelOpenEdit}
                      className="text-blue-600 h-5 w-5 cursor-pointer hover:text-blue-400"
                    ></PencilIcon>
                    <TrashIcon
                      onClick={handelDeleteTask}
                      className="text-red-600 h-5 w-5 cursor-pointer hover:text-red-400"
                    ></TrashIcon>
                  </div>
                </Dialog.Title>
                <div className="mt-2 flex align-middle gap-2">
                  <p
                    className={`flex items-center font-medium text-base ${
                      isEdit ? "self-center" : "self-start"
                    }`}
                  >
                    <Bars3BottomRightIcon className="w-5 h-5"></Bars3BottomRightIcon>
                    Task:
                  </p>
                  {isEdit ? (
                    <input
                      type="text"
                      value={inputTask}
                      onChange={(e) => setInputTask(e.target.value)}
                      placeholder="Enter a task"
                      className="p-2 rounded-md border border-spacing-1 outline-none focus:outline-none w-full"
                    />
                  ) : (
                    <h6 className="font-normal text-base self-center break-all">
                      {todoDetail?.title}
                    </h6>
                  )}
                </div>
                {image &&
                  (!isHideImage ? (
                    <div className="mt-2 relative">
                      {isEdit && (
                        <XMarkIcon
                          onClick={() => setIsHideImage(true)}
                          className="w-5 h-5 text-white bg-gray-500 rounded-full cursor-pointer font-bold absolute top-1 right-2 hover:bg-gray-400"
                        ></XMarkIcon>
                      )}
                      {image && (
                        <div className="h-full w-full rounded-full px-2 flex items-center justify-center">
                          {image.length === 1 ? (
                            <Image
                              src={image[0]}
                              alt="Image task detail"
                              width={200}
                              height={200}
                              className="w-full object-contain rounded-lg"
                            />
                          ) : (
                            image.map((item, index) => (
                              <Image
                                key={index}
                                src={item}
                                alt="Image task detail"
                                width={150}
                                height={150}
                                className="object-contain rounded-lg"
                              />
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full flex justify-center mt-3">
                      <button
                        type="button"
                        onClick={() => setIsHideImage(false)}
                        className="my-1 px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      >
                        Roll Back Image
                      </button>
                    </div>
                  ))}
                {todoDetail?.description && (
                  <div className="mt-2 flex flex-col align-middle">
                    <p className="flex items-center font-medium text-base">
                      <Bars3BottomRightIcon className="w-5 h-5"></Bars3BottomRightIcon>
                      Description:{" "}
                    </p>
                    {isEdit ? (
                      <textarea
                        onKeyUp={handleInput}
                        id="message"
                        rows={4}
                        className="outline-none mt-2 block p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:outline-none  dark:bg-white dark:border-gray-300 dark:placeholder-gray-400 dark:text-gray-900"
                        placeholder="Write description..."
                        value={inputDescription}
                        onChange={(e) => setInputDescription(e.target.value)}
                      ></textarea>
                    ) : (
                      handelDescription().map((item: any, index: number) => {
                        if (item === "</br>") {
                          return <p key={index} />;
                        } else {
                          return (
                            <p key={index} className="ml-2 break-all">
                              {item}
                            </p>
                          );
                        }
                      })
                    )}
                  </div>
                )}

                <TaskPriorityGroup></TaskPriorityGroup>
                <TaskTypeRadioGroup></TaskTypeRadioGroup>
                {isEdit && (
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
                        if (!e.target.files![0].type.startsWith("image/"))
                          return;
                        setImageTask(e.target.files![0]);
                      }}
                    ></input>
                  </div>
                )}
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
                {isEdit && (
                  <div className="mt-5 flex justify-center gap-6">
                    <button
                      onClick={handelCancelEdit}
                      type="button"
                      className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                    >
                      Cancel Edit
                    </button>
                    <button
                      onClick={handelSubmit}
                      type="button"
                      disabled={handelCheckButton()}
                      className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:hover:bg-gray-500"
                    >
                      Submit
                    </button>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default TaskDetail;
