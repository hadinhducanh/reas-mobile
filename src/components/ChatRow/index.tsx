import { NavigationProp, useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, Pressable } from "react-native";
import { RootStackParamList } from "../../navigation/AppNavigator";

interface ChatRowProps {
  name: string;
  time: string;
  message: string;
  receiverUsername: string;
  receiverFullName: string;
}

const ChatRow: React.FC<ChatRowProps> = ({ name, time, message, receiverUsername, receiverFullName}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <Pressable
      className="flex-row items-center p-4 bg-white border-b border-gray-100 active:bg-gray-100"
      onPress={() => {
        navigation.navigate("ChatDetails", { receiverUsername, receiverFullName });
      }}
    >
      {/* Avatar (có thể thay thế bằng Image nếu có URL) */}
      <View className="w-16 h-16 rounded-full bg-gray-300 mr-3" />

      {/* Nội dung chat */}
      <View className="flex-1">
        <View className="flex-row justify-between items-center">
          <Text className="text-lg font-medium text-black">{name}</Text>
          <Text className="text-sm text-gray-400">{time}</Text>
        </View>
        <Text className="mt-1 text-sm text-gray-600" numberOfLines={1}>
          {message}
        </Text>
      </View>
    </Pressable>
  );
};

export default ChatRow;
