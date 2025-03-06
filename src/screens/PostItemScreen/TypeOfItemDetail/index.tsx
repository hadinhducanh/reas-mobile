import React, { useEffect, useState } from "react";
import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/MaterialIcons";
import { RootStackParamList } from "../../../navigation/AppNavigator";
import { SafeAreaView } from "react-native-safe-area-context";

const options = [
  "Stove",
  "Knife",
  "Rice cooker",
  "Microwaves",
  "Coffee maker",
  "Others",
];

const TypeOfItemDetailScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Lấy dữ liệu từ AsyncStorage khi vào màn hình
  useEffect(() => {
    const getStoredType = async () => {
      try {
        const storedType = await AsyncStorage.getItem("selectedType");
        if (storedType) {
          setSelectedOption(storedType);
        }
      } catch (error) {
        console.error("Failed to retrieve type:", error);
      }
    };
    getStoredType();
  }, []);

  // Khi chọn một option, lưu vào AsyncStorage và quay về UploadScreen
  const handleSelectType = async (type: string) => {
    try {
      await AsyncStorage.setItem("selectedType", type);
      setSelectedOption(type);
      navigation.pop(2);
    } catch (error) {
      console.error("Failed to save type:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F6F9F9]">
      <ScrollView contentInsetAdjustmentBehavior="automatic" className="flex-1">
        {/* Header */}
        <View className="w-full h-14 flex-row items-center px-4 ">
          <TouchableOpacity onPress={() => navigation.goBack()} className="w-10">
            <Icon name="arrow-back-ios" size={20} color="black" />
          </TouchableOpacity>
          <View className="flex-1 items-center">
            <Text className="text-2xl font-semibold text-black">Brand</Text>
          </View>
          <View className="w-10" />
        </View>

        {/* Danh sách lựa chọn */} 
        {options.map((option, index) => {
          const isSelected = selectedOption === option;
          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleSelectType(option)}
              className={`w-11/12 h-16 rounded-lg mt-2 ml-4 flex-row justify-between items-center px-4 ${
                isSelected ? "bg-[#00b0b91A]" : "bg-white"
              }`}
            >
              {/* Text hiển thị nội dung */}
              <Text className={`text-lg font-normal ${isSelected ? "text-[#00b0b9] font-bold" : "text-black"}`}>
                {option}
              </Text>

              {/* Radio Button */}
              <Icon
                name={isSelected ? "radio-button-checked" : "radio-button-unchecked"}
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

export default TypeOfItemDetailScreen;
