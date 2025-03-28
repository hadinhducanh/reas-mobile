import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Platform,
  Modal,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import Header from "../../../components/Header";
import LoadingButton from "../../../components/LoadingButton";
import { RootStackParamList } from "../../../navigation/AppNavigator";
import {
  defaultExchangeItem,
  useExchangeItem,
} from "../../../context/ExchangeContext";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { Image } from "react-native";
import { makeAnExchangeThunk } from "../../../redux/thunk/exchangeThunk";
import ConfirmModal from "../../../components/DeleteConfirmModal";
import { resetExchange } from "../../../redux/slices/exchangeSlice";

const ConfirmExchange: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { itemDetail } = useSelector((state: RootState) => state.item);
  const { exchangeItem, setExchangeItem } = useExchangeItem();
  const { loading, exchangeRequest } = useSelector(
    (state: RootState) => state.exchange
  );
  const [confirmVisible, setConfirmVisible] = useState(false);

  const handleConfirmExchange = async () => {
    const exchangeRequestRequest = {
      sellerItemId: exchangeItem.sellerItemId,
      buyerItemId:
        exchangeItem.selectedItem === null
          ? null
          : exchangeItem.selectedItem.id,
      paidByUserId: exchangeItem.paidByUserId,
      exchangeDate: exchangeItem.exchangeDateExtend.toISOString(),
      exchangeLocation: exchangeItem.exchangeLocation,
      estimatePrice: exchangeItem.estimatePrice,
      methodExchange: exchangeItem.methodExchange,
      additionalNotes: exchangeItem.additionalNotes,
    };

    // console.log(exchangeRequestRequest);

    await dispatch(makeAnExchangeThunk(exchangeRequestRequest));
  };

  useEffect(() => {
    if (exchangeRequest !== null) {
      setExchangeItem(defaultExchangeItem);
      dispatch(resetExchange());
      setConfirmVisible(false);
      navigation.navigate("MainTabs", { screen: "Exchanges" });
    }
  }, [exchangeRequest, dispatch]);

  const formatPrice = (price: number | undefined): string => {
    return price !== undefined ? price.toLocaleString("vi-VN") : "0";
  };

  const handleConfirm = async () => {
    setConfirmVisible(true);
  };

  const handleCancel = () => {
    setConfirmVisible(false);
  };

  const formatExchangeDate = (exchangeDate: string): string => {
    const dt = new Date(exchangeDate);

    const formattedTime = dt.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });

    const day = dt.getDate().toString().padStart(2, "0");
    const month = (dt.getMonth() + 1).toString().padStart(2, "0");
    const year = dt.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;

    return `${formattedTime} ${formattedDate}`;
  };

  return (
    <>
      <SafeAreaView className="flex-1 bg-[#f6f9f9]" edges={["top"]}>
        <Header title="Exchange details" showOption={false} />
        <ScrollView className="px-5">
          <View className="flex-row justify-between items-center py-5">
            <View className="flex-row items-center">
              <View className="items-center">
                <Icon name="person-circle-outline" size={60} color="gray" />
              </View>
              <View>
                <Text className="justify-start items-center text-left text-[18px] font-medium text-black">
                  {itemDetail?.owner.fullName}
                </Text>
                <Text className="justify-start items-center text-left text-[14px] font-normal text-[#6b7280]">
                  @Seller
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
                  {user?.fullName}
                </Text>
                <Text className="justify-start items-center text-right text-[14px] font-normal text-[#6b7280]">
                  @Buyer
                </Text>
              </View>
              <View className="items-center">
                <Icon name="person-circle-outline" size={60} color="gray" />
              </View>
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
                <View className="h-40 bg-white rounded-lg">
                  <Image
                    source={{
                      uri: itemDetail?.imageUrl.split(", ")[0],
                    }}
                    className="w-full h-full object-contain"
                    resizeMode="contain"
                  />
                </View>

                <Text
                  className="mt-2 text-base text-gray-500"
                  numberOfLines={1}
                >
                  {itemDetail?.itemName}
                </Text>
                <Text className="text-sm">
                  {itemDetail?.price === 0
                    ? "Free"
                    : formatPrice(itemDetail?.price) + " VND"}
                </Text>
              </View>
              {exchangeItem.selectedItem === null ? (
                <View className="bg-white rounded-lg p-4 shadow-sm w-[47%] justify-center items-center">
                  <Text className="text-gray-500 text-lg">None</Text>
                </View>
              ) : (
                <>
                  <View className="bg-white rounded-lg p-4 shadow-sm w-[47%]">
                    <View className="h-40 bg-white rounded-lg">
                      <Image
                        source={{
                          uri: exchangeItem.selectedItem?.imageUrl.split(
                            ", "
                          )[0],
                        }}
                        className="w-full h-full object-contain"
                        resizeMode="contain"
                      />
                    </View>
                    <Text
                      className="mt-2 text-base text-gray-500"
                      numberOfLines={1}
                    >
                      {exchangeItem.selectedItem?.itemName}
                    </Text>
                    <Text className="text-sm">
                      {exchangeItem.selectedItem?.price === 0
                        ? "Free"
                        : formatPrice(exchangeItem.selectedItem?.price) +
                          " VND"}
                    </Text>
                  </View>
                </>
              )}
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
                  {exchangeItem.methodExchangeName}
                </Text>
                <Text className="text-right text-base text-[#00b0b9]">
                  {itemDetail?.desiredItem === null
                    ? "Open"
                    : "Open with desired item"}
                </Text>
                <View className="flex-row items-center justify-end">
                  <Icon name="location-outline" size={20} color="#00B0B9" />
                  <Text
                    className="ml-[2px] text-base underline text-[#00b0b9] flex-1"
                    numberOfLines={1}
                  >
                    {exchangeItem.exchangeLocation.split("//")[1]}
                  </Text>
                </View>

                <View className="flex-row items-center justify-end">
                  <Icon
                    name="calendar-clear-outline"
                    size={20}
                    color="#00B0B9"
                  />
                  <Text className="ml-[2px] text-right text-base underline text-[#00b0b9]">
                    {formatExchangeDate(
                      exchangeItem.exchangeDateExtend.toISOString()
                    )}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {itemDetail?.termsAndConditionsExchange && (
            <View className="mt-8">
              <Text className="font-bold text-lg text-gray-500">
                Term & Conditions
              </Text>
              <View className="bg-white mt-2 rounded-lg p-4 flex-col justify-center h-fit">
                <Text className="text-base text-gray-500">
                  {itemDetail.termsAndConditionsExchange}
                </Text>
              </View>
            </View>
          )}

          {exchangeItem.additionalNotes && (
            <View className="mt-8">
              <Text className="font-bold text-lg text-gray-500">Note</Text>
              <View className="bg-white mt-2 rounded-lg p-4 h-fit">
                {exchangeItem.additionalNotes
                  .split("\\n")
                  .map((line, index) => (
                    <Text className="text-base text-gray-500" key={index}>
                      {line}
                    </Text>
                  ))}
              </View>
            </View>
          )}

          <View className="my-8">
            <Text className="font-bold text-lg text-gray-500">
              Price of item
            </Text>

            <View className="bg-white mt-2 rounded-lg p-4 flex-col justify-center h-fit">
              <View className="flex-row items-center justify-between">
                <Text className="text-base text-gray-800">
                  Their item price
                </Text>
                <Text className="text-base text-gray-800">
                  {itemDetail?.price === 0
                    ? "Free"
                    : formatPrice(itemDetail?.price) + " VND"}
                </Text>
              </View>
              {exchangeItem.selectedItem !== null && (
                <View className="flex-row items-center justify-between mt-1">
                  <Text className="text-base text-gray-800">
                    Your item price
                  </Text>
                  <Text className="text-base text-gray-800">
                    {exchangeItem.selectedItem?.price === 0
                      ? "Free"
                      : formatPrice(exchangeItem.selectedItem?.price) + " VND"}
                  </Text>
                </View>
              )}
              <View className="border-[0.2px] border-gray-300 my-2"></View>
              <View className="flex-row items-center justify-between">
                <Text className="font-bold text-lg">Estimated difference</Text>
                <Text className="font-bold text-lg text-[#00b0b9]">
                  {itemDetail?.price === 0
                    ? "Free"
                    : formatPrice(exchangeItem.estimatePrice) + " VND"}
                </Text>
              </View>
              <View className="flex-row items-center justify-end">
                <Text className="text-sm text-right text-gray-500">
                  {itemDetail?.price === 0
                    ? `This is a free item exchange${"\n"}so payment is not needed`
                    : "Paid by: " +
                      (exchangeItem.paidBy?.id === user?.id
                        ? "You"
                        : exchangeItem.paidBy?.fullName)}
                </Text>
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
          onPress={handleConfirm}
          buttonClassName="p-4"
        />
      </View>
      <ConfirmModal
        title="Make an exchange"
        content="Are you sure you to make an exchange with item?"
        visible={confirmVisible}
        onCancel={handleCancel}
        onConfirm={handleConfirmExchange}
      />
      <Modal transparent visible={loading} animationType="fade">
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <ActivityIndicator size="small" color="black" />
        </View>
      </Modal>
    </>
  );
};

export default ConfirmExchange;
