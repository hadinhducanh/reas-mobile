import React from "react";
import { View, Text } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import LoadingButton from "../../../components/LoadingButton";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../../components/Header";

const OrderHistoryEmpty: React.FC = () => {
  const handleSend = async () => {
    // Test Loading: delay 3 giây
    await new Promise((resolve) => setTimeout(resolve, 3000));
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f6f9f9]">
      {/* Header: Back Button */}
      <Header title="Purchase order history" />

      <View className="items-center h-full ">
        <View className="w-[90%] h-[80%] bg-white rounded-[10px] flex flex-col justify-center items-center">
          <View className="w-[266px] h-[266px] relative overflow-hidden mb-[20px] rounded-[10px]">
            <View className="absolute inset-0 bg-[#dfecec]" />
            <Icon
              name="bag-handle-outline"
              size={120}
              color="#ffffff"
              className="absolute top-1/2 left-1/2 -translate-x-[60px] -translate-y-[60px]"
            />
          </View>

          {/* Title */}
          <Text className="text-[22px] font-bold leading-[30.8px] text-[#0b1d2d] text-center mt-[20px]">
            No Order History Yet!
          </Text>

          {/* Subtitle */}
          <Text className="text-[16px] font-bold leading-[24px] text-[#738aa0] text-center mt-[10px]">
            It looks like your order history is {"\n"} empty. Place your order
            now to start {"\n"} building your history!
          </Text>
        </View>

        {/* Button */}
        <View className="w-[90%] mt-[20px]">
          <LoadingButton title="Explore Our Menu" onPress={handleSend} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OrderHistoryEmpty;
