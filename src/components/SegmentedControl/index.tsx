// SegmentedControl.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface SegmentedControlProps {
  selected: string;
  onChange: (value: string) => void;
}

const segments = ["Weekly", "Monthly", "Yearly"];

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  selected,
  onChange,
}) => {
  return (
    <View className="flex-row bg-gray-200 p-1 rounded-xl w-full mb-4">
      {segments.map((segment) => {
        const isActive = segment === selected;
        return (
          <TouchableOpacity
            key={segment}
            onPress={() => onChange(segment)}
            className={`flex-1 items-center py-2 rounded-xl ${
              isActive ? "bg-white" : ""
            }`}
          >
            <Text
              className={isActive ? "text-blue-500 font-bold" : "text-gray-500"}
            >
              {segment}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
