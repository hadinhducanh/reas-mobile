import React, { useCallback, useState } from "react";
import { View, FlatList, ActivityIndicator, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TabHeader from "../../../components/TabHeader";
import ExchangeCard from "../../../components/ExchangeCard";
import Header from "../../../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { StatusExchange } from "../../../common/enums/StatusExchange";
import { ExchangeResponse } from "../../../common/models/exchange";
import {
  getAllExchangesByStatusOfCurrentUserThunk,
  getExchangeCountsThunk,
} from "../../../redux/thunk/exchangeThunk";
import Icon from "react-native-vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";
import { resetExchangeList } from "../../../redux/slices/exchangeSlice";

const ExchangeHistory: React.FC = () => {
  const { loading, exchangeByStatus, counts } = useSelector(
    (state: RootState) => state.exchange
  );
  const dispatch = useDispatch<AppDispatch>();

  const [selectedStatus, setSelectedStatus] = useState<StatusExchange>(
    StatusExchange.PENDING
  );

  const { content, pageNo, last } = exchangeByStatus;

  const tabs = [
    {
      label: StatusExchange.PENDING,
      count: counts.PENDING!,
    },
    {
      label: StatusExchange.APPROVED,
      count: counts.APPROVED!,
    },
    {
      label: StatusExchange.SUCCESSFUL,
      count: counts.SUCCESSFUL!,
    },
    {
      label: StatusExchange.REJECTED,
      count: counts.REJECTED!,
    },
    {
      label: StatusExchange.CANCELLED,
      count: counts.CANCELLED!,
    },
    {
      label: StatusExchange.FAILED,
      count: counts.FAILED!,
    },
  ];

  useFocusEffect(
    useCallback(() => {
      dispatch(resetExchangeList());
      dispatch(
        getAllExchangesByStatusOfCurrentUserThunk({
          pageNo: 0,
          statusExchangeRequest: selectedStatus,
        })
      );
      dispatch(getExchangeCountsThunk());
    }, [dispatch, selectedStatus])
  );

  const handleLoadMore = () => {
    if (!loading && !last) {
      dispatch(
        getAllExchangesByStatusOfCurrentUserThunk({
          pageNo: pageNo + 1,
          statusExchangeRequest: selectedStatus,
        })
      );
    }
  };

  const ListHeaderComponent = (
    <>
      <Header
        showBackButton={false}
        title="Exchange"
        showOption={false}
        showFilter={selectedStatus === StatusExchange.APPROVED}
      />
      <TabHeader
        owner={false}
        tabs={tabs}
        selectedTab={selectedStatus}
        onSelectTab={(value) => setSelectedStatus(value as StatusExchange)}
      />
    </>
  );

  const renderExchangeCard = ({ item }: { item: ExchangeResponse }) => (
    <ExchangeCard
      status={
        item.statusExchangeRequest === StatusExchange.APPROVED &&
        item.exchangeHistory.statusExchangeHistory === StatusExchange.SUCCESSFUL
          ? StatusExchange.SUCCESSFUL
          : item.statusExchangeRequest
      }
      exchange={item}
    />
  );

  return (
    <SafeAreaView className="flex-1 bg-[#f6f9f9]">
      <FlatList
        data={content}
        numColumns={1}
        renderItem={renderExchangeCard}
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
              <Text className="text-gray-500">No exchange</Text>
            </View>
          );
        }}
        ListFooterComponent={
          !loading || content.length === 0 ? null : (
            <ActivityIndicator size="large" color="#00b0b9" />
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

export default ExchangeHistory;
