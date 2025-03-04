import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import Header from "../../../components/Header";
import LoadingButton from "../../../components/LoadingButton";
import { RootStackParamList } from "../../../navigation/AppNavigator";

const ConfirmExchange: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleConfirmExchange = () => {
    navigation.navigate("MainTabs", { screen: "Exchanges" });
  };

  return (
    <>
      <SafeAreaView className="flex-1 bg-[#f6f9f9]" edges={["top"]}>
        <Header title="Exchange details" showOption={false} />
        <ScrollView className="px-5">
          <View className="flex-row items-center justify-between pt-3 ">
            <View className="flex-row ">
              <Text className="text-gray-500 text-base">
                Exchange ID:&nbsp;
              </Text>
              <Text className="text-gray-500 font-bold text-base">
                #EX12356
              </Text>
            </View>
            <Text className="items-center text-sm font-medium text-[#00b0b9] bg-[rgb(0,176,185,0.2)] rounded-full px-5 py-2">
              Pending
            </Text>
          </View>
          <View className="flex-row justify-between items-center py-5">
            <View className="flex-row items-center">
              <View className="w-16 h-16 rounded-full bg-black mr-2"></View>
              <View>
                <Text className="justify-start items-center text-left text-[18px] font-medium text-black">
                  Đức Sơn
                </Text>
                <Text className="justify-start items-center text-left text-[14px] font-normal text-[#6b7280]">
                  @Sonnd
                </Text>
              </View>
            </View>
            <View className="relative mr-2">
              <Icon
                name="swap-horizontal-outline"
                size={26}
                color="#00B0B9"
                style={{ position: "absolute" }}
              />
              <Icon name="swap-horizontal-outline" size={26} color="#00B0B9" />
            </View>
            <View className="flex-row items-center">
              <View>
                <Text className="justify-start items-center text-right text-[18px] font-medium text-black">
                  Đức Sơn
                </Text>
                <Text className="justify-start items-center text-right text-[14px] font-normal text-[#6b7280]">
                  @Sonnd
                </Text>
              </View>
              <View className="w-16 h-16 rounded-full bg-black ml-2"></View>
            </View>
          </View>
          <View>
            <View className="flex-row justify-between">
              <Text className="font-bold text-lg text-gray-500">
                Their item
              </Text>
              <Text className="font-bold text-lg text-gray-500">Your item</Text>
            </View>
            <View className="flex-row justify-between mt-2">
              <View className="bg-white rounded-lg p-4 shadow-sm w-[47%]">
                {/* Khung chứa ảnh */}
                <View className="h-40 bg-gray-200 rounded-lg" />

                {/* Thông tin sản phẩm */}
                <Text className="mt-2 text-base text-gray-500">
                  Suncook rice cooker
                </Text>
                <Text className="text-sm">150.000 VND</Text>
              </View>
              <View className="bg-white rounded-lg p-4 shadow-sm w-[47%]">
                {/* Khung chứa ảnh */}
                <View className="h-40 bg-gray-200 rounded-lg" />

                {/* Thông tin sản phẩm */}
                <Text className="mt-2 text-base text-gray-500">
                  Suncook rice cooker
                </Text>
                <Text className="text-sm">150.000 VND</Text>
              </View>
            </View>
          </View>

          <View className="mt-8">
            <Text className="font-bold text-lg text-gray-500">
              Exchange Details
            </Text>

            <View className="bg-white mt-2 rounded-lg p-4 flex-row justify-between h-fit">
              <View className="w-1/2 justify-between">
                <Text className="text-base text-gray-500">Method</Text>
                <Text className="text-base text-gray-500 my-4">Type</Text>
                <Text className="text-base text-gray-500 mb-4">
                  Meeting Location
                </Text>
                <Text className="text-base text-gray-500">Date & Time</Text>
              </View>
              <View className="w-1/2 justify-between">
                <Text className="text-right text-base text-[#00b0b9]">
                  Pick-up in person
                </Text>
                <Text className="text-right text-base text-[#00b0b9]">
                  Desired item
                </Text>
                <View className="flex-row items-center justify-end">
                  <Icon name="location-outline" size={20} color="#00B0B9" />
                  <Text className="ml-[2px] text-base underline text-[#00b0b9]">
                    Hẻm 446 Lê Quang Định
                  </Text>
                </View>

                <View className="flex-row items-center justify-end">
                  <Icon
                    name="calendar-clear-outline"
                    size={20}
                    color="#00B0B9"
                  />
                  <Text className="ml-[2px] text-right text-base underline text-[#00b0b9]">
                    14:30 20-02-2025
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View className="mt-8">
            <Text className="font-bold text-lg text-gray-500">
              Term & Conditions
            </Text>

            <View className="bg-white mt-2 rounded-lg p-4 flex-col justify-center h-fit">
              <View className="flex-row items-center">
                <View className="w-2 h-2 rounded-full bg-gray-500 mr-2"></View>
                <Text className="text-base text-gray-500">
                  Không đổi trả lại
                </Text>
              </View>
              <View className="flex-row items-center my-4">
                <View className="w-2 h-2 rounded-full bg-gray-500 mr-2"></View>
                <Text className="text-base text-gray-500">
                  Chỉ trả tiền mặt (không nhận chuyển khoản)
                </Text>
              </View>
              <View className="flex-row items-center">
                <View className="w-2 h-2 rounded-full bg-gray-500 mr-2"></View>
                <Text className="text-base text-gray-500">
                  Vui lòng gọi điện trước khi đến
                </Text>
              </View>
            </View>
          </View>
          <View className="mt-8">
            <Text className="font-bold text-lg text-gray-500">Note</Text>
            <View className="bg-white mt-2 rounded-lg p-4 h-fit">
              <Text className="text-base text-gray-500">
                Có thể thay kiểm tra kỹ trước rồi hẵng chấp nhận
              </Text>
            </View>
          </View>

          <View className="my-8">
            <Text className="font-bold text-lg text-gray-500">
              Price of item
            </Text>

            <View className="bg-white mt-2 rounded-lg p-4 flex-col justify-center h-fit">
              <View className="flex-row items-center justify-between">
                <Text className="text-base text-gray-800">
                  Their item price
                </Text>
                <Text className="text-base text-gray-800">150.000 VND</Text>
              </View>
              <View className="flex-row items-center justify-between mt-1">
                <Text className="text-base text-gray-800">Your item price</Text>
                <Text className="text-base text-gray-800">500.000 VND</Text>
              </View>
              <View className="border-[0.2px] border-gray-300 my-2"></View>
              <View className="flex-row items-center justify-between">
                <Text className="font-bold text-lg">Additional payment</Text>
                <Text className="font-bold text-lg text-[#00b0b9]">
                  350.000 VND
                </Text>
              </View>
              <View className="flex-row items-center justify-end">
                <Text className="text-sm text-gray-500">Paid by: Đức Sơn</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
      <View
        className={`${
          Platform.OS === "ios" ? "pt-4 pb-7" : "py-3"
        } px-5 bg-white mt-auto rounded-t-xl flex-row items-center`}
      >
        <LoadingButton
          title="Confirm exchange"
          onPress={handleConfirmExchange}
        />
      </View>
    </>
  );
};

export default ConfirmExchange;
