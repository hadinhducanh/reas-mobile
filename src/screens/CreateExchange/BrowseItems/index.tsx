import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../navigation/AppNavigator";
import Header from "../../../components/Header";
import { Pressable, ScrollView, Text, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import ItemCard from "../../../components/CardItem";

type ItemType = {
  id: number;
  name: string;
  price: string;
  image: string;
  location: string;
  description: string;
  isFavorited: boolean;
};

const BrowseItems: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

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

  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleSelect = (itemId: number) => {
    setSelectedId((prev) => (prev === itemId ? null : itemId));
  };

  const rows = chunkArray(itemList, 2);

  return (
    <SafeAreaView className="flex-1 bg-[#F6F9F9]">
      <Header title="Browse my items" showOption={false} />
      <ScrollView>
        <View className="px-5 mt-3">
          {rows.map((row, rowIndex) => (
            <View key={rowIndex} className="flex flex-row mb-2 gap-x-2">
              {row.map((item) => (
                <View key={item.id} className="flex-1">
                  <ItemCard
                    item={item}
                    mode="selectable"
                    isSelected={selectedId === item.id}
                    onSelect={handleSelect}
                  />
                </View>
              ))}
              {/* Nếu hàng chỉ có 1 item, thêm View trống để lấp đầy không gian */}
              {row.length === 1 && <View className="flex-1" />}
            </View>
          ))}
        </View>
      </ScrollView>
      <View className="h-24 px-5 bg-white mt-auto rounded-t-xl shadow-xl flex-row items-center">
        <Pressable className="flex-1 bg-[#00B0B9] p-4 rounded-lg items-center flex-row justify-center active:bg-[rgb(0,176,185,0.9)]">
          <Text className="text-white font-bold ml-1">Select</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default BrowseItems;
