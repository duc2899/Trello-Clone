import { storage } from "@/appWrite";

export const getUrl = async (image: any) => {
  const convertImage = JSON.parse(image);
  return storage.getFileView(convertImage.bucketId, convertImage.fileId);
};
