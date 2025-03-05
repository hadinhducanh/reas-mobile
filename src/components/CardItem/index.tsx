import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

type ItemType = {
  id: number;
  name: string;
  price: number;
  image: string;
  location: string;
  description: string;
  onPress: () => void;
};

const CardItem: React.FC<ItemType> = ({ id, name, price, image, location, onPress }) => {
  return (
    <TouchableOpacity key={id} className="w-[48%] bg-white rounded-lg p-3 mb-4" onPress={onPress}>
      {/* Hình ảnh sản phẩm */}
      <View className="w-full aspect-[4/3] bg-white rounded-t-lg overflow-hidden relative">
        <Image source={{ uri: image }} className="w-full h-full" />
        <View className="absolute bottom-2 right-2">
          <Icon name="heart-outline" size={24} color="#ff0000" />
        </View>
      </View>

      {/* Thông tin sản phẩm */}
      <View className="mt-2 space-y-1">
        <Text className="text-gray-500 text-sm font-medium truncate">{name}</Text>
        <Text className="text-gray-900 text-base font-semibold">{price} VND</Text>
        <Text className="text-gray-400 text-xs">14 mins ago | {location}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default CardItem;
