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
  const [error, setError] = useState<string>("");
  const [isInvalid, setIsInvalid] = useState<boolean>(false);

  useEffect(() => {
    setMinValue(minValue);
    setMaxValue(maxValue);
  }, [minValue, maxValue]);

  const handleApply = () => {
    onApply(minValue, maxValue);
  };

  const handleClear = () => {
    setMinValue("");
    setMaxValue("");
    onClear?.();
  };

  const formatPrice = (value: string): string => {
    const numericValue = value.replace(/\D/g, "");
    return numericValue
      ? parseInt(numericValue, 10).toLocaleString("en-US")
      : "";
  };

  useEffect(() => {
    const minPriceValue = parseInt(minValue.replace(/,/g, ""), 10) || 0;
    const maxPriceValue = parseInt(maxValue.replace(/,/g, ""), 10) || 0;

    if (minPriceValue > maxPriceValue && maxPriceValue !== 0) {
      setError("Min price cannot be greater than Max price");
      setIsInvalid(true);
    } else if (minValue.length === 0 && maxValue.length === 0) {
      setIsInvalid(true);
    } else {
      setError("");
      setIsInvalid(false);
    }
  }, [minValue, maxValue]);
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
          <View className="flex-row py-2 items-center">
            <TextInput
              placeholder="0"
              placeholderTextColor="#d1d5db"
              className="flex-1 text-base text-black"
              keyboardType="numeric"
              value={formatPrice(minValue)}
              onChangeText={(value) => {
                setMinValue(value.length === 0 ? "" : value);
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
          <View className="flex-row py-2 items-center">
            <TextInput
              placeholder="0"
              placeholderTextColor="#d1d5db"
              className="flex-1 text-base text-black"
              keyboardType="numeric"
              value={formatPrice(maxValue)}
              onChangeText={(value) => {
                setMaxValue(value.length === 0 ? "" : value);
              }}
            />
            <Text className="text-gray-500 text-base ml-1">VND</Text>
          </View>
        </View>
      </View>

      {error ? (
        <Text className="text-red-500 text-sm mt-2">{error}</Text>
      ) : null}

      <View className="mt-5">
        <LoadingButton
          title="Apply"
          onPress={handleApply}
          buttonClassName={`py-4 mt-4 ${isInvalid ? "bg-gray-200" : ""}`}
          disable={isInvalid}
        />
      </View>
    </View>
  );
};

export default FilterPriceModal;
