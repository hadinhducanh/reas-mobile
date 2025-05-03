import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../navigation/AppNavigator";
import Header from "../../../components/Header";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import ItemCard from "../../../components/CardItem";
import { ItemResponse } from "../../../common/models/item";
import Icon from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import LoadingButton from "../../../components/LoadingButton";
import { useExchangeItem } from "../../../context/ExchangeContext";
import { getAllItemOfCurrentUserByStatusThunk } from "../../../redux/thunk/itemThunks";
import { StatusItem } from "../../../common/enums/StatusItem";
import { FlatList } from "react-native-gesture-handler";

const BrowseItems: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { itemByStatus, loading } = useSelector(
    (state: RootState) => state.item
  );
  const { content, pageNo, last } = itemByStatus;
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

  useEffect(() => {
    dispatch(
      getAllItemOfCurrentUserByStatusThunk({
        pageNo: 0,
        statusItem: StatusItem.AVAILABLE,
      })
    );
  }, [dispatch]);

  const handleLoadMore = () => {
    if (!loading && !last) {
      dispatch(
        getAllItemOfCurrentUserByStatusThunk({
          pageNo: pageNo + 1,
          statusItem: StatusItem.AVAILABLE,
        })
      );
    }
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

  const ListHeaderComponent = (
    <>
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
    </>
  );

  const renderItem = ({
    item,
    index,
  }: {
    item: ItemResponse;
    index: number;
  }) => {
    const isSingle = content.length % 2 === 1 && index === content.length - 1;

    return (
      <View className={`${isSingle ? "w-1/2 px-1.5" : "flex-1 px-1.5"}`}>
        <ItemCard
          item={item}
          mode="selectable"
          isSelected={selectedItem?.id === item.id}
          onSelect={() => handleSelectItem(item)}
        />
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F6F9F9]">
      <FlatList
        data={content}
        numColumns={2}
        renderItem={renderItem}
        keyExtractor={(item, index) =>
          item ? item.id.toString() : `empty-${index}`
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={() => {
          if (loading) {
            return (
              <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#00b0b9" />
              </View>
            );
          }

          return (
            <View className="flex-1 justify-center items-center">
              <Icon name="remove-circle-outline" size={70} color={"#00b0b9"} />
              <Text className="text-gray-500">No item in inventory</Text>
            </View>
          );
        }}
        ListFooterComponent={
          !loading || content.length === 0 ? null : (
            <ActivityIndicator size="large" color="#00b0b9" className="my-4" />
          )
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          backgroundColor: "#f3f4f6",
          flexGrow: 1,
        }}
      />
      <View className="h-24 px-5 bg-white mt-auto rounded-t-xl shadow-xl flex-row items-center">
        <LoadingButton
          disable={selectedItem === null}
          title="Confirm"
          buttonClassName={`p-4 ${selectedItem === null ? "bg-gray-300" : ""}`}
          onPress={handleConfirm}
        />
      </View>
    </SafeAreaView>
  );
};

export default BrowseItems;
