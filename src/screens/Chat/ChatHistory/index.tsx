import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import ChatRow from "../../../components/ChatRow";
import { useNavigation } from "@react-navigation/native";
import Header from "../../../components/Header";

const ChatHistory: React.FC = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-[#00B0B9]">
      <View className="bg-[#00B0B9]">
        <Header
          backIconColor="white"
          showOption={false}
          title="Chat"
          backgroundColor="bg-[#00B0B9]"
          textColor="text-white"
        />
        <ScrollView className="bg-white h-full" scrollEnabled={true}>
          <ChatRow name="Ha Dinh Duc Anh" time="15:34 PM" message="You: OK!" />
          <ChatRow
            name="Nguyen Duc Son"
            time="12:30 PM"
            message="You: I have a pair of headphones in good condition t...."
          />
          <ChatRow
            name="Nguyen Tien Dung"
            time="18/01/2024"
            message="You: OK!"
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ChatHistory;
