import React, { useState } from "react";
import { Alert, Image, Platform, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { ActionSheetIOS } from "react-native";

interface ImagePickerComponentProps {
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
}

const ImagePickerComponent: React.FC<ImagePickerComponentProps> = ({ images, setImages }) => {
  const convertToBase64 = async (uri: string) => {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
      return `data:image/jpeg;base64,${base64}`; // Prefix để đảm bảo hiển thị đúng format ảnh
    } catch (error) {
      console.error("Error converting to Base64:", error);
      return null;
    }
  };

  const handleImagePick = async (result: ImagePicker.ImagePickerResult) => {
    if (!result.canceled) {
      const newBase64Images = await Promise.all(result.assets.map(async (asset) => {
        const base64 = await convertToBase64(asset.uri);
        return base64;
      }));

      setImages((prevImages) => [...prevImages, ...newBase64Images.filter((image): image is string => image !== null)]);
    }
  };

  const openCamera = async () => {
    if (images.length >= 4) {
      Alert.alert("Limit reached", "You can only upload up to 4 photos.");
      return;
    }

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied", "Camera access is required.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
    });

    await handleImagePick(result);
  };

  const openImageLibrary = async () => {
    if (images.length >= 4) {
      Alert.alert("Limit reached", "You can only upload up to 4 photos.");
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied", "Gallery access is required.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
      selectionLimit: 4 - images.length,
    });

    await handleImagePick(result);
  };

  const showImagePickerOptions = () => {
    if (images.length >= 4) {
      Alert.alert("Limit reached", "You can only upload up to 4 photos.");
      return;
    }

    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancel", "Take Photo", "Choose from Library"],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) openCamera();
          else if (buttonIndex === 2) openImageLibrary();
        }
      );
    } else {
      Alert.alert(
        "Select Option",
        "Choose an option",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Take Photo", onPress: openCamera },
          { text: "Choose from Library", onPress: openImageLibrary },
        ]
      );
    }
  };

  const deleteImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  return (
    <View className="flex-row flex-wrap mt-2 ml-4">
      {images.length < 4 && (
        <TouchableOpacity
          onPress={showImagePickerOptions}
          className="w-20 h-32 bg-transparent border-2 border-dashed border-gray-300 rounded-lg justify-center items-center mr-2"
        >
          <Icon name="photo-camera" size={24} color="#00b0b9" />
          <Text className="text-center text-xs font-light text-gray-500 mt-2" style={{ width: 64 }}>
            Add up to 4 photos
          </Text>
        </TouchableOpacity>
      )}

      {images.map((base64, index) => (
        <View key={index} className="w-20 h-32 bg-transparent border-2 border-dashed border-gray-300 rounded-lg justify-center items-center mr-2">
          <Image source={{ uri: base64 }} className="w-full h-full rounded-lg" />
          <TouchableOpacity
            onPress={() => deleteImage(index)}
            className="absolute top-0 right-0 bg-red-500 rounded-full w-6 h-6 justify-center items-center"
          >
            <Icon name="close" size={14} color="#ffffff" />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

export default ImagePickerComponent;
