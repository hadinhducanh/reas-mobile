import { NavigationProp, useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, ImageBackground, Pressable } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { RootStackParamList } from "../../navigation/AppNavigator";

interface ExchangeCardProps {
  status: string;
}

const statusStyles: Record<
  string,
  { textColor: string; backgroundColor: string }
> = {
  Pending: {
    textColor: "text-[#00b0b9]",
    backgroundColor: "bg-[rgba(0,176,185,0.2)]",
  },
  Agreed: {
    textColor: "text-[#FFA43D]",
    backgroundColor: "bg-[rgba(255,164,61,0.4)]",
  },
  Rejected: {
    textColor: "text-[#FA5555]",
    backgroundColor: "bg-[rgba(250,85,85,0.2)]",
  },
  Completed: {
    textColor: "text-[#16A34A]",
    backgroundColor: "bg-[rgba(22,163,74,0.2)]",
  },
  Canceled: {
    textColor: "text-gray-500",
    backgroundColor: "bg-[rgba(116,139,150,0.2)]",
  },
};

const ExchangeCard: React.FC<ExchangeCardProps> = ({ status }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handlePress = () => {
    if (status === "Pending") {
      navigation.navigate("AccpectRejectExchange");
    } else {
      navigation.navigate("ExchangeDetail");
    }
  };

  const { textColor, backgroundColor } = statusStyles[status];

  return (
    <Pressable
      className="bg-white mx-5 mt-4 px-5 py-4 rounded-xl active:bg-gray-100"
      onPress={handlePress}
    >
      {/* Phần header: ngày và badge Pending */}
      <View className="flex-row justify-between items-center">
        <Text className="items-center text-[14px] font-normal text-[#6b7280]">
          Feb 15, 2025
        </Text>
        <Text
          className={`items-center text-[13px] font-medium ${textColor} ${backgroundColor} rounded-full px-5 py-2`}
        >
          {status}
        </Text>
      </View>

      {/* Phần thông tin trao đổi: ảnh, tên & sản phẩm */}
      <View className="flex-row items-center my-1">
        <View className="w-14 h-14 rounded-full bg-black mr-2"></View>
        <View>
          <Text className="justify-start items-center text-left text-[16px] font-medium text-black">
            Đức Sơn
          </Text>
          <Text className="justify-start items-center text-left text-[14px] font-normal text-[#6b7280]">
            Suncook Rice cooker
          </Text>
        </View>
      </View>
      <View className="my-2 border-t-[1px] border-b-[1px] py-2 border-gray-200">
        {/* Exchange ID */}
        <Text className="text-[12px] font-normal">
          <Text className="text-[#6b7280]">Exchange ID: </Text>
          <Text className="font-bold text-[#6b7280]">#EX123456</Text>
        </Text>
        <Text className="text-[12px] font-normal my-4">
          <Text className="text-[#6b7280]">Date & Time: </Text>
          <Text className="font-bold text-[#6b7280]">14:30 20-02-2025 </Text>
        </Text>
        <Text className="text-[12px] font-normal text-left">
          <Text className="text-[#6b7280]">Location: </Text>
          <Text className="font-bold text-[#6b7280]">
            Hẻm 446 Lê Quang Định
          </Text>
        </Text>
      </View>

      {/* Phần Date & Time, Location và Additional Payment */}
      <View className="mt-2">
        <Text className="text-[14px] font-bold text-right">
          <Text className="text-black">Additional payment: </Text>
          <Text className="text-[#00b0b9]">350.000 VND</Text>
        </Text>
        {/* Paid by */}
        <Text className="my-2 text-right items-center text-[12px] font-normal text-[#738aa0]">
          Paid by: Sarah Wilson
        </Text>
        <View className="flex-row justify-end">
          {status === "Completed" && (
            <Pressable
              className="flex-row justify-center items-center py-3 px-5 border-[#00b0b9] border-[1px] rounded-lg mr-2 active:bg-[rgb(0,176,185,0.1)]"
              onPress={() => navigation.navigate("FeedbackItem")}
            >
              <Icon
                className="mr-1"
                name="pencil-outline"
                size={18}
                color="#00b0b9"
              />
              <Text className="justify-center items-center text-center text-[16px] font-bold text-[#00b0b9]">
                Feedback
              </Text>
            </Pressable>
          )}

          <Pressable
            className="flex-row justify-center items-center py-3 px-8 bg-[#00b0b9] rounded-lg active:bg-[rgb(0,176,185,0.9)]"
            onPress={() => navigation.navigate("ChatHistory")}
          >
            <Icon
              className="mr-1"
              name="chatbox-ellipses-outline"
              size={18}
              color="#fff"
            />
            <Text className="justify-center items-center text-center text-[16px] font-bold text-white">
              Chat
            </Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
};

export default ExchangeCard;
