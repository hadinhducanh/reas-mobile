import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import Icon from "react-native-vector-icons/Ionicons";
import NotificationItem from "../../components/NotificationItem";

const Notifications: React.FC = () => {
  // const navigation = useNavigation<NavigationProp<RootStackParamList>>();

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
      <ScrollView className="bg-gray-100" showsVerticalScrollIndicator={false}>
        <NotificationItem />
        <NotificationItem />
        <NotificationItem />
        <NotificationItem />
        <NotificationItem />
        <NotificationItem />
        <NotificationItem />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Notifications;
