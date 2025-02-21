import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import ChatRow from "../../components/ChatRow";
import { useNavigation } from "@react-navigation/native";

const ChatHistoryScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-[#00B0B9]">
      <View>
        <View className="relative flex-row items-center justify-center h-[60px]">
          <Text className="text-[18px] font-bold text-white">Chat</Text>
          <Pressable
            className="absolute left-[20px] flex-row"
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Icon name="chevron-back-outline" size={24} color="#fff" />
          </Pressable>
        </View>
      </View>
      <ScrollView className="bg-white" scrollEnabled={true}>
        <ChatRow name="Ha Dinh Duc Anh" time="15:34 PM" message="You: OK!" />
        <ChatRow
          name="Nguyen Duc Son"
          time="12:30 PM"
          message="You: I have a pair of headphones in good condition t...."
        />
        <ChatRow name="Nguyen Tien Dung" time="18/01/2024" message="You: OK!" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChatHistoryScreen;
