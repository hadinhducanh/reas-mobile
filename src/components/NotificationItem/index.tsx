import React from "react";
import { View, Text, Pressable } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const NotificationItem: React.FC = ({}) => {
  return (
    <View className="bg-white rounded-xl p-4 my-3 shadow-sm mx-5 py-8">
      <View className="flex-row items-center">
        <View className="w-6 h-6 bg-[#00B0B9] rounded-full items-center justify-center mr-2">
          <Icon name="checkmark" size={14} color="#ffffff" />
        </View>
        <Text className="text-base font-semibold text-[#0B1D2D]">
          Request For Exchange
        </Text>
      </View>

      <Text className="text-sm text-gray-600 my-5">
        xxx ask you to swap your xxx to xxx
      </Text>

      <View className="flex-row justify-between items-center">
        <Text className="text-sm text-gray-500">Feb 26 at 12:36 pm</Text>
        <Pressable>
          <Text className="text-sm font-semibold text-[#00B0B9]">
            Mark as read
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default NotificationItem;
