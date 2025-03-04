import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import ItemCard from "../../components/ItemCard";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/AppNavigator";

type ItemType = {
  id: number;
  name: string;
  price: string;
  image: string;
  location: string;
  description: string;
  isFavorited: boolean;
};

const Favorite: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const isEmpty = true;

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
    <SafeAreaView className="flex-1 bg-[#00B0B9]" edges={["top"]}>
      {/* Header cố định trên cùng */}
      <Header
        title="Favorites"
        backgroundColor="bg-[#00B0B9]"
        backIconColor="white"
        textColor="text-white"
        optionIconColor="white"
        showOption={false}
      />

      {/* Phần còn lại của màn hình */}
      <View className="flex-1 bg-[#F6F9F9]">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Nếu isEmpty = true, hiển thị Empty UI */}
          {isEmpty ? (
            <View className="flex-1 px-5 justify-center items-center">
              {/* Card trắng chứa nội dung empty */}
              <View className="w-full bg-white rounded-md p-4 items-center">
                {/* Placeholder ảnh */}
                <View className="w-full h-96 bg-[#E1EEF1] rounded-md mb-6" />
                <Text className="text-xl font-bold text-[#0B1D2D] mb-2">
                  Your Favorite List Is Empty!
                </Text>
                <Text className="text-base text-center text-gray-500">
                  Your list of favorite dishes is currently empty. Why not start
                  adding dishes that you love?
                </Text>
              </View>

              {/* Nếu muốn hiển thị "New items" phía dưới khi list rỗng */}
              <View className="mt-5 w-full">
                <Text className="text-[#0b1d2d] text-xl font-bold mb-3">
                  New items
                </Text>
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
                    {row.length === 1 && <View className="flex-1" />}
                  </View>
                ))}
              </View>
            </View>
          ) : (
            // Nếu isEmpty = false, hiển thị danh sách item
            <View className="flex-1 px-5">
              <View className="mt-3">
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
                    {row.length === 1 && <View className="flex-1" />}
                  </View>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Favorite;
