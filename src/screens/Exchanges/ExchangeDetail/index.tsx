import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Image,
  Platform,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import Header from "../../../components/Header";
import { RootStackParamList } from "../../../navigation/AppNavigator";
import { UploadEvidence } from "../../../components/UploadEvidence";
import { StatusExchange } from "../../../common/enums/StatusExchange";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import {
  cancelExchangeThunk,
  getExchangeDetailThunk,
} from "../../../redux/thunk/exchangeThunk";
import { MethodExchange } from "../../../common/enums/MethodExchange";
import LocationModal from "../../../components/LocationModal";
import LoadingButton from "../../../components/LoadingButton";
import ConfirmModal from "../../../components/DeleteConfirmModal";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TypeCriticalReport } from "../../../common/enums/TypeCriticalReport";

const statusStyles: Record<
  StatusExchange,
  { textColor: string; backgroundColor: string }
> = {
  PENDING: {
    textColor: "text-[#00b0b9]",
    backgroundColor: "bg-[rgba(0,176,185,0.2)]",
  },
  APPROVED: {
    textColor: "text-[#FFA43D]",
    backgroundColor: "bg-[rgba(255,164,61,0.4)]",
  },
  REJECTED: {
    textColor: "text-[#FA5555]",
    backgroundColor: "bg-[rgba(250,85,85,0.2)]",
  },
  SUCCESSFUL: {
    textColor: "text-[#16A34A]",
    backgroundColor: "bg-[rgba(22,163,74,0.2)]",
  },
  FAILED: {
    textColor: "text-[#D067BD]",
    backgroundColor: "bg-[rgba(208,103,189,0.2)]",
  },
  NOT_YET_EXCHANGE: {
    textColor: "",
    backgroundColor: "",
  },
  PENDING_EVIDENCE: {
    textColor: "",
    backgroundColor: "",
  },
  CANCELLED: {
    textColor: "text-gray-500",
    backgroundColor: "bg-[rgba(116,139,150,0.2)]",
  },
};

const exchangeMethods = [
  { label: "Pick up in person", value: MethodExchange.PICK_UP_IN_PERSON },
  { label: "Delivery", value: MethodExchange.DELIVERY },
  {
    label: "Meet at a given location",
    value: MethodExchange.MEET_AT_GIVEN_LOCATION,
  },
];

const statusExchanges = [
  { label: "Approved", value: StatusExchange.APPROVED },
  { label: "Cancelled", value: StatusExchange.CANCELLED },
  { label: "Failed", value: StatusExchange.FAILED },
  { label: "Not yet exchange", value: StatusExchange.NOT_YET_EXCHANGE },
  { label: "Pending", value: StatusExchange.PENDING },
  { label: "Pending evidence", value: StatusExchange.PENDING_EVIDENCE },
  { label: "Rejected", value: StatusExchange.REJECTED },
  { label: "Successful", value: StatusExchange.SUCCESSFUL },
];

