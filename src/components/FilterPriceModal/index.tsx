import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import LoadingButton from "../LoadingButton";

interface FilterPriceModalProps {
  initialMinPrice: string;
  initialMaxPrice: string;
  onApply: (min: string, max: string) => void;
  onClear?: () => void;
}

const FilterPriceModal: React.FC<FilterPriceModalProps> = ({
  initialMinPrice,
  initialMaxPrice,
  onApply,
  onClear,
}) => {
  const [minValue, setMinValue] = useState<string>(initialMinPrice);
  const [maxValue, setMaxValue] = useState<string>(initialMaxPrice);

  useEffect(() => {
    setMinValue(initialMinPrice);
    setMaxValue(initialMaxPrice);
  }, [initialMinPrice, initialMaxPrice]);

  const handleApply = () => {
    onApply(minValue, maxValue);
  };

  const handleClear = () => {
    setMinValue("0");
    setMaxValue("0");
    onClear?.();
  };

  const formatPrice = (value: string): string => {
    const numericValue = value.replace(/\D/g, "");
    return numericValue
      ? parseInt(numericValue, 10).toLocaleString("en-US")
      : "";
  };
  return (
    <View className="bg-white rounded-t-2xl mt-auto px-5 pb-6">
      <View className="items-center mt-2 mb-3">
        <View className="w-20 h-1.5 bg-gray-400 rounded-full" />
      </View>

      <View className="flex-row items-center justify-between mb-4 px-2">
        <Text className="text-lg font-semibold text-black">Lọc theo giá</Text>
        <TouchableOpacity onPress={handleClear}>
          <Text className="text-base font-semibold text-[#00B0B9]">Clear</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row mt-3">
        <View className="flex-1 border border-[#00B0B9] rounded-lg px-2 pt-1">
          <Text className="text-base font-semibold text-[#00B0B9] mb-2">
            Min price
          </Text>
          <View className="flex-row items-center">
            <TextInput
              className="flex-1 text-base text-black"
              keyboardType="numeric"
              value={formatPrice(minValue)}
              onChangeText={(value) => {
                setMinValue(value.length === 0 ? "0" : value);
              }}
            />
            <Text className="text-gray-500 text-base ml-1">VND</Text>
          </View>
        </View>

        <View className="items-center flex-col justify-center">
          <View className="w-3 h-1 bg-[#00B0B9] mx-2 rounded-full" />
        </View>

        <View className="flex-1 border border-[#00B0B9] rounded-lg px-2 pt-1">
          <Text className="text-base font-semibold text-[#00B0B9] mb-2">
            Max price
          </Text>
          <View className="flex-row items-center">
            <TextInput
              className="flex-1 text-base text-black"
              keyboardType="numeric"
              value={formatPrice(maxValue)}
              onChangeText={(value) => {
                setMaxValue(value.length === 0 ? "0" : value);
              }}
            />
            <Text className="text-gray-500 text-base ml-1">VND</Text>
          </View>
        </View>
      </View>

      <View className="mt-5">
        <LoadingButton
          title="Apply"
          onPress={handleApply}
          buttonClassName={`py-4 `}
        />
      </View>
    </View>
  );
};

export default FilterPriceModal;
