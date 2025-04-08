import React from "react";
import { ScrollView, Text, TouchableOpacity } from "react-native";
import { useNavigation, useNavigationState } from "@react-navigation/native";
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
  const state = useNavigationState((state) => state);
  const dispatch = useDispatch<AppDispatch>();
  const { uploadItem, setUploadItem } = useUploadItem();

  let selectedTypeItem: TypeItem = TypeItem.NO_TYPE;
  let handleSelectTypeItem: (typeItem: TypeItem) => void;

  const targetIndex = state.index - 1;

  if (
    targetIndex > 0 &&
    state.routes[targetIndex].name === "ExchangeDesiredItemScreen"
  ) {
    selectedTypeItem = uploadItem.typeItemDesire || TypeItem.NO_TYPE;
    handleSelectTypeItem = (typeItemDesire: TypeItem) => {
      if (selectedTypeItem === typeItemDesire) {
        setUploadItem({
          ...uploadItem,
          desiredItem: {
            ...uploadItem.desiredItem!,
            categoryId: 0,
          },
          typeItemDesire: TypeItem.NO_TYPE,
          categoryDesiredItemName: "",
        });
        navigation.goBack();
      } else {
        setUploadItem({
          ...uploadItem,
          categoryDesiredItemName: "",
          typeItemDesire,
          desiredItem: {
            ...uploadItem.desiredItem!,
            categoryId: 0,
          },
        });
        dispatch(getAllByTypeItemThunk(typeItemDesire));
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
          categoryName: "",
        });
        navigation.goBack();
      } else {
        setUploadItem({
          ...uploadItem,
          typeItem,
          categoryId: 0,
          categoryName: "",
        });
        dispatch(getAllByTypeItemThunk(typeItem));
        navigation.navigate("TypeOfItemDetailScreen");
      }
    };
  }

  const handleBackButton = () => {
    if (
      targetIndex > 0 &&
      state.routes[targetIndex].name === "ExchangeDesiredItemScreen"
    ) {
      if (uploadItem.desiredItem?.categoryId === 0) {
        setUploadItem({
          ...uploadItem,
          desiredItem: {
            ...uploadItem.desiredItem!,
          },
          typeItemDesire: TypeItem.NO_TYPE,
        });
      }
    } else {
      if (uploadItem.categoryId === 0) {
        setUploadItem({
          ...uploadItem,
          typeItem: TypeItem.NO_TYPE,
        });
      }
    }
    navigation.goBack();
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F6F9F9]">
      <Header
        title="Type of item"
        showOption={false}
        onBackPress={handleBackButton}
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