const ExchangeDetail: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "ExchangeDetail">>();
  const { statusDetail, exchangeId } = route.params;
  const dispatch = useDispatch<AppDispatch>();
  const { exchangeDetail, loading } = useSelector(
    (state: RootState) => state.exchange
  );
  const { user } = useSelector((state: RootState) => state.auth);

  const { textColor, backgroundColor } = statusStyles[statusDetail];
  const [locationVisible, setLocationVisible] = useState<boolean>(false);
  const [cancelVisible, setCancelVisible] = useState(false);

  useEffect(() => {
    dispatch(getExchangeDetailThunk(exchangeId));
  }, [dispatch, exchangeId]);

  const formatPrice = (price: number | undefined): string => {
    if (price === undefined) return "0";
    return price.toLocaleString("vi-VN");
  };

  const getMethodLabel = (method: MethodExchange | undefined): string => {
    const found = exchangeMethods.find((item) => item.value === method);
    return found ? found.label : "";
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

  const handleCancelExchange = async () => {
    setCancelVisible(false);
    navigation.navigate("MainTabs", { screen: "Exchanges" });
    await dispatch(cancelExchangeThunk(exchangeDetail?.id!));
  };

  const getStatusExchangeLabel = (
    status: StatusExchange | undefined
  ): string => {
    const found = statusExchanges.find((item) => item.value === status);
    return found ? found.label : "";
  };

  return (
    <>
      <SafeAreaView className="flex-1 bg-[#f6f9f9]" edges={["top"]}>
        <Header title="Exchange details" showOption={false} />
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#00b0b9" />
          </View>
        ) : (
          <ScrollView className="px-5">
            <View className="flex-row items-center justify-between pt-3 ">
              <View className="flex-row ">
                <Text className="text-gray-500 text-base">
                  Exchange ID:&nbsp;
                </Text>
                <Text className="text-gray-500 font-bold text-base">
                  #EX{exchangeDetail?.id}
                </Text>
              </View>
              <Text
                className={`items-center text-[13px] font-medium ${textColor} ${backgroundColor} rounded-full px-5 py-2`}
              >
                {getStatusExchangeLabel(statusDetail)}
              </Text>
            </View>
            <View className="flex-row justify-between items-center py-5">
              <View className="flex-row flex-1 items-center">
                <View className="items-center mr-2">
                  {user?.id !==
                  (exchangeDetail?.buyerItem === null
                    ? exchangeDetail?.paidBy.id
                    : exchangeDetail?.buyerItem.owner.id) ? (
                    <>
                      {exchangeDetail?.buyerItem === null ? (
                        <>
                          {exchangeDetail?.paidBy.image ? (
                            <View className="w-16 h-16 rounded-full items-center justify-center">
                              <Image
                                source={{
                                  uri: exchangeDetail?.paidBy.image,
                                }}
                                className="w-full h-full rounded-full"
                              />
                            </View>
                          ) : (
                            <View className="w-16 h-16 rounded-full items-center justify-center">
                              <Icon
                                name="person-circle-outline"
                                size={60}
                                color="gray"
                              />
                            </View>
                          )}
                        </>
                      ) : (
                        <>
                          {exchangeDetail?.buyerItem.owner.image ? (
                            <View className="w-16 h-16 rounded-full items-center justify-center">
                              <Image
                                source={{
                                  uri: exchangeDetail?.buyerItem.owner.image,
                                }}
                                className="w-full h-full rounded-full"
                              />
                            </View>
                          ) : (
                            <View className="w-16 h-16 rounded-full items-center justify-center">
                              <Icon
                                name="person-circle-outline"
                                size={60}
                                color="gray"
                              />
                            </View>
                          )}
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      {exchangeDetail?.sellerItem.owner.image ? (
                        <View className="w-16 h-16 rounded-full items-center justify-center">
                          <Image
                            source={{
                              uri: exchangeDetail?.sellerItem.owner.image,
                            }}
                            className="w-full h-full rounded-full"
                          />
                        </View>
                      ) : (
                        <View className="w-16 h-16 rounded-full items-center justify-center">
                          <Icon
                            name="person-circle-outline"
                            size={60}
                            color="gray"
                          />
                        </View>
                      )}
                    </>
                  )}
                </View>
                <View className="flex-1">
                  <Text
                    className="justify-start items-center text-left text-[18px] font-medium text-black"
                    numberOfLines={1}
                  >
                    {user?.id !== exchangeDetail?.sellerItem.owner.id
                      ? exchangeDetail?.sellerItem.owner.fullName
                      : exchangeDetail?.buyerItem === null
                      ? exchangeDetail.paidBy.fullName
                      : exchangeDetail?.buyerItem.owner.fullName}
                  </Text>
                  <Text className="justify-start items-center text-left text-[14px] font-normal text-[#6b7280]">
                    {user?.id !== exchangeDetail?.sellerItem.owner.id
                      ? "@Seller"
                      : "@Buyer"}
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
                <Icon
                  name="swap-horizontal-outline"
                  size={26}
                  color="#00B0B9"
                />
              </View>
              <View className="flex-row items-center flex-1">
                <View className="flex-1">
                  <Text
                    className="justify-start items-center text-right text-[18px] font-medium text-black"
                    numberOfLines={1}
                  >
                    {user?.id ===
                    (exchangeDetail?.buyerItem === null
                      ? exchangeDetail.paidBy.id
                      : exchangeDetail?.buyerItem.owner.id)
                      ? exchangeDetail?.buyerItem === null
                        ? exchangeDetail.paidBy.fullName
                        : exchangeDetail?.buyerItem.owner.fullName
                      : exchangeDetail?.sellerItem.owner.fullName}
                  </Text>
                  <Text className="justify-start items-center text-right text-[14px] font-normal text-[#6b7280]">
                    {user?.id ===
                    (exchangeDetail?.buyerItem === null
                      ? exchangeDetail.paidBy.id
                      : exchangeDetail?.buyerItem.owner.id)
                      ? "@Buyer"
                      : "@Seller"}
                  </Text>
                </View>
                <View className="items-center ml-2">
                  {user?.id ===
                  (exchangeDetail?.buyerItem === null
                    ? exchangeDetail?.paidBy.id
                    : exchangeDetail?.buyerItem.owner.id) ? (
                    <Text className="justify-start items-center text-left text-[16px] font-medium text-black">
                      {exchangeDetail?.buyerItem === null ? (
                        <>
                          {exchangeDetail?.paidBy.image ? (
                            <View className="w-16 h-16 rounded-full items-center justify-center">
                              <Image
                                source={{
                                  uri: exchangeDetail?.paidBy.image,
                                }}
                                className="w-full h-full rounded-full"
                              />
                            </View>
                          ) : (
                            <View className="w-16 h-16 rounded-full items-center justify-center">
                              <Icon
                                name="person-circle-outline"
                                size={60}
                                color="gray"
                              />
                            </View>
                          )}
                        </>
                      ) : (
                        <>
                          {exchangeDetail?.buyerItem.owner.image ? (
                            <View className="w-16 h-16 rounded-full items-center justify-center">
                              <Image
                                source={{
                                  uri: exchangeDetail?.buyerItem.owner.image,
                                }}
                                className="w-full h-full rounded-full"
                              />
                            </View>
                          ) : (
                            <View className="w-16 h-16 rounded-full items-center justify-center">
                              <Icon
                                name="person-circle-outline"
                                size={60}
                                color="gray"
                              />
                            </View>
                          )}
                        </>
                      )}
                    </Text>
                  ) : (
                    <>
                      {exchangeDetail?.sellerItem.owner.image ? (
                        <View className="w-16 h-16 rounded-full items-center justify-center">
                          <Image
                            source={{
                              uri: exchangeDetail?.sellerItem.owner.image,
                            }}
                            className="w-full h-full rounded-full"
                          />
                        </View>
                      ) : (
                        <View className="w-16 h-16 rounded-full items-center justify-center">
                          <Icon
                            name="person-circle-outline"
                            size={60}
                            color="gray"
                          />
                        </View>
                      )}
                    </>
                  )}
                </View>
              </View>
            </View>
            <View>
              <View className="flex-row justify-between">
                <Text className="font-bold text-lg text-gray-500">
                  Their item
                </Text>
                <Text className="font-bold text-lg text-gray-500">
                  Your item
                </Text>
              </View>
              <View className="flex-row justify-between mt-2">
                {user?.id === exchangeDetail?.sellerItem.owner.id ? (
                  <>
                    {exchangeDetail?.buyerItem === null ? (
                      <View className="bg-white rounded-lg p-4 shadow-sm w-[47%] justify-center items-center">
                        <Text className="text-gray-500 text-lg">None</Text>
                      </View>
                    ) : (
                      <View className="bg-white rounded-lg p-4 shadow-sm w-[47%]">
                        <View className="w-full h-40">
                          <Image
                            source={{
                              uri: exchangeDetail?.buyerItem.imageUrl.split(
                                ", "
                              )[0],
                            }}
                            className="w-full h-full object-contain"
                            resizeMode="contain"
                          />
                        </View>

                        <Text className="mt-2 text-base text-gray-500">
                          {exchangeDetail?.buyerItem.itemName}
                        </Text>
                        <Text className="text-sm">
                          {exchangeDetail?.buyerItem.price! === 0
                            ? "Free"
                            : formatPrice(exchangeDetail?.buyerItem.price!) +
                              " VND"}
                        </Text>
                      </View>
                    )}

                    <View className="bg-white rounded-lg p-4 shadow-sm w-[47%]">
                      <View className="w-full h-40">
                        <Image
                          source={{
                            uri: exchangeDetail?.sellerItem.imageUrl.split(
                              ", "
                            )[0],
                          }}
                          className="w-full h-full object-contain"
                          resizeMode="contain"
                        />
                      </View>
                      <Text className="mt-2 text-base text-gray-500">
                        {exchangeDetail?.sellerItem.itemName}
                      </Text>
                      <Text className="text-sm">
                        {exchangeDetail?.sellerItem.price! === 0
                          ? "Free"
                          : formatPrice(exchangeDetail?.sellerItem.price!) +
                            " VND"}
                      </Text>
                    </View>
                  </>
                ) : (
                  <>
                    <View className="bg-white rounded-lg p-4 shadow-sm w-[47%]">
                      <View className="w-full h-40">
                        <Image
                          source={{
                            uri: exchangeDetail?.sellerItem.imageUrl.split(
                              ", "
                            )[0],
                          }}
                          className="w-full h-full object-contain"
                          resizeMode="contain"
                        />
                      </View>

                      <Text className="mt-2 text-base text-gray-500">
                        {exchangeDetail?.sellerItem.itemName}
                      </Text>
                      <Text className="text-sm">
                        {exchangeDetail?.sellerItem.price! === 0
                          ? "Free"
                          : formatPrice(exchangeDetail?.sellerItem.price!) +
                            " VND"}
                      </Text>
                    </View>

                    {exchangeDetail?.buyerItem === null ? (
                      <View className="bg-white rounded-lg p-4 shadow-sm w-[47%] justify-center items-center">
                        <Text className="text-gray-500 text-lg">None</Text>
                      </View>
                    ) : (
                      <View className="bg-white rounded-lg p-4 shadow-sm w-[47%]">
                        <View className="w-full h-40">
                          <Image
                            source={{
                              uri: exchangeDetail?.buyerItem.imageUrl.split(
                                ", "
                              )[0],
                            }}
                            className="w-full h-full object-contain"
                            resizeMode="contain"
                          />
                        </View>
                        <Text className="mt-2 text-base text-gray-500">
                          {exchangeDetail?.buyerItem.itemName}
                        </Text>
                        <Text className="text-sm">
                          {exchangeDetail?.buyerItem.price! === 0
                            ? "Free"
                            : formatPrice(exchangeDetail?.buyerItem.price!) +
                              " VND"}
                        </Text>
                      </View>
                    )}
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
                    {getMethodLabel(exchangeDetail?.methodExchange)}
                  </Text>
                  <Text className="text-right text-base text-[#00b0b9]">
                    {exchangeDetail?.sellerItem.desiredItem === null
                      ? "Open"
                      : "Open with desired item"}
                  </Text>
                  <Pressable onPress={() => setLocationVisible(true)}>
                    <View className="flex-row items-center justify-end">
                      <Icon name="location-outline" size={20} color="#00B0B9" />
                      <Text
                        className="ml-[2px] text-base underline text-[#00b0b9] flex-1"
                        numberOfLines={1}
                      >
                        {exchangeDetail?.exchangeLocation.split("//")[1].trim()}
                      </Text>
                    </View>
                  </Pressable>

                  <View className="flex-row items-center justify-end">
                    <Icon
                      name="calendar-clear-outline"
                      size={20}
                      color="#00B0B9"
                    />
                    <Text className="ml-[2px] text-right text-base underline text-[#00b0b9]">
                      {formatExchangeDate(exchangeDetail?.exchangeDate!)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {exchangeDetail?.sellerItem.termsAndConditionsExchange && (
              <View className="mt-8">
                <Text className="font-bold text-lg text-gray-500">
                  Term & Conditions
                </Text>
                <View className="bg-white mt-2 rounded-lg p-4 flex-col justify-center h-fit">
                  {exchangeDetail.sellerItem.termsAndConditionsExchange
                    .split("\\n")
                    .map((line, index) => (
                      <Text className="text-base text-gray-500" key={index}>
                        {line}
                      </Text>
                    ))}
                </View>
              </View>
            )}

            {exchangeDetail?.additionalNotes && (
              <View className="mt-8">
                <Text className="font-bold text-lg text-gray-500">Note</Text>
                <View className="bg-white mt-2 rounded-lg p-4 h-fit">
                  {exchangeDetail.additionalNotes
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
                {user?.id === exchangeDetail?.sellerItem.owner.id ? (
                  <>
                    <View className="flex-row items-center justify-between">
                      <Text className="text-base text-gray-800">
                        Your item price
                      </Text>
                      <Text className="text-base text-gray-800">
                        {exchangeDetail?.sellerItem.price! === 0
                          ? "Free"
                          : formatPrice(exchangeDetail?.sellerItem.price!) +
                            " VND"}
                      </Text>
                    </View>
                    {exchangeDetail?.buyerItem === null ? (
                      ""
                    ) : (
                      <View className="flex-row items-center justify-between mt-1">
                        <Text className="text-base text-gray-800">
                          Their item price
                        </Text>
                        <Text className="text-base text-gray-800">
                          {exchangeDetail?.buyerItem.price! === 0
                            ? "Free"
                            : formatPrice(exchangeDetail?.buyerItem.price!) +
                              " VND"}
                        </Text>
                      </View>
                    )}
                  </>
                ) : (
                  <>
                    {exchangeDetail?.buyerItem === null ? (
                      ""
                    ) : (
                      <View className="flex-row items-center justify-between">
                        <Text className="text-base text-gray-800">
                          Your item price
                        </Text>
                        <Text className="text-base text-gray-800">
                          {exchangeDetail?.buyerItem.price! === 0
                            ? "Free"
                            : formatPrice(exchangeDetail?.buyerItem.price!) +
                              " VND"}
                        </Text>
                      </View>
                    )}
                    <View className="flex-row items-center justify-between mt-1">
                      <Text className="text-base text-gray-800">
                        Their item price
                      </Text>
                      <Text className="text-base text-gray-800">
                        {exchangeDetail?.sellerItem.price! === 0
                          ? "Free"
                          : formatPrice(exchangeDetail?.sellerItem.price!) +
                            " VND"}
                      </Text>
                    </View>
                  </>
                )}

                <View className="border-[0.2px] border-gray-300 my-2"></View>

                <View className="flex-row items-center justify-between">
                  <Text className="font-bold text-lg">
                    Estimated difference
                  </Text>
                  <Text className="font-bold text-lg text-[#00b0b9]">
                    {exchangeDetail?.estimatePrice === 0
                      ? "Free"
                      : formatPrice(exchangeDetail?.estimatePrice) + " VND"}
                  </Text>
                </View>
                <View className="flex-row items-center justify-end">
                  <Text className="text-sm text-right text-gray-500">
                    {exchangeDetail?.estimatePrice === 0
                      ? `This is a free item exchange${"\n"}so payment is not needed`
                      : "Paid by: " +
                        (exchangeDetail?.paidBy.id === user?.id
                          ? "You"
                          : exchangeDetail?.paidBy.fullName)}
                  </Text>
                </View>
              </View>
            </View>

            {exchangeDetail?.finalPrice !== exchangeDetail?.estimatePrice && (
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
                      {formatPrice(exchangeDetail?.finalPrice)} VND
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {exchangeDetail?.exchangeHistory !== null && (
              <UploadEvidence status={statusDetail} />
            )}

            {exchangeDetail?.statusExchangeRequest ===
              StatusExchange.APPROVED && (
              <View className="flex-row items-center justify-center mb-5">
                <Icon name="flag-outline" size={20} color="#00B0B9" />
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("CriticalReport", {
                      id: exchangeDetail?.id,
                      typeOfReport: TypeCriticalReport.EXCHANGE,
                      exchangeReport: exchangeDetail,
                    })
                  }
                >
                  <Text className="font-semibold text-lg text-gray-500 ml-2 underline">
                    Report exchange
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        )}
      </SafeAreaView>

      <View
        className={`${
          Platform.OS === "ios" ? "pt-4 pb-7" : "py-3"
        } px-5 bg-white mt-auto rounded-t-xl flex-row items-center`}
      >
        {exchangeDetail?.exchangeDate &&
          new Date(exchangeDetail.exchangeDate) > new Date() &&
          exchangeDetail?.statusExchangeRequest === StatusExchange.APPROVED &&
          user?.id ===
            (exchangeDetail?.buyerItem?.owner?.id ??
              exchangeDetail?.paidBy.id) && (
            <View className="flex-1 mr-2">
              <LoadingButton
                title="Cancel exchange"
                onPress={() => setCancelVisible(true)}
                buttonClassName="p-4 border-[#00B0B9] border-2 bg-white"
                textColor="text-[#00B0B9]"
              />
            </View>
          )}
      </View>

      <ConfirmModal
        title="Cancel exchange request"
        content={`Are you sure to cancel exchange request?`}
        visible={cancelVisible}
        onCancel={() => setCancelVisible(false)}
        onConfirm={handleCancelExchange}
      />

      {exchangeDetail?.exchangeLocation && (
        <LocationModal
          visible={locationVisible}
          onClose={() => setLocationVisible(false)}
          place_id={exchangeDetail?.exchangeLocation.split("//")[0].trim()}
        />
      )}
    </>
  );
};

export default ExchangeDetail;
