import { useCallback } from "react";
import { Alert, Platform, ActionSheetIOS } from "react-native";
import * as ImagePicker from "expo-image-picker";

export interface PickedImageFile {
  uri: string;
  type: string;
  name: string;
}

export const useExpoImagePicker = () => {
  // Function to launch the camera and return a file-like object
  const openCameraSingle = useCallback(async (): Promise<PickedImageFile | null> => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied", "Camera access is required.");
      return null;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      const asset = result.assets[0];
      return {
        uri: asset.uri,
        type: asset.type ? `image/${asset.type}` : "image/jpeg",
        name: asset.fileName || `photo_${Date.now()}.jpg`,
      };
    }
    return null;
  }, []);

  // Function to launch the image library and return a file-like object
  const openImageLibrarySingle = useCallback(async (): Promise<PickedImageFile | null> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied", "Gallery access is required.");
      return null;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      const asset = result.assets[0];
      return {
        uri: asset.uri,
        type: asset.type ? `image/${asset.type}` : "image/jpeg",
        name: asset.fileName || `photo_${Date.now()}.jpg`,
      };
    }
    return null;
  }, []);

  // Function to show picker options and return the selected file object
  const showPickerOptions = useCallback(async (): Promise<PickedImageFile | null> => {
    if (Platform.OS === "ios") {
      return new Promise((resolve) => {
        ActionSheetIOS.showActionSheetWithOptions(
          {
            options: ["Cancel", "Take Photo", "Choose from Library"],
            cancelButtonIndex: 0,
          },
          async (buttonIndex) => {
            if (buttonIndex === 1) {
              const image = await openCameraSingle();
              resolve(image);
            } else if (buttonIndex === 2) {
              const image = await openImageLibrarySingle();
              resolve(image);
            } else {
              resolve(null);
            }
          }
        );
      });
    } else {
      return new Promise((resolve) => {
        Alert.alert("Select Option", "Choose an option", [
          { text: "Cancel", style: "cancel", onPress: () => resolve(null) },
          {
            text: "Take Photo",
            onPress: async () => {
              const image = await openCameraSingle();
              resolve(image);
            },
          },
          {
            text: "Choose from Library",
            onPress: async () => {
              const image = await openImageLibrarySingle();
              resolve(image);
            },
          },
        ]);
      });
    }
  }, [openCameraSingle, openImageLibrarySingle]);

  return { showPickerOptions };
};
