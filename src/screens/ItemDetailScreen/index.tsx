import React from "react";
import { View, Text, Image, TouchableOpacity, SafeAreaView, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useRoute, RouteProp, useNavigation, NavigationProp } from "@react-navigation/native";

// Định nghĩa kiểu dữ liệu cho Item
type Item = {
  id: string;
  name: string;
  image: string;
  price: number;
  location: string;
  description: string;
};

// Định nghĩa kiểu dữ liệu cho navigation
type RootStackParamList = {
  ItemDetail: { item: Item };
};

const ItemDetailScreen: React.FC = () => {
  // Lấy dữ liệu từ route
  const route = useRoute<RouteProp<RootStackParamList, "ItemDetail">>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { item } = route.params;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        {/* Ảnh item */}
        <View className="relative">
          <Image source={{ uri: item.image }} className="w-full h-72" />
          
          {/* Nút quay lại */}
          <TouchableOpacity
            className="absolute top-5 left-5 bg-white p-2 rounded-full mt-10"
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={25} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Thông tin item */}
        <View className="p-5">
          <Text className="text-2xl font-bold text-gray-900">{item.name}</Text>
          <Text className="text-lg text-gray-600 mt-1">${item.price}</Text>

          {/* Địa điểm */}
          <View className="flex flex-row items-center mt-3">
            <Icon name="location-outline" size={18} color="#00B0B9" />
            <Text className="ml-1 text-gray-500 text-sm">{item.location}</Text>
          </View>

          {/* Mô tả */}
          <Text className="text-gray-700 mt-4 text-sm leading-5">{item.description}</Text>

          {/* Hành động */}
          <View className="mt-5 flex-row justify-between">
            {/* Nút Chat */}
            <TouchableOpacity className="flex-1 bg-[#00B0B9] p-3 rounded-lg mr-2 items-center">
              <Text className="text-white font-bold">Chat with Seller</Text>
            </TouchableOpacity>

            {/* Nút Yêu thích */}
            <TouchableOpacity className="bg-gray-200 p-3 rounded-lg items-center">
              <Icon name="heart-outline" size={24} color="#ff0000" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ItemDetailScreen;
