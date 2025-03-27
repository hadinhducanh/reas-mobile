import React, { useEffect, useState } from "react";
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

const ExchangeHistory: React.FC = () => {
  const { loading, exchangeByStatus, counts } = useSelector(
    (state: RootState) => state.exchange
  );
  const dispatch = useDispatch<AppDispatch>();

  const [selectedStatus, setSelectedStatus] = useState<StatusExchange>(
    StatusExchange.PENDING
  );

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

  useEffect(() => {
    dispatch(getExchangeCountsThunk());
  }, []);

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
      <View>
        <Header showBackButton={false} title="Exchange" showOption={false} />
        <TabHeader
          owner={false}
          tabs={tabs}
          selectedTab={selectedStatus}
          onSelectTab={setSelectedStatus}
        />
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#00b0b9" />
        </View>
      ) : exchangeByStatus.content.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500">No exchange was request</Text>
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={exchangeByStatus.content}
          renderItem={renderExchangeCard}
          keyExtractor={(item) => item.id.toString()}
        />
      )}

      {}
    </SafeAreaView>
  );
};

export default ExchangeHistory;
