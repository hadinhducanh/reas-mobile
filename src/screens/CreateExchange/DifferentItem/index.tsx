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
import ChooseImage from "../../../components/ChooseImage";

const DifferentItem: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [price, setPrice] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [images, setImages] = useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  const data = [
    { label: "Type of item", value: "Rice cooker" },
    { label: "Brand", value: "Others" },
    { label: "Condition", value: "Like new" },
    { label: "Min price", value: "100.000 VND" },
    { label: "Max price", value: "250.000 VND" },
  ];

  const [selectedCondition, setSelectedCondition] = useState<string | null>(
    null
  );
  const [selectedConditionValue, setSelectedConditionValue] = useState<
    string | null
  >(null);
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedTypeValue, setSelectedTypeValue] = useState<string | null>(
    null
  );

  const handleDone = () => {};

  useFocusEffect(
    useCallback(() => {
      const fetchStoredData = async () => {
        try {
          const [methods, condition, brand, type] = await Promise.all([
            AsyncStorage.getItem("selectedMethods"),
            AsyncStorage.getItem("selectedCondition"),
            AsyncStorage.getItem("selectedBrand"),
            AsyncStorage.getItem("selectedType"),
          ]);

          if (condition) {
            const parsedCondition = JSON.parse(condition);
            setSelectedConditionValue(parsedCondition.value);
            setSelectedCondition(parsedCondition.label);
          }

          if (brand) {
            const parsedBrand = JSON.parse(brand);
            setSelectedBrand(parsedBrand.brandName);
            setSelectedBrandId(parsedBrand.id);
          }
          if (type) {
            const parsedType = JSON.parse(type);
            setSelectedTypeValue(parsedType.value);
            setSelectedType(parsedType.label);
          }
        } catch (error) {
          console.error("Failed to retrieve or delete data:", error);
        }
      };

      fetchStoredData();
    }, [])
  );

  return (
    <SafeAreaView className="flex-1 bg-[#F6F9F9]">
      <Header title="Add different item" showOption={false} />

      <ScrollView className="mx-5" showsVerticalScrollIndicator={false}>
        <Text className="text-lg font-bold mt-4 mb-3 text-gray-500">
          Their desired item description:
        </Text>

        <View className="border border-gray-300 rounded-md overflow-hidden">
          <View className="border border-gray-300 rounded-md overflow-hidden">
            {data.map((info, index) => (
              <View key={index} className="flex-row border-b border-gray-300">
                <View className="w-[40%] px-2 py-4 bg-gray-200">
                  <Text className="text-base font-semibold text-gray-500">
                    {info.label}
                  </Text>
                </View>
                <View className="px-2 py-4">
                  <Text className="text-base">{info.value}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className="border-gray-200 border-[1px] my-5" />

        <ChooseImage images={images} setImages={setImages} />

        <TouchableOpacity
          onPress={() => navigation.navigate("TypeOfItemScreen")}
          className="w-full bg-white rounded-lg mt-4 flex-row justify-between items-center px-5 py-3"
        >
          <View>
            <Text className="text-base text-black">Type of item</Text>
            <Text className="text-lg font-semibold text-[#00b0b9] mt-1">
              {selectedType || "Select type"}
            </Text>
          </View>
          <Icon name="arrow-forward-ios" size={20} color="black" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("BrandSelectionScreen")}
          className="w-full bg-white rounded-lg mt-4 flex-row justify-between items-center px-5 py-3"
        >
          <View>
            <Text className="text-base text-black">Brand</Text>
            <Text className="text-lg font-semibold text-[#00b0b9] mt-1">
              {selectedBrand || "Select brand"}
            </Text>
          </View>
          <Icon name="arrow-forward-ios" size={20} color="black" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("ItemConditionScreen")}
          className="w-full bg-white rounded-lg mt-4 flex-row justify-between items-center px-5 py-3"
        >
          <View>
            <Text className="text-base text-black">Condition</Text>
            <Text className="text-lg font-semibold text-[#00b0b9] mt-1">
              {selectedCondition || "Select condition"}
            </Text>
          </View>
          <Icon name="arrow-forward-ios" size={20} color="black" />
        </TouchableOpacity>

        <View className="w-full bg-white rounded-lg mt-4 flex-row items-center justify-between px-5 py-3">
          <TextInput
            className="flex-1 text-base font-normal text-black"
            placeholder="Price"
            placeholderTextColor="#d1d5db"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />
          <Text className="font-bold text-[#00B0B9]">VND</Text>
        </View>

        {/* Nhập title */}
        <View className="w-full bg-white rounded-lg mt-4 flex-row items-center justify-between px-5 py-3">
          <TextInput
            className="flex-1 text-base font-normal text-[#00B0B9]"
            placeholder="Title"
            placeholderTextColor="#d1d5db"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View className="w-full h-36 bg-white rounded-lg mt-4 px-5 py-3">
          <TextInput
            className="flex-1 text-base font-normal text-black"
            placeholder="Description"
            placeholderTextColor="#d1d5db"
            value={description}
            onChangeText={setDescription}
            multiline={true}
            textAlignVertical="top"
          />
        </View>

        <View className="w-full bg-white rounded-lg my-4 px-5 py-3">
          <TextInput
            className="flex-1 text-base font-normal text-black"
            placeholder="Quantity"
            placeholderTextColor="#d1d5db"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
            inputMode="numeric"
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
