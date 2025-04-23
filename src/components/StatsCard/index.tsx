// StatsCard.tsx
import React from "react";
import { View, Text } from "react-native";

interface StatsCardProps {
  value: string;
  label: string;
  percentage?: string;
  isPositive?: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  value,
  label,
  percentage,
  isPositive = true,
}) => {
  return (
    <View className="bg-white rounded-xl p-4 w-[48%] mb-4">
      <Text className="text-xl font-bold">{value}</Text>
      <Text className="text-gray-500">{label}</Text>
      <Text className={`${isPositive ? "text-green-500" : "text-red-500"}`}>
        {percentage}
      </Text>
    </View>
  );
};
