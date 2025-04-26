import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { SegmentedControl } from "../../../components/SegmentedControl";
import { MyLineChart } from "../../../components/MyLineChart";
import { StatsCard } from "../../../components/StatsCard";
import Header from "../../../components/Header";
import { RootStackParamList } from "../../../navigation/AppNavigator";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import {
  getMonthlyRevenueOfUserInOneYearFromExchangesThunk,
  getNumberOfSuccessfulExchangesOfUserThunk,
  getRevenueOfUserInOneYearFromExchangesThunk,
} from "../../../redux/thunk/exchangeThunk";
import { getNumberOfSuccessfulTransactionOfUserThunk } from "../../../redux/thunk/paymentThunk";

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const Statistics: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useDispatch<AppDispatch>();
  const {
    numberOfSuccessfulExchange,
    revenueOfUserFromExchanges,
    monthlyRevenueOfUserFromExchanges,
  } = useSelector((state: RootState) => state.exchange);
  const { numberOfSuccessfulTransaction } = useSelector(
    (state: RootState) => state.payment
  );
  const [selectedSegment, setSelectedSegment] = useState("Monthly");

  const [month] = useState(() => new Date().getMonth() + 1);
  const [year] = useState(() => new Date().getFullYear());

  useEffect(() => {
    dispatch(getNumberOfSuccessfulExchangesOfUserThunk({ month, year }));
    dispatch(getNumberOfSuccessfulTransactionOfUserThunk({ month, year }));
    dispatch(getRevenueOfUserInOneYearFromExchangesThunk(year));
    dispatch(getMonthlyRevenueOfUserInOneYearFromExchangesThunk(year));
  }, [dispatch, month, year]);

  const chartData = useMemo(() => {
    if (selectedSegment === "Monthly") {
      const data = MONTH_LABELS.map(
        (_, idx) =>
          // truy xuất plain object với key là số tháng
          monthlyRevenueOfUserFromExchanges[idx + 1] ?? 0
      );
      return { labels: MONTH_LABELS, datasets: [{ data }] };
    } else {
      return {
        labels: [year.toString()],
        datasets: [{ data: [revenueOfUserFromExchanges ?? 0] }],
      };
    }
  }, [
    selectedSegment,
    monthlyRevenueOfUserFromExchanges,
    revenueOfUserFromExchanges,
    year,
  ]);

  const formatPrice = (price: number | undefined): string => {
    return price !== undefined ? price.toLocaleString("vi-VN") : "0";
  };

  return (
    <SafeAreaView className="flex-1 bg-[#00B0B9]">
      <Header
        title="Statistics"
        backgroundColor="bg-[#00B0B9]"
        backIconColor="white"
        textColor="text-white"
        optionIconColor="white"
        showOption={false}
        onBackPress={() =>
          navigation.navigate("MainTabs", { screen: "Account" })
        }
      />
      <ScrollView className="flex-1 bg-gray-100 p-4">
        <SegmentedControl
          selected={selectedSegment}
          onChange={(val) => setSelectedSegment(val)}
        />

        {/* (3) Line Chart */}
        <MyLineChart chartData={chartData} />

        {/* (4) & (5) - 4 thẻ thống kê */}
        <View className="flex-row flex-wrap justify-between">
          <StatsCard
            value={numberOfSuccessfulExchange.toString()}
            label="Exchanges"
            percentage="+2.5%"
            isPositive
          />
          <StatsCard
            value={numberOfSuccessfulTransaction.toString()}
            label="Transactions"
            percentage="+0.5%"
            isPositive
          />

          <StatsCard
            value={formatPrice(revenueOfUserFromExchanges)}
            label="Revenue"
            percentage="-2.5%"
            isPositive={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Statistics;
