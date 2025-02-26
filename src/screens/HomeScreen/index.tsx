import React from "react";
import { SafeAreaView, View, ScrollView, TextInput, Image, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/AppNavigator";


type ItemType = {
  id: number;
  name: string;
  price: string;
  image: string;
  location: string;
  description: string;
};

// Định nghĩa kiểu cho navigation
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "ItemDetail">;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  // Dữ liệu item mẫu
  const items: ItemType[] = [
    {
      id: 1,
      name: "iPhone 20",
      price: "12.79",
      image: "https://via.placeholder.com/150",
      location: "Vinhome Grand Park",
      description: "Brand new iPhone 20 with latest features.",
    },
    {
      id: 2,
      name: "Samsung Galaxy S25",
      price: "10.99",
      image: "https://via.placeholder.com/150",
      location: "District 1, HCMC",
      description: "Latest Samsung flagship phone.",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView>
        {/* Header với thanh tìm kiếm */}
        <View className="h-40 bg-[#00B0B9] w-full flex flex-row justify-between items-center px-5">
          <View className="flex-1 flex items-center mr-5">
            <View className="w-full h-12 bg-white rounded-lg flex flex-row items-center px-3 mt-7">
              <View className="w-8 h-8 bg-[#00B0B9] rounded-md flex items-center justify-center mr-3">
                <Icon name="search" size={20} color="#ffffff" />
              </View>
              <TextInput
                placeholder="Search..."
                placeholderTextColor="#738aa0"
                className="flex-1 text-sm text-gray-800"
              />
            </View>
          </View>
          <View className="flex flex-row space-x-3 ml-2 mt-7">
            <Icon name="notifications-outline" size={35} color="#ffffff" />
            <Icon name="chatbubble-outline" size={30} color="#ffffff" />
          </View>
        </View>

        {/* Banner Image */}
        <View>
          <Image
            source={{ uri: "https://res.cloudinary.com/dnslrwedn/image/upload/v1740407613/52c61b29-1200_628_1_deautx.png" }}
            className="w-full h-60"
          />
        </View>

        {/* Danh mục */}
        <View className="w-[90%] mx-auto relative rounded-lg mt-5 p-4 bg-white">
          <Text className="text-[#0b1d2d] text-sm font-bold capitalize mb-3">
            Explore Category
          </Text>
          <View className="flex flex-wrap justify-between">
            {[...Array(2)].map((_, rowIndex) => (
              <View key={rowIndex} className="flex flex-row justify-around w-full mb-4">
                {[...Array(3)].map((_, colIndex) => (
                  <View key={colIndex} className="flex flex-col items-center">
                    <View className="w-12 h-12 bg-gray-300 rounded-lg"></View>
                    <Text className="text-xs font-medium text-black capitalize mt-1">Category</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </View>

        {/* Danh sách item mới */}
        <View className="mt-5 ml-5">
          <Text className="text-[#0b1d2d] text-sm font-bold capitalize">
            New items
          </Text>
        </View>

        <View className="flex flex-row flex-wrap justify-between px-5 mt-3">
          {items.map((item) => (
            <TouchableOpacity
              key={item.id}
              className="w-[48%] bg-white rounded-lg shadow-md p-3 mb-4"
              onPress={() => navigation.navigate("ItemDetail", { item })}
            >
              {/* Image Container */}
              <View className="w-full aspect-[4/3] bg-white rounded-t-lg overflow-hidden relative">
                <Image source={{ uri: item.image }} className="w-full h-full" />
                <View className="absolute bottom-2 right-2">
                  <Icon name="heart-outline" size={24} color="#ff0000" />
                </View>
              </View>
              {/* Item Info */}
              <View className="mt-2 space-y-1">
                <Text className="text-gray-500 text-sm font-medium truncate">{item.name}</Text>
                <Text className="text-gray-900 text-base font-semibold">${item.price}</Text>
                <Text className="text-gray-400 text-xs">14 mins ago | {item.location}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
