import React from "react";
import { View, Text } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";

const OrderHistoryScreen: React.FC = () => {
  const handleSend = async () => {
    // Test Loading: delay 3 giây
    await new Promise((resolve) => setTimeout(resolve, 3000));
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f8f8f8]">
      {/* Header: Back Button */}
      <View className="relative flex-row items-center justify-center h-[65px]">
        <Text className="text-[18px] font-bold">Purchase order history</Text>
        <View className="absolute left-[20px] flex-row">
          <Icon name="chevron-back-outline" size={24} color="#0b1d2d" />
        </View>
      </View>

      {/* Container chính */}
      <View className="items-center mx-5 ">
        {/* Card đơn hàng 1 */}
        <View className="w-full bg-red-300 rounded-t-xl px-[20px] py-[15px] mt-[20px]">
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-baseline">
              <Text className="text-[14px] font-medium text-[#0b1d2d] mr-[4px]">
                Jul 28, 2023
              </Text>
              <Text className="text-[10px] font-normal text-[#738aa0]">
                at 8:32 pm
              </Text>
            </View>
            <Text className="text-[14px] font-medium text-[#0b1d2d]">
              $40.97
            </Text>
          </View>
          <View className="flex-row justify-between items-center mt-[10px]">
            <Text className="text-[12px] font-normal text-[#738aa0]">
              Order ID: 464654
            </Text>
            <View className="bg-[#00b0b9] rounded-[5px] py-[3px] px-[8px]">
              <Text className="text-[10px] font-medium text-white">
                Success
              </Text>
            </View>
          </View>
        </View>

        {/* Card chi tiết đơn hàng */}
        <View className="w-full bg-red-300 rounded-b-[10px] px-[20px] py-[20px] border-t border-t-[#738aa0]">
          <View className="flex-row justify-between mb-[15px]">
            <Text className="text-[10px] font-normal text-[#738aa0]">
              Roasted Tomato Soup
            </Text>
            <Text className="text-[10px] font-normal text-[#738aa0]">
              1 x $6.99
            </Text>
          </View>
          <View className="flex-row justify-between mb-[15px]">
            <Text className="text-[10px] font-normal text-[#738aa0]">
              Pan-Seared Salmon
            </Text>
            <Text className="text-[10px] font-normal text-[#738aa0]">
              2 x $15.99
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-[10px] font-normal text-[#738aa0]">
              Delivery
            </Text>
            <Text className="text-[10px] font-normal text-[#738aa0]">$2</Text>
          </View>
        </View>

        {/* Button của mỗi card */}
        <View className="flex-row justify-between w-full mt-3">
          <View className="w-[48%] border border-[#00b0b9] rounded-[10px] py-[13px] items-center justify-center">
            <Text className="text-[16px] font-bold text-[#00b0b9] text-center">
              Repeat Order
            </Text>
          </View>
          <View className="w-[48%] bg-[#00b0b9] rounded-[10px] py-[13px] items-center justify-center">
            <Text className="text-[16px] font-bold text-white text-center">
              Leave Review
            </Text>
          </View>
        </View>

        {/* Card đơn hàng 2 */}
        <View className="w-full bg-white rounded-[10px] px-[20px] py-[15px] mt-[20px]">
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-baseline">
              <Text className="text-[14px] font-medium text-[#0b1d2d] mr-[4px]">
                Jun 11, 2023
              </Text>
              <Text className="text-[10px] font-normal text-[#738aa0]">
                at 8:32 pm
              </Text>
            </View>
            <Text className="text-[14px] font-medium text-[#0b1d2d]">
              $34.3
            </Text>
          </View>
          <View className="flex-row justify-between items-center mt-[10px]">
            <Text className="text-[12px] font-normal text-[#738aa0]">
              Order ID: 457854
            </Text>
            <View className="bg-[#00b0b9] rounded-[5px] py-[3px] px-[8px]">
              <Text className="text-[10px] font-medium text-white">
                Success
              </Text>
            </View>
          </View>
        </View>

        {/* Card đơn hàng 3 (Canceled) */}
        <View className="w-full bg-white rounded-[10px] px-[20px] py-[15px] mt-[20px]">
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-baseline">
              <Text className="text-[14px] font-medium text-[#0b1d2d] mr-[4px]">
                May 22, 2023
              </Text>
              <Text className="text-[10px] font-normal text-[#738aa0]">
                at 8:32 pm
              </Text>
            </View>
            <Text className="text-[14px] font-medium text-[#0b1d2d]">
              $144.8
            </Text>
          </View>
          <View className="flex-row justify-between items-center mt-[10px]">
            <Text className="text-[12px] font-normal text-[#738aa0]">
              Order ID: 456631
            </Text>
            <View className="bg-[#f95555] rounded-[5px] py-[3px] px-[8px]">
              <Text className="text-[10px] font-medium text-white">
                Canceled
              </Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OrderHistoryScreen;
