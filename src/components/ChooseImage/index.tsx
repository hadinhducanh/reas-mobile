import React, { useCallback, useMemo, useState } from "react";
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActionSheetIOS,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { useUploadItem } from "../../context/ItemContext";
import ImagePreviewModal from "../ImagePreviewModal";

interface ImagePickerProps {
  images?: string;
  setImages?: React.Dispatch<React.SetStateAction<string>>;
  receivedItemImage?: string | null;
  setReceivedItemImage?: React.Dispatch<React.SetStateAction<string>>;
  transferReceiptImage?: string | null;
  setTransferReceiptImage?: React.Dispatch<React.SetStateAction<string>>;
  isUploadEvidence?: boolean;
  isFeedback?: boolean;
  isProfile?: boolean;
  isCriticalReport?: boolean;
}

const MAX_IMAGES = 4;
const SEPARATOR = ", ";

const ChooseImage: React.FC<ImagePickerProps> = (props) => {
  const { setUploadItem } = useUploadItem();
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [imagesModalVisible, setImagesModalVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const {
    images = "",
    setImages = () => {},
    receivedItemImage = null,
    setReceivedItemImage = () => {},
    transferReceiptImage = null,
    setTransferReceiptImage = () => {},
    isUploadEvidence,
    isFeedback,
    isProfile,
    isCriticalReport,
  } = props;

  const parseImages = useCallback((imageStr: string | null): string[] => {
    return imageStr
      ? imageStr.split(SEPARATOR).filter((img) => img.trim() !== "")
      : [];
  }, []);
  const imagesArray = useMemo(() => parseImages(images), [images, parseImages]);

  const convertToBase64 = async (uri: string) => {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return `data:image/jpeg;base64,${base64}`;
    } catch (error) {
      console.error("Error converting to Base64:", error);
      return null;
    }
  };

  // ----- SINGLE-IMAGE PICK LOGIC -----
  const openCameraSingle = useCallback(
    async (setter: React.Dispatch<React.SetStateAction<string>>) => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Camera access is required.");
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: "images",
        allowsEditing: true,
        quality: 1,
      });
      if (!result.canceled) {
        const base64 = await convertToBase64(result.assets[0].uri);
        if (base64) setter(base64);
      }
    },
    [convertToBase64]
  );

  const openImageLibrarySingle = useCallback(
    async (setter: React.Dispatch<React.SetStateAction<string>>) => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Gallery access is required.");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
      if (!result.canceled) {
        const base64 = await convertToBase64(result.assets[0].uri);
        if (base64) setter(base64);
      }
    },
    [convertToBase64]
  );

  const showPickerOptions = useCallback(
    (setter: React.Dispatch<React.SetStateAction<string>>) => {
      if (Platform.OS === "ios") {
        ActionSheetIOS.showActionSheetWithOptions(
          {
            options: ["Cancel", "Take Photo", "Choose from Library"],
            cancelButtonIndex: 0,
          },
          (buttonIndex) => {
            if (buttonIndex === 1) openCameraSingle(setter);
            else if (buttonIndex === 2) openImageLibrarySingle(setter);
          }
        );
      } else {
        Alert.alert("Select Option", "Choose an option", [
          { text: "Cancel", style: "cancel" },
          { text: "Take Photo", onPress: () => openCameraSingle(setter) },
          {
            text: "Choose from Library",
            onPress: () => openImageLibrarySingle(setter),
          },
        ]);
      }
    },
    [openCameraSingle, openImageLibrarySingle]
  );

  // ----- MULTI-IMAGE PICK LOGIC -----
  const handleImagePick = useCallback(
    async (result: ImagePicker.ImagePickerResult) => {
      if (!result.canceled) {
        const newBase64Images = await Promise.all(
          result.assets.map(async (asset) => await convertToBase64(asset.uri))
        );
        setImages((prev) => {
          const current = parseImages(prev);
          const updated = [...current, ...newBase64Images.filter(Boolean)];

          const newImagesStr = updated.join(SEPARATOR);
          setUploadItem((prevUpload) => ({
            ...prevUpload,
            imageUrl: newImagesStr,
          }));

          return newImagesStr;
        });
      }
    },
    [convertToBase64, parseImages, setImages]
  );

  const requestPermission = useCallback(
    async (
      permissionRequest: () => Promise<ImagePicker.PermissionResponse>,
      errorMessage: string
    ) => {
      const { status } = await permissionRequest();
      if (status !== "granted") {
        Alert.alert("Permission denied", errorMessage);
        return false;
      }
      return true;
    },
    []
  );

  const openCamera = useCallback(async () => {
    if (imagesArray.length >= MAX_IMAGES) {
      Alert.alert(
        "Limit reached",
        `You can only upload up to ${MAX_IMAGES} photos.`
      );
      return;
    }
    const hasPermission = await requestPermission(
      ImagePicker.requestCameraPermissionsAsync,
      "Camera access is required."
    );
    if (!hasPermission) return;
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: "images",
      quality: 1,
      allowsEditing: true,
    });
    await handleImagePick(result);
  }, [imagesArray, requestPermission, handleImagePick]);

  const openImageLibrary = useCallback(async () => {
    if (imagesArray.length >= MAX_IMAGES) {
      Alert.alert(
        "Limit reached",
        `You can only upload up to ${MAX_IMAGES} photos.`
      );
      return;
    }
    const hasPermission = await requestPermission(
      ImagePicker.requestMediaLibraryPermissionsAsync,
      "Gallery access is required."
    );
    if (!hasPermission) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
      selectionLimit: MAX_IMAGES - imagesArray.length,
    });
    await handleImagePick(result);
  }, [imagesArray, requestPermission, handleImagePick]);

  const showImagePickerOptions = useCallback(() => {
    if (imagesArray.length >= MAX_IMAGES) {
      Alert.alert(
        "Limit reached",
        `You can only upload up to ${MAX_IMAGES} photos.`
      );
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
      Alert.alert("Select Option", "Choose an option", [
        { text: "Cancel", style: "cancel" },
        { text: "Take Photo", onPress: openCamera },
        { text: "Choose from Library", onPress: openImageLibrary },
      ]);
    }
  }, [imagesArray, openCamera, openImageLibrary]);

  const deleteImage = useCallback(
    (index: number) => {
      setImages((prev) => {
        const current = parseImages(prev);
        current.splice(index, 1);
        const newImagesStr = current.join(SEPARATOR);

        setUploadItem((prevUpload) => ({
          ...prevUpload,
          imageUrl: newImagesStr,
        }));

        return newImagesStr;
      });
    },
    [parseImages, setImages]
  );

  const imageComponents = useMemo(
    () =>
      imagesArray.map((base64, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => {
            setSelectedIndex(index);
            setImagesModalVisible(true);
          }}
        >
          <View
            key={index}
            className="w-32 h-44 bg-transparent border-2 border-dashed border-gray-300 rounded-lg justify-center items-center mr-2"
          >
            <Image
              source={{ uri: base64 }}
              className="w-full h-full rounded-lg"
              resizeMode="contain"
            />
            <TouchableOpacity
              onPress={() => deleteImage(index)}
              className="absolute top-0 right-0 bg-red-500 rounded-full w-6 h-6 justify-center items-center"
            >
              <Icon name="close" size={14} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )),
    [imagesArray, deleteImage]
  );

  const chooseReceivedItemImage = () => {
    if (receivedItemImage?.length !== 0) {
      setSelectedImage(receivedItemImage);
      setImageModalVisible(true);
    } else {
      showPickerOptions(setReceivedItemImage);
    }
  };

  const chooseTransferReceiptImage = () => {
    if (transferReceiptImage?.length !== 0) {
      setSelectedImage(transferReceiptImage);
      setImageModalVisible(true);
    } else {
      showPickerOptions(setTransferReceiptImage);
    }
  };

  return (
    <>
      {isUploadEvidence ? (
        // SINGLE-IMAGE UI (2 ô)
        <View className="flex-row justify-center mt-2">
          <TouchableOpacity
            onPress={chooseReceivedItemImage}
            className="w-40 h-56 border-2 border-dashed border-gray-300 rounded-lg items-center justify-center m-2"
          >
            {receivedItemImage ? (
              <>
                <Image
                  source={{ uri: receivedItemImage }}
                  className="w-full h-full rounded-lg"
                  resizeMode="contain"
                />
                <TouchableOpacity
                  onPress={() => setReceivedItemImage("")}
                  className="absolute top-0 right-0 bg-red-500 rounded-full w-6 h-6 justify-center items-center"
                >
                  <Icon name="close" size={14} color="#ffffff" />
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Icon name="photo-camera" size={30} color="#00b0b9" />
                <Text className="text-gray-500 text-center text-xs mt-2 w-32">
                  {isFeedback
                    ? "(Optional)"
                    : isCriticalReport
                    ? "Please add your evidence"
                    : " Please add your received item picture"}
                </Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={chooseTransferReceiptImage}
            className="w-40 h-56 border-2 border-dashed border-gray-300 rounded-lg items-center justify-center m-2"
          >
            {transferReceiptImage ? (
              <>
                <Image
                  source={{ uri: transferReceiptImage }}
                  className="w-full h-full rounded-lg"
                  resizeMode="contain"
                />
                <TouchableOpacity
                  onPress={() => setTransferReceiptImage("")}
                  className="absolute top-0 right-0 bg-red-500 rounded-full w-6 h-6 justify-center items-center"
                >
                  <Icon name="close" size={14} color="#ffffff" />
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Icon name="photo-camera" size={30} color="#00b0b9" />
                <Text className="text-gray-500 text-center text-xs mt-2 w-32">
                  {isFeedback
                    ? "(Optional)"
                    : isCriticalReport
                    ? "Please add your evidence (optional)"
                    : "Please add your transfer receipt (optional)"}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      ) : isProfile ? (
        <>
          <TouchableOpacity
            onPress={() => showPickerOptions(setTransferReceiptImage)}
            className="bg-[#a9b4bd] w-[180px] h-[180px] flex items-center justify-center rounded-full mb-10 relative"
          >
            {transferReceiptImage ? (
              <>
                <View className="w-full h-full rounded-full overflow-hidden p-2">
                  <Image
                    source={{ uri: transferReceiptImage }}
                    className="w-full h-full rounded-full"
                  />
                </View>
                <View className="absolute w-full h-full rounded-full bg-gray-100/5">
                  <Icon
                    name="photo-camera"
                    size={40}
                    color="white"
                    style={{
                      top: "50%",
                      left: "50%",
                      transform: [{ translateX: -20 }, { translateY: -20 }],
                    }}
                  />
                </View>
              </>
            ) : (
              <>
                <View className="absolute w-full h-full rounded-full bg-gray-100/5">
                  <Icon
                    name="photo-camera"
                    size={40}
                    color="white"
                    style={{
                      top: "50%",
                      left: "50%",
                      transform: [{ translateX: -20 }, { translateY: -20 }],
                    }}
                  />
                </View>
              </>
            )}
          </TouchableOpacity>
        </>
      ) : (
        // MULTI-IMAGE UI
        <View className="flex-row mt-2">
          {imagesArray.length < MAX_IMAGES && (
            <TouchableOpacity
              onPress={showImagePickerOptions}
              className="w-32 h-44 bg-transparent border-2 border-dashed border-gray-300 rounded-lg justify-center items-center mr-2"
            >
              <Icon name="photo-camera" size={24} color="#00b0b9" />
              <Text
                className="text-center text-xs font-light text-gray-500 mt-2"
                style={{ width: 64 }}
              >
                Add up to {MAX_IMAGES} photos
              </Text>
            </TouchableOpacity>
          )}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {imageComponents}
          </ScrollView>
        </View>
      )}

      <ImagePreviewModal
        visible={imageModalVisible}
        onClose={() => setImageModalVisible(false)}
        imageUrl={selectedImage}
      />

      <ImagePreviewModal
        visible={imagesModalVisible}
        onClose={() => setImagesModalVisible(false)}
        initialIndex={selectedIndex}
        imageUrls={imagesArray}
      />
    </>
  );
};

export default ChooseImage;
