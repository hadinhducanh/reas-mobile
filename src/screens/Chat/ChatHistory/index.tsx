import React, { useEffect, useState } from "react";
import { View, ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ChatRow from "../../../components/ChatRow";
import Header from "../../../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { fetchChatConversationsThunk } from "../../../redux/thunk/chatThunk";
import { ChatMessage } from "../../../common/models/chat";
import Icon from "react-native-vector-icons/Ionicons";

const ChatHistory: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
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
      const response = await dispatch(
        fetchChatConversationsThunk({ senderId: senderUsername as string })
      );
      if (response.payload) {
        setConversations(response.payload as ChatMessage[]);
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#00B0B9]">
      <View className="bg-white flex-1">
        <Header
          backIconColor="white"
          showOption={false}
          title="Chat"
          backgroundColor="bg-[#00B0B9]"
          textColor="text-white"
        />
        {conversations.length !== 0 ? (
          <ScrollView className="bg-white h-full" scrollEnabled={true}>
            {conversations.map((conv, index) => (
              <ChatRow
                key={index}
                name={
                  conv.recipientId === senderUsername
                    ? conv.senderName
                    : conv.recipientName
                }
                time={new Date(conv.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                message={conv.content}
                receiverUsername={
                  conv.recipientId === senderUsername
                    ? conv.senderId
                    : conv.recipientId
                }
                receiverFullName={
                  conv.recipientId === senderUsername
                    ? conv.senderName
                    : conv.recipientName
                }
              />
            ))}
          </ScrollView>
        ) : (
          <View className="flex-1 justify-center items-center bg-white">
            <Icon name="remove-circle-outline" size={70} color={"#00b0b9"} />
            <Text className="text-gray-500">No history chat</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ChatHistory;
