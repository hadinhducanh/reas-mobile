import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

interface SortModalProps {
  selectedSort: string;
  onSelectSort: (value: string) => void;
}

const sortOptions = [
  { label: "Newest first", value: "new" },
  { label: "Price: Low to High", value: "lowPrice" },
  { label: "Price: High to Low", value: "highPrice" },
];

const SortModal: React.FC<SortModalProps> = ({
  selectedSort,
  onSelectSort,
}) => {
  return (
    <View className="bg-white rounded-t-2xl mt-auto px-5">
      <View className="items-center mt-2 mb-3">
        <View className="w-20 h-1.5 bg-gray-400 rounded-full" />
      </View>

      <Text className="text-center text-base font-semibold text-black py-3">
        Sắp xếp
      </Text>

      <View className="pb-4">
        {sortOptions.map((item) => {
          const isSelected = item.value === selectedSort;
          return (
            <TouchableOpacity
              key={item.value}
              onPress={() => onSelectSort(item.value)}
              className={`flex-row items-center justify-between px-4 py-3 mb-1 rounded-md ${
                isSelected ? "bg-[#E6FBFD]" : "bg-white"
              }`}
            >
              <Text
                className={`text-base ${
                  isSelected ? "text-[#00B0B9]" : "text-black"
                }`}
              >
                {item.label}
              </Text>
              {isSelected ? (
                <Icon name="radio-button-on" size={20} color="#00B0B9" />
              ) : (
                <Icon name="radio-button-off" size={20} color="#738AA0" />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default SortModal;
