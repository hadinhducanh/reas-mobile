import React from "react";
import { View, Text } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import LoadingButton from "../../../components/LoadingButton";
import { SafeAreaView } from "react-native-safe-area-context";

const OrderFailed: React.FC = () => {
  const handleSend = async () => {
    // Test Loading: delay 3 giây
    await new Promise((resolve) => setTimeout(resolve, 3000));
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f6f9f9] p-5 justify-center">
      {/* Phần noti chiếm toàn bộ không gian còn lại */}
      <View className="flex-1 bg-white rounded-[10px] items-center justify-center">
        {/* Image Container với background và icon ở giữa */}
        <View className="w-[266px] h-[266px] relative overflow-hidden mb-5 rounded-[10px]">
          <View className="absolute inset-0 bg-[#dfecec]" />
          <Icon
            name="close-outline"
            size={120}
            color="#ffffff"
            className="absolute top-1/2 left-1/2 -translate-x-[60px] -translate-y-[60px]"
          />
        </View>

        {/* Title */}
        <Text className="text-[22px] font-bold leading-[30.8px] text-[#0b1d2d] text-center mt-[10px]">
          Sorry! Your Order{"\n"}Has Failed!
        </Text>

        {/* Subtitle */}
        <Text className="text-[16px] font-bold leading-[24px] text-[#738aa0] text-center mt-[10px]">
          Something went wrong. Please try{"\n"}again to continue your order.
        </Text>
      </View>
      <View className="py-4">
        <LoadingButton title="Try again" onPress={handleSend} />
        <LoadingButton
          buttonClassName="mt-3 border-[1px] border-[#00b0b9] bg-white"
          textColor="text-[#00b0b9]"
          loadingColor="#00b0b9"
          title="Go back to the order"
          onPress={handleSend}
        />
      </View>
    </SafeAreaView>
  );
};

export default OrderFailed;
