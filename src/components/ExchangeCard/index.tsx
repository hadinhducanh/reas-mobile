import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, Pressable, Image } from "react-native";
import { StatusExchange } from "../../common/enums/StatusExchange";
import { ExchangeResponse } from "../../common/models/exchange";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Icon from "react-native-vector-icons/Ionicons";
import { RootStackParamList } from "../../navigation/AppNavigator";
import LoadingButton from "../LoadingButton";
import FeebackModal from "../FeedbackModal";

interface ExchangeCardProps {
  status: StatusExchange;
  exchange: ExchangeResponse;
}

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

const formatPrice = (price: number | undefined): string => {
  return price !== undefined ? price.toLocaleString("vi-VN") : "0";
};

const ExchangeCard: React.FC<ExchangeCardProps> = ({ status, exchange }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [feedbackVisible, setFeedbackVisible] = useState(false);

  const displayStatus =
    status === StatusExchange.APPROVED &&
    exchange.exchangeHistory?.statusExchangeHistory === StatusExchange.FAILED
      ? StatusExchange.FAILED
      : status;

  const handlePress = () => {
    if (status === StatusExchange.PENDING) {
      navigation.navigate("AccpectRejectExchange", { exchangeId: exchange.id });
    } else {
      navigation.navigate("ExchangeDetail", {
        statusDetail: status,
        exchangeId: exchange.id,
      });
    }
  };

  const { textColor, backgroundColor } = statusStyles[displayStatus];

  const formatExchangeDate = (
    exchangeDate: string,
    isDate: boolean
  ): string => {
    const dt = new Date(exchangeDate);

    const day = dt.getDate().toString().padStart(2, "0");
    const month = (dt.getMonth() + 1).toString().padStart(2, "0");
    const year = dt.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;

    if (isDate) {
      return formattedDate;
    } else {
      const formattedTime = dt.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      });
      return `${formattedTime} ${formattedDate}`;
    }
  };

  const getStatusExchangeLabel = (
    status: StatusExchange | undefined,
    statusHistory?: StatusExchange
  ): string => {
    if (
      status === StatusExchange.APPROVED &&
      statusHistory === StatusExchange.FAILED
    ) {
      return "Failed";
    }

    const found = statusExchanges.find((item) => item.value === status);
    return found ? found.label : "";
  };

  return (
    <>
      <Pressable
        className="bg-white mx-5 mt-4 px-5 py-4 rounded-xl active:bg-gray-100"
        onPress={handlePress}
      >
        <View className="flex-row justify-between items-center">
          <Text className="items-center text-[14px] font-normal text-[#6b7280]">
            {formatExchangeDate(exchange.creationDate, true)}
          </Text>
          <Text
            className={`items-center text-[13px] font-medium ${textColor} ${backgroundColor} rounded-full px-5 py-2`}
          >
            {getStatusExchangeLabel(
              status,
              exchange.exchangeHistory?.statusExchangeHistory
            )}
          </Text>
        </View>

        <View className="flex-row items-center my-1">
          <View className="items-center mr-2">
            {user?.id !==
            (exchange.buyerItem === null
              ? exchange.paidBy.id
              : exchange.buyerItem.owner.id) ? (
              <>
                {exchange.buyerItem === null ? (
                  <>
                    {exchange.paidBy.image ? (
                      <View className="w-16 h-16 rounded-full items-center justify-center">
                        <Image
                          source={{
                            uri: exchange.paidBy.image,
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
                    {exchange.buyerItem.owner.image ? (
                      <View className="w-16 h-16 rounded-full items-center justify-center">
                        <Image
                          source={{
                            uri: exchange.buyerItem.owner.image,
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
                {exchange.sellerItem.owner.image ? (
                  <View className="w-16 h-16 rounded-full items-center justify-center">
                    <Image
                      source={{
                        uri: exchange.sellerItem.owner.image,
                      }}
                      className="w-full h-full rounded-full"
                    />
                  </View>
                ) : (
                  <View className="w-16 h-16 rounded-full items-center justify-center">
                    <Icon name="person-circle-outline" size={60} color="gray" />
                  </View>
                )}
              </>
            )}
          </View>

          <View>
            {user?.id !==
            (exchange.buyerItem === null
              ? exchange.paidBy.id
              : exchange.buyerItem.owner.id) ? (
              <Text className="justify-start items-center text-left text-[16px] font-medium text-black">
                {exchange.buyerItem === null
                  ? exchange.paidBy.fullName
                  : exchange.buyerItem.owner.fullName}
              </Text>
            ) : (
              <Text className="justify-start items-center text-left text-[16px] font-medium text-black">
                {exchange.sellerItem.owner.fullName}
              </Text>
            )}
            {user?.id !==
            (exchange.buyerItem === null
              ? exchange.paidBy.id
              : exchange.buyerItem.owner.id) ? (
              <Text className="justify-start items-center text-left text-[14px] font-normal text-[#6b7280]">
                {exchange.buyerItem === null
                  ? "Item free"
                  : exchange.buyerItem.itemName}
              </Text>
            ) : (
              <Text className="justify-start items-center text-left text-[14px] font-normal text-[#6b7280]">
                {exchange.sellerItem.itemName}
              </Text>
            )}
          </View>
        </View>
        <View className="my-2 border-t-[1px] border-b-[1px] py-2 border-gray-200">
          <Text className="text-[12px] font-normal">
            <Text className="text-[#6b7280]">Exchange ID: </Text>
            <Text className="font-bold text-[#6b7280]">#EX{exchange.id}</Text>
          </Text>
          <Text className="text-[12px] font-normal my-4">
            <Text className="text-[#6b7280]">Date & Time: </Text>
            <Text className="font-bold text-[#6b7280]">
              {formatExchangeDate(exchange.exchangeDate, false)}
            </Text>
          </Text>
          <Text className="text-[12px] font-normal text-left" numberOfLines={1}>
            <Text className="text-[#6b7280]">Location: </Text>
            <Text className="font-bold text-[#6b7280] flex-1">
              {exchange.exchangeLocation.split("//")[1]}
            </Text>
          </Text>
        </View>

        <View className="mt-2">
          <Text className="text-[14px] font-bold text-right">
            <Text className="text-black">Estimated difference: </Text>
            <Text className="text-[#00b0b9]">
              {exchange.sellerItem.price === 0
                ? "Free"
                : formatPrice(exchange.estimatePrice) + " VND"}
            </Text>
          </Text>
          <Text className="my-2 text-right items-center text-[12px] font-normal text-[#738aa0]">
            {exchange?.estimatePrice === 0
              ? `This is a free item exchange${"\n"}so payment is not needed`
              : "Paid by: " +
                (exchange?.paidBy.id === user?.id
                  ? "You"
                  : exchange?.paidBy.fullName)}
          </Text>
          <View
            className={`flex-row items-center ${
              status === StatusExchange.APPROVED &&
              exchange.exchangeHistory.statusExchangeHistory !==
                StatusExchange.FAILED
                ? "justify-between"
                : " justify-end"
            }`}
          >
            {status === StatusExchange.APPROVED &&
              exchange.exchangeHistory.statusExchangeHistory !==
                StatusExchange.FAILED && (
                <View>
                  <Text className="text-[#00b0b9]">
                    {getStatusExchangeLabel(
                      exchange.exchangeHistory.statusExchangeHistory
                    )}
                  </Text>
                </View>
              )}

            <View className="flex-row">
              {((status === StatusExchange.SUCCESSFUL &&
                user?.id ===
                  (exchange.buyerItem === null
                    ? exchange.paidBy.id
                    : exchange.buyerItem.owner.id)) ||
                exchange.feedbackId !== null) && (
                <View className="mr-2">
                  <LoadingButton
                    title={
                      exchange.feedbackId !== null
                        ? "View feedback"
                        : "Feedback"
                    }
                    onPress={
                      exchange.feedbackId !== null
                        ? () => setFeedbackVisible(true)
                        : () =>
                            navigation.navigate("FeedbackItem", {
                              exchangeId: exchange.id,
                            })
                    }
                    buttonClassName="py-4 px-8 bg-white border-2 border-[#00b0b9]"
                    textColor="text-[#00b0b9]"
                    iconColor="#00b0b9"
                    showIcon={true}
                    iconName="pencil-outline"
                    iconSize={18}
                  />
                </View>
              )}
              <View>
                <LoadingButton
                  title="Chat"
                  onPress={() =>
                    navigation.navigate("ChatDetails", {
                      receiverUsername:
                        user?.id ===
                        (exchange.buyerItem === null
                          ? exchange.paidBy.id
                          : exchange.buyerItem.owner.id)
                          ? exchange.sellerItem.owner.userName
                          : exchange.buyerItem === null
                          ? exchange.paidBy.userName
                          : exchange.buyerItem.owner.userName,
                      receiverFullName:
                        user?.id ===
                        (exchange.buyerItem === null
                          ? exchange.paidBy.id
                          : exchange.buyerItem.owner.id)
                          ? exchange.sellerItem.owner.fullName
                          : exchange.buyerItem === null
                          ? exchange.paidBy.fullName
                          : exchange.buyerItem.owner.fullName,
                    })
                  }
                  buttonClassName="py-4 px-8 border-2 border-transparent"
                  iconColor="#fff"
                  showIcon={true}
                  iconName="chatbox-ellipses-outline"
                  iconSize={18}
                />
              </View>
            </View>
          </View>
        </View>
      </Pressable>
      {exchange.feedbackId !== null && (
        <FeebackModal
          key={exchange.feedbackId}
          visible={feedbackVisible}
          onCancel={() => setFeedbackVisible(false)}
          feedbackId={exchange.feedbackId}
          exchangeId={exchange.id}
        />
      )}
    </>
  );
};

export default ExchangeCard;
