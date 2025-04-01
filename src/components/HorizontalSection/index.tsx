import React from "react";
import { View, Text, ActivityIndicator, FlatList } from "react-native";
import CardItem from "../CardItem";
import { ItemType, RootStackParamList } from "../../navigation/AppNavigator";
import { NavigationProp } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { ItemResponse } from "../../common/models/item";

interface HorizontalSectionProps {
  title?: string;
  data: ItemResponse[];
  toggleLike?: (itemId: number) => void;
  navigation: NavigationProp<RootStackParamList>;
}

const HorizontalSection: React.FC<HorizontalSectionProps> = ({
  title,
  data,
  toggleLike,
  navigation,
}) => {
  const { loading } = useSelector((state: RootState) => state.item);
  return (
    <View className="p-5">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="font-semibold text-xl">{title}</Text>
        {/* <Text className="font-bold underline text-lg text-[#00B0B9]">
          Tất cả
        </Text> */}
      </View>
      {loading && (
        <ActivityIndicator size="large" color="#00b0b9" className="mb-5" />
      )}
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
