import React, { useCallback, useEffect, useState, useRef } from "react";
import { ScrollView, Text, TextInput, View, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/AppNavigator";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../../components/Header";
import LoadingButton from "../../../components/LoadingButton";
import { defaultUploadItem, useUploadItem } from "../../../context/ItemContext";
import NavigationListItem from "../../../components/NavigationListItem";
import ConfirmModal from "../../../components/DeleteConfirmModal";
import { ConditionItem } from "../../../common/enums/ConditionItem";

const ExchangeDesiredItemScreen = () => {
  const { uploadItem, setUploadItem } = useUploadItem();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [confirmVisible, setConfirmVisible] = useState(false);

  const [minPrice, setMinPrice] = useState<string>(
    uploadItem.desiredItem?.minPrice.toString() || ""
  );
  const [maxPrice, setMaxPrice] = useState<string>(
    uploadItem.desiredItem?.maxPrice === null
      ? "0"
      : uploadItem.desiredItem?.maxPrice.toString() || ""
  );
  const [description, setDescription] = useState<string>(
    uploadItem.desiredItem?.description || ""
  );

  const pendingBeforeRemoveEvent = useRef<any>(null);
  const hasConfirmedRef = useRef(false);

  const formatPrice = (value: string): string => {
    const numericValue = value.replace(/\D/g, "");
    return numericValue
      ? parseInt(numericValue, 10).toLocaleString("en-US")
      : "";
  };

  const handleDone = async () => {
    const min = parseInt(minPrice.replace(/,/g, ""), 10) || 0;
    const max = parseInt(maxPrice.replace(/,/g, ""), 10) || 0;

    if (!minPrice || !description) {
      Alert.alert("Missing Information", "All fields is required.");
      return;
    } else if (max <= min && max !== 0) {
      Alert.alert("Invalid", "Max price must be greater than min price.");
      return;
    } else {
      hasConfirmedRef.current = true;

      setUploadItem({
        ...uploadItem,
        desiredItem: {
          ...uploadItem.desiredItem!,
          categoryId:
            uploadItem.desiredItem?.categoryId === 0
              ? null
              : uploadItem.desiredItem?.categoryId!,
          brandId:
            uploadItem.desiredItem?.brandId === 0
              ? null
              : uploadItem.desiredItem?.brandId!,
          conditionItem:
            uploadItem.desiredItem?.conditionItem === ConditionItem.NO_CONDITION
              ? null
              : uploadItem.desiredItem?.conditionItem!,
          maxPrice: max === 0 ? null : max,
          minPrice: min,
        },
      });

      navigation.goBack();
    }
  };

  const handleFieldChange = useCallback(
    (field: "minPrice" | "maxPrice" | "description", value: string) => {
      const priceValue = parseInt(value.replace(/,/g, ""), 10) || 0;

      if (field === "maxPrice") {
        setMaxPrice(value);
        setUploadItem((prev) => ({
          ...prev,
          desiredItem: { ...prev.desiredItem!, maxPrice: priceValue },
        }));
      } else if (field === "minPrice") {
        setMinPrice(value);
        setUploadItem((prev) => ({
          ...prev,
          desiredItem: { ...prev.desiredItem!, minPrice: priceValue },
        }));
      } else {
        setDescription(value);
        setUploadItem((prev) => ({
          ...prev,
          desiredItem: {
            ...prev.desiredItem!,
            description: value.trim().replace(/\n/g, "\\n"),
          },
        }));
      }
    },
    [setUploadItem]
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (hasConfirmedRef.current) return;

      if (
        JSON.stringify(uploadItem.desiredItem) !==
        JSON.stringify(defaultUploadItem.desiredItem)
      ) {
        pendingBeforeRemoveEvent.current = e;
        e.preventDefault();
        setConfirmVisible(true);
      }
    });

    return unsubscribe;
  }, [navigation, uploadItem]);

  const handleConfirm = async () => {
    hasConfirmedRef.current = true;
    setConfirmVisible(false);
    setUploadItem((prev) => ({
      ...prev,
      desiredItem: defaultUploadItem.desiredItem,
    }));
    if (pendingBeforeRemoveEvent.current) {
      navigation.dispatch(pendingBeforeRemoveEvent.current.data.action);
    }
  };

  const handleCancel = () => {
    setConfirmVisible(false);
    pendingBeforeRemoveEvent.current = null;
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F6F9F9]">
      <Header title="Your desired item for exchange" showOption={false} />
      <ScrollView className="flex-1 mx-5">
        <NavigationListItem
          title="Type of item(Optional)"
          value={uploadItem.categoryDesiredItemName}
          route="TypeOfItemScreen"
          defaultValue="Select type"
        />

        <NavigationListItem
          title="Brand(Optional)"
          value={uploadItem.brandDesiredItemName}
          route="BrandSelectionScreen"
          defaultValue="Select brand"
        />

        <View className="flex-row justify-center gap-4 mt-4">
          <View className="flex-1 rounded-lg border-2 border-[#00B0B9] bg-white p-2">
            <Text className="text-[#00b0b9] text-base font-bold">
              Min price*
            </Text>
            <View className="flex-row justify-between items-center mt-1">
              <TextInput
                className="flex-1 text-black text-lg font-normal"
                placeholder="0"
                value={formatPrice(minPrice)}
                onChangeText={(text) => handleFieldChange("minPrice", text)}
                keyboardType="numeric"
                placeholderTextColor="#d1d5db"
              />
              <Text className="text-gray-500 text-lg font-normal">đ</Text>
            </View>
          </View>

          <View className="flex-1 rounded-lg border-2 border-[#00B0B9] bg-white p-2">
            <Text className="text-[#00b0b9] text-base font-bold">
              Max price(Optional)
            </Text>
            <View className="flex-row justify-between items-center mt-1">
              <TextInput
                className="flex-1 text-black text-lg font-normal"
                placeholder="0"
                value={formatPrice(maxPrice)}
                onChangeText={(text) => handleFieldChange("maxPrice", text)}
                keyboardType="numeric"
                placeholderTextColor="#d1d5db"
              />
              <Text className="text-gray-500 text-lg font-normal">đ</Text>
            </View>
          </View>
        </View>

        <NavigationListItem
          title="Condition(Optional)"
          value={uploadItem.conditionDesiredItemName}
          route="ItemConditionScreen"
          defaultValue="Select condition"
        />

        <View className="w-full h-40 bg-white rounded-lg mt-4 px-5 py-3">
          <Text className="text-black text-base">Description*</Text>
          <TextInput
            className="flex-1 text-lg font-normal text-black"
            placeholder="Aaaaa"
            placeholderTextColor="#d1d5db"
            value={description}
            onChangeText={(text) => handleFieldChange("description", text)}
            multiline={true}
            textAlignVertical="top"
          />
        </View>

        <LoadingButton
          title="Done"
          onPress={handleDone}
          buttonClassName="p-4 mt-4"
        />
      </ScrollView>
      <ConfirmModal
        title="Warning"
        content={`You have unsaved item. ${"\n"} Do you really want to leave?`}
        visible={confirmVisible}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
    </SafeAreaView>
  );
};

export default ExchangeDesiredItemScreen;
