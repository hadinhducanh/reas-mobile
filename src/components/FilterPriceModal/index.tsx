import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import LoadingButton from "../LoadingButton";

interface FilterPriceModalProps {
  initialMinPrice: number;
  initialMaxPrice: number;
  onApply: (min: number, max: number) => void;
  onClear?: () => void;
}

const FilterPriceModal: React.FC<FilterPriceModalProps> = ({
  initialMinPrice,
  initialMaxPrice,
  onApply,
  onClear,
}) => {
  const [minValue, setMinValue] = useState<number>(initialMinPrice);
  const [maxValue, setMaxValue] = useState<number>(initialMaxPrice);

  useEffect(() => {
    setMinValue(initialMinPrice);
    setMaxValue(initialMaxPrice);
  }, [initialMinPrice, initialMaxPrice]);

  const handleApply = () => {
    onApply(minValue, maxValue);
  };

  const handleClear = () => {
    setMinValue(0);
    setMaxValue(0);
    onClear?.();
  };

  return (
    <View className="bg-white rounded-t-2xl mt-auto px-5 pb-6">
      <View className="items-center mt-2 mb-3">
        <View className="w-20 h-1.5 bg-gray-400 rounded-full" />
      </View>

      {/* Header */}
      <View className="flex-row items-center justify-between mb-4 px-2">
        <Text className="text-lg font-semibold text-black">Lọc theo giá</Text>
        <TouchableOpacity onPress={handleClear}>
          <Text className="text-base font-semibold text-[#00B0B9]">Clear</Text>
        </TouchableOpacity>
      </View>

      {/* Container cho Min price và Max price */}
      <View className="flex-row mt-3">
        {/* Min price */}
        <View className="flex-1 border border-[#00B0B9] rounded-lg px-2 pt-1">
          <Text className="text-base font-semibold text-[#00B0B9] mb-2">
            Min price
          </Text>
          <View className="flex-row items-center">
            <TextInput
              className="flex-1 text-base text-black"
              keyboardType="numeric"
              value={String(minValue)}
              onChangeText={(val) => {
                const numVal = parseInt(val, 10);
                setMinValue(isNaN(numVal) ? 0 : numVal);
              }}
            />
            <Text className="text-gray-500 text-base ml-1">đ</Text>
          </View>
        </View>

        {/* Đường kẻ dọc giữa */}
        <View className="items-center flex-col justify-center">
          <View className="w-3 h-1 bg-[#00B0B9] mx-2 rounded-full" />
        </View>

        {/* Max price - thêm padding p-3 để fit content giống Min price */}
        <View className="flex-1 border border-[#00B0B9] rounded-lg px-2 pt-1">
          <Text className="text-base font-semibold text-[#00B0B9] mb-2">
            Max price
          </Text>
          <View className="flex-row items-center">
            <TextInput
              className="flex-1 text-base text-black"
              keyboardType="numeric"
              value={String(maxValue)}
              onChangeText={(val) => {
                const numVal = parseInt(val, 10);
                setMaxValue(isNaN(numVal) ? 0 : numVal);
              }}
            />
            <Text className="text-gray-500 text-base ml-1">đ</Text>
          </View>
        </View>
      </View>

      {/* Nút Apply */}
      <View className="mt-5">
        <LoadingButton title="Apply" onPress={handleApply} />
      </View>
    </View>
  );
};

export default FilterPriceModal;
