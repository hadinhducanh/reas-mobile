import React, { useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { StatsCard } from "../../components/StatsCard";
import { SegmentedControl } from "../../components/SegmentedControl";
import { MyLineChart } from "../../components/MyLineChart";

const Statistics: React.FC = () => {
  const navigation = useNavigation();
  // State quản lý chế độ Weekly / Monthly / Yearly
  const [selectedSegment, setSelectedSegment] = useState("Monthly");

  // Dữ liệu cho 3 chế độ
  const weeklyData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [{ data: [12, 24, 18, 35, 40, 22, 15] }],
  };
  const monthlyData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [{ data: [80, 45, 28, 80, 99, 43] }],
  };
  const yearlyData = {
    labels: ["2020", "2021", "2022", "2023", "2024", "2025"],
    datasets: [{ data: [200, 500, 1000, 800, 1200, 1500] }],
  };

  // Lấy dữ liệu tương ứng với lựa chọn
  let chartData;
  if (selectedSegment === "Weekly") {
    chartData = weeklyData;
  } else if (selectedSegment === "Monthly") {
    chartData = monthlyData;
  } else {
    chartData = yearlyData;
  }

  return (
    <SafeAreaView className="flex-1 bg-[#00B0B9]">
      <View>
        <View className="relative flex-row items-center justify-center h-[60px]">
          <Text className="text-[18px] font-bold text-white">Statistics</Text>
          <Pressable
            className="absolute left-[20px] flex-row"
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Icon name="chevron-back-outline" size={24} color="#fff" />
          </Pressable>
        </View>
      </View>
      <ScrollView className="flex-1 bg-gray-100 p-4">
        <SegmentedControl
          selected={selectedSegment}
          onChange={(val) => setSelectedSegment(val)}
        />

        {/* (3) Line Chart */}
        <MyLineChart chartData={chartData} />

        {/* (4) & (5) - 4 thẻ thống kê */}
        <View className="flex-row flex-wrap justify-between">
          <StatsCard value="10" label="Orders" percentage="+2.5%" isPositive />
          <StatsCard value="20" label="Sales" percentage="+0.5%" isPositive />
          <StatsCard
            value="10"
            label="Exchanges"
            percentage="+2.5%"
            isPositive
          />
          <StatsCard
            value="$3000"
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
