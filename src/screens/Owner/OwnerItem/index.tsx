import React, { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../../components/Header";
import Icon from "react-native-vector-icons/Ionicons";
import TabHeader from "../../../components/TabHeader";
import ItemCard from "../../../components/ItemCard";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../navigation/AppNavigator";

interface ExchangeData {
  id: number;
  status: string;
  // Các trường khác nếu cần
}

type ItemType = {
  id: number;
  name: string;
  price: string;
  image: string;
  location: string;
  description: string;
  isFavorited: boolean;
};

const OwnerItem: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>("Đang hiển thị");
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const data: ExchangeData[] = [
    { id: 1, status: "Đang hiển thị" },
    { id: 2, status: "Đang hiển thị" },
    { id: 3, status: "Đang hiển thị" },
    { id: 4, status: "Đã bán" },
    { id: 5, status: "Đang hiển thị" },
    { id: 6, status: "Đã bán" },
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

  const tabs = [
    {
      label: "Đang hiển thị",
      count: data.filter((item) => item.status === "Đang hiển thị").length,
    },
    {
      label: "Đã bán",
      count: data.filter((item) => item.status === "Đã bán").length,
    },
  ];

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

  const rows = chunkArray(itemList, 2);

  return (
    <SafeAreaView className="bg-[#00B0B9] flex-1" edges={["top"]}>
      <Header
        title="Ngọc Cường"
        backgroundColor="bg-[#00B0B9]"
        backIconColor="white"
        textColor="text-white"
        optionIconColor="white"
        owner={false}
      />
      <View className="flex-1 bg-[#F6F9F9]">
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Banner xám phía trên */}
          <View className="bg-gray-200 h-[120px]" />

          <View className="bg-white -mt-[50px] px-5 pt-5">
            <View className="w-[100px] h-[100px] bg-[#00B0B9] rounded-full border-[4px] border-white -mt-[50px]" />
            <View className="mt-2 pb-5">
              <Text className="text-lg font-bold">Ngọc Cường</Text>
              {/* Đánh giá sao */}
              <View className="flex-row items-center mt-1">
                <Text className="text-sm mr-1">5.0</Text>
                {[...Array(5)].map((_, idx) => (
                  <Icon key={idx} name="star" size={14} color="#FFA43D" />
                ))}
                <Pressable onPress={() => navigation.navigate("OwnerFeedback")}>
                  <Text className="ml-1 text-sm font-semibold text-[#00B0B9]">
                    (5 đánh giá)
                  </Text>
                </Pressable>
              </View>

              {/* Địa chỉ */}
              <View className="flex-row items-center mt-2">
                <Icon name="location-outline" size={20} color="#738AA0" />
                <Text className="text-base text-gray-500 ml-1">
                  Địa chỉ:
                  <Text className="text-black"> VinHome Grand Park, HCM</Text>
                </Text>
              </View>

              {/* Thời gian tham gia */}
              <View className="flex-row items-center mt-1">
                <Icon name="time-outline" size={20} color="#738AA0" />
                <Text className="text-base text-gray-600 ml-1">
                  Đã tham gia:
                  <Text className="text-black"> 2 tuần trước</Text>
                </Text>
              </View>
            </View>
          </View>

          <TabHeader
            owner={true}
            tabs={tabs}
            selectedTab={selectedStatus}
            onSelectTab={setSelectedStatus}
          />

          <View className="mt-3 mx-3">
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
      </View>
    </SafeAreaView>
  );
};

export default OwnerItem;
