import React, { useEffect, useState } from "react";
import { View, Text, Pressable, ScrollView, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ChatRow from "../../../components/ChatRow";
import { useNavigation } from "@react-navigation/native";
import Header from "../../../components/Header";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

const ChatHistory: React.FC = () => {
  const navigation = useNavigation();
  const [stompClient, setStompClient] = useState<any>(null);
  const [userName, setUserName] = useState("testUser"); // Replace with dynamic user
  const [fullName, setFullName] = useState("Test User");
  const [connectedUsers, setConnectedUsers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    const stomp = Stomp.over(socket);
    setStompClient(stomp);
    stomp.connect({}, onConnected, onError);
    return () => stomp.disconnect();
  }, []);

  const onError = (error: any) => {
    console.error("Error connecting to websocket:", error);
  };

  const onConnected = () => {
    if (!stompClient) return;

    stompClient.subscribe(`/user/${userName}/queue/messages`, onMessageReceived);
    stompClient.subscribe(`/user/public`, onMessageReceived);

    stompClient.send(
      "/app/user.addUser",
      {},
      JSON.stringify({ userName: userName, fullName: fullName, status: "ONLINE" })
    );
    fetchConnectedUsers();
  };

  const fetchConnectedUsers = async () => {
    try {
      const response = await fetch("/users");
      if (!response.ok) throw new Error("Failed to fetch users");
      let users = await response.json();
      users = users.filter((user: { userName: string }) => user.userName !== userName);
      setConnectedUsers(users);
    } catch (error) {
      console.error("Error fetching connected users:", error);
    }
  };

  const fetchChatHistory = async (selectedUser: string) => {
    try {
      const response = await fetch(`/messages/${userName}/${selectedUser}`);
      const chatData = await response.json();
      setMessages(chatData);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  const onMessageReceived = (payload: any) => {
    const message = JSON.parse(payload.body);
    if (message.senderId === selectedUserId) {
      setMessages(prevMessages => [...prevMessages, message]);
    }
  };

  const sendMessage = () => {
    if (!message || !stompClient || !selectedUserId) return;

    const chatMessage = {
      senderId: userName,
      recipientId: selectedUserId,
      content: message,
      timestamp: new Date(),
    };

    stompClient.send("/app/chat", {}, JSON.stringify(chatMessage));
    setMessages(prevMessages => [...prevMessages, chatMessage]);
    setMessage("");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#00B0B9]">
      <Header
        backIconColor="white"
        showOption={false}
        title="Chat"
        backgroundColor="bg-[#00B0B9]"
        textColor="text-white"
      />
      <View className="p-4">
        <Text className="text-white text-lg mb-2">Online Users</Text>
        <ScrollView>
          {connectedUsers.map(user => (
            <Pressable
              key={user.userName}
              onPress={() => {
                setSelectedUserId(user.userName);
                fetchChatHistory(user.userName);
              }}
              className={`p-2 rounded-lg ${selectedUserId === user.userName ? "bg-blue-500" : "bg-gray-300"}`}
            >
              <Text>{user.fullName}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
      <View className="flex-1 p-4 bg-white">
        <ScrollView>
          {messages.map((msg, index) => (
            <Text key={index} className={msg.senderId === userName ? "text-right" : "text-left"}>
              {msg.content}
            </Text>
          ))}
        </ScrollView>
        <View className="flex-row mt-2">
          <TextInput
            className="border p-2 flex-1"
            placeholder="Type a message..."
            value={message}
            onChangeText={setMessage}
          />
          <Pressable onPress={sendMessage} className="bg-blue-500 p-2 ml-2 rounded">
            <Text className="text-white">Send</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ChatHistory;
