import React from "react";
import { View, Text } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import LoadingButton from "../../../components/LoadingButton";
import { SafeAreaView } from "react-native-safe-area-context";

const ForgotPassSuccess: React.FC = () => {
  const handleSend = async () => {
    // Test Loading: delay 3 giây
    await new Promise((resolve) => setTimeout(resolve, 3000));
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f6f9f9] items-center">
      <View className="w-[90%] h-[90%] bg-white rounded-[10px] p-[20px] flex flex-col justify-center items-center">
        <View className="w-[266px] h-[266px] relative overflow-hidden mb-[20px] rounded-[10px]">
          <View className="absolute inset-0 bg-[#dfecec]" />
          <Icon
            name="key-outline"
            size={120}
            color="#ffffff"
            className="absolute top-1/2 left-1/2 -translate-x-[60px] -translate-y-[60px]"
          />
        </View>

        <Text className="text-[22px] font-bold leading-[30.8px] text-[#0b1d2d] text-center mt-[20px]">
          Your Password Has{"\n"}Been Reset!
        </Text>

        <Text className="text-[16px] font-bold leading-[24px] text-[#738aa0] text-center mt-[10px]">
          Log in with your new password to {"\n"} continue your journey.
        </Text>
      </View>

      <View className="w-[90%] mt-[20px]">
        <LoadingButton
          title="Done"
          onPress={handleSend}
          buttonClassName="py-4"
        />
      </View>
    </SafeAreaView>
  );
};

export default ForgotPassSuccess;
