import React, { useState } from "react";
import { View, Text, Pressable, Image } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

type ItemType = {
  id: number;
  name: string;
  price: string;
  image: string;
  location: string;
  description: string;
  isFavorited: boolean;
};

interface MatchedListProps {
  items?: ItemType[];
  onSelectItem?: (item: ItemType) => void;
}

const MatchedList: React.FC<MatchedListProps> = ({
  items = [],
  onSelectItem,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View>
      <Pressable
        onPress={() => setExpanded(!expanded)}
        className="w-full items-center bg-gray-100 border border-gray-300 px-5 py-4 rounded-lg "
      >
        <View className="flex-row justify-between items-center w-full">
          <Text className="text-center text-lg text-gray-500 font-medium">
            Suggested items (Matched their desired)
          </Text>
          <Icon name={expanded ? "remove" : "add"} size={20} />
        </View>

        {expanded && (
          <View className="mt-2 rounded-md">
            {items.length > 0 ? (
              items.map((item) => (
                <View
                  key={item.id}
                  className="mb-3 flex-row justify-between w-full items-center bg-white px-5 rounded-lg py-2"
                >
                  <View className="flex-row items-center">
                    <View className="w-20 h-20 rounded-md overflow-hidden">
                      <Image
                        source={{
                          uri: "https://goldsun.vn/pic/ProductItem/Noi-com-d_637625508222561223.jpg",
                        }}
                        className="w-full h-full object-cover"
                        resizeMode="cover"
                      />
                    </View>
                    <Text
                      className="text-gray-700 text-lg ml-2 w-40 font-medium"
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={{ flexShrink: 1 }}
                    >
                      {item.name}
                    </Text>
                  </View>

                  <Pressable
                    className="bg-[#00B0B9] py-3 px-8 rounded-xl active:bg-[rgb(0,176,185,0.5)]"
                    onPress={() => onSelectItem?.(item)}
                  >
                    <Text className="text-base text-white font-medium">
                      Select
                    </Text>
                  </Pressable>
                </View>
              ))
            ) : (
              <Text className="text-gray-500 text-center p-5 bg-gray-100 text-base font-light">
                No item matched
              </Text>
            )}
          </View>
        )}
      </Pressable>
    </View>
  );
};

export default MatchedList;
