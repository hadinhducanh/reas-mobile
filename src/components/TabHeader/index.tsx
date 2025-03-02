import React, { FC, useState } from "react";
import { ScrollView, View, Text, TouchableOpacity } from "react-native";

interface Tab {
  label: string;
  count: number;
}

const tabs: Tab[] = [
  { label: "Pending", count: 2 },
  { label: "Agreed", count: 1 },
  { label: "Rejected", count: 0 },
  { label: "Completed", count: 0 },
  { label: "Canceled", count: 0 },
];

const TabHeader: FC = () => {
  const [selectedTab, setSelectedTab] = useState<string>("Pending");

  const isSelected = (label: string) => selectedTab === label;

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className="flex-row">
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.7}
            onPress={() => setSelectedTab(tab.label)}
          >
            <View
              className={`px-5 h-[45px] justify-center items-center bg-[#f6f9f9] ${
                isSelected(tab.label)
                  ? "border-b-2 border-solid border-[#00b0b9]"
                  : "border-b border-solid border-gray-200"
              }`}
            >
              <Text
                className={`text-[13px] font-bold leading-[18px] text-center ${
                  isSelected(tab.label) ? "text-[#00b0b9]" : "text-[#738aa0]"
                }`}
                numberOfLines={1}
              >
                {`${tab.label} (${tab.count})`}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default TabHeader;
