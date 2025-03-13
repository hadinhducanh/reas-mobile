import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import { ActionSheetIOS } from "react-native";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";

import { RootStackParamList } from "../../navigation/AppNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppDispatch, RootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { postItemThunk } from "../../redux/thunk/itemThunks";
import Header from "../../components/Header";
import ChooseImage from "../../components/ChooseImage";
import LoadingButton from "../../components/LoadingButton";

export default function UploadScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isCheckedFree, setIsCheckedFree] = useState(false);
  const [isCheckedDesiredItem, setIsCheckedDesiredItem] = useState(false);
  const [price, setPrice] = useState<number | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [description1, setDescription1] = useState("");
  const [quantity, setQuantity] = useState("");
  const [condition, setCondition] = useState("");
  const [images, setImages] = useState<string>("");
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
  const [selectedMethodsValue, setSelectedMethodsValue] = useState<string[]>(
    []
  );
  const [selectedCondition, setSelectedCondition] = useState<string | null>(
    null
  );
  const [selectedConditionValue, setSelectedConditionValue] = useState<
    string | null
  >(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedTypeValue, setSelectedTypeValue] = useState<string | null>(
    null
  );

  const { loading } = useSelector((state: RootState) => state.item);

  const dispatch = useDispatch<AppDispatch>();

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

          if (methods) {
            const parsedMethods = JSON.parse(methods);
            setSelectedMethodsValue(
              parsedMethods.map((method: { value: string }) => method.value)
            );
            setSelectedMethods(
              parsedMethods.map((method: { label: string }) => method.label)
            );
          }
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

  const handleCreateItem = async () => {
    const missingFields = [];

    if (!title) missingFields.push("title");
    if (!selectedType) missingFields.push("selectedType");
    if (!selectedBrandId) missingFields.push("selectedBrandId");
    if (!selectedCondition) missingFields.push("selectedCondition");

    if (missingFields.length > 0) {
      console.log("❌ Missing fields:", missingFields.join(", "));
      Alert.alert(
        "Error",
        `Please fill in all required fields: ${missingFields.join(", ")}`
      );
      return;
    }

    const newItem = {
      itemName: title || "",
      description: description1 || "",
      price: isCheckedFree ? 0 : price || 0,
      conditionItem: selectedConditionValue || "",
      imageUrl: images.length > 0 ? images[0] : "",
      // imageUrl: "hehehege",
      methodExchanges: selectedMethodsValue || [],
      isMoneyAccepted: !isCheckedDesiredItem,
      typeExchange: isCheckedDesiredItem
        ? "EXCHANGE_WITH_DESIRED_ITEM"
        : "OPEN_EXCHANGE",
      typeItem: selectedTypeValue || "",
      termsAndConditionsExchange: condition || "",
      categoryId: 2, // Đúng với dữ liệu mẫu
      brandId: selectedBrandId ?? 2, // Đúng với dữ liệu mẫu
      desiredItem: isCheckedDesiredItem
        ? {
            typeItem: "LIVING_ROOM_APPLIANCES",
            categoryId: 2,
            brandId: 2,
            conditionItem: "LIKE_NEW",
            minPrice: 1000,
            maxPrice: 100000,
          }
        : undefined,
    };

    console.log("🛠 Sending newItem data:", JSON.stringify(newItem, null, 2)); // Log toàn bộ dữ liệu item

    try {
      const resultAction = await dispatch(postItemThunk(newItem)).unwrap();
      console.log("✅ Success:", resultAction);
      Alert.alert("Success", "Item created successfully!");
    } catch (err) {
      console.log("❌ Error creating item:", err);

      if (err instanceof Error) {
        console.log("🛠 Error message:", err.message);
        Alert.alert("Error", err.message || "Failed to create item.");
      } else {
        console.log("🛠 Unknown error:", JSON.stringify(err, null, 2));
        Alert.alert("Error", "Failed to create item.");
      }
    }
  };

  const toggleCheckboxFree = () => {
    setIsCheckedFree(!isCheckedFree);
  };
  const toggleCheckboxDesiredItem = () => {
    setIsCheckedDesiredItem(!isCheckedDesiredItem);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F6F9F9]">
      <Header
        title="Upload your item"
        showBackButton={false}
        showOption={false}
      />
      <ScrollView className="mx-5" showsVerticalScrollIndicator={false}>
        <ChooseImage
          images={images}
          setImages={setImages}
          isUploadEvidence={false}
        />

        <TouchableOpacity
          onPress={() => navigation.navigate("TypeOfItemScreen")}
          className="w-full bg-white rounded-lg mt-4 flex-row justify-between items-center px-5 py-3"
        >
          <View>
            <Text className="text-base text-black">Type of item</Text>
            <Text className="text-lg font-semibold text-[#00b0b9] mt-1">
              {selectedCondition || "Select type"}
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

        <View className="flex-row items-center justify-between mt-4 px-5">
          <Text className="text-lg font-medium text-gray-500">
            I want to give it for free
          </Text>
          <TouchableOpacity
            onPress={toggleCheckboxFree}
            className="w-6 h-6 bg-white rounded-sm justify-center items-center border-2 border-[#00b0b9]"
          >
            {isCheckedFree && <Icon name="check" size={15} color="#00B0B9" />}
          </TouchableOpacity>
        </View>

        {!isCheckedFree && (
          <View className="w-full bg-white rounded-lg mt-4 flex-row items-center justify-between px-5 py-3">
            <TextInput
              className="flex-1 text-base font-normal text-black"
              placeholder="Price"
              placeholderTextColor="#d1d5db"
              value={price !== null ? price.toString() : ""}
              onChangeText={(text) => setPrice(text ? parseFloat(text) : null)}
              keyboardType="numeric"
            />

            <Text className="font-bold text-[#00B0B9]">VND</Text>
          </View>
        )}

        <View className="w-full bg-white rounded-lg mt-4 flex-row items-center justify-between px-5 py-3">
          <TextInput
            className="flex-1 text-base font-normal text-[#00B0B9]"
            placeholder="Title"
            placeholderTextColor="#d1d5db"
            // value={title}
            onChangeText={setTitle}
          />
        </View>

        <View className="w-full h-36 bg-white rounded-lg mt-4 px-5 py-3">
          <TextInput
            className="flex-1 text-base font-normal text-black"
            placeholder="Description"
            placeholderTextColor="#d1d5db"
            value={description1}
            onChangeText={setDescription1}
            multiline={true}
            textAlignVertical="top"
          />
        </View>

        <View className="w-full bg-white rounded-lg mt-4 px-5 py-3">
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

        <TouchableOpacity
          onPress={() => navigation.navigate("MethodOfExchangeScreen")}
          className="w-full bg-white rounded-lg mt-4 flex-row justify-between items-center px-5 py-3"
        >
          <View>
            <Text className="text-base text-black">Method of exchange</Text>
            <Text className="text-lg font-semibold text-[#00B0B9] mt-1">
              {selectedMethods.length > 0
                ? selectedMethods.join(", ")
                : "Select methods"}
            </Text>
          </View>
          <Icon name="arrow-forward-ios" size={20} color="black" />
        </TouchableOpacity>

        <View className="flex-row items-center justify-between mt-4 px-5">
          <Text className="text-lg font-medium text-gray-500">
            I want to desire an item for exchanging
          </Text>
          <TouchableOpacity
            onPress={toggleCheckboxDesiredItem}
            className="w-6 h-6 bg-white rounded-sm justify-center items-center border-2 border-[#00b0b9]"
          >
            {isCheckedDesiredItem && (
              <Icon name="check" size={15} color="#00B0B9" />
            )}
          </TouchableOpacity>
        </View>

        {isCheckedDesiredItem && (
          <TouchableOpacity
            onPress={() => navigation.navigate("ExchangeDesiredItemScreen")}
            className="w-full bg-[rgb(0,176,185,0.2)] rounded-lg mt-8 flex-row justify-between items-center px-5 py-5"
          >
            <View>
              <Text className="text-sm font-medium text-[#00B0B9]">
                Add your desired item for exchanging (optional)
              </Text>
            </View>

            <Icon name="arrow-forward-ios" size={20} color="#00B0B9" />
          </TouchableOpacity>
        )}

        <Text className="text-base font-semibold mt-8 px-5 text-gray-500">
          Exchange’s terms and conditions
        </Text>

        <View className="w-full h-36 bg-white rounded-lg mt-4 px-5 py-3">
          <TextInput
            className="text-base font-normal text-black pt-2"
            placeholder="Write your terms and conditions here..."
            placeholderTextColor="#d1d5db"
            value={condition}
            onChangeText={setCondition}
            multiline={true}
            textAlignVertical="top"
          />
        </View>

        <View className="py-5">
          <LoadingButton
            title="Create"
            buttonClassName="p-4"
            onPress={handleCreateItem}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
