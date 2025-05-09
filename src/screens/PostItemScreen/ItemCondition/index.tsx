import React from "react";
import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/MaterialIcons";
import { RootStackParamList } from "../../../navigation/AppNavigator";
import { SafeAreaView } from "react-native-safe-area-context";
import { ConditionItem } from "../../../common/enums/ConditionItem";
import { useUploadItem } from "../../../context/ItemContext";
import Header from "../../../components/Header";

const options = [
  { label: "Brand new", value: ConditionItem.BRAND_NEW },
  { label: "Like new", value: ConditionItem.LIKE_NEW },
  { label: "Excellent condition", value: ConditionItem.EXCELLENT },
  { label: "Good condition", value: ConditionItem.GOOD },
  { label: "Fair condition", value: ConditionItem.FAIR },
  { label: "Poor condition", value: ConditionItem.POOR },
  { label: "For parts / Not working", value: ConditionItem.NOT_WORKING },
];

const ItemConditionScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const state = useNavigationState((state) => state);
  const { uploadItem, setUploadItem } = useUploadItem();

  let selectedItemCondition: ConditionItem = ConditionItem.NO_CONDITION;
  let handleSelectCondition: (
    conditionItem: ConditionItem,
    conditionItemName: string
  ) => void;

  const targetIndex = state.index - 1;

  if (
    targetIndex > 0 &&
    state.routes[targetIndex].name === "ExchangeDesiredItemScreen"
  ) {
    selectedItemCondition =
      uploadItem.desiredItem?.conditionItem || ConditionItem.NO_CONDITION;
    handleSelectCondition = (
      conditionItem: ConditionItem,
      conditionItemName: string
    ) => {
      if (selectedItemCondition === conditionItem) {
        setUploadItem({
          ...uploadItem,
          conditionDesiredItemName: "",
          desiredItem: {
            ...uploadItem.desiredItem!,
            conditionItem: ConditionItem.NO_CONDITION,
          },
        });
      } else {
        setUploadItem({
          ...uploadItem,
          conditionDesiredItemName: conditionItemName,
          desiredItem: {
            ...uploadItem.desiredItem!,
            conditionItem,
          },
        });
      }
      navigation.goBack();
    };
  } else {
    selectedItemCondition = uploadItem.conditionItem;
    handleSelectCondition = async (
      conditionItem: ConditionItem,
      conditionItemName: string
    ) => {
      if (selectedItemCondition === conditionItem) {
        setUploadItem({
          ...uploadItem,
          conditionItem: ConditionItem.NO_CONDITION,
          conditionItemName: "",
        });
      } else {
        setUploadItem({ ...uploadItem, conditionItem, conditionItemName });
      }
      navigation.goBack();
    };
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F6F9F9]">
      <Header title="Item condition" showOption={false} />

      <ScrollView className="flex-1 mx-5">
        {options.map((option, index) => {
          const isSelected = selectedItemCondition === option.value;
          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleSelectCondition(option.value, option.label)}
              className={`p-5 rounded-lg mt-3 flex-row justify-between items-center ${
                isSelected ? "bg-[#00b0b91A]" : "bg-white"
              }`}
            >
              <Text
                className={`text-lg ${
                  isSelected
                    ? "text-[#00b0b9] font-bold"
                    : "text-black font-normal"
                }`}
              >
                {option.label}
              </Text>
              <Icon
                name={
                  isSelected ? "radio-button-checked" : "radio-button-unchecked"
                }
                size={24}
                color="#00b0b9"
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ItemConditionScreen;
