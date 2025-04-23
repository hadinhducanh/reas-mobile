import React, { useEffect, useState } from "react";
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
import { getNumberOfSuccessfulExchangesOfUserThunk } from "../../../redux/thunk/exchangeThunk";
import { getNumberOfSuccessfulTransactionOfUserThunk } from "../../../redux/thunk/paymentThunk";

const Statistics: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useDispatch<AppDispatch>();
  const { numberOfSuccessfulExchange, loading } = useSelector(
    (state: RootState) => state.exchange
  );
  const { numberOfSuccessfulTransaction, loadingPayment } = useSelector(
    (state: RootState) => state.payment
  );
  // State quản lý chế độ Weekly / Monthly / Yearly
  const [selectedSegment, setSelectedSegment] = useState("Monthly");

  const monthlyData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [{ data: [80, 45, 28, 80, 99, 43] }],
  };

  // Lấy dữ liệu tương ứng với lựa chọn
  let chartData;
  chartData = monthlyData;

  useEffect(() => {
    dispatch(
      getNumberOfSuccessfulExchangesOfUserThunk({ month: 4, year: 2025 })
    );
    dispatch(
      getNumberOfSuccessfulTransactionOfUserThunk({ month: 4, year: 2025 })
    );
  }, [numberOfSuccessfulExchange, numberOfSuccessfulTransaction]);

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
            value="VND 3000"
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
