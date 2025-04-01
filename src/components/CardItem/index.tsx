import React, { useCallback, useEffect, useMemo } from "react";
import { TouchableOpacity, View, Text, Image } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import dayjs from "dayjs";
import { ItemResponse } from "../../common/models/item";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

interface CardItemProps {
  item: ItemResponse;
  navigation?: any;
  toggleLike?: (itemId: number) => void;
  isSelected?: boolean;
  onSelect?: (itemId: number) => void;
  mode?: "default" | "selectable" | "management";
}

const CardItem: React.FC<CardItemProps> = ({
  item,
  navigation,
  toggleLike,
  isSelected = false,
  onSelect,
  mode = "default",
}) => {
  const { user } = useSelector((state: RootState) => state.auth);

  const handlePress = useCallback(() => {
    if (mode === "selectable" && onSelect) {
      onSelect(item.id);
    } else if (mode === "default") {
      if (user?.id === item.owner.id) {
        navigation.navigate("ItemPreview", { itemId: item.id });
      } else {
        navigation.navigate("ItemDetails", { itemId: item.id });
      }
    } else {
      navigation.navigate("ItemPreview", { itemId: item.id });
    }
  }, [mode, onSelect, item.id, navigation]);

  const handleIconPress = useCallback(() => {
    if (mode === "default" && toggleLike) {
      toggleLike(item.id);
    } else if (mode === "selectable" && onSelect) {
      onSelect(item.id);
    }
  }, [mode, onSelect, item.id, toggleLike]);

  const formatPrice = useCallback((price: number): string => {
    return price.toLocaleString("vi-VN");
  }, []);

  const imageArray = useMemo(() => {
    return item?.imageUrl ? item.imageUrl.split(", ") : [];
  }, [item.imageUrl]);

  const formatRelativeTime = useCallback(
    (timeStr: Date | undefined): string => {
      const givenTime = dayjs(timeStr);
      const now = dayjs();
      const diffInSeconds = now.diff(givenTime, "second");
      if (diffInSeconds < 60) {
        return `${diffInSeconds} seconds ago`;
      } else if (diffInSeconds < 3600) {
        const minutes = now.diff(givenTime, "minute");
        return `${minutes} minutes ago`;
      } else if (diffInSeconds < 86400) {
        const hours = now.diff(givenTime, "hour");
        return `${hours} hours ago`;
      } else if (diffInSeconds < 86400 * 30) {
        const days = now.diff(givenTime, "day");
        return `${days} days ago`;
      } else if (diffInSeconds < 86400 * 30 * 12) {
        const months = now.diff(givenTime, "month");
        return `${months} months ago`;
      } else {
        const years = now.diff(givenTime, "year");
        return `${years} years ago`;
      }
    },
    []
  );

  return (
    <TouchableOpacity
      className={`bg-white rounded-lg p-3 mb-4 border-2 ${
        isSelected ? "border-[#00B0B9]" : "border-transparent"
      }`}
      onPress={handlePress}
    >
      <View className="bg-white rounded-t-lg relative">
        <View className="w-full h-56">
          <Image
            source={{ uri: imageArray[0] }}
            className="w-full h-full object-contain"
            resizeMode="contain"
          />
        </View>

        <TouchableOpacity
          onPress={handleIconPress}
          activeOpacity={0.7}
          className="absolute bottom-2 right-2"
        >
          {mode === "selectable" && (
            <Icon
              name={
                isSelected ? "checkmark-circle" : "checkmark-circle-outline"
              }
              size={24}
              color={isSelected ? "#00B0B9" : "#cccccc"}
            />
          )}
        </TouchableOpacity>
      </View>

      <View className="mt-3 py-3">
        <Text className="text-gray-500 text-base font-medium" numberOfLines={1}>
          {item.itemName}
        </Text>
        <Text className="text-gray-900 text-base font-semibold">
          {item.price === 0 ? "Free" : formatPrice(item.price) + " VND"}
        </Text>
        {mode === "default" && (
          <Text className="text-gray-400 text-sm" numberOfLines={1}>
            {formatRelativeTime(item.approvedTime)} | {item.owner.fullName}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(CardItem);
