import React from "react";
import { View, Text, Pressable } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { NotificationDto } from "../../common/models/notification";
import { TypeNotification } from "../../common/enums/TypeNotification";

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

const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
  // Format the timestamp into a localized date string (customize as needed)
  const formattedDate = new Date(notification.timestamp).toLocaleString();
  const iconName = getNotificationIcon(notification.notificationType);

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
        <Text className="text-base font-semibold text-[#0B1D2D]">
          {getNotificationTitle(notification.notificationType)}
        </Text>
      </View>

      {/* Notification content */}
      <Text className="text-sm text-gray-600 my-5">
        {notification.content}
      </Text>

      {/* Footer with timestamp and mark as read button */}
      <View className="flex-row justify-between items-center">
        <Text className="text-sm text-gray-500">{formattedDate}</Text>
        <Pressable>
          <Text className="text-sm font-semibold text-[#00B0B9]">
            Mark as read
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default NotificationItem;
