import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Modal,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import Header from "../../../components/Header";
import { RootStackParamList } from "../../../navigation/AppNavigator";
import { TextInput } from "react-native-gesture-handler";

const AccpectRejectExchange: React.FC = () => {
  const [feedback, setFeedback] = useState("");

  const handleSend = async () => {
    // Test Loading: delay 3 giây
    await new Promise((resolve) => setTimeout(resolve, 3000));
  };
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [modalVisible, setModalVisible] = useState(false);
  const [negotiatedVisible, setNegotiatedVisible] = useState(false);

  const handleNegotiatePrice = () => {
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleSet = () => {
    setModalVisible(false);
    setNegotiatedVisible(!negotiatedVisible);
  };

  const handleAccpectRejectExchange = () => {};

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
            <View className="flex-row justify-between">
              <Text className="font-bold text-lg text-gray-500">
                Price of item
              </Text>
              <Pressable onPress={handleNegotiatePrice}>
                <Icon name="create-outline" size={24} color="#00b0b9" />
              </Pressable>
            </View>

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
          {negotiatedVisible && (
            <View className="mb-8">
              <View className="flex-row justify-between">
                <Text className="font-bold text-lg text-gray-500">
                  Negotiated price
                </Text>
              </View>

              <View className="bg-white mt-2 rounded-lg p-4 flex-col justify-center h-fit">
                <View className="flex-row items-center justify-between">
                  <Text className="font-bold text-lg">After adjusting</Text>
                  <Text className="font-bold text-lg text-[#00b0b9]">
                    300.000 VND
                  </Text>
                </View>
                <View className="flex-row items-center justify-end">
                  <Text className="text-sm text-gray-500">
                    2 offer remaining
                  </Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={handleCancel}
      >
        <Pressable
          className="flex-1 bg-[rgba(0,0,0,0.2)]"
          onPress={handleCancel}
        >
          <View className="absolute inset-0 flex justify-center items-center">
            <View className="w-[85%] bg-white rounded-lg p-5">
              <Text className="text-center text-xl font-bold text-[#00B0B9]">
                Negotiated Price
              </Text>
              <Text className="text-center text-sm text-gray-500 mt-1">
                Please input a negotiated price
              </Text>

              <View className="flex-row justify-between items-center mt-4 mb-2">
                <View>
                  <Text className="text-base font-medium text-gray-800">
                    Estimated difference
                  </Text>
                  <Text className="text-lg font-bold text-[#00B0B9]">
                    350.000 VND
                  </Text>
                </View>
                <Icon name="cash-outline" size={40} color="#00B0B9" />
              </View>

              <View className="border border-[#00B0B9] rounded-md px-3 py-2">
                <Text className="text-[#00B0B9] font-bold">
                  Negotiated price
                </Text>
                <View className="flex-row items-center justify-between">
                  <TextInput
                    placeholder="0"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    className="flex-1 text-base text-gray-700 font-semibold"
                  />
                  <Text className="text-gray-500 ml-1 font-semibold">đ</Text>
                </View>
              </View>

              <View className="flex-row mt-5">
                <Pressable
                  onPress={handleCancel}
                  className="flex-1 border border-[#00B0B9] rounded-md py-3 mr-2 items-center"
                >
                  <Text className="text-[#00B0B9] font-bold">Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={handleSet}
                  className="flex-1 bg-[#00B0B9] rounded-md py-3 ml-2 items-center"
                >
                  <Text className="text-white font-bold">Set</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Pressable>
      </Modal>
      <View
        className={`${
          Platform.OS === "ios" ? "pt-4 pb-7" : "py-3"
        } px-5 bg-white mt-auto rounded-t-xl flex-row items-center`}
      >
        <Pressable className="flex-1 border-[1px] border-[#00B0B9] bg-white p-4 rounded-lg mx-2 items-center flex-row justify-center active:bg-[rgb(0,176,185,0.1)]">
          <Text className="text-[#00B0B9] font-bold ml-1">Reject</Text>
        </Pressable>
        <Pressable className="flex-1 bg-[#00B0B9] p-4 rounded-lg items-center flex-row justify-center active:bg-[rgb(0,176,185,0.9)]">
          <Text className="text-white font-bold ml-1">Accpect</Text>
        </Pressable>
      </View>
    </>
  );
};

export default AccpectRejectExchange;
