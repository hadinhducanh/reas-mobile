import React, { useEffect, useState } from "react";
import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/MaterialIcons";
import { RootStackParamList } from "../../../navigation/AppNavigator";
import { SafeAreaView } from "react-native-safe-area-context";

// Mảng chứa cả nhãn hiển thị và giá trị tương ứng
const options = [
  { label: "Brand new", value: "BRAND_NEW" },
  { label: "Like new", value: "LIKE_NEW" },
  { label: "Excellent condition", value: "EXCELLENT" },
  { label: "Good condition", value: "GOOD" },
  { label: "Fair condition", value: "FAIR" },
  { label: "Poor condition", value: "POOR" },
  { label: "For parts / Not working", value: "NOT_WORKING" },
];

const ItemConditionScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedOption, setSelectedOption] = useState<{ label: string; value: string } | null>(null);

  // Lấy dữ liệu từ AsyncStorage khi vào màn hình
  useEffect(() => {
    const getStoredCondition = async () => {
      try {
        const storedCondition = await AsyncStorage.getItem("selectedCondition");
        if (storedCondition) {
          setSelectedOption(JSON.parse(storedCondition));
        }
      } catch (error) {
        console.error("Failed to retrieve condition:", error);
      }
    };
    getStoredCondition();
  }, []);

  // Khi chọn một option, lưu vào AsyncStorage và quay về UploadScreen
  const handleSelectCondition = async (condition: { label: string; value: string }) => {
    try {
      await AsyncStorage.setItem("selectedCondition", JSON.stringify(condition));
      setSelectedOption(condition);
      navigation.goBack();
    } catch (error) {
      console.error("Failed to save condition:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F6F9F9]">
      <ScrollView contentInsetAdjustmentBehavior="automatic" className="flex-1">
        {/* Header */}
        <View className="w-full h-14 flex-row items-center px-4">
          <TouchableOpacity onPress={() => navigation.goBack()} className="w-10">
            <Icon name="arrow-back-ios" size={20} color="black" />
          </TouchableOpacity>
          <View className="flex-1 items-center">
            <Text className="text-2xl font-semibold text-black">Item condition</Text>
          </View>
          <View className="w-10" />
        </View>

        {/* Danh sách lựa chọn */}
        {options.map((option, index) => {
          const isSelected = selectedOption?.value === option.value;
          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleSelectCondition(option)}
              className={`w-11/12 h-16 rounded-lg mt-2 ml-4 flex-row justify-between items-center px-4 ${
                isSelected ? "bg-[#00b0b91A]" : "bg-white"
              }`}
            >
              {/* Text hiển thị nội dung */}
              <Text className={`text-lg font-normal ${isSelected ? "text-[#00b0b9] font-bold" : "text-black"}`}>
                {option.label}
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

export default ItemConditionScreen;
