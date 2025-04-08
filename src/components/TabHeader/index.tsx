import React, { FC } from "react";
import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { StatusExchange } from "../../common/enums/StatusExchange";
import { StatusItem } from "../../common/enums/StatusItem";

interface Tab {
  header?: string;
  label: StatusExchange | StatusItem | string | number;
  count: number;
}

interface TabHeaderProps {
  tabs: Tab[];
  selectedTab: string;
  onSelectTab: (label: StatusExchange | StatusItem | string | number) => void;
  owner?: boolean;
  ownerFeedback?: boolean;
}

const TabHeader: FC<TabHeaderProps> = ({
  tabs,
  selectedTab,
  onSelectTab,
  owner = false,
  ownerFeedback = false,
}) => {
  const isSelected = (label: StatusExchange | StatusItem | string | number) =>
    selectedTab === label;

  if (ownerFeedback) {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row my-2">
          {tabs.map((tab, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.7}
              onPress={() => onSelectTab(tab.label)}
            >
              <View
                className="px-5 py-5 flex-row justify-center items-center bg-white"
                style={{
                  borderBottomWidth: isSelected(tab.label) ? 2 : 1,
                  borderBottomColor: isSelected(tab.label)
                    ? "#00b0b9"
                    : "#d1d5db",
                }}
              >
                <Text
                  className={`text-[13px] font-bold leading-[18px] text-center ${
                    isSelected(tab.label) ? "text-[#00b0b9]" : "text-[#738aa0]"
                  }`}
                  numberOfLines={1}
                >
                  {`${tab.label}`}
                </Text>
                <Icon name="star" size={16} color="#FFA43D" className="mx-1" />
                {tab.count !== undefined && (
                  <Text
                    className={`text-[13px] font-bold leading-[18px] text-center ${
                      isSelected(tab.label)
                        ? "text-[#00b0b9]"
                        : "text-[#738aa0]"
                    }`}
                    numberOfLines={1}
                  >
                    {`(${tab.count})`}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    );
  } else if (owner) {
    return (
      <View className="flex-row w-full my-2">
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.7}
            onPress={() => onSelectTab(tab.label)}
            className="flex-1"
          >
            <View
              className="h-[45px] justify-center items-center bg-white"
              style={{
                borderBottomWidth: isSelected(tab.label) ? 2 : 1,
                borderBottomColor: isSelected(tab.label)
                  ? "#00b0b9"
                  : "#d1d5db",
              }}
            >
              <Text
                className={`text-[13px] font-bold leading-[18px] text-center ${
                  isSelected(tab.label) ? "text-[#00b0b9]" : "text-[#738aa0]"
                }`}
                numberOfLines={1}
              >
                {`${tab.header ? tab.header : tab.label} (${tab.count})`}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  } else {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row my-2">
          {tabs.map((tab, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.7}
              onPress={() => onSelectTab(tab.label)}
            >
              <View
                className="px-5 h-[45px] justify-center items-center"
                style={{
                  borderBottomWidth: isSelected(tab.label) ? 2 : 1,
                  borderBottomColor: isSelected(tab.label)
                    ? "#00b0b9"
                    : "#d1d5db",
                }}
              >
                <Text
                  className={`text-[13px] font-bold leading-[18px] text-center ${
                    isSelected(tab.label) ? "text-[#00b0b9]" : "text-[#738aa0]"
                  }`}
                  numberOfLines={1}
                >
                  {`${tab.header ? tab.header : tab.label} (${tab.count})`}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    );
  }
};

export default TabHeader;
