import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { NotificationDto } from "../../common/models/notification";
import { TypeNotification } from "../../common/enums/TypeNotification";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { getExchangeDetailThunk } from "../../redux/thunk/exchangeThunk";
import { StatusItem } from "../../common/enums/StatusItem";
import ErrorModal from "../ErrorModal";
import { getItemDetailThunk } from "../../redux/thunk/itemThunks";
import { resetItemDetailState } from "../../redux/slices/itemSlice";
import { resetExchange } from "../../redux/slices/exchangeSlice";

const getNotificationTitle = (notificationType: TypeNotification): string => {
  switch (notificationType) {
    case TypeNotification.CHAT_MESSAGE:
      return "Chat message";
    case TypeNotification.UPLOAD_ITEM:
      return "Upload item";
    case TypeNotification.EXCHANGE_REQUEST:
      return "Request for exchange";
    case TypeNotification.ITEM_EXPIRED:
      return "Item expired";
    case TypeNotification.REPORT_RESPONSE:
      return "Report response";
    case TypeNotification.REPORT_HANDLED:
      return "Report handled";
    default:
      return "Notification";
  }
};

const getNotificationColors = (type: TypeNotification) => {
  switch (type) {
    case TypeNotification.CHAT_MESSAGE:
      return {
        bgColor: "bg-[#E0F7FA]",
        textColor: "text-[#00796B]",
      };
    case TypeNotification.UPLOAD_ITEM:
      return {
        bgColor: "bg-[#FFF3E0]",
        textColor: "text-[#EF6C00]",
      };
    case TypeNotification.EXCHANGE_REQUEST:
      return {
        bgColor: "bg-[#EDE7F6]",
        textColor: "text-[#5E35B1]",
      };
    case TypeNotification.ITEM_EXPIRED:
      return {
        bgColor: "bg-[#FFEBEE]",
        textColor: "text-[#C62828]",
      };
    case TypeNotification.REPORT_RESPONSE:
      return {
        bgColor: "bg-[#E8F5E9]",
        textColor: "text-[#2E7D32]",
      };
    case TypeNotification.REPORT_HANDLED:
      return {
        bgColor: "bg-[#ECEFF1]",
        textColor: "text-[#37474F]",
      };
    default:
      return {
        bgColor: "bg-[#00B0B9]/10",
        textColor: "text-[#00B0B9]",
      };
  }
};

// Helper function to map enum values to appropriate icon names
const getNotificationIcon = (notificationType: TypeNotification): string => {
  switch (notificationType) {
    case TypeNotification.CHAT_MESSAGE:
      return "mail"; // Tin nhắn
    case TypeNotification.UPLOAD_ITEM:
      return "cloud-upload"; // Tải lên
    case TypeNotification.EXCHANGE_REQUEST:
      return "swap-horizontal"; // Yêu cầu trao đổi
    case TypeNotification.ITEM_EXPIRED:
      return "time-outline"; // Hết hạn
    case TypeNotification.REPORT_RESPONSE:
      return "chatbubble-ellipses-outline"; // Phản hồi báo cáo
    case TypeNotification.REPORT_HANDLED:
      return "checkmark-done-outline"; // Báo cáo đã xử lý
    default:
      return "notifications"; // Mặc định
  }
};

interface NotificationItemProps {
  notification: NotificationDto;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch<AppDispatch>();
  const formattedDate = new Date(notification.timestamp).toLocaleString();
  const iconName = getNotificationIcon(notification.notificationType);
  const { bgColor, textColor } = getNotificationColors(
    notification.notificationType
  );
  const { exchangeDetail } = useSelector((state: RootState) => state.exchange);

  const [visible, setVisible] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  const [title, setTitle] = useState<string>("");

  const extractExchangeId = (content: string): number | null => {
    const match = content.match(/#EX(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  };

  return (
    <>
      {notification.content?.includes("Click here to re-create") ? (
        <TouchableOpacity
          onPress={async () => {
            const exchangeId = extractExchangeId(notification.content || "");
            if (exchangeId) {
              try {
                const result = await dispatch(
                  getExchangeDetailThunk(Number(exchangeId))
                ).unwrap();

                if (
                  result &&
                  result.sellerItem.statusItem !== StatusItem.AVAILABLE
                ) {
                  dispatch(resetExchange());
                  setVisible(true);
                  setTitle("Unavailable Item");
                  setContent(
                    "The item you want to exchange is currently unavailable."
                  );
                  return;
                } else {
                  dispatch(resetItemDetailState());
                  dispatch(getItemDetailThunk(result.sellerItem.id));
                  navigation.navigate("CreateExchange", {
                    itemId: result.sellerItem.id,
                  });
                }
              } catch (error) {
                setVisible(true);
                setTitle("Error");
                setContent(
                  "Failed to retrieve exchange details. Please try again."
                );
              }
            }
          }}
          className="bg-white rounded-xl p-4 my-3 shadow-sm mx-5 py-8"
        >
          {/* Header row: Icon + sender ID on the left, and notification type on the right */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="w-6 h-6 bg-[#00B0B9] rounded-full items-center justify-center mr-2">
                <Icon name={iconName} size={14} color="#ffffff" />
              </View>
              <Text className="text-base font-semibold text-[#0B1D2D]">
                {notification.senderId}
              </Text>
            </View>
            <View className={` ${bgColor} px-3 py-1 rounded-xl`}>
              <Text className={`text-base font-semibold ${textColor}`}>
                {getNotificationTitle(notification.notificationType)}
              </Text>
            </View>
          </View>

          {/* Notification content */}
          <Text className="text-sm text-gray-600 my-5">
            {notification.content}
          </Text>

          {/* Footer with timestamp and mark as read button */}
          <View className="flex-row justify-between items-center">
            <Text className="text-sm text-gray-500">{formattedDate}</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <View className="bg-white rounded-xl p-4 my-3 shadow-sm mx-5 py-8">
          {/* Header row: Icon + sender ID on the left, and notification type on the right */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="w-6 h-6 bg-[#00B0B9] rounded-full items-center justify-center mr-2">
                <Icon name={iconName} size={14} color="#ffffff" />
              </View>
              <Text className="text-base font-semibold text-[#0B1D2D]">
                {notification.senderId}
              </Text>
            </View>
            <View className={` ${bgColor} px-3 py-1 rounded-xl`}>
              <Text className={`text-base font-semibold ${textColor}`}>
                {getNotificationTitle(notification.notificationType)}
              </Text>
            </View>
          </View>

          {/* Notification content */}
          <Text className="text-sm text-gray-600 my-5">
            {notification.content}
          </Text>

          {/* Footer with timestamp and mark as read button */}
          <View className="flex-row justify-between items-center">
            <Text className="text-sm text-gray-500">{formattedDate}</Text>
          </View>
        </View>
      )}

      <ErrorModal
        title={title}
        content={content}
        visible={visible}
        onCancel={() => setVisible(false)}
      />
    </>
  );
};

export default NotificationItem;
