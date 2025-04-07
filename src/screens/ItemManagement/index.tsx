import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import TabHeader from "../../components/TabHeader";
import { RootStackParamList } from "../../navigation/AppNavigator";
import CardItem from "../../components/CardItem";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { ItemResponse } from "../../common/models/item";
import { StatusItem } from "../../common/enums/StatusItem";
import {
  getAllItemOfCurrentUserByStatusThunk,
  getItemCountsOfCurrentUserThunk,
} from "../../redux/thunk/itemThunks";
import Icon from "react-native-vector-icons/Ionicons";

const statusItems = [
  { label: "AVAILABLE", value: StatusItem.AVAILABLE },
  {
    label: "EXPIRED",
    value: StatusItem.EXPIRED,
  },
  { label: "PENDING", value: StatusItem.PENDING },
  { label: "REJECTED", value: StatusItem.REJECTED },
  { label: "NO LONGER FOR EXCHANGE", value: StatusItem.NO_LONGER_FOR_EXCHANGE },
  { label: "SOLD", value: StatusItem.SOLD },
  { label: "UNAVAILABLE", value: StatusItem.UNAVAILABLE },
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

  useEffect(() => {
    dispatch(
      getAllItemOfCurrentUserByStatusThunk({
        pageNo: 0,
        statusItem: selectedStatus,
      })
    );
    dispatch(getItemCountsOfCurrentUserThunk());
  }, [dispatch, selectedStatus]);

  const tabs = [
    {
      label: getStatusItemLabel(StatusItem.AVAILABLE),
      count: countsOfCurrentUser.AVAILABLE!,
    },
    {
      label: getStatusItemLabel(StatusItem.EXPIRED),
      count: countsOfCurrentUser.EXPIRED!,
    },
    {
      label: getStatusItemLabel(StatusItem.PENDING),
      count: countsOfCurrentUser.PENDING!,
    },
    {
      label: getStatusItemLabel(StatusItem.REJECTED),
      count: countsOfCurrentUser.REJECTED!,
    },
    {
      label: getStatusItemLabel(StatusItem.NO_LONGER_FOR_EXCHANGE),
      count: countsOfCurrentUser.NO_LONGER_FOR_EXCHANGE!,
    },
    {
      label: getStatusItemLabel(StatusItem.SOLD),
      count: countsOfCurrentUser.SOLD!,
    },
    {
      label: getStatusItemLabel(StatusItem.UNAVAILABLE),
      count: countsOfCurrentUser.UNAVAILABLE!,
    },
  ];

  const chunkArray = (array: ItemResponse[], size: number) => {
    const chunked: ItemResponse[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunked.push(array.slice(i, i + size));
    }
    return chunked;
  };

  const rows = chunkArray(content, 2);

  return (
    <SafeAreaView className="flex-1 bg-[#f6f9f9]">
      <View>
        <Header showBackButton={false} title="Your items" showOption={false} />
        <TabHeader
          owner={false}
          tabs={tabs}
          selectedTab={selectedStatus}
          onSelectTab={(value) => setSelectedStatus(value as StatusItem)}
        />
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#00b0b9" />
        </View>
      ) : (
        <>
          {content.length === 0 ? (
            <View className="flex-1 justify-center items-center">
              <Icon name="remove-circle-outline" size={70} color={"#00b0b9"} />
              <Text className="text-gray-500">No item</Text>
            </View>
          ) : (
            <View className="mx-5">
              <View className="mt-3">
                {rows.map((row, rowIndex) => (
                  <View key={rowIndex} className="flex flex-row gap-x-2">
                    {row.map((item) => (
                      <View key={item.id} className="flex-1">
                        <CardItem
                          item={item}
                          navigation={navigation}
                          // toggleLike={toggleLike}
                          mode="management"
                        />
                      </View>
                    ))}
                    {row.length === 1 && <View className="flex-1" />}
                  </View>
                ))}
              </View>
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

export default ItemManagement;
