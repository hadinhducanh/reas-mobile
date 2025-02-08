import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import LoadingButton from "../../../components/LoadingButton";

const ResetPasswordScreen: React.FC = () => {
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [confirmpasswordVisible, setConfirmpasswordVisible] = useState(true);

  const handleSend = async () => {
    // Test Loading: delay 3 giây
    await new Promise((resolve) => setTimeout(resolve, 3000));
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F6F9F9]">
      {/* Header: Back Button & Title */}
      <View className="relative flex-row items-center justify-center h-[50px] px-[20px] pt-[20px]">
        <View className="absolute left-[20px] top-[20px]">
          <Icon name="chevron-back-outline" size={24} color="#0b1d2d" />
        </View>
        <Text className="text-[18px] font-normal">Reset Password</Text>
      </View>

      {/* Form nằm ngay dưới Header */}
      <View className="bg-white rounded-tl-[10px] rounded-tr-[10px] mx-[20px] px-[20px] py-[20px] mt-[20px]">
        <Text className="text-[16px] text-[#738aa0] mt-[20px] mb-[30px] font-light">
          Enter new password and confirm.
        </Text>

        {/* Password Input */}
        <View className="w-full h-[50px] mb-[30px]">
          <View className="flex-row h-[50px] px-[6px] items-center bg-[#e8f3f6] rounded-[8px]">
            <View className="w-[40px] h-[40px] bg-[#00b0b9] rounded-[8px] justify-center items-center mr-[10px]">
              <Icon name="key-outline" size={20} color="#ffffff" />
            </View>
            <TextInput
              placeholder="Password"
              placeholderTextColor="#738aa0"
              secureTextEntry={passwordVisible}
              className="flex-1 text-[16px] text-[#0b1d2d]"
            />
            <Icon
              name={passwordVisible ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="black"
              onPress={() => setPasswordVisible(!passwordVisible)}
              style={{ marginLeft: 10 }}
            />
          </View>
        </View>

        {/* Confirm Password Input */}
        <View className="w-full h-[50px] mb-[30px]">
          <View className="flex-row h-[50px] px-[6px] items-center bg-[#e8f3f6] rounded-[8px]">
            <View className="w-[40px] h-[40px] bg-[#00b0b9] rounded-[8px] justify-center items-center mr-[10px]">
              <Icon name="key-outline" size={20} color="#ffffff" />
            </View>
            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor="#738aa0"
              secureTextEntry={confirmpasswordVisible}
              className="flex-1 text-[16px] text-[#0b1d2d]"
            />
            <Icon
              name={confirmpasswordVisible ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="black"
              onPress={() => setConfirmpasswordVisible(!confirmpasswordVisible)}
              style={{ marginLeft: 10 }}
            />
          </View>
        </View>

        <LoadingButton title="Change Password" onPress={handleSend} />
      </View>
    </SafeAreaView>
  );
};

export default ResetPasswordScreen;
