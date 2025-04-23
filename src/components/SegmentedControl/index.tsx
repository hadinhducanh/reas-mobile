// SegmentedControl.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface SegmentedControlProps {
  selected: string;
  onChange: (value: string) => void;
}

const segments = ["Monthly"];

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  selected,
  onChange,
}) => {
  return (
    <View className="flex-row bg-white p-1 rounded-xl w-full mb-4">
      {segments.map((segment) => {
        return (
          <TouchableOpacity
            key={segment}
            onPress={() => onChange(segment)}
            className={`flex-1 items-center py-2 rounded-xl`}
          >
            <Text className="text-[#00B0B9] font-semibold">{segment}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
