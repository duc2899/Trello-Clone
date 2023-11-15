import { Inter } from "next/font/google";
import "./globals.css";
import { Metadata } from "next";
import Modal from "@/components/Modal";
import TaskDetail from "@/components/TaskDetail";
export const metadata: Metadata = {
  title: "Trello Clone",
  icons:
    "https://w7.pngwing.com/pngs/115/721/png-transparent-trello-social-icons-icon.png",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#F5F6F8] scrollbar-thumb-gray-600 scrollbar-track-gray-300 scrollbar-thin">
        {children}
        <Modal />
        <TaskDetail />
      </body>
    </html>
  );
}
