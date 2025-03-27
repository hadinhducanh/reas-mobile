import { useCallback } from "react";
import { PickedImageFile } from "../hook/useExpoImagePicker";

export const uploadImageToCloudinary = async (
  file: PickedImageFile
): Promise<string> => {
  const cloudinaryFormData = new FormData();
  cloudinaryFormData.append("file", {
    uri: file.uri,
    type: file.type,
    name: file.name,
  } as any);
  cloudinaryFormData.append("upload_preset", "reas_user_avatar");
  cloudinaryFormData.append("cloud_name", "dkpg60ca0");

  const response = await fetch(
    "https://api.cloudinary.com/v1_1/dkpg60ca0/image/upload",
    {
      method: "POST",
      body: cloudinaryFormData,
    }
  );
  if (!response.ok) throw new Error("Image upload failed");
  const data = await response.json();
  return data.secure_url;
};

export const uploadToCloudinary = async (
  uri: string,
  creatorName: string | undefined
): Promise<string | null> => {
  try {
    const data = new FormData();
    const timestamp = new Date().getTime();
    data.append("file", {
      uri,
      type: "image/jpeg",
      name: `${creatorName}-${timestamp}.jpg`,
    } as any);
    data.append("upload_preset", "reas_image_upload");
    data.append("cloud_name", "dpysbryyk");
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/dpysbryyk/image/upload`,
      { method: "POST", body: data }
    );
    const json = await response.json();
    return json.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    return null;
  }
};
