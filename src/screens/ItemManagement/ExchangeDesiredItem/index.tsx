import React, { useCallback, useEffect, useState, useRef } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/AppNavigator";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../../components/Header";
import LoadingButton from "../../../components/LoadingButton";
import NavigationListItem from "../../../components/NavigationListItem";
import ConfirmModal from "../../../components/DeleteConfirmModal";
import { ConditionItem } from "../../../common/enums/ConditionItem";
import { TypeItem } from "../../../common/enums/TypeItem";
import {
  defaultUpdateItem,
  useUpdateItem,
} from "../../../context/UpdateItemContext";
import ErrorModal from "../../../components/ErrorModal";

const ExchangeDesiredItemUpdateScreen = () => {
  const { updateItem, setUpdateItem } = useUpdateItem();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [confirmVisible, setConfirmVisible] = useState(false);

  const [minPrice, setMinPrice] = useState<string>(
    updateItem.desiredItem?.minPrice === null
      ? ""
      : updateItem.desiredItem?.minPrice.toString() || ""
  );
  const [maxPrice, setMaxPrice] = useState<string>(
    updateItem.desiredItem?.maxPrice === null
      ? ""
      : updateItem.desiredItem?.maxPrice.toString() || ""
  );
  const [description, setDescription] = useState<string>(
    updateItem.desiredItem?.description.replace(/\\n/g, "\n") || ""
  );
  const [error, setError] = useState<string>("");
  const [isInvalid, setIsInvalid] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  const [title, setTitle] = useState<string>("");

  const pendingBeforeRemoveEvent = useRef<any>(null);
  const hasConfirmedRef = useRef(false);

  const formatPrice = (value: string): string => {
    const numericValue = value.replace(/\D/g, "");
    return numericValue
      ? parseInt(numericValue, 10).toLocaleString("en-US")
      : "";
  };

  const handleDone = async () => {
    const min = parseInt(minPrice.replace(/,/g, ""), 10) || null;
    const max = parseInt(maxPrice.replace(/,/g, ""), 10) || null;

    if (!minPrice || !description) {
      setTitle("Missing Information");
      setContent("All fields are required. Please fill them in to proceed.");
      setVisible(true);
      return;
    } else {
      hasConfirmedRef.current = true;
      setUpdateItem({
        ...updateItem,
        desiredItem: {
          ...updateItem.desiredItem!,
          categoryId:
            updateItem.desiredItem?.categoryId === 0
              ? null
              : updateItem.desiredItem?.categoryId!,
          brandId:
            updateItem.desiredItem?.brandId === 0
              ? null
              : updateItem.desiredItem?.brandId!,
          conditionItem:
            updateItem.desiredItem?.conditionItem === ConditionItem.NO_CONDITION
              ? null
              : updateItem.desiredItem?.conditionItem!,
          maxPrice: max === null ? null : max,
          minPrice: min === null ? 0 : min,
        },
      });

      navigation.goBack();
    }
  };

  const handleFieldChange = useCallback(
    (field: "minPrice" | "maxPrice" | "description", value: string) => {
      const priceValue = parseInt(value.replace(/,/g, ""), 10) || null;

      if (field === "maxPrice") {
        setMaxPrice(value);
        setUpdateItem((prev) => ({
          ...prev,
          desiredItem: { ...prev.desiredItem!, maxPrice: priceValue },
        }));
      } else if (field === "minPrice") {
        setMinPrice(value);
        setUpdateItem((prev) => ({
          ...prev,
          desiredItem: { ...prev.desiredItem!, minPrice: priceValue },
        }));
      } else {
        setDescription(value);
        setUpdateItem((prev) => ({
          ...prev,
          desiredItem: {
            ...prev.desiredItem!,
            description: value.trim().replace(/\n/g, "\\n"),
          },
        }));
      }
    },
    [setUpdateItem]
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (hasConfirmedRef.current) return;

      if (
        JSON.stringify(updateItem.desiredItem) !==
        JSON.stringify(defaultUpdateItem.desiredItem)
      ) {
        pendingBeforeRemoveEvent.current = e;
        e.preventDefault();
        setConfirmVisible(true);
      }
    });

    return unsubscribe;
  }, [navigation, updateItem]);

  const handleConfirm = async () => {
    hasConfirmedRef.current = true;
    setConfirmVisible(false);
    setUpdateItem((prev) => ({
      ...prev,
      desiredItem: {
        ...prev.desiredItem!,
        categoryId: null,
        conditionItem: null,
        brandId: null,
        minPrice: null,
        maxPrice: null,
        description: "",
      },
      typeItemDesire: TypeItem.NO_TYPE,
      conditionDesiredItemName: "",
      categoryDesiredItemName: "",
      brandDesiredItemName: "",
    }));
    if (pendingBeforeRemoveEvent.current) {
      navigation.dispatch(pendingBeforeRemoveEvent.current.data.action);
    }
  };

  const handleCancel = () => {
    setConfirmVisible(false);
    pendingBeforeRemoveEvent.current = null;
  };

  useEffect(() => {
    const minPriceValue = parseInt(minPrice.replace(/,/g, ""), 10) || null;
    const maxPriceValue = parseInt(maxPrice.replace(/,/g, ""), 10) || null;

    if (
      minPriceValue &&
      maxPriceValue &&
      minPriceValue > maxPriceValue &&
      maxPriceValue !== 0
    ) {
      setError("Min price cannot be greater than Max price");
      setIsInvalid(true);
    } else {
      setError("");
      setIsInvalid(false);
    }
  }, [minPrice, maxPrice]);

  return (
    <SafeAreaView className="flex-1 bg-[#F6F9F9]">
      <Header title="Your desired item for exchange" showOption={false} />
      <ScrollView className="flex-1 mx-5">
        <NavigationListItem
          title="Type of item"
          value={updateItem.categoryDesiredItemName}
          route="TypeOfItemUpdateScreen"
          defaultValue="Select type"
        />

        <NavigationListItem
          title="Brand"
          value={updateItem.brandDesiredItemName}
          route="BrandSelectionUpdateScreen"
          defaultValue="Select brand"
        />

        <View className="flex-row justify-center gap-4 mt-4">
          <View className="flex-1 rounded-lg border-2 border-[#00B0B9] bg-white p-2">
            <Text className="text-[#00b0b9] text-base font-bold">
              Min price<Text className="text-red-500">*</Text>
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
              Max price
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
          title="Condition"
          value={updateItem.conditionDesiredItemName}
          route="ItemConditionUpdateScreen"
          defaultValue="Select condition"
        />

        <View className="w-full h-40 bg-white rounded-lg mt-4 px-5 py-3">
          <Text className="text-black text-base">
            Description<Text className="text-red-500">*</Text>
          </Text>
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

        {error ? (
          <Text className="text-red-500 text-sm mt-2">{error}</Text>
        ) : null}

        <LoadingButton
          title="Done"
          onPress={handleDone}
          buttonClassName={`py-4 mt-4 ${isInvalid ? "bg-gray-200" : ""}`}
          disable={isInvalid}
        />
      </ScrollView>

      <ErrorModal
        content={content}
        title={title}
        visible={visible}
        onCancel={() => setVisible(false)}
      />

      <ConfirmModal
        title="Warning"
        content={`You have unsaved desired item. ${"\n"} Do you really want to leave?`}
        visible={confirmVisible}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
    </SafeAreaView>
  );
};

export default ExchangeDesiredItemUpdateScreen;
