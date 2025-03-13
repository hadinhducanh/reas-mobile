import React, { useEffect, useState } from "react";
import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/MaterialIcons";
import { RootStackParamList } from "../../../navigation/AppNavigator";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../../components/Header";

const options = [
  { label: "Kitchen appliances", value: "KITCHEN_APPLIANCES" },
  {
    label: "Cleaning & Laundry Appliances",
    value: "CLEANING_LAUNDRY_APPLIANCES",
  },
  { label: "Cooling & Heating Devices", value: "COOLING_HEATING_APPLIANCES" },
  {
    label: "Electronics & Entertainment Devices",
    value: "ELECTRONICS_ENTERTAINMENT_DEVICES",
  },
  { label: "Lighting & Security Devices", value: "LIGHTING_SECURITY_DEVICES" },
  { label: "Bedroom Appliances", value: "BEDROOM_APPLIANCES" },
  { label: "Living Room Appliances", value: "LIVING_ROOM_APPLIANCES" },
  { label: "Bathroom Appliances", value: "BATHROOM_APPLIANCES" },
];

const TypeOfItemScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedOption, setSelectedOption] = useState<{
    label: string;
    value: string;
  } | null>(null);

  useEffect(() => {
    const getStoredType = async () => {
      try {
        const storedType = await AsyncStorage.getItem("selectedType");
        if (storedType) {
          setSelectedOption(JSON.parse(storedType));
        }
      } catch (error) {
        console.error("Failed to retrieve type:", error);
      }
    };
    getStoredType();
  }, []);

  const handleSelectType = async (type: { label: string; value: string }) => {
    try {
      await AsyncStorage.setItem("selectedType", JSON.stringify(type));
      setSelectedOption(type);
      navigation.goBack();
    } catch (error) {
      console.error("Failed to save type:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F6F9F9]">
      <Header title="Item type" showOption={false} />
      <ScrollView contentInsetAdjustmentBehavior="automatic" className="px-5">
        {options.map((option, index) => {
          const isSelected = selectedOption?.value === option.value;
          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleSelectType(option)}
              className={`w-full rounded-lg mt-2 flex-row justify-between items-center px-5 py-5 ${
                isSelected ? "bg-[#00b0b91A]" : "bg-white"
              }`}
            >
              <Text
                className={`text-lg font-normal ${
                  isSelected ? "text-[#00b0b9] font-bold" : "text-black"
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
