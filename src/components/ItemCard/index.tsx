import React from "react";
import { TouchableOpacity, View, Text, Image } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

interface Item {
  id: number;
  name: string;
  price: string;
  image: string;
  location: string;
  description: string;
  isFavorited: boolean;
}

interface ItemCardProps {
  item: Item;
  navigation?: any;
  toggleLike?: (itemId: number) => void;
  isSelected?: boolean;
  onSelect?: (itemId: number) => void;
  mode?: "default" | "selectable";
}

const ItemCard: React.FC<ItemCardProps> = ({
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
    } else if (navigation) {
      navigation.navigate("ItemDetail", { item });
    }
  };

  const handleIconPress = () => {
    if (mode === "default" && toggleLike) {
      toggleLike(item.id);
    } else if (mode === "selectable" && onSelect) {
      onSelect(item.id);
    }
  };

  return (
    <TouchableOpacity
      className={`bg-white rounded-lg p-3 mb-4 flex-col h-96 justify-between border-2 ${
        isSelected ? "border-[#00B0B9]" : "border-transparent"
      }`}
      onPress={handlePress}
    >
      {/* Phần ảnh */}
      <View className="flex-[2] bg-gray-100 rounded-t-lg relative">
        <Image
          source={{ uri: item.image }}
          className="w-full h-full object-cover rounded-t-lg"
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
          ) : (
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

      {/* Phần thông tin */}
      <View className="flex-1 flex-col justify-center">
        <View className="mt-2">
          <Text className="text-gray-500 text-base font-medium">
            {item.name}
          </Text>
          <Text className="text-gray-900 text-base font-semibold">
            {item.price} VND
          </Text>
          <Text className="text-gray-400 text-sm">
            {mode === "default"
              ? `14 mins ago | ${item.location}`
              : item.location}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ItemCard;
