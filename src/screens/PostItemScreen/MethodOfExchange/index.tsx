import React, { useEffect, useState } from "react";
import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../../../navigation/AppNavigator";
import { SafeAreaView } from "react-native-safe-area-context";

// Danh sách chuẩn với value là chuỗi
const exchangeMethods = [
  { label: "Pick up in person", value: "PICK_UP_IN_PERSON" },
  { label: "Delivery", value: "DELIVERY" },
  { label: "Meet at a given location", value: "MEET_AT_GIVEN_LOCATION" },
];

const MethodOfExchangeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedMethods, setSelectedMethods] = useState<{ label: string; value: string }[]>([]);

  // Lấy dữ liệu từ AsyncStorage khi vào màn hình
  useEffect(() => {
    const getStoredMethods = async () => {
      try {
        const storedData = await AsyncStorage.getItem("selectedMethods");
        if (storedData) {
          const parsedData = JSON.parse(storedData);

          // Loại bỏ các mục có `value` là số
          const filteredData = parsedData
            .filter((item: any) => typeof item.value === "string")
            .map((item: any) => {
              const matchedMethod = exchangeMethods.find((m) => m.value === item.value);
              return matchedMethod || item;
            });

          setSelectedMethods(filteredData);
        }
      } catch (error) {
        console.error("Failed to retrieve methods:", error);
      }
    };
    getStoredMethods();
  }, []);

  // Hàm xử lý lựa chọn phương thức giao dịch
  const toggleMethod = (method: { label: string; value: string }) => {
    setSelectedMethods((prev) =>
      prev.some((m) => m.value === method.value)
        ? prev.filter((m) => m.value !== method.value)
        : [...prev, method]
    );
  };

  // Xác nhận lựa chọn -> Lưu & Điều hướng về UploadScreen
  const handleConfirm = async () => {
    if (selectedMethods.length > 0) {
      try {
        await AsyncStorage.setItem("selectedMethods", JSON.stringify(selectedMethods));
        console.log("✅ Saved selected methods:", selectedMethods);
        navigation.goBack();
      } catch (error) {
        console.error("Failed to save methods:", error);
      }
    } else {
      alert("Please select at least one method!");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F6F9F9]">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="w-full h-14 flex-row items-center px-4">
          <TouchableOpacity onPress={() => navigation.goBack()} className="w-10">
            <Icon name="arrow-back-ios" size={20} color="black" />
          </TouchableOpacity>
          <View className="flex-1 items-center">
            <Text className="text-2xl font-semibold text-black">Method of Exchange</Text>
          </View>
          <View className="w-10" />
        </View>

        {/* Danh sách phương thức giao dịch */}
        {exchangeMethods.map((method, index) => {
          const isSelected = selectedMethods.some((m) => m.value === method.value);
          return (
            <TouchableOpacity
              key={index}
              onPress={() => toggleMethod(method)}
              className={`w-11/12 h-16 rounded-lg mt-2 ml-4 flex-row justify-between items-center px-4 ${
                isSelected ? "bg-[#00b0b91A]" : "bg-white"
              }`}
            >
              <Text className={`text-lg font-normal ${isSelected ? "text-[#00b0b9] font-bold" : "text-black"}`}>
                {method.label}
              </Text>
              <Icon
                name={isSelected ? "check-box" : "check-box-outline-blank"}
                size={24}
                color="#00b0b9"
              />
            </TouchableOpacity>
          );
        })}

        {/* Nút xác nhận */}
        <TouchableOpacity
          onPress={handleConfirm}
          className="w-11/12 h-14 bg-[#00b0b9] rounded-lg mt-6 ml-4 flex items-center justify-center"
        >
          <Text className="text-lg font-semibold text-white">Confirm</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MethodOfExchangeScreen;
