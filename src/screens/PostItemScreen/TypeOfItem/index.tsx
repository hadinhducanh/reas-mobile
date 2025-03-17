import React, { useEffect, useState } from "react";
import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/MaterialIcons";
import { RootStackParamList } from "../../../navigation/AppNavigator";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../../components/Header";
import { TypeItem } from "../../../common/enums/TypeItem";
import { useUploadItem } from "../../../context/ItemContext";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { getAllByTypeItemThunk } from "../../../redux/thunk/categoryThunk";

const options = [
  { label: "Kitchen appliances", value: TypeItem.KITCHEN_APPLIANCES },
  {
    label: "Cleaning & Laundry Appliances",
    value: TypeItem.CLEANING_LAUNDRY_APPLIANCES,
  },
  {
    label: "Cooling & Heating Devices",
    value: TypeItem.COOLING_HEATING_APPLIANCES,
  },
  {
    label: "Electronics & Entertainment Devices",
    value: TypeItem.ELECTRONICS_ENTERTAINMENT_DEVICES,
  },
  {
    label: "Lighting & Security Devices",
    value: TypeItem.LIGHTING_SECURITY_DEVICES,
  },
  { label: "Bedroom Appliances", value: TypeItem.BEDROOM_APPLIANCES },
  { label: "Living Room Appliances", value: TypeItem.LIVING_ROOM_APPLIANCES },
  { label: "Bathroom Appliances", value: TypeItem.BATHROOM_APPLIANCES },
];

const TypeOfItemScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch<AppDispatch>();
  const { uploadItem, setUploadItem } = useUploadItem();

  const routes = navigation.getState().routes;

  let selectedTypeItem: TypeItem = TypeItem.NO_TYPE;
  let handleSelectTypeItem: (typeItem: TypeItem) => void;

  if (
    routes.length > 1 &&
    (routes[routes.length - 2].name as string) === "ExchangeDesiredItemScreen"
  ) {
    selectedTypeItem = uploadItem.desiredItem?.typeItem || TypeItem.NO_TYPE;
    handleSelectTypeItem = (typeItem: TypeItem) => {
      if (selectedTypeItem === typeItem) {
        setUploadItem({
          ...uploadItem,
          desiredItem: {
            ...uploadItem.desiredItem!,
            typeItem: TypeItem.NO_TYPE,
            categoryId: 0,
          },
        });
        navigation.navigate("ExchangeDesiredItemScreen");
      } else {
        setUploadItem({
          ...uploadItem,
          desiredItem: {
            ...uploadItem.desiredItem!,
            typeItem,
          },
        });
        dispatch(getAllByTypeItemThunk(typeItem));
        navigation.navigate("TypeOfItemDetailScreen");
      }
    };
  } else {
    selectedTypeItem = uploadItem.typeItem;
    handleSelectTypeItem = (typeItem: TypeItem) => {
      if (selectedTypeItem === typeItem) {
        setUploadItem({
          ...uploadItem,
          typeItem: TypeItem.NO_TYPE,
          categoryId: 0,
        });
        navigation.navigate("UploadScreen");
      } else {
        setUploadItem({ ...uploadItem, typeItem });
        dispatch(getAllByTypeItemThunk(typeItem));
        navigation.navigate("TypeOfItemDetailScreen");
      }
    };
  }
  return (
    <SafeAreaView className="flex-1 bg-[#F6F9F9]">
      <Header
        title="Type of item"
        showOption={false}
        onBackPress={
          routes.length > 1 &&
          (routes[routes.length - 2].name as string) ===
            "ExchangeDesiredItemScreen"
            ? () => navigation.navigate("ExchangeDesiredItemScreen")
            : () => navigation.navigate("UploadScreen")
        }
      />
      <ScrollView className="flex-1 mx-5">
        {options.map((option, index) => {
          const isSelected = selectedTypeItem === option.value;
          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleSelectTypeItem(option.value)}
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

export default TypeOfItemScreen;
