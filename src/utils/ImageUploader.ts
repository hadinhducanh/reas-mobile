// src/utils/ImageUploader.ts

export class ImageUploader {
    static async uploadImage(file: File): Promise<string> {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'reas_user_avatar'); // Your preset
      formData.append('cloud_name', 'dkpg60ca0'); // Your Cloudinary cloud name
  
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/dkpg60ca0/image/upload',
        {
          method: 'POST',
          body: formData,
        }
      );
  
      if (!response.ok) {
        throw new Error('Image upload failed');
      }
      const data = await response.json();
      return data.secure_url;
    }
  }
  