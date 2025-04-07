import { NavigationProp, useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, Pressable, Image } from "react-native";
import { RootStackParamList } from "../../navigation/AppNavigator";
import Icon from "react-native-vector-icons/Ionicons";

interface ChatRowProps {
  name: string;
  time: string;
  message: string;
  receiverUsername: string;
  receiverFullName: string;
  imageUrl?: string;
}

const ChatRow: React.FC<ChatRowProps> = ({
  name,
  time,
  message,
  receiverUsername,
  receiverFullName,
  imageUrl,
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <Pressable
      className="flex-row items-center p-4 bg-white border-b border-gray-100 active:bg-gray-100"
      onPress={() => {
        navigation.navigate("ChatDetails", {
          receiverUsername,
          receiverFullName,
        });
      }}
    >
      {/* Avatar (có thể thay thế bằng Image nếu có URL) */}
      {imageUrl ? (
        <View className="w-20 h-20 rounded-full items-center justify-center p-2">
          <Image
            source={{
              uri: imageUrl,
            }}
            className="w-full h-full rounded-full"
          />
        </View>
      ) : (
        <View className="w-20 h-20 rounded-full items-center justify-center">
          <Icon name="person-circle-outline" size={70} color="gray" />
        </View>
      )}
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
