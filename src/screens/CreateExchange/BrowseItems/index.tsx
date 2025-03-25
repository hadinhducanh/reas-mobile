import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../navigation/AppNavigator";
import Header from "../../../components/Header";
import { Pressable, ScrollView, Text, View } from "react-native";
import ItemCard from "../../../components/CardItem";
import { ItemResponse } from "../../../common/models/item";
import Icon from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

const BrowseItems: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { itemRecommnand } = useSelector((state: RootState) => state.item);
  const chunkArray = (array: ItemResponse[], size: number) => {
    const chunked: ItemResponse[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunked.push(array.slice(i, i + size));
    }
    return chunked;
  };

  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleSelect = (itemId: number) => {
    setSelectedId((prev) => (prev === itemId ? null : itemId));
  };

  const rows = chunkArray(itemRecommnand.content, 2);

  return (
    <SafeAreaView className="flex-1 bg-[#F6F9F9]">
      <Header title="Browse my items" showOption={false} />
      <Pressable
        className="flex-row justify-center items-center mx-5 bg-gray-100 border-[1px] border-gray-300 px-5 py-4 rounded-lg active:bg-gray-200"
        onPress={() => navigation.navigate("UploadScreen")}
      >
        <Text className="text-center text-lg text-gray-500 font-medium mr-1">
          Add a different item
        </Text>
        <Icon name="add" size={20} />
      </Pressable>
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
