import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import { RootStackParamList } from "../../../navigation/AppNavigator";
import Header from "../../../components/Header";
import {
  ActionSheetIOS,
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import LoadingButton from "../../../components/LoadingButton";

type ItemType = {
  id: number;
  name: string;
  price: string;
  image: string;
  location: string;
  description: string;
  isFavorited: boolean;
};

const DifferentItem: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // Dữ liệu nhập của người dùng
  const [price, setPrice] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  // Danh sách ảnh
  const [images, setImages] = useState<string[]>([]);

  // Đọc condition (tình trạng) từ AsyncStorage
  const [selectedCondition, setSelectedCondition] = useState<string | null>(
    null
  );

  const handleDone = () => {};

  useFocusEffect(
    useCallback(() => {
      const getCondition = async () => {
        try {
          const condition = await AsyncStorage.getItem("selectedCondition");
          if (condition) {
            setSelectedCondition(condition);
          }
        } catch (error) {
          console.error("Failed to retrieve condition:", error);
        }
      };
      getCondition();
    }, [])
  );

  // Hàm mở camera để chụp ảnh
  const openCamera = async () => {
    if (images.length >= 4) {
      Alert.alert("Limit reached", "You can only upload up to 4 photos.");
      return;
    }
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission denied",
        "Sorry, we need camera permissions to make this work!"
      );
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
    });
    if (!result.canceled) {
      const newImage = result.assets[0].uri;
      setImages((prevImages) => [...prevImages, newImage]);
    }
  };

  // Hàm mở thư viện ảnh
  const openImageLibrary = async () => {
    if (images.length >= 4) {
      Alert.alert("Limit reached", "You can only upload up to 4 photos.");
      return;
    }
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission denied",
        "Sorry, we need camera roll permissions to make this work!"
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
      selectionLimit: 4 - images.length,
    });
    if (!result.canceled) {
      const selectedImages = result.assets.map((asset) => asset.uri);
      setImages((prevImages) => [...prevImages, ...selectedImages]);
    }
  };

  // Hàm hiển thị menu chọn chụp ảnh / chọn ảnh
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
          if (buttonIndex === 1) {
            openCamera();
          } else if (buttonIndex === 2) {
            openImageLibrary();
          }
        }
      );
    } else {
      Alert.alert("Select Option", "Choose an option", [
        { text: "Cancel", style: "cancel" },
        { text: "Take Photo", onPress: openCamera },
        { text: "Choose from Library", onPress: openImageLibrary },
      ]);
    }
  };

  // Xóa ảnh khỏi danh sách
  const deleteImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F6F9F9]">
      <Header title="Add different item" showOption={false} />

      <ScrollView className="mx-5" showsVerticalScrollIndicator={false}>
        <Text className="text-lg font-bold mt-4 mb-3 text-gray-500">
          Their desired item description:
        </Text>

        {/* Thông tin item desired */}
        <View className="border border-gray-300 rounded-md overflow-hidden">
          {/* Row 1 */}
          <View className="flex-row border-b border-gray-300">
            <View className="w-[40%] px-2 py-3 bg-gray-200">
              <Text className="text-base font-semibold text-gray-500">
                Type of item
              </Text>
            </View>
            <View className="px-2 py-3">
              <Text className="text-base">Rice cooker</Text>
            </View>
          </View>

          {/* Row 2 */}
          <View className="flex-row border-b border-gray-300">
            <View className="w-[40%] px-2 py-3 bg-gray-200">
              <Text className="text-base font-semibold text-gray-500">
                Brand
              </Text>
            </View>
            <View className="flex-1 px-2 py-3">
              <Text className="text-base">Others</Text>
            </View>
          </View>

          {/* Row 3 */}
          <View className="flex-row border-b border-gray-300">
            <View className="w-[40%] px-2 py-3 bg-gray-200">
              <Text className="text-base font-semibold text-gray-500">
                Condition
              </Text>
            </View>
            <View className="flex-1 px-2 py-3">
              <Text className="text-base">Like New</Text>
            </View>
          </View>

          {/* Row 4 */}
          <View className="flex-row border-b border-gray-300">
            <View className="w-[40%] px-2 py-3 bg-gray-200">
              <Text className="text-base font-semibold text-gray-500">
                Min price
              </Text>
            </View>
            <View className="flex-1 px-2 py-3">
              <Text className="text-base">100.000 VND</Text>
            </View>
          </View>

          {/* Row 5 */}
          <View className="flex-row">
            <View className="w-[40%] px-2 py-3 bg-gray-200">
              <Text className="text-base font-semibold text-gray-500">
                Max price
              </Text>
            </View>
            <View className="flex-1 px-2 py-3">
              <Text className="text-base">250.000 VND</Text>
            </View>
          </View>
        </View>

        <View className="border-gray-200 border-[1px] my-5" />

        {/* Khu vực chọn ảnh */}
        <View className="flex-row mt-2">
          {images.length < 4 && (
            <TouchableOpacity
              onPress={showImagePickerOptions}
              className="w-32 h-44 bg-transparent border-2 border-dashed border-gray-300 rounded-lg justify-center items-center mr-2"
            >
              <View className="flex justify-center items-center">
                <Icon name="photo-camera" size={24} color="#00b0b9" />
              </View>
              <Text
                className="text-center text-xs font-light text-gray-500 mt-2"
                numberOfLines={2}
                ellipsizeMode="tail"
                style={{ width: 64 }}
              >
                Add up to 4 photos
              </Text>
            </TouchableOpacity>
          )}

          {images.map((uri, index) => (
            <View
              key={index}
              className="w-20 h-32 bg-transparent border-2 border-dashed border-gray-300 rounded-lg justify-center items-center mr-2"
            >
              <Image source={{ uri }} className="w-full h-full rounded-lg" />
              <TouchableOpacity
                onPress={() => deleteImage(index)}
                className="absolute top-0 right-0 bg-red-500 rounded-full w-6 h-6 justify-center items-center"
              >
                <Icon name="close" size={14} color="#ffffff" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Chọn type of item */}
        <TouchableOpacity
          onPress={() => navigation.navigate("TypeOfItemScreen")}
          className="w-full bg-white rounded-lg mt-4 flex-row justify-between items-center px-5 py-3"
        >
          <View>
            <Text className="text-base text-black">Type of item</Text>
            <Text className="text-sm font-semibold text-black mt-1">
              {selectedCondition || "Select type"}
            </Text>
          </View>
          <Icon name="arrow-forward-ios" size={20} color="black" />
        </TouchableOpacity>

        {/* Chọn condition */}
        <TouchableOpacity
          onPress={() => navigation.navigate("ItemConditionScreen")}
          className="w-full bg-white rounded-lg mt-4 flex-row justify-between items-center px-5 py-3"
        >
          <View>
            <Text className="text-base text-black">Condition</Text>
            <Text className="text-sm font-semibold text-black mt-1">
              {selectedCondition || "Select condition"}
            </Text>
          </View>
          <Icon name="arrow-forward-ios" size={20} color="black" />
        </TouchableOpacity>

        {/* Nhập price */}
        <View className="w-full bg-white rounded-lg mt-4 flex-row items-center justify-between px-5 py-3">
          <TextInput
            className="flex-1 text-base font-bold text-[#00B0B9]"
            placeholder="Price"
            placeholderTextColor="#d1d5db"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />
          <Text className="font-bold text-[#00B0B9]">VND</Text>
        </View>

        {/* Nhập title */}
        <View className="w-full bg-white rounded-lg mt-4 px-5 py-3">
          <TextInput
            className="text-base font-normal text-black"
            placeholder="Title"
            placeholderTextColor="#d1d5db"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Description section */}
        <View className="w-full h-36 bg-white rounded-lg mt-4 px-5 py-3">
          <TextInput
            className="text-base font-normal text-black pt-2"
            placeholder="Description"
            placeholderTextColor="#d1d5db"
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* Quantity section */}
        <View className="w-full bg-white rounded-lg mt-4 px-5 py-3">
          <TextInput
            className="text-base font-normal text-black"
            placeholder="Quantity"
            placeholderTextColor="#d1d5db"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
          />
        </View>
      </ScrollView>

      <View
        className={`${
          Platform.OS === "ios" ? "pt-4 pb-7" : "py-3"
        } px-5 bg-white mt-auto rounded-t-xl flex-row items-center`}
      >
        <LoadingButton
          buttonClassName="p-3"
          title="Done"
          onPress={handleDone}
        />
      </View>
    </SafeAreaView>
  );
};

export default DifferentItem;
