import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Platform,
  Image,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Header from "../../../components/Header";
import { RootStackParamList } from "../../../navigation/AppNavigator";
import LoadingButton from "../../../components/LoadingButton";
import NegotiateModal from "../../../components/NegotiateModal";
import { ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import {
  cancelExchangeThunk,
  confirmNegotiatedPriceThunk,
  getAllExchangesByStatusOfCurrentUserThunk,
  getExchangeCountsThunk,
  getExchangeDetailThunk,
  reviewExchangeRequestThunk,
} from "../../../redux/thunk/exchangeThunk";
import LocationModal from "../../../components/LocationModal";
import { SafeAreaView } from "react-native-safe-area-context";
import ConfirmModal from "../../../components/DeleteConfirmModal";
import ErrorModal from "../../../components/ErrorModal";
import { StatusExchange } from "../../../common/enums/StatusExchange";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MethodExchange } from "../../../common/enums/MethodExchange";
import { resetExchange } from "../../../redux/slices/exchangeSlice";

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

const AccpectRejectExchange: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route =
    useRoute<RouteProp<RootStackParamList, "AccpectRejectExchange">>();
  const { exchangeId } = route.params;
  const dispatch = useDispatch<AppDispatch>();

  const { exchangeDetail, exchangeByStatus, loading } = useSelector(
    (state: RootState) => state.exchange
  );
  const { user } = useSelector((state: RootState) => state.auth);

  const [negotiateVisible, setNegotiateVisible] = useState(false);
  const [locationVisible, setLocationVisible] = useState<boolean>(false);
  const [confirmPriceVisible, setConfirmPriceVisible] = useState(false);
  const [approveVisible, setApproveVisible] = useState(false);
  const [rejectVisible, setRejectVisible] = useState(false);
  const [cancelVisible, setCancelVisible] = useState(false);
  const [errorVisible, setErrorVisible] = useState<boolean>(false);

  const handleNegotiatePrice = () => {
    const isBuyer = user?.id === exchangeDetail?.buyerItem.owner.id;
    const isSeller = user?.id === exchangeDetail?.sellerItem.owner.id;
    const confirmed =
      (isBuyer && exchangeDetail?.buyerConfirmation) ||
      (isSeller && exchangeDetail?.sellerConfirmation);

    if (
      confirmed &&
      exchangeDetail.finalPrice !== exchangeDetail.estimatePrice
    ) {
      setErrorVisible(true);
    } else {
      setNegotiateVisible(true);
    }
  };

  useEffect(() => {
    dispatch(getExchangeDetailThunk(exchangeId));
  }, [dispatch, exchangeId]);

  const formatPrice = (price: number | undefined): string => {
    if (price === undefined) return "0";
    return price.toLocaleString("vi-VN");
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

  const handleConfirmPrice = async () => {
    setConfirmPriceVisible(false);
    await dispatch(confirmNegotiatedPriceThunk(exchangeDetail?.id!));
  };

  const handleApproveExchange = async () => {
    setApproveVisible(false);

    await dispatch(
      reviewExchangeRequestThunk({
        exchangeId: exchangeDetail?.id!,
        statusExchangeRequest: StatusExchange.APPROVED,
      })
    );

    dispatch(resetExchange());
    await dispatch(
      getAllExchangesByStatusOfCurrentUserThunk({
        pageNo: 0,
        statusExchangeRequest: StatusExchange.PENDING,
      })
    );

    await dispatch(getExchangeCountsThunk());
    if (exchangeByStatus.content.length !== 0) {
      navigation.goBack();
    }
  };

  const handleRejectExchange = async () => {
    setRejectVisible(false);
    navigation.goBack();
    await dispatch(
      reviewExchangeRequestThunk({
        exchangeId: exchangeDetail?.id!,
        statusExchangeRequest: StatusExchange.REJECTED,
      })
    );

    dispatch(resetExchange());
    await dispatch(
      getAllExchangesByStatusOfCurrentUserThunk({
        pageNo: 0,
        statusExchangeRequest: StatusExchange.PENDING,
      })
    );

    await dispatch(getExchangeCountsThunk());
    if (exchangeByStatus.content.length !== 0) {
      navigation.goBack();
    }
  };

  const handleCancelExchange = async () => {
    setCancelVisible(false);
    navigation.goBack();
    await dispatch(cancelExchangeThunk(exchangeDetail?.id!));

    dispatch(resetExchange());
    await dispatch(
      getAllExchangesByStatusOfCurrentUserThunk({
        pageNo: 0,
        statusExchangeRequest: StatusExchange.PENDING,
      })
    );

    await dispatch(getExchangeCountsThunk());
    if (exchangeByStatus.content.length !== 0) {
      navigation.goBack();
    }
  };

  const getMethodLabel = (method: MethodExchange | undefined): string => {
    const found = exchangeMethods.find((item) => item.value === method);
    return found ? found.label : "";
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
                  #{exchangeDetail?.id}
                </Text>
              </View>
              <Text className="items-center text-sm font-medium text-[#00b0b9] bg-[rgb(0,176,185,0.2)] rounded-full px-5 py-2">
                {getStatusExchangeLabel(exchangeDetail?.statusExchangeRequest)}
              </Text>
            </View>
            <View className="flex-row justify-between items-center py-5">
              <View className="flex-row items-center">
                <View className="items-center">
                  <Icon name="person-circle-outline" size={60} color="gray" />
                </View>
                <View>
                  <Text className="justify-start items-center text-left text-[18px] font-medium text-black">
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
              <View className="flex-row items-center">
                <View>
                  <Text className="justify-start items-center text-right text-[18px] font-medium text-black">
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

                        <Text
                          className="mt-2 text-base text-gray-500"
                          numberOfLines={1}
                        >
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
                      <Text
                        className="mt-2 text-base text-gray-500"
                        numberOfLines={1}
                      >
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

                      <Text
                        className="mt-2 text-base text-gray-500"
                        numberOfLines={1}
                      >
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
                        <Text
                          className="mt-2 text-base text-gray-500"
                          numberOfLines={1}
                        >
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
                  <Text className="text-base text-gray-500">
                    {exchangeDetail.sellerItem.termsAndConditionsExchange}
                  </Text>
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

            <View className="mt-8">
              <View className="flex-row justify-between">
                <Text className="font-bold text-lg text-gray-500">
                  Price of item
                </Text>
                {exchangeDetail?.numberOfOffer !== 0 &&
                  exchangeDetail?.estimatePrice !== 0 &&
                  ((!exchangeDetail?.buyerConfirmation &&
                    !exchangeDetail?.sellerConfirmation) ||
                    !exchangeDetail?.buyerConfirmation ||
                    !exchangeDetail?.sellerConfirmation) && (
                    <Pressable onPress={handleNegotiatePrice}>
                      <Icon name="create-outline" size={24} color="#00b0b9" />
                    </Pressable>
                  )}
              </View>

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
              <View className="mt-8">
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
                  <View className="flex-row items-center justify-end">
                    <Text className="text-sm text-gray-500">
                      {exchangeDetail?.numberOfOffer} offer remaining
                    </Text>
                  </View>
                </View>
              </View>
            )}

            <View className="my-8">
              <Text className="font-bold text-lg text-gray-500">
                Confirmed price
              </Text>

              <View className="bg-white mt-2 rounded-lg p-4 flex-col justify-center h-fit">
                {user?.id === exchangeDetail?.sellerItem.owner.id ? (
                  <>
                    <View className="flex-row items-center justify-between pr-5">
                      <View className="flex-row items-center">
                        <View className="items-center">
                          <Icon
                            name="person-circle-outline"
                            size={60}
                            color="gray"
                          />
                        </View>
                        <Text className="ml-2 text-lg font-medium text-black">
                          You
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => setConfirmPriceVisible(true)}
                        disabled={exchangeDetail?.sellerConfirmation}
                        className={`w-8 h-8 rounded-md justify-center items-center ${
                          exchangeDetail?.sellerConfirmation
                            ? "bg-[rgb(0,176,185,0.2)]"
                            : "bg-gray-300"
                        }`}
                      >
                        {exchangeDetail?.sellerConfirmation && (
                          <Icon
                            name="checkmark-outline"
                            size={25}
                            color="#00B0B9"
                          />
                        )}
                      </TouchableOpacity>
                    </View>

                    <View className="border-[0.2px] border-gray-300 my-3"></View>

                    <View className="flex-row items-center justify-between pr-5">
                      <View className="flex-row items-center">
                        <View className="items-center">
                          <Icon
                            name="person-circle-outline"
                            size={60}
                            color="gray"
                          />
                        </View>
                        <Text className="ml-2 text-lg font-medium text-black">
                          {exchangeDetail?.buyerItem === null
                            ? exchangeDetail.paidBy.fullName
                            : exchangeDetail?.buyerItem.owner.fullName}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => {}}
                        disabled={true}
                        className={`w-8 h-8 rounded-md justify-center items-center ${
                          exchangeDetail?.buyerConfirmation
                            ? "bg-[rgb(0,176,185,0.2)]"
                            : "bg-gray-300"
                        }`}
                      >
                        {exchangeDetail?.buyerConfirmation && (
                          <Icon
                            name="checkmark-outline"
                            size={25}
                            color="#00B0B9"
                          />
                        )}
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  <>
                    <View className="flex-row items-center justify-between pr-5">
                      <View className="flex-row items-center">
                        <View className="items-center">
                          <Icon
                            name="person-circle-outline"
                            size={60}
                            color="gray"
                          />
                        </View>
                        <Text className="ml-2 text-lg font-medium text-black">
                          You
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => setConfirmPriceVisible(true)}
                        disabled={exchangeDetail?.buyerConfirmation}
                        className={`w-8 h-8 rounded-md justify-center items-center ${
                          exchangeDetail?.buyerConfirmation
                            ? "bg-[rgb(0,176,185,0.2)]"
                            : "bg-gray-300"
                        }`}
                      >
                        {exchangeDetail?.buyerConfirmation && (
                          <Icon
                            name="checkmark-outline"
                            size={25}
                            color="#00B0B9"
                          />
                        )}
                      </TouchableOpacity>
                    </View>

                    <View className="border-[0.2px] border-gray-300 my-3"></View>

                    <View className="flex-row items-center justify-between pr-5">
                      <View className="flex-row items-center">
                        <View className="items-center">
                          <Icon
                            name="person-circle-outline"
                            size={60}
                            color="gray"
                          />
                        </View>
                        <Text className="ml-2 text-lg font-medium text-black">
                          {exchangeDetail?.sellerItem.owner.fullName}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => {}}
                        disabled={true}
                        className={`w-8 h-8 rounded-md justify-center items-center ${
                          exchangeDetail?.sellerConfirmation
                            ? "bg-[rgb(0,176,185,0.2)]"
                            : "bg-gray-300"
                        }`}
                      >
                        {exchangeDetail?.sellerConfirmation && (
                          <Icon
                            name="checkmark-outline"
                            size={25}
                            color="#00B0B9"
                          />
                        )}
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
            </View>
          </ScrollView>
        )}
      </SafeAreaView>

      <NegotiateModal
        visible={negotiateVisible}
        onCancel={() => setNegotiateVisible(false)}
      />

      {!loading && (
        <View
          className={`${
            Platform.OS === "ios" ? "pt-4 pb-7" : "py-3"
          } px-5 bg-white mt-auto rounded-t-xl flex-row items-center`}
        >
          {exchangeDetail?.sellerItem.owner.id === user?.id ? (
            <>
              <View className="flex-1 mr-2">
                <LoadingButton
                  title="Reject"
                  onPress={() => setRejectVisible(true)}
                  buttonClassName="p-4 border-[#00B0B9] border-2 bg-white"
                  textColor="text-[#00B0B9]"
                />
              </View>
              <View className="flex-1">
                <LoadingButton
                  title="Approve"
                  onPress={() => setApproveVisible(true)}
                  disable={
                    exchangeDetail?.buyerConfirmation &&
                    exchangeDetail.sellerConfirmation
                      ? false
                      : true
                  }
                  buttonClassName={`p-4 border-2 border-transparent ${
                    exchangeDetail?.buyerConfirmation &&
                    exchangeDetail.sellerConfirmation
                      ? ""
                      : "bg-gray-300"
                  }`}
                />
              </View>
            </>
          ) : (
            <>
              {exchangeDetail?.exchangeDate &&
                new Date(exchangeDetail.exchangeDate) > new Date() && (
                  <View className="flex-1 mr-2">
                    <LoadingButton
                      title="Cancel exchange"
                      onPress={() => setCancelVisible(true)}
                      buttonClassName="p-4 border-[#00B0B9] border-2 bg-white"
                      textColor="text-[#00B0B9]"
                    />
                  </View>
                )}
            </>
          )}
        </View>
      )}

      <ConfirmModal
        title="Confirm price"
        content={`Are you sure to with present of exchange?`}
        visible={confirmPriceVisible}
        onCancel={() => setConfirmPriceVisible(false)}
        onConfirm={handleConfirmPrice}
      />

      <ConfirmModal
        title="Approve exchange request"
        content={`Are you sure to approve exchange request?`}
        visible={approveVisible}
        onCancel={() => setApproveVisible(false)}
        onConfirm={handleApproveExchange}
      />

      <ConfirmModal
        title="Reject exchange request"
        content={`Are you sure to reject exchange request?`}
        visible={rejectVisible}
        onCancel={() => setRejectVisible(false)}
        onConfirm={handleRejectExchange}
      />

      <ConfirmModal
        title="Cancel exchange request"
        content={`Are you sure to cancel exchange request?`}
        visible={cancelVisible}
        onCancel={() => setCancelVisible(false)}
        onConfirm={handleCancelExchange}
      />

      <ErrorModal
        title={"Warning"}
        content={"Please wait for other confirmation"}
        visible={errorVisible}
        onCancel={() => setErrorVisible(false)}
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

export default AccpectRejectExchange;
