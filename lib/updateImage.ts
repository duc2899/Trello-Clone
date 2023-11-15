import { ID, storage } from "@/appWrite";

export const upLoadImage = async (file: File, id: string) => {
  if (!file) return;
  const fileUploaded = await storage.createFile(
    "6530ce54cc278fd26859",
    id,
    file
  );
  return fileUploaded;
};
