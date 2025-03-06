import React, { useState } from "react";
import { FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import TabHeader from "../../components/TabHeader";
import { ItemType, RootStackParamList } from "../../navigation/AppNavigator";
import CardItem from "../../components/CardItem";
import { NavigationProp, useNavigation } from "@react-navigation/native";

interface ItemManageTabData {
  id: number;
  status: string;
}
const ItemManagement: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [selectedStatus, setSelectedStatus] = useState<string>("Approved");

  const data: ItemManageTabData[] = [
    { id: 1, status: "Approved" },
    { id: 2, status: "Expired" },
    { id: 3, status: "Rejected" },
    { id: 4, status: "Pending" },
    { id: 5, status: "No Longer For Exchange" },
    { id: 6, status: "Unavailable" },
  ];

  const tabs = [
    {
      label: "Approved",
      count: data.filter((item) => item.status === "Approved").length,
    },
    {
      label: "Expired",
      count: data.filter((item) => item.status === "Expired").length,
    },
    {
      label: "Rejected",
      count: data.filter((item) => item.status === "Rejected").length,
    },
    {
      label: "Pending",
      count: data.filter((item) => item.status === "Pending").length,
    },
    {
      label: "No Longer For Exchange",
      count: data.filter((item) => item.status === "No Longer For Exchange")
        .length,
    },
    {
      label: "Unavailable",
      count: data.filter((item) => item.status === "Unavailable").length,
    },
  ];

  const [itemList, setItemList] = useState<ItemType[]>([
    {
      id: 1,
      name: "iPhone 20",
      price: 30000000,
      images: "https://via.placeholder.com/150",
      location: "Vinhome Grand Park",
      description: "Brand new iPhone 20 with latest features.",
      isFavorited: false,
    },
    {
      id: 2,
      name: "Samsung Galaxy S25",
      price: 30000000,
      images: "https://via.placeholder.com/150",
      location: "District 1, HCMC",
      description: "Latest Samsung flagship phone.",
      isFavorited: false,
    },
    {
      id: 3,
      name: "Samsung Galaxy S24",
      price: 30000000,
      images: "https://via.placeholder.com/150",
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

  const rows = chunkArray(itemList, 2);

  return (
    <SafeAreaView className="flex-1 bg-[#f6f9f9]">
      <View>
        <Header showBackButton={false} title="Your items" showOption={false} />
        <TabHeader
          owner={false}
          tabs={tabs}
          selectedTab={selectedStatus}
          onSelectTab={setSelectedStatus}
        />
      </View>
      <View className="mx-5">
        <View className="mt-3">
          {rows.map((row, rowIndex) => (
            <View key={rowIndex} className="flex flex-row mb-2 gap-x-2">
              {row.map((item) => (
                <View key={item.id} className="flex-1">
                  <CardItem
                    item={item}
                    navigation={navigation}
                    toggleLike={toggleLike}
                    mode="management"
                  />
                </View>
              ))}
              {/* Nếu hàng chỉ có 1 item, thêm View trống để lấp đầy không gian */}
              {row.length === 1 && <View className="flex-1" />}
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ItemManagement;
