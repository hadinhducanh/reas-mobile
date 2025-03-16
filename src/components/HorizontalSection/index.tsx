import React from "react";
import { View, Text } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import CardItem from "../CardItem";
import { ItemType, RootStackParamList } from "../../navigation/AppNavigator";
import { NavigationProp } from "@react-navigation/native";

interface HorizontalSectionProps {
  title?: string;
  data: ItemType[];
  toggleLike?: (itemId: number) => void;
  navigation: NavigationProp<RootStackParamList>;
}

const HorizontalSection: React.FC<HorizontalSectionProps> = ({
  title,
  data,
  toggleLike,
  navigation,
}) => {
  return (
    <View className="p-5">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="font-semibold text-xl">{title}</Text>
        <Text className="font-bold underline text-lg text-[#00B0B9]">
          Tất cả
        </Text>
      </View>
      <View className="py-1">
        <FlatList
          data={data}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View className="mr-2 w-48 h-100">
              <CardItem
                item={item}
                navigation={navigation}
                toggleLike={toggleLike}
              />
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default HorizontalSection;
