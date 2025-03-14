import React, { useState } from "react";
import { View, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TabHeader from "../../../components/TabHeader";
import ExchangeCard from "../../../components/ExchangeCard";
import Header from "../../../components/Header";

interface ExchangeData {
  id: number;
  status: string;
}

const ExchangeHistory: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>("Pending");

  const data: ExchangeData[] = [
    { id: 1, status: "Pending" },
    { id: 2, status: "Approved" },
    { id: 3, status: "Completed" },
    { id: 4, status: "Rejected" },
    { id: 5, status: "Rejected" },
    { id: 6, status: "Canceled" },
  ];

  const tabs = [
    {
      label: "Pending",
      count: data.filter((item) => item.status === "Pending").length,
    },
    {
      label: "Approved",
      count: data.filter((item) => item.status === "Approved").length,
    },
    {
      label: "Rejected",
      count: data.filter((item) => item.status === "Rejected").length,
    },
    {
      label: "Completed",
      count: data.filter((item) => item.status === "Completed").length,
    },
    {
      label: "Canceled",
      count: data.filter((item) => item.status === "Canceled").length,
    },
  ];

  const filteredData = data.filter((item) => item.status === selectedStatus);

  const renderItem = ({ item }: { item: ExchangeData }) => (
    <ExchangeCard status={item.status} />
  );

  return (
    <SafeAreaView className="flex-1 bg-[#f6f9f9]">
      <View>
        <Header showBackButton={false} title="Exchange" showOption={false} />
        <TabHeader
          owner={false}
          tabs={tabs}
          selectedTab={selectedStatus}
          onSelectTab={setSelectedStatus}
        />
      </View>

      <FlatList
        showsVerticalScrollIndicator={false}
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </SafeAreaView>
  );
};

export default ExchangeHistory;
