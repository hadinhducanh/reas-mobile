import React, { useCallback, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import TabHeader from "../../components/TabHeader";
import { RootStackParamList } from "../../navigation/AppNavigator";
import CardItem from "../../components/CardItem";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { ItemResponse } from "../../common/models/item";
import { StatusItem } from "../../common/enums/StatusItem";
import {
  getAllItemOfCurrentUserByStatusThunk,
  getItemCountsOfCurrentUserThunk,
} from "../../redux/thunk/itemThunks";
import Icon from "react-native-vector-icons/Ionicons";
import { FlatList } from "react-native-gesture-handler";

const statusItems = [
  { label: "AVAILABLE", value: StatusItem.AVAILABLE },
  {
    label: "EXPIRED",
    value: StatusItem.EXPIRED,
  },
  { label: "PENDING", value: StatusItem.PENDING },
  { label: "REJECTED", value: StatusItem.REJECTED },
  {
    label: "NO_LONGER_FOR_EXCHANGE",
    value: StatusItem.NO_LONGER_FOR_EXCHANGE,
  },
  { label: "EXCHANGED", value: StatusItem.EXCHANGED },
  { label: "IN_EXCHANGE", value: StatusItem.IN_EXCHANGE },
];

const ItemManagement: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useDispatch<AppDispatch>();

  const [selectedStatus, setSelectedStatus] = useState<StatusItem>(
    StatusItem.AVAILABLE
  );
  const { itemByStatus, countsOfCurrentUser, loading } = useSelector(
    (state: RootState) => state.item
  );

  const { content, pageNo, last } = itemByStatus;

  const getStatusItemLabel = (status: StatusItem | undefined): string => {
    const found = statusItems.find((item) => item.value === status);
    return found ? found.label : "";
  };

  useFocusEffect(
    useCallback(() => {
      dispatch(
        getAllItemOfCurrentUserByStatusThunk({
          pageNo: 0,
          statusItem: selectedStatus,
        })
      );
      dispatch(getItemCountsOfCurrentUserThunk());
    }, [dispatch, selectedStatus])
  );

  const tabs = [
    {
      label: getStatusItemLabel(StatusItem.AVAILABLE),
      count: countsOfCurrentUser.AVAILABLE!,
    },
    {
      label: getStatusItemLabel(StatusItem.PENDING),
      count: countsOfCurrentUser.PENDING!,
    },
    {
      label: getStatusItemLabel(StatusItem.EXPIRED),
      count: countsOfCurrentUser.EXPIRED!,
    },
    {
      header: "IN EXCHANGE",
      label: getStatusItemLabel(StatusItem.IN_EXCHANGE),
      count: countsOfCurrentUser.IN_EXCHANGE!,
    },

    {
      label: getStatusItemLabel(StatusItem.REJECTED),
      count: countsOfCurrentUser.REJECTED!,
    },
    {
      header: "DEACTIVATED",
      label: getStatusItemLabel(StatusItem.NO_LONGER_FOR_EXCHANGE),
      count: countsOfCurrentUser.NO_LONGER_FOR_EXCHANGE!,
    },
    {
      header: "EXCHANGED",
      label: getStatusItemLabel(StatusItem.EXCHANGED),
      count: countsOfCurrentUser.EXCHANGED!,
    },
  ];

  const handleLoadMore = () => {
    if (!loading && !last) {
      dispatch(
        getAllItemOfCurrentUserByStatusThunk({
          pageNo: pageNo + 1,
          statusItem: selectedStatus,
        })
      );
    }
  };

  const ListHeaderComponent = (
    <>
      <Header showBackButton={false} title="Your items" showOption={false} />
      <TabHeader
        owner={false}
        tabs={tabs}
        selectedTab={selectedStatus}
        onSelectTab={(value) => setSelectedStatus(value as StatusItem)}
      />
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
      <View className={`${isSingle ? "w-1/2 px-1.5" : "flex-1 px-1.5 "}`}>
        <CardItem item={item} navigation={navigation} mode="management" />
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f6f9f9]">
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
              <Text className="text-gray-500">No item</Text>
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
    </SafeAreaView>
  );
};

export default ItemManagement;
