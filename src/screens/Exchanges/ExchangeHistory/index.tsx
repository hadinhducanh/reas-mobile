import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  Text,
  ScrollView,
} from "react-native";
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
      label: StatusExchange.REJECTED,
      count: counts.REJECTED!,
    },
    {
      label: StatusExchange.CANCELLED,
      count: counts.CANCELLED!,
    },
    {
      label: StatusExchange.SUCCESSFUL,
      count: counts.SUCCESSFUL!,
    },
    {
      label: StatusExchange.FAILED,
      count: counts.FAILED!,
    },
  ];

  useEffect(() => {
    dispatch(
      getAllExchangesByStatusOfCurrentUserThunk({
        pageNo: 0,
        statusExchangeRequest: selectedStatus,
      })
    );
    dispatch(getExchangeCountsThunk());
  }, [dispatch, selectedStatus]);

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
    <SafeAreaView className="flex-1 bg-[#f6f9f9]">
      <View>
        <Header showBackButton={false} title="Exchange" showOption={false} />
        <TabHeader
          owner={false}
          tabs={tabs}
          selectedTab={selectedStatus}
          onSelectTab={setSelectedStatus}
        />
      </View>

      {loading && pageNo === 0 ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#00b0b9" />
        </View>
      ) : exchangeByStatus.content.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Icon name="remove-circle-outline" size={70} color={"#00b0b9"} />
          <Text className="text-gray-500">No exchange</Text>
        </View>
      ) : (
        <>
          <ScrollView
            className="bg-gray-100"
            showsVerticalScrollIndicator={false}
            onScroll={({ nativeEvent }) => {
              if (isCloseToBottom(nativeEvent)) {
                handleLoadMore();
              }
            }}
            scrollEventThrottle={100}
          >
            {exchangeByStatus.content.map((exchange) => (
              <ExchangeCard
                key={exchange.id}
                status={
                  exchange.statusExchangeRequest === StatusExchange.APPROVED &&
                  exchange.exchangeHistory.statusExchangeHistory ===
                    StatusExchange.SUCCESSFUL
                    ? StatusExchange.SUCCESSFUL
                    : exchange.statusExchangeRequest
                }
                exchange={exchange}
              />
            ))}
          </ScrollView>
          {loading && pageNo !== 0 && (
            <ActivityIndicator size="large" color="#00b0b9" className="mb-5" />
          )}
        </>
      )}

      {}
    </SafeAreaView>
  );
};

export default ExchangeHistory;
