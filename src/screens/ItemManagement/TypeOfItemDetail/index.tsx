import React from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/MaterialIcons";
import { RootStackParamList } from "../../../navigation/AppNavigator";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";
import Header from "../../../components/Header";
import { useUpdateItem } from "../../../context/UpdateItemContext";

const TypeOfItemDetailUpdateScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const state = useNavigationState((state) => state);
  const { categories, loading, error } = useSelector(
    (state: RootState) => state.category
  );
  const { updateItem, setUpdateItem } = useUpdateItem();

  let selectedTypeItemDetail: number = 0;
  let handleSelectType: (categoryId: number, categoryName: string) => void;

  const targetIndex = state.index - 2;

  if (
    targetIndex > 0 &&
    state.routes[targetIndex].name === "ExchangeDesiredItemUpdateScreen"
  ) {
    selectedTypeItemDetail = updateItem.desiredItem?.categoryId || 0;
    handleSelectType = (categoryId: number, categoryName: string) => {
      if (selectedTypeItemDetail === categoryId) {
        setUpdateItem({
          ...updateItem,
          categoryDesiredItemName: "",
          desiredItem: {
            ...updateItem.desiredItem!,
            categoryId: 0,
          },
        });
        navigation.goBack();
      } else {
        setUpdateItem({
          ...updateItem,
          categoryDesiredItemName: categoryName,
          desiredItem: {
            ...updateItem.desiredItem!,
            categoryId,
          },
        });
        navigation.pop(2);
      }
    };
  } else {
    selectedTypeItemDetail = updateItem.categoryId;
    handleSelectType = async (categoryId: number, categoryName: string) => {
      if (selectedTypeItemDetail === categoryId) {
        setUpdateItem({ ...updateItem, categoryId: 0, categoryName: "" });
        navigation.goBack();
      } else {
        setUpdateItem({ ...updateItem, categoryId, categoryName });
        navigation.pop(2);
      }
    };
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F6F9F9]">
      <Header title="Type of item" showOption={false} />

      <ScrollView className="flex-1 mx-5">
        {loading && <ActivityIndicator size="large" color="#00b0b9" />}
        {error && (
          <Text className="text-red-500 text-center mt-4">{error}</Text>
        )}

        {categories.map((category) => {
          const isSelected = selectedTypeItemDetail === category.id;
          return (
            <TouchableOpacity
              key={category.id}
              onPress={() =>
                handleSelectType(category.id, category.categoryName)
              }
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
                {category.categoryName}
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

export default TypeOfItemDetailUpdateScreen;
