"use client";
import Board from "@/components/Board";
import Header from "@/components/Header";
import { useBoardStore } from "@/store/BoardStore";
import { redirect } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const user =
    typeof window !== "undefined"
      ? JSON.parse(window.localStorage.getItem("trello")!)
      : undefined;
  const [statusCrateTask] = useBoardStore((state) => [state.statusCrateTask]);
  const notify = (message: string, type: string) => {
    if (type === "error") {
      return toast.error(message);
    } else if (type === "success") {
      return toast.success(message);
    }
  };
  switch (statusCrateTask.status) {
    case "success": {
      notify(statusCrateTask.message, "success");
      break;
    }
    case "error": {
      notify(statusCrateTask.message, "error");
      break;
    }
  }
  if (user) {
    return (
      <main className="md:px-5">
        <Header></Header>
        <Board></Board>
        <ToastContainer />
      </main>
    );
  } else {
    redirect("/login");
  }
}
