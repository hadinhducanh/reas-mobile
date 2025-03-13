import React from "react";
import { TouchableOpacity, View, Text, Image } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { ItemType } from "../../navigation/AppNavigator";

interface CardItemProps {
  item: ItemType;
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
  const handlePress = () => {
    if (mode === "selectable" && onSelect) {
      onSelect(item.id);
    } else if (mode === "default") {
      navigation.navigate("ItemDetails", { itemId: item.id });
    } else {
      navigation.navigate("ItemPreview", { itemId: item.id });
    }
  };

  const handleIconPress = () => {
    if (mode === "default" && toggleLike) {
      toggleLike(item.id);
    } else if (mode === "selectable" && onSelect) {
      onSelect(item.id);
    }
  };

  const formatPrice = (price: number): string => {
    return price.toLocaleString("vi-VN");
  };

  return (
    <TouchableOpacity
      className={`bg-white rounded-lg p-3 mb-4 border-2 ${
        isSelected ? "border-[#00B0B9]" : "border-transparent"
      }`}
      onPress={handlePress}
    >
      <View className="bg-gray-100 rounded-t-lg relative">
        <Image
          source={{ uri: item.images }}
          className="w-full h-56 object-cover rounded-t-lg"
        />

        <TouchableOpacity
          onPress={handleIconPress}
          activeOpacity={0.7}
          className="absolute bottom-2 right-2"
        >
          {mode === "default" ? (
            <Icon
              name={item.isFavorited ? "heart" : "heart-outline"}
              size={24}
              color="#ff0000"
            />
          ) : mode === "selectable" ? (
            <Icon
              name={
                isSelected ? "checkmark-circle" : "checkmark-circle-outline"
              }
              size={24}
              color={isSelected ? "#00B0B9" : "#cccccc"}
            />
          ) : (
            ""
          )}
        </TouchableOpacity>
      </View>

      <View className="mt-3 py-3">
        <Text className="text-gray-500 text-base font-medium" numberOfLines={1}>
          {item.name}
        </Text>
        <Text className="text-gray-900 text-base font-semibold">
          {formatPrice(item.price)} VND
        </Text>
        {mode === "default" && (
          <Text className="text-gray-400 text-sm" numberOfLines={1}>
            14 mins ago | {item.location}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default CardItem;
