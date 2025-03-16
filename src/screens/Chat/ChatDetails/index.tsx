import React, { useEffect, useState, useRef } from "react";
import { View, Text, Pressable, ScrollView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import ChatMessage from "../../../components/ChatMessage";
import { TextInput } from "react-native-gesture-handler";
import { KeyboardAvoidingView } from "react-native";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { RootStackParamList } from "../../../navigation/AppNavigator";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

const ChatDetails: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, "ChatDetails">>();
  const { receiverUsername, receiverFullName } = route.params;
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const { user } = useSelector((state: RootState) => state.auth);
  const senderUsername = user?.userName;
  const stompClientRef = useRef<any>(null);

  useEffect(() => {
    console.log("senderUsername", senderUsername);
    console.log("receiverUsername", receiverUsername);

    const client = Stomp.over(() => new SockJS("http://localhost:8080/ws"));
    stompClientRef.current = client;
    client.connect(
      {},
      () => {
        client.subscribe(`/user/${senderUsername}/queue/messages`,onMessageReceived);
        client.subscribe(`/topic/public`, onMessageReceived);
      },
      onError
    );
  }, []);

  const onMessageReceived = (payload: any) => {
    const receivedMessage = JSON.parse(payload.body);
    // Only update the chat if the message is for this conversation
    if (
      receivedMessage.senderId === receiverUsername ||
      receivedMessage.senderId === senderUsername
    ) {
      setMessages((prev) => [...prev, receivedMessage]);
    }
  };

  const onError = (error: any) => {
    console.error("WebSocket error:", error);
  };

  useEffect(() => {
    if (receiverUsername) {
      fetchChatHistory(receiverUsername);
    }
  }, [receiverUsername]);

  const fetchChatHistory = async (receiverUsername: string) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/messages/${senderUsername}/${receiverUsername}`
      );
      const chatData = await response.json();
      setMessages(Array.isArray(chatData) ? chatData : chatData.messages || []);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  const sendMessage = () => {
    if (!message.trim()) return;
    const client = stompClientRef.current;
    if (!client || !client.connected) {
      console.warn("No underlying stomp connection");
      return;
    }

    const chatMessage = {
      senderId: senderUsername,
      recipientId: receiverUsername,
      senderName: user?.fullName,
      recipientName: receiverFullName,
      content: message,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, chatMessage]);
    client.send("/app/chat", {}, JSON.stringify(chatMessage));
    setMessage("");
  };

  const formatTimestamp = (timestamp?: string): string => {
    console.log("timestamp", timestamp);
    if (!timestamp) return "";
    try {
      const normalized = timestamp.replace(/:(?=\d\d$)/, "");
      const date = new Date(normalized);
      if (isNaN(date.getTime())) return "";
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Ho_Chi_Minh",
      });
    } catch (err) {
      console.error("Error formatting timestamp:", err);
      return "";
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#00b0b9]" edges={["top"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <View className="flex-1">
          <View className="flex-row items-center justify-start h-[60px] px-5">
            <Pressable onPress={() => navigation.goBack()}>
              <Icon name="chevron-back-outline" size={24} color="#fff" />
            </Pressable>
            <View className="mx-3 w-12 h-12 rounded-full bg-[#738aa0]" />
            <Text className="text-[18px] font-bold text-white">
              {receiverFullName}
            </Text>
          </View>

          {/* Chat Messages */}
          <View className="flex-1 bg-white">
            <ScrollView className="bg-white">
              {messages.map((msg, index) => (
                <ChatMessage
                  key={index}
                  isSender={msg.senderId === senderUsername}
                  type="text"
                  time={formatTimestamp(msg.timestamp)}
                  text={msg.content}
                />
              ))}
            </ScrollView>
          </View>

          <View className="flex-row items-center px-5 bg-white py-8">
            <Icon name="image" size={28} color="#00b0b9" />
            <Icon className="mx-2" name="location" size={28} color="#00b0b9" />
            <TextInput
              placeholder="Nhập tin nhắn..."
              className="flex-1 bg-[rgb(217,217,217,0.6)] rounded-[20px] px-5 py-3 text-black mr-2"
              value={message}
              onChangeText={setMessage}
              onSubmitEditing={sendMessage}
            />
            <Pressable onPress={sendMessage}>
              <Icon name="send" size={28} color="#00b0b9" />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatDetails;
