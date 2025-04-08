import React, { useEffect } from "react";
import { ActivityIndicator, ScrollView, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import NotificationItem from "../../components/NotificationItem";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { getNotificationsOfCurrentUserThunk } from "../../redux/thunk/notificationThunk";
import { GetNotificationRequest } from "../../common/models/notification";
import Icon from "react-native-vector-icons/Ionicons";

const Notifications: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { notifications, loading, error } = useSelector(
    (state: RootState) => state.notification
  );

  useEffect(() => {
    if (user?.userName) {
      const getNotificationRequest: GetNotificationRequest = {
        pageNo: 1,
        pageSize: 10,
        username: user.userName,
      };
      dispatch(getNotificationsOfCurrentUserThunk(getNotificationRequest));
    }
  }, [user, dispatch]);

  return (
    <SafeAreaView className="flex-1 bg-[#00B0B9]" edges={["top"]}>
      <Header
        title="Notifications"
        backgroundColor="bg-[#00B0B9]"
        backIconColor="white"
        textColor="text-white"
        optionIconColor="white"
        showOption={false}
      />
      <ScrollView
        className="bg-gray-100 flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 10 }}
      >
        {loading && (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#00B0B9" />
          </View>
        )}
        {error && (
          <Text className="text-center text-red-500 my-2">{error}</Text>
        )}
        {notifications && notifications.length > 0
          ? notifications.map((notification, index) => (
              <NotificationItem key={index} notification={notification} />
            ))
          : !loading && (
              <View className="flex-1 justify-center items-center">
                <Icon
                  name="remove-circle-outline"
                  size={70}
                  color={"#00b0b9"}
                />
                <Text className="text-gray-500">No notifications</Text>
              </View>
            )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Notifications;
