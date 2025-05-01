import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../../components/Header";
import ItemCard from "../../../components/CardItem";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../navigation/AppNavigator";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import Icon from "react-native-vector-icons/Ionicons";
import { ItemResponse } from "../../../common/models/item";
import { FavoriteResponse } from "../../../common/models/favorite";
import { getAllFavoriteItemsThunk } from "../../../redux/thunk/favoriteThunk";

const Favorite: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useDispatch<AppDispatch>();

  const { itemFavorite, loading } = useSelector(
    (state: RootState) => state.item
  );
  const { content, pageNo, last } = itemFavorite;

  const chunkArray = (array: FavoriteResponse[], size: number) => {
    const chunked: FavoriteResponse[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunked.push(array.slice(i, i + size));
    }
    return chunked;
  };

  const rows = chunkArray(content, 2);

  useEffect(() => {
    dispatch(getAllFavoriteItemsThunk(0));
  }, []);

  const handleLoadMore = () => {
    if (!loading && !last) {
      dispatch(getAllFavoriteItemsThunk(pageNo + 1));
    }
  };

  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }: any) => {
    const paddingToBottom = 80;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  return (
    <SafeAreaView className="flex-1" edges={["top"]}>
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

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#00b0b9" />
        </View>
      ) : (
        <>
          {content.length === 0 ? (
            <View className="flex-1 justify-center bg-white rounded-md p-5 items-center">
              <Icon name="remove-circle-outline" size={180} color="#00B0B9" />
              <Text className="text-xl font-bold text-[#0B1D2D] mb-2">
                Your Favorite List Is Empty!
              </Text>
              <Text className="text-base text-center text-gray-500">
                Your list of favorite is currently empty. Why not start adding
                items that you love?
              </Text>
            </View>
          ) : (
            <ScrollView
              className="flex-1 bg-gray-100"
              contentContainerStyle={{ flexGrow: 1 }}
              showsVerticalScrollIndicator={false}
              onScroll={({ nativeEvent }) => {
                if (isCloseToBottom(nativeEvent)) {
                  handleLoadMore();
                }
              }}
              scrollEventThrottle={100}
            >
              <View className="flex-1 px-5">
                <View className="mt-3">
                  {rows.map((row, rowIndex) => (
                    <View key={rowIndex} className="flex flex-row mb-2 gap-x-2">
                      {row.map((item) => (
                        <View key={item.id} className="flex-1">
                          <ItemCard
                            item={item.item}
                            navigation={navigation}
                            // toggleLike={toggleLike}
                            mode="default"
                          />
                        </View>
                      ))}
                      {row.length === 1 && <View className="flex-1" />}
                    </View>
                  ))}
                </View>
              </View>
            </ScrollView>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

export default Favorite;
