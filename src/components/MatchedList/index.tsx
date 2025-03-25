import React, { useState } from "react";
import { View, Text, Pressable, Image, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import LoadingButton from "../LoadingButton";
import { ItemResponse } from "../../common/models/item";

interface MatchedListProps {
  items?: ItemResponse[];
  onSelectItem?: (item: ItemResponse) => void;
}

const MatchedList: React.FC<MatchedListProps> = ({
  items = [],
  onSelectItem,
}) => {
  const [expanded, setExpanded] = useState(true);

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
              <ScrollView
                style={{ maxHeight: 240 }}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
              >
                {items.map((item) => (
                  <View
                    key={item.id}
                    className="mb-3 flex-row justify-between w-full items-center bg-white rounded-lg p-3"
                  >
                    <View className="w-20 h-20 rounded-md overflow-hidden">
                      <Image
                        source={{
                          uri: item.imageUrl.split(", ")[0],
                        }}
                        className="w-full h-full object-contain"
                        resizeMode="contain"
                      />
                    </View>
                    <Text
                      className="text-gray-700 text-lg mx-3 font-medium flex-1"
                      numberOfLines={1}
                    >
                      {item.itemName}
                    </Text>

                    <View className="flex-1">
                      <LoadingButton
                        title="Select"
                        onPress={() => onSelectItem?.(item)}
                        buttonClassName="py-3 px-8"
                      />
                    </View>
                  </View>
                ))}
              </ScrollView>
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
