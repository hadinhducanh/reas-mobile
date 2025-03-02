import React, { useState } from "react";
import {
  View,
  ScrollView,
  TextInput,
  Image,
  Text,
  TouchableOpacity,
  Pressable,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { SafeAreaView } from "react-native-safe-area-context";
import ItemCard from "../../components/ItemCard";

type ItemType = {
  id: number;
  name: string;
  price: string;
  image: string;
  location: string;
  description: string;
  isFavorited: boolean;
};

// Định nghĩa kiểu cho navigation
type HomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ItemDetail"
>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const categories = [
    { id: 1, name: "Kitchen" },
    { id: 2, name: "Cleaning" },
    { id: 3, name: "Cooling" },
    { id: 4, name: "Electric" },
    { id: 5, name: "Lighting" },
    { id: 6, name: "Living room" },
    { id: 7, name: "Bedroom" },
    { id: 8, name: "Bathroom" },
  ];

  const [itemList, setItemList] = useState<ItemType[]>([
    {
      id: 1,
      name: "iPhone 20",
      price: "150.000",
      image: "https://via.placeholder.com/150",
      location: "Vinhome Grand Park",
      description: "Brand new iPhone 20 with latest features.",
      isFavorited: false,
    },
    {
      id: 2,
      name: "Samsung Galaxy S25",
      price: "150.000",
      image: "https://via.placeholder.com/150",
      location: "District 1, HCMC",
      description: "Latest Samsung flagship phone.",
      isFavorited: false,
    },
    {
      id: 3,
      name: "Samsung Galaxy S24",
      price: "150.000",
      image: "https://via.placeholder.com/150",
      location: "District 3, HCMC",
      description: "Latest Samsung flagship phone1.",
      isFavorited: false,
    },
  ]);

  // Hàm chunk mảng thành các nhóm nhỏ với mỗi nhóm có 2 item
  const chunkArray = (array: ItemType[], size: number) => {
    const chunked: ItemType[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunked.push(array.slice(i, i + size));
    }
    return chunked;
  };

  const toggleLike = (itemId: number) => {
    setItemList((prevList) =>
      prevList.map((item) =>
        item.id === itemId ? { ...item, isFavorited: !item.isFavorited } : item
      )
    );
  };

  // Chia itemList thành các hàng, mỗi hàng có 2 item
  const rows = chunkArray(itemList, 2);

  return (
    <SafeAreaView className="flex-1 bg-[#00B0B9]">
      <ScrollView className="bg-gray-100" showsVerticalScrollIndicator={false}>
        {/* Header với thanh tìm kiếm */}
        <View className="h-20 bg-[#00B0B9] w-full flex-row justify-between items-center px-5">
          <View className="flex-1 mr-5">
            <View className="bg-white rounded-xl flex-row items-center px-2">
              <View className="p-2 bg-[#00B0B9] rounded-xl flex items-center justify-center mr-3">
                <Icon name="search" size={20} color="#ffffff" />
              </View>
              <TextInput
                placeholder="Search..."
                placeholderTextColor="#738aa0"
                className="flex-1 text-lg text-gray-800 py-3"
              />
            </View>
          </View>
          <View className="flex-row">
            <Icon
              className="mr-1"
              name="notifications-outline"
              size={34}
              color="#ffffff"
            />
            <Pressable onPress={() => navigation.navigate("ChatDetails")}>
              <Icon name="chatbox-outline" size={34} color="#ffffff" />
            </Pressable>
          </View>
        </View>

        {/* Banner Image */}
        <View>
          <Image
            source={{
              uri: "https://res.cloudinary.com/dnslrwedn/image/upload/v1740407613/52c61b29-1200_628_1_deautx.png",
            }}
            className="w-full h-60"
          />
        </View>

        {/* Danh mục */}
        <View className="w-[90%] mx-auto relative rounded-lg mt-5 p-4 bg-white">
          <Text className="text-[#0b1d2d] text-lg font-bold capitalize mb-3">
            Explore Category
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex flex-row">
              {categories
                .reduce((columns: any[], _, i) => {
                  if (i % 2 === 0) {
                    columns.push(categories.slice(i, i + 2));
                  }
                  return columns;
                }, [])
                .map((col, colIndex) => (
                  <View
                    key={colIndex}
                    className="flex flex-col justify-between mx-6"
                  >
                    {col.map((category: any) => (
                      <View
                        key={category.id}
                        className="flex flex-col items-center mb-5"
                      >
                        <View className="p-8 bg-gray-300 rounded-lg"></View>
                        <Text className="text-sm font-medium text-black capitalize mt-1">
                          {category.name}
                        </Text>
                      </View>
                    ))}
                  </View>
                ))}
            </View>
          </ScrollView>
        </View>

        {/* Danh sách item mới */}
        <View className="mt-5 ml-5">
          <Text className="text-[#0b1d2d] text-xl font-bold">New items</Text>
        </View>

        <View className="px-5 mt-3">
          {rows.map((row, rowIndex) => (
            <View key={rowIndex} className="flex flex-row mb-2 gap-x-2">
              {row.map((item) => (
                <View key={item.id} className="flex-1">
                  <ItemCard
                    item={item}
                    navigation={navigation}
                    toggleLike={toggleLike}
                    mode="default"
                  />
                </View>
              ))}
              {/* Nếu hàng chỉ có 1 item, thêm View trống để lấp đầy không gian */}
              {row.length === 1 && <View className="flex-1" />}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
