import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  ActivityIndicator,
} from "react-native";
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../../components/Header";
import Icon from "react-native-vector-icons/Ionicons";
import {
  PaymentHistoryDto,
  SearchPaymentHistoryRequest,
} from "../../../common/models/payment";
import { searchPaymentHistoryOfUserPaginationThunk } from "../../../redux/thunk/paymentThunk";
import { AppDispatch, RootState } from "../../../redux/store";
import { StatusPayment } from "../../../common/enums/StatusPayment";
import { MethodPayment } from "../../../common/enums/MethodPayment";
import { SafeAreaView } from "react-native-safe-area-context";

const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

const formatPrice = (price: number | undefined): string => {
  return price !== undefined ? price.toLocaleString("vi-VN") : "0";
};

const formatPaymentTime = (paymentTime: string): string => {
  const dt = new Date(paymentTime);

  const formattedTime = dt.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${formattedTime} `;
};

const methodPayments = [
  { label: "APPLE PAY", value: MethodPayment.APPLE_PAY },
  { label: "BANK", value: MethodPayment.BANK_TRANSFER },
  { label: "CASH", value: MethodPayment.CASH },
  { label: "CREDIT CARD", value: MethodPayment.CREDIT_CARD },
  { label: "MASTER CARD", value: MethodPayment.MASTER_CARD },
  { label: "OTHER", value: MethodPayment.OTHER },
  { label: "PAYPAL", value: MethodPayment.PAYPAL },
  { label: "VISA", value: MethodPayment.VISA },
];

const statusPayments = [
  { label: "FAILED", value: StatusPayment.FAILED },
  { label: "SUCCESS", value: StatusPayment.SUCCESS },
  { label: "PENDING", value: StatusPayment.PENDING },
];

const dateRanges = ["15 days", "30 days", "3 months", "6 months", "1 year"];

const getDateRange = (range: string): { fromDate: Date; toDate: Date } => {
  const today = new Date();
  let fromDate = new Date();
  let toDate = new Date();

  switch (range) {
    case "15 days":
      fromDate.setDate(today.getDate() - 15);
      break;
    case "30 days":
      fromDate.setDate(today.getDate() - 30);
      break;
    case "3 months":
      fromDate.setMonth(today.getMonth() - 3);
      break;
    case "6 months":
      fromDate.setMonth(today.getMonth() - 6);
      break;
    case "1 year":
      fromDate.setFullYear(today.getFullYear() - 1);
      break;
    default:
      fromDate.setDate(today.getDate() - 15);
  }

  toDate.setDate(toDate.getDate() + 1);

  return {
    fromDate,
    toDate,
  };
};

export default function PaymentHistory(): JSX.Element {
  const [transactionIdSearch, setTransactionIdSearch] = useState<string>("");
  const [dateRange, setDateRange] = useState<string>("Select date");
  const [showDateModal, setShowDateModal] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { searchPaymentHistory, loadingPayment } = useSelector(
    (state: RootState) => state.payment
  );
  const { content, pageNo, last } = searchPaymentHistory;
  const isFirstRender = useRef(true);

  const searchRequest: SearchPaymentHistoryRequest = {};

  useEffect(() => {
    if (user?.id) {
      dispatch(
        searchPaymentHistoryOfUserPaginationThunk({
          pageNo: 0,
          userId: user.id,
          request: searchRequest,
        })
      );
    }
  }, [user?.id]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const delayDebounce = setTimeout(() => {
      if (user?.id) {
        const { fromDate, toDate } = getDateRange(dateRange);

        dispatch(
          searchPaymentHistoryOfUserPaginationThunk({
            pageNo: 0,
            userId: user.id,
            request: {
              transactionId: Number(transactionIdSearch) || undefined,
              fromTransactionDate: fromDate || undefined,
              toTransactionDate: toDate || undefined,
            },
          })
        );
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [transactionIdSearch, dateRange]);

  const handleLoadMore = () => {
    if (!loadingPayment && !last && user?.id) {
      const { fromDate, toDate } = getDateRange(dateRange);

      dispatch(
        searchPaymentHistoryOfUserPaginationThunk({
          pageNo: pageNo + 1,
          userId: user.id,
          request: {
            ...searchRequest,
            transactionId: Number(transactionIdSearch) || undefined,
            fromTransactionDate: fromDate || undefined,
            toTransactionDate: toDate || undefined,
          },
        })
      );
    }
  };

  const getMethodPaymentLabel = (status: MethodPayment | undefined): string => {
    const found = methodPayments.find((item) => item.value === status);
    return found ? found.label : "";
  };

  const getStatusPaymentLabel = (status: StatusPayment | undefined): string => {
    const found = statusPayments.find((item) => item.value === status);
    return found ? found.label : "";
  };

  const getStatusColor = (status: StatusPayment): string => {
    return status === StatusPayment.SUCCESS
      ? "text-green-600"
      : status === StatusPayment.PENDING
      ? "text-yellow-600"
      : "text-red-600";
  };

  const getStatusBackground = (status: StatusPayment): string => {
    return status === StatusPayment.SUCCESS
      ? "bg-green-100"
      : status === StatusPayment.PENDING
      ? "bg-yellow-100"
      : "bg-red-100";
  };

  const getStatusIconColor = (status: StatusPayment): string => {
    return status === StatusPayment.SUCCESS
      ? "green"
      : status === StatusPayment.PENDING
      ? "#d97706"
      : "red";
  };

  const getStatusIconName = (
    status: StatusPayment
  ): keyof typeof Feather.glyphMap => {
    return status === StatusPayment.SUCCESS
      ? "check-circle"
      : status === StatusPayment.PENDING
      ? "clock"
      : "x-circle";
  };

  const renderTransaction = ({ item }: { item: PaymentHistoryDto }) => (
    <View className="flex-row items-center justify-between bg-white rounded-lg p-4 mx-2 my-2 shadow mb-2">
      <View className="flex-row items-center">
        <View
          className={`p-3 rounded-full ${getStatusBackground(
            item.statusPayment
          )}`}
        >
          <Feather
            name={getStatusIconName(item.statusPayment)}
            size={24}
            color={getStatusIconColor(item.statusPayment)}
          />
        </View>
        <View className="ml-4">
          <Text className="font-semibold text-gray-800">
            {item.description}
          </Text>
          <Text className="text-sm text-gray-500 my-1">
            ID: #{item.transactionId}
          </Text>
          <Text className="text-sm text-gray-500 my-1">
            {formatDate(new Date(item.transactionDateTime)) +
              " - " +
              formatPaymentTime(item.transactionDateTime.toString())}
          </Text>

          <View className="mt-1 flex-row items-center">
            <MaterialIcons name="payment" size={16} color="#888" />
            <Text className="text-xs text-gray-500 ml-1">
              {getMethodPaymentLabel(item.methodPayment)}
            </Text>
          </View>
        </View>
      </View>
      <View className="flex-col justify-between">
        <Text
          className={`text-sm ml-auto px-2 py-1 items-center text-center bg-black font-medium ${getStatusColor(
            item.statusPayment
          )} ${getStatusBackground(item.statusPayment)} rounded-full`}
        >
          {getStatusPaymentLabel(item.statusPayment)}
        </Text>

        <Text
          className={`font-semibold text-lg ${getStatusColor(
            item.statusPayment
          )}`}
        >
          {`-${formatPrice(item.amount)} VND`}
        </Text>
      </View>
    </View>
  );

  const ListHeaderComponent = (
    <>
      <Header title="Payment history" showOption={false} />

      {/* Filter UI */}
      <View className="px-4 pt-3 pb-2 bg-white">
        <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-3 mb-2">
          <Feather name="search" size={20} color="#999" />
          <TextInput
            placeholder="Search Transaction ID"
            keyboardType="numeric"
            value={transactionIdSearch}
            onChangeText={(text) => {
              const numericText = text.replace(/[^0-9]/g, "");
              setTransactionIdSearch(numericText);
            }}
            className="ml-2 text-base flex-1 text-gray-800"
          />
        </View>

        <View className="flex-row justify-between items-center my-2 px-3">
          <View className="flex-row items-center">
            <Feather name="calendar" size={20} color="#555" />
            <Text className="ml-2 text-gray-700">Date Range</Text>
          </View>
          <TouchableOpacity
            className="flex-row items-center"
            onPress={() => setShowDateModal(true)}
          >
            <Text className="text-[#00b0b9] font-semibold mr-1">
              {dateRange}
            </Text>
            <AntDesign name="down" size={12} color="#00b0b9" />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );

  return (
    <>
      <SafeAreaView className="flex-1" edges={["top"]}>
        <FlatList
          data={content}
          renderItem={({ item }) => renderTransaction({ item })}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          ListHeaderComponent={ListHeaderComponent}
          ListEmptyComponent={() => {
            if (loadingPayment) {
              return (
                <View className="flex-1 justify-center items-center">
                  <ActivityIndicator size="large" color="#00b0b9" />
                </View>
              );
            }
            return (
              <View className="flex-1 justify-center items-center">
                <Icon
                  name="remove-circle-outline"
                  size={70}
                  color={"#00b0b9"}
                />
                <Text className="text-gray-500">No payment history</Text>
              </View>
            );
          }}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingPayment ? (
              <ActivityIndicator
                size="small"
                color="#00b0b9"
                className="my-4"
              />
            ) : null
          }
          contentContainerStyle={{ flexGrow: 1 }}
        />
      </SafeAreaView>

      <Modal
        transparent
        animationType="slide"
        visible={showDateModal}
        onRequestClose={() => setShowDateModal(false)}
      >
        <TouchableOpacity
          className="flex-1 justify-end bg-black/50"
          onPress={() => setShowDateModal(false)}
        >
          <View className="bg-white rounded-t-2xl p-6">
            <Text className="text-center text-xl font-bold text-[#00b0b9]">
              Select Date Range
            </Text>
            <TouchableOpacity
              onPress={() => {
                setDateRange("Select date");
                setShowDateModal(false);
              }}
              className="absolute right-6 top-6"
            >
              <Text className="text-[#00b0b9] font-medium">Reset</Text>
            </TouchableOpacity>
            <Text className="text-center text-base text-gray-500 mt-1">
              Choose a time
            </Text>
            <View className="mt-4 space-y-3">
              {dateRanges.map((range) => (
                <TouchableOpacity
                  key={range}
                  onPress={() => {
                    setDateRange(range);
                    setShowDateModal(false);
                  }}
                  className={`py-3 px-4 rounded-lg border mb-2 ${
                    dateRange === range
                      ? "border-[#00b0b9] bg-[#E0F7FA]"
                      : "border-gray-200"
                  }`}
                >
                  <Text
                    className={`${
                      dateRange === range
                        ? "text-[#00b0b9] font-semibold"
                        : "text-gray-800"
                    }`}
                  >
                    {range}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}
