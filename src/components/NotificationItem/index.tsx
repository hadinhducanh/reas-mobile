import React from "react";
import { View, Text, Pressable, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { NotificationDto } from "../../common/models/notification";
import { TypeNotification } from "../../common/enums/TypeNotification";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";

// Helper function to map enum values to user-friendly labels
const getNotificationTitle = (notificationType: TypeNotification): string => {
  switch (notificationType) {
    case TypeNotification.CHAT_MESSAGE:
      return "Chat message";
    case TypeNotification.UPLOAD_ITEM:
      return "Upload item";
    case TypeNotification.EXCHANGE_REQUEST:
      return "Request for exchange";
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
      return "mail"; // For example, you can use "mail" or "mail-unread"
    case TypeNotification.UPLOAD_ITEM:
      return "cloud-upload";
    case TypeNotification.EXCHANGE_REQUEST:
      return "swap-horizontal"; // Example icon for exchange requests
    default:
      return "notifications";
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
  const formattedDate = new Date(notification.timestamp).toLocaleString();
  const iconName = getNotificationIcon(notification.notificationType);
  const { bgColor, textColor } = getNotificationColors(
    notification.notificationType
  );

  return (
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
      <Text className="text-sm text-gray-600 my-5">{notification.content}</Text>

      {/* Footer with timestamp and mark as read button */}
      <View className="flex-row justify-between items-center">
        <Text className="text-sm text-gray-500">{formattedDate}</Text>
        {notification.content?.includes("item has been approved") && (
          <TouchableOpacity
            onPress={() => navigation.navigate("CreateExchange", { itemId: 1 })}
          >
            <Text className="text-sm font-semibold text-[#00B0B9]">
              Mark as read
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default NotificationItem;
