import React from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

interface HeaderProps {
  headerName?: string;
}

const Header: React.FC<HeaderProps> = ({ headerName }) => {
  return (
    <View className="relative flex-row items-center justify-center h-[80px]">
      <Text className="text-[18px] font-bold">{headerName}</Text>
      <View className="absolute right-[20px] flex-row">
        <Icon
          className="mr-3"
          name="notifications-outline"
          size={24}
          color="#00B0B9"
        />
        <Icon name="chatbox-outline" size={24} color="#00B0B9" />
      </View>
    </View>
  );
};

export default Header;
