import React, { useCallback, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/MaterialIcons";
import { RootStackParamList } from "../../../navigation/AppNavigator";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../../../components/Header";
import LoadingButton from "../../../components/LoadingButton";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useUploadItem } from "../../../context/ItemContext";
import { ConditionItem } from "../../../common/enums/ConditionItem";

const itemConditions = [
  { label: "Brand new", value: ConditionItem.BRAND_NEW },
  { label: "Like new", value: ConditionItem.LIKE_NEW },
  { label: "Excellent condition", value: ConditionItem.EXCELLENT },
  { label: "Good condition", value: ConditionItem.GOOD },
  { label: "Fair condition", value: ConditionItem.FAIR },
  { label: "Poor condition", value: ConditionItem.POOR },
  { label: "For parts / Not working", value: ConditionItem.NOT_WORKING },
];

const ExchangeDesiredItemScreen = () => {
  const { uploadItem, setUploadItem } = useUploadItem();

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [minPrice, setMinPrice] = useState<string>(
    uploadItem.desiredItem?.minPrice.toString() || ""
  );
  const [maxPrice, setMaxPrice] = useState<string>(
    uploadItem.desiredItem?.maxPrice.toString() || ""
  );

  const { brands } = useSelector((state: RootState) => state.brand);
  const { categories } = useSelector((state: RootState) => state.category);

  const selectedBrand = brands.find(
    (brand) => brand.id === uploadItem.desiredItem?.brandId
  );
  const selectedTypeItemDetail = categories.find(
    (category) => category.id === uploadItem.desiredItem?.categoryId
  );
  const selectedItemCondition = itemConditions.find(
    (itemCondition) =>
      itemCondition.value === uploadItem.desiredItem?.conditionItem
  );

  const formatPrice = (value: string): string => {
    const numericValue = value.replace(/\D/g, "");
    return numericValue
      ? parseInt(numericValue, 10).toLocaleString("en-US")
      : "";
  };

  const handleDone = async () => {
    const min = parseInt(minPrice.replace(/,/g, ""), 10) || 0;
    const max = parseInt(maxPrice.replace(/,/g, ""), 10) || 0;

    if (
      !minPrice ||
      !maxPrice ||
      !selectedBrand ||
      !selectedItemCondition ||
      !selectedTypeItemDetail
    ) {
      Alert.alert("Missing Information", "All fields is required.");
      return;
    } else if (max <= min) {
      Alert.alert("Invalid", "Max price must be greater than min price.");
      return;
    } else {
      setUploadItem({
        ...uploadItem,
        desiredItem: {
          ...uploadItem.desiredItem!,
          maxPrice: max,
          minPrice: min,
        },
      });
      navigation.navigate("MainTabs", { screen: "Upload" });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F6F9F9]">
      <Header title="Your desired item for exchange" showOption={false} />
      <ScrollView className="flex-1 mx-5">
        <TouchableOpacity
          onPress={() => navigation.navigate("TypeOfItemScreen")}
          className="w-full bg-white rounded-lg mt-4 flex-row justify-between items-center px-5 py-3"
        >
          <View>
            <Text className="text-base text-black">Type of item</Text>
            <Text
              className={`text-lg font-semibold ${
                selectedTypeItemDetail ? "text-[#00b0b9]" : "text-black"
              }  mt-1`}
            >
              {selectedTypeItemDetail?.categoryName || "Select type"}
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
            <Text
              className={`text-lg font-semibold ${
                selectedBrand ? "text-[#00b0b9]" : "text-black"
              }  mt-1`}
            >
              {selectedBrand?.brandName || "Select brand"}
            </Text>
          </View>
          <Icon name="arrow-forward-ios" size={20} color="black" />
        </TouchableOpacity>

        <View className="flex-row justify-center gap-4 mt-4">
          {/* Min Price */}
          <View className="flex-1 rounded-lg border-2 border-[#00B0B9] bg-white p-2">
            <Text className="text-[#00b0b9] text-base font-bold">
              Min price
            </Text>
            <View className="flex-row justify-between items-center mt-1">
              <TextInput
                className="flex-1 text-black text-lg font-normal"
                placeholder="0"
                value={formatPrice(minPrice)}
                onChangeText={(value) => setMinPrice(formatPrice(value))}
                keyboardType="numeric"
                placeholderTextColor="#d1d5db"
              />
              <Text className="text-gray-500 text-lg font-normal">đ</Text>
            </View>
          </View>

          {/* Max Price */}
          <View className="flex-1 rounded-lg border-2 border-[#00B0B9] bg-white p-2">
            <Text className="text-[#00b0b9] text-base font-bold">
              Max price
            </Text>
            <View className="flex-row justify-between items-center mt-1">
              <TextInput
                className="flex-1 text-black text-lg font-normal"
                placeholder="0"
                value={formatPrice(maxPrice)}
                onChangeText={(value) => setMaxPrice(formatPrice(value))}
                keyboardType="numeric"
                placeholderTextColor="#d1d5db"
              />
              <Text className="text-gray-500 text-lg font-normal">đ</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate("ItemConditionScreen")}
          className="w-full bg-white rounded-lg mt-4 flex-row justify-between items-center px-5 py-3"
        >
          <View>
            <Text className="text-base text-black">Condition</Text>
            <Text
              className={`text-lg font-semibold ${
                selectedItemCondition ? "text-[#00b0b9]" : "text-black"
              }  mt-1`}
            >
              {selectedItemCondition?.label || "Select condition"}
            </Text>
          </View>
          <Icon name="arrow-forward-ios" size={20} color="black" />
        </TouchableOpacity>

        <LoadingButton
          title="Done"
          onPress={handleDone}
          buttonClassName="p-4 mt-4"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ExchangeDesiredItemScreen;
