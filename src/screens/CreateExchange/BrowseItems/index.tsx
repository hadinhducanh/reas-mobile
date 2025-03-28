import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../navigation/AppNavigator";
import Header from "../../../components/Header";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import ItemCard from "../../../components/CardItem";
import { ItemResponse } from "../../../common/models/item";
import Icon from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import LoadingButton from "../../../components/LoadingButton";
import { useExchangeItem } from "../../../context/ExchangeContext";

const BrowseItems: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { itemSuggested } = useSelector((state: RootState) => state.item);
  const chunkArray = (array: ItemResponse[], size: number) => {
    const chunked: ItemResponse[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunked.push(array.slice(i, i + size));
    }
    return chunked;
  };
  const { exchangeItem, setExchangeItem } = useExchangeItem();
  const [selectedItem, setSelectedItem] = useState<ItemResponse | null>(
    exchangeItem.selectedItem
  );

  const handleSelectItem = (item: ItemResponse) => {
    setSelectedItem((prev) => (prev === item ? null : item));
  };

  const handleConfirm = () => {
    setExchangeItem({
      ...exchangeItem,
      selectedItem: selectedItem,
    });
    navigation.goBack();
  };

  const handleGoBack = () => {
    if (selectedItem === null) {
      setExchangeItem({
        ...exchangeItem,
        selectedItem: null,
      });
      navigation.goBack();
    } else {
      navigation.goBack();
    }
  };
  const rows = chunkArray(itemSuggested.content, 2);

  return (
    <SafeAreaView className="flex-1 bg-[#F6F9F9]">
      <Header
        title="Browse my items"
        showOption={false}
        onBackPress={handleGoBack}
      />
      <Pressable
        className="flex-row justify-center items-center mx-5 bg-gray-100 border-[1px] border-gray-300 px-5 py-4 rounded-lg active:bg-gray-200"
        onPress={() => navigation.navigate("UploadScreen")}
      >
        <Text className="text-center text-lg text-gray-500 font-medium mr-1">
          Add a different item
        </Text>
        <Icon name="add" size={20} />
      </Pressable>
      {itemSuggested.content.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Icon name="remove-circle-outline" size={70} color={"#00b0b9"} />
          <Text className="text-gray-500">No item in inventory</Text>
        </View>
      ) : (
        <>
          <ScrollView>
            <View className="px-5 mt-3">
              {rows.map((row, rowIndex) => (
                <View key={rowIndex} className="flex flex-row mb-2 gap-x-2">
                  {row.map((item) => (
                    <View key={item.id} className="flex-1">
                      <ItemCard
                        item={item}
                        mode="selectable"
                        isSelected={selectedItem?.id === item.id}
                        onSelect={() => handleSelectItem(item)}
                      />
                    </View>
                  ))}
                  {row.length === 1 && <View className="flex-1" />}
                </View>
              ))}
            </View>
          </ScrollView>
          <View className="h-24 px-5 bg-white mt-auto rounded-t-xl shadow-xl flex-row items-center">
            <LoadingButton
              disable={selectedItem === null}
              title="Confirm"
              buttonClassName={`p-4 ${
                selectedItem === null ? "bg-gray-300" : ""
              }`}
              onPress={handleConfirm}
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default BrowseItems;
