import React, { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../../components/Header";
import ItemCard from "../../../components/CardItem";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../navigation/AppNavigator";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import Icon from "react-native-vector-icons/Ionicons";
import { getAllFavoriteItemsThunk } from "../../../redux/thunk/favoriteThunk";
import { FlatList } from "react-native-gesture-handler";
import { ItemResponse } from "../../../common/models/item";

const Favorite: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useDispatch<AppDispatch>();

  const { itemFavorite, loading } = useSelector(
    (state: RootState) => state.item
  );
  const { content, pageNo, last } = itemFavorite;

  useEffect(() => {
    dispatch(getAllFavoriteItemsThunk(0));
  }, []);

  const handleLoadMore = () => {
    if (!loading && !last) {
      dispatch(getAllFavoriteItemsThunk(pageNo + 1));
    }
  };

  const favoriteItems: ItemResponse[] = content.map((fav) => fav.item);

  const renderItem = ({
    item,
    index,
  }: {
    item: ItemResponse;
    index: number;
  }) => {
    const isSingle =
      favoriteItems.length % 2 === 1 && index === favoriteItems.length - 1;

    return (
      <View className={`${isSingle ? "w-1/2 px-1.5" : "flex-1 px-1.5"}`}>
        <ItemCard item={item} navigation={navigation} mode="default" />
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1" edges={["top"]}>
      <FlatList
        data={favoriteItems}
        numColumns={2}
        renderItem={renderItem}
        keyExtractor={(item, index) =>
          item ? item.id.toString() : `empty-${index}`
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={
          <View className="mb-5">
            <Header
              title="Favorites"
              backgroundColor="bg-[#00B0B9]"
              backIconColor="white"
              textColor="text-white"
              optionIconColor="white"
              showOption={false}
              onBackPress={() =>
                navigation.navigate("MainTabs", { screen: "Account" })
              }
            />
          </View>
        }
        ListEmptyComponent={() => {
          if (loading) {
            return (
              <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#00b0b9" />
              </View>
            );
          }

          return (
            <View className="flex-1 justify-center rounded-md p-5 items-center">
              <Icon name="remove-circle-outline" size={150} color="#00B0B9" />
              <Text className="text-xl font-bold text-[#0B1D2D] mb-2">
                Your Favorite List Is Empty!
              </Text>
              <Text className="text-base text-center text-gray-500">
                Your list of favorite is currently empty. Why not start adding
                items that you love?
              </Text>
            </View>
          );
        }}
        ListFooterComponent={
          !loading || favoriteItems.length === 0 ? null : (
            <ActivityIndicator size="large" color="#00b0b9" />
          )
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          backgroundColor: "#f3f4f6",
          flexGrow: 1,
          justifyContent:
            !loading && favoriteItems.length === 0 ? "center" : "flex-start",
        }}
      />
    </SafeAreaView>
  );
};

export default Favorite;
