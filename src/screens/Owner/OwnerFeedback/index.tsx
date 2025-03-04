import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../../components/Header";
import Icon from "react-native-vector-icons/Ionicons";
import TabHeader from "../../../components/TabHeader";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../navigation/AppNavigator";

interface ExchangeData {
  id: number;
  status: string;
}

const OwnerFeedback: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>("Tất cả");
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const data: ExchangeData[] = [
    { id: 1, status: "Tất cả" },
    { id: 2, status: "Tất cả" },
    { id: 3, status: "Tất cả" },
    { id: 4, status: "1" },
    { id: 5, status: "3" },
    { id: 6, status: "5" },
  ];

  const tabs = [
    {
      label: "Tất cả",
      count: data.filter((item) => item.status === "Tất cả").length,
    },
    {
      label: "5",
      count: data.filter((item) => item.status === "5").length,
    },
    {
      label: "4",
      count: data.filter((item) => item.status === "4").length,
    },
    {
      label: "3",
      count: data.filter((item) => item.status === "3").length,
    },
    {
      label: "2",
      count: data.filter((item) => item.status === "2").length,
    },
    {
      label: "1",
      count: data.filter((item) => item.status === "1").length,
    },
    {
      label: "0",
      count: data.filter((item) => item.status === "0").length,
    },
  ];

  return (
    <SafeAreaView className="bg-[#00B0B9] flex-1" edges={["top"]}>
      <Header
        title="Chi tiết đánh giá"
        backgroundColor="bg-[#00B0B9]"
        backIconColor="white"
        textColor="text-white"
        optionIconColor="white"
        owner={false}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="bg-white">
          <View className="bg-gray-200 h-[120px]" />

          <View className="bg-white -mt-[50px] px-5 pt-5">
            <View className="w-[100px] h-[100px] bg-[#00B0B9] rounded-full border-[4px] border-white -mt-[50px]" />
            <View className="mt-2 pb-5">
              <Text className="text-lg font-bold">Ngọc Cường</Text>
              <View className="flex-row items-center mt-1">
                <Text className="text-sm mr-1">5.0</Text>
                {[...Array(5)].map((_, idx) => (
                  <Icon key={idx} name="star" size={14} color="#FFA43D" />
                ))}
                <Text className="ml-1 text-sm font-semibold text-[#00B0B9]">
                  (5 đánh giá)
                </Text>
              </View>
              {/* Địa chỉ */}
              <View className="flex-row items-center mt-2">
                <Icon name="location-outline" size={20} color="#738AA0" />
                <Text className="text-base text-gray-500 ml-1">
                  Địa chỉ:
                  <Text className="text-black"> VinHome Grand Park, HCM</Text>
                </Text>
              </View>
              {/* Thời gian tham gia */}
              <View className="flex-row items-center mt-1">
                <Icon name="time-outline" size={20} color="#738AA0" />
                <Text className="text-base text-gray-600 ml-1">
                  Đã tham gia:
                  <Text className="text-black"> 2 tuần trước</Text>
                </Text>
              </View>
            </View>
          </View>

          <TabHeader
            ownerFeedback={true}
            tabs={tabs}
            selectedTab={selectedStatus}
            onSelectTab={setSelectedStatus}
          />

          <View className="w-full px-3">
            <View className="p-4 bg-white rounded-lg shadow-sm mt-3">
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-[#00B0B9] rounded-full mr-3" />
                <Text className="text-lg font-bold">Ngọc Cường</Text>
              </View>
              <Text className="text-gray-700 mt-1">
                Sản phẩm tốt, người bán uy tín, giá hợp lí
              </Text>
              <View className="flex-row items-center mt-1">
                {[...Array(5)].map((_, idx) => (
                  <Icon key={idx} name="star" size={14} color="#FFA43D" />
                ))}
                <Text className="ml-2 text-gray-500 text-sm">
                  | 2 năm trước
                </Text>
              </View>
              <View className="flex-row items-center bg-[#D6F2F4] rounded-lg mt-3 p-3">
                <View className="w-12 h-12 bg-gray-300 rounded-md mr-3" />
                <View>
                  <Text className="text-gray-700 font-medium">
                    Suncook Rice Cooker
                  </Text>
                  <Text className="text-[#00B0B9] font-bold">500.000 đ</Text>
                </View>
              </View>
              <View className="border-b border-gray-300 my-4" />
            </View>

            <View className="p-4 bg-white rounded-lg shadow-sm mt-3">
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-[#00B0B9] rounded-full mr-3" />
                <Text className="text-lg font-bold">Ngọc Cường</Text>
              </View>
              <Text className="text-gray-700 mt-1">
                Sản phẩm tốt, người bán uy tín, giá hợp lí
              </Text>
              <View className="flex-row items-center mt-1">
                {[...Array(5)].map((_, idx) => (
                  <Icon key={idx} name="star" size={14} color="#FFA43D" />
                ))}
                <Text className="ml-2 text-gray-500 text-sm">
                  | 2 năm trước
                </Text>
              </View>
              <View className="flex-row items-center bg-[#D6F2F4] rounded-lg mt-3 p-3">
                <View className="w-12 h-12 bg-gray-300 rounded-md mr-3" />
                <View>
                  <Text className="text-gray-700 font-medium">
                    Suncook Rice Cooker
                  </Text>
                  <Text className="text-[#00B0B9] font-bold">500.000 đ</Text>
                </View>
              </View>
              <View className="border-b border-gray-300 my-4" />
            </View>

            <View className="p-4 bg-white rounded-lg shadow-sm mt-3">
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-[#00B0B9] rounded-full mr-3" />
                <Text className="text-lg font-bold">Ngọc Cường</Text>
              </View>
              <Text className="text-gray-700 mt-1">
                Sản phẩm tốt, người bán uy tín, giá hợp lí
              </Text>
              <View className="flex-row items-center mt-1">
                {[...Array(5)].map((_, idx) => (
                  <Icon key={idx} name="star" size={14} color="#FFA43D" />
                ))}
                <Text className="ml-2 text-gray-500 text-sm">
                  | 2 năm trước
                </Text>
              </View>
              <View className="flex-row items-center bg-[#D6F2F4] rounded-lg mt-3 p-3">
                <View className="w-12 h-12 bg-gray-300 rounded-md mr-3" />
                <View>
                  <Text className="text-gray-700 font-medium">
                    Suncook Rice Cooker
                  </Text>
                  <Text className="text-[#00B0B9] font-bold">500.000 đ</Text>
                </View>
              </View>
              <View className="border-b border-gray-300 my-4" />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OwnerFeedback;
