// MyLineChart.tsx
import React from "react";
import { View, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";

interface MyLineChartProps {
  chartData: {
    labels: string[];
    datasets: { data: number[] }[];
  };
}

const screenWidth = Dimensions.get("window").width - 32; // trừ khoảng padding ngang

// Cấu hình hiển thị chart
const chartConfig = {
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  decimalPlaces: 0, // Số chữ số thập phân
  color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`, // Màu đường
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Màu text
  propsForDots: {
    r: "4",
    strokeWidth: "2",
    stroke: "#ffffff",
  },
};

export const MyLineChart: React.FC<MyLineChartProps> = ({ chartData }) => {
  return (
    <View className="bg-white rounded-xl mb-4">
      <LineChart
        data={chartData}
        width={screenWidth}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </View>
  );
};
