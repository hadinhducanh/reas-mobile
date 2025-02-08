import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import LoadingButton from "../../../components/LoadingButton";

const VerifyPhoneScreen: React.FC = () => {
  const [countryCode, setCountryCode] = useState("+84");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSend = async () => {
    // Test Loading: delay 3 giây
    await new Promise((resolve) => setTimeout(resolve, 3000));
  };

  // Hàm định dạng số điện thoại theo mẫu "123-456-6789"
  const formatPhoneNumber = (digits: string) => {
    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 6) {
      return digits.slice(0, 3) + "-" + digits.slice(3);
    } else {
      return (
        digits.slice(0, 3) +
        "-" +
        digits.slice(3, 6) +
        "-" +
        digits.slice(6, 10)
      );
    }
  };

  const handlePhoneChange = (input: string) => {
    const cleaned = input.replace(/\D/g, "");
    const limited = cleaned.slice(0, 10);
    const formatted = formatPhoneNumber(limited);
    setPhoneNumber(formatted);
  };

  const isValidPhone = (phone: string) => {
    const regex = /^\d{3}-\d{3}-\d{4}$/;
    return regex.test(phone);
  };

  const renderValidationIcon = () => {
    if (phoneNumber.trim().length === 0) {
      return null;
    }
    if (isValidPhone(phoneNumber)) {
      return (
        <Icon
          name="checkmark-outline"
          size={20}
          color="#00b0b9"
          className="ml-[10px]"
        />
      );
    } else {
      return (
        <Icon
          name="close-outline"
          size={20}
          color="red"
          className="ml-[10px]"
        />
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F6F9F9]">
      {/* Header: Back Button & Title */}
      <View className="relative flex-row items-center justify-center h-[50px] px-[20px] pt-[20px]">
        <View className="absolute left-[20px] top-[20px]">
          <Icon name="chevron-back-outline" size={24} color="#0b1d2d" />
        </View>
        <Text className="text-[18px] font-normal">
          Verify your phone number
        </Text>
      </View>

      {/* Form nằm ngay dưới Header */}
      <View className="bg-white rounded-tl-[10px] rounded-tr-[10px] mx-[20px] px-[20px] py-[20px] mt-[20px]">
        <Text className="text-[16px] font-bold text-[#738aa0] mt-[20px] mb-[30px]">
          We have sent you an SMS with a code to number +17 123-456-789
        </Text>

        {/* Input cho số điện thoại với mã quốc gia */}
        <View className="w-full h-[50px] mb-[30px]">
          <View className="flex-row h-full px-[6px] items-center bg-[#e8f3f6] rounded-[8px]">
            <View className="w-[40px] h-[40px] bg-[#00b0b9] rounded-[8px] justify-center items-center mr-[10px]">
              <Icon name="phone-portrait-outline" size={20} color="#ffffff" />
            </View>
            {/* Container cho mã quốc gia */}
            <View className="px-[10px] justify-center items-center border-r border-r-[#738aa0] mr-[10px]">
              <Text className="text-[16px] text-[#0b1d2d]">{countryCode}</Text>
            </View>
            {/* Ô nhập số điện thoại */}
            <TextInput
              placeholder="123-456-6789"
              placeholderTextColor="#738aa0"
              keyboardType="number-pad"
              value={phoneNumber}
              onChangeText={handlePhoneChange}
              className="flex-1 text-[16px] text-[#0b1d2d]"
            />
            {renderValidationIcon()}
          </View>
        </View>

        <LoadingButton title="Confirm" onPress={handleSend} />
      </View>
    </SafeAreaView>
  );
};

export default VerifyPhoneScreen;
