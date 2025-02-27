import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import LoadingButton from "../../../components/LoadingButton";

const ForgotPass: React.FC = () => {
  const [email, setEmail] = useState("");

  const handleSend = async () => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
  };

  const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const renderValidationIcon = () => {
    if (email.trim().length === 0) {
      return null;
    }
    if (isValidEmail(email)) {
      return (
        <Icon
          name="checkmark-outline"
          size={20}
          color="#00b0b9"
          style={{ marginLeft: 10 }}
        />
      );
    } else {
      return (
        <Icon
          name="close-outline"
          size={20}
          color="red"
          style={{ marginLeft: 10 }}
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
        <Text className="text-[18px] font-normal">Forgot Password</Text>
      </View>

      {/* Form nằm ngay dưới Header */}
      <View className="bg-white rounded-tl-[10px] rounded-tr-[10px] mx-[20px] px-[20px] py-[20px] mt-[20px]">
        <Text className="text-[16px] text-[#738aa0] mt-[20px] mb-[30px] font-bold">
          Please enter your email address. You will receive a link to create a
          new password via email
        </Text>

        <View className="w-full h-[50px] mb-[30px]">
          <View className="flex-row h-[50px] px-[6px] items-center bg-[#e8f3f6] rounded-[8px]">
            <View className="w-[40px] h-[40px] bg-[#00b0b9] rounded-[8px] justify-center items-center mr-[10px]">
              <Icon name="mail-outline" size={20} color="#ffffff" />
            </View>
            <TextInput
              placeholder="Email"
              placeholderTextColor="#738aa0"
              className="flex-1 text-[16px] text-[#0b1d2d]"
              value={email}
              onChangeText={setEmail}
            />
            {renderValidationIcon()}
          </View>
        </View>

        <LoadingButton title="Send" onPress={handleSend} />
      </View>
    </SafeAreaView>
  );
};

export default ForgotPass;
