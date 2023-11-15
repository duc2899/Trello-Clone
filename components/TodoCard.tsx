"use client";

import { getUrl } from "@/lib/getURL";
import { useBoardStore } from "@/store/BoardStore";
import { useModalTaskDetail } from "@/store/ModalTaskDetail";
import { ChatBubbleLeftIcon } from "@heroicons/react/20/solid";
import { ClockIcon, TrashIcon, XCircleIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import React from "react";
import {
  DraggableProvidedDragHandleProps,
  DraggableProvidedDraggableProps,
} from "react-beautiful-dnd";
type Props = {
  todo: Todo;
  index: number;
  id: TypeColumn;
  innerRef: (element: HTMLElement | null) => void;
  draggableProps: DraggableProvidedDraggableProps | null | undefined;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
};
function TodoCard({
  todo,
  index,
  id,
  innerRef,
  draggableProps,
  dragHandleProps,
}: Props) {
  const typePriority = ["High", "Medium", "Low"];

  const [setNewTaskType, setInputDescription, setInputTask, setPriorityTask] =
    useBoardStore((state) => [
      state.setNewTaskType,
      state.setInputDescription,
      state.setInputTask,
      state.setPriorityTask,
    ]);
  const [openModalDetail, setTodoDetail, setIsOpeModal] = useModalTaskDetail(
    (state) => [state.openModalDetail, state.setTodoDetail, state.setIsOpeModal]
  );
  const [image, setImage] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (todo.image) {
      const fetchImage = async () => {
        todo.image?.map(async (item) => {
          let imageValue = await getUrl(item);
          if (imageValue) {
            return setImage((oldImage) => [...oldImage, imageValue.toString()]);
          }
        });
      };
      fetchImage();
    }
  }, [todo]);

  const convertTime = (time: string) => {
    var pad = function (i: number) {
      return i < 10 ? "0" + i : i;
    };

    var d = new Date(time);
    const Y = d.getFullYear();
    const m = d.getMonth() + 1;
    const D = d.getDate();
    const H = d.getHours();
    const M = d.getMinutes();
    const S = d.getSeconds();
    const result =
      Y +
      "-" +
      pad(m) +
      "-" +
      pad(D) +
      "T" +
      pad(H) +
      ":" +
      pad(M) +
      ":" +
      pad(S);
    return result;
  };
  const convertTypePriority = (index: number): string => {
    return typePriority[index];
  };
  const handelOpenDetailTask = () => {
    openModalDetail();
    setIsOpeModal(true);
    setTodoDetail(todo, index);
    setNewTaskType(todo.status);
    setInputDescription(todo.description);
    setInputTask(todo.title);
    setPriorityTask(todo.priority);
  };

  return (
    <div
      {...draggableProps}
      {...dragHandleProps}
      ref={innerRef}
      onClick={handelOpenDetailTask}
      className="bg-white px-6 space-y-2 rounded-md drop-shadow-md hover:bg-slate-200 cursor-pointer"
    >
      <div className="flex justify-between p-5 items-center">
        <p className="font-bold break-all">{todo.title}</p>
      </div>
      {image && (
        <div className="h-full w-full pl-20 flex items-center justify-center overflow-x-auto gap-3 scrollbar-thumb-gray-600 scrollbar-track-gray-300 scrollbar-thin">
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
      <div className="flex justify-between p-2 px-5 items-center">
        {todo.priority && (
          <div className="flex justify-center items-center font-semibold gap-1">
            <div
              className={`w-4 h-4 rounded-full
             ${todo.priority === "1" && "bg-red-500"}
             ${todo.priority === "2" && "bg-yellow-500"}
             ${todo.priority === "3" && "bg-green-500"}
            `}
            ></div>
            {convertTypePriority(parseInt(todo.priority) - 1)}
          </div>
        )}
        {todo.description && (
          <div className="flex gap-2 font-semibold align-middle">
            <ChatBubbleLeftIcon className="w-6 h-6 text-gray-400" />
          </div>
        )}
        <div className="flex gap-2 align-middle">
          <ClockIcon className="w-6 h-6 text-gray-400" />
          <p className="font-semibold text-xs self-center">
            {convertTime(todo?.$createdAt!)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default TodoCard;
