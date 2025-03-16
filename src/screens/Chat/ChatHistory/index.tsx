import React, { useEffect, useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import ChatRow from "../../../components/ChatRow";
import { useNavigation } from "@react-navigation/native";
import Header from "../../../components/Header";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

const ChatHistory: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useSelector((state: RootState) => state.auth);
  const senderUsername = user?.userName;
  const [conversations, setConversations] = useState<any[]>([]);

  useEffect(() => {
    if (senderUsername) {
      fetchChatHistory();
    }
  }, [senderUsername]);

  const fetchChatHistory = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/conversations/${senderUsername}`
      );
      const chatData = await response.json(); 
      setConversations(chatData);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };
  
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
          {conversations.map((conv, index) => (
            <ChatRow
              key={index}
              name={conv.recipientId === senderUsername ? conv.senderName : conv.recipientName}
              time={new Date(conv.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              message={conv.content}
              receiverUsername={conv.recipientId === senderUsername ? conv.senderId : conv.recipientId}
              receiverFullName={conv.recipientId === senderUsername ? conv.senderName : conv.recipientName}
            />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ChatHistory;
