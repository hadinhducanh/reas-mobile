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