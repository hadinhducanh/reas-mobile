import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Platform,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
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
import {
  useExpoImagePicker,
  PickedImageFile,
} from "../../../hook/useExpoImagePicker";

const uploadImageToCloudinary = async (
  file: PickedImageFile
): Promise<string> => {
  const cloudinaryFormData = new FormData();
  cloudinaryFormData.append("file", {
    uri: file.uri,
    type: file.type,
    name: file.name,
  } as any);
  cloudinaryFormData.append("upload_preset", "reas_user_avatar");
  cloudinaryFormData.append("cloud_name", "dkpg60ca0");

  const response = await fetch(
    "https://api.cloudinary.com/v1_1/dkpg60ca0/image/upload",
    {
      method: "POST",
      body: cloudinaryFormData,
    }
  );

  if (!response.ok) throw new Error("Image upload failed");
  const data = await response.json();
  return data.secure_url;
};

const ChatDetails: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, "ChatDetails">>();
  const { receiverUsername, receiverFullName } = route.params;
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<PickedImageFile | null>(
    null
  );
  const [isSending, setIsSending] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const senderUsername = user?.userName;
  const stompClientRef = useRef<any>(null);
  const { showPickerOptions } = useExpoImagePicker();

  useEffect(() => {
    console.log("senderUsername", senderUsername);
    console.log("receiverUsername", receiverUsername);

    const client = Stomp.over(() => new SockJS("http://localhost:8080/ws"));
    stompClientRef.current = client;
    client.connect(
      {},
      () => {
        client.subscribe(
          `/user/${senderUsername}/queue/messages`,
          onMessageReceived
        );
        client.subscribe(`/topic/public`, onMessageReceived);
      },
      onError
    );
  }, []);

  // Modified onMessageReceived: if contentType is missing and content starts with "http", set it to "image".
  const onMessageReceived = (payload: any) => {
    const receivedMessage = JSON.parse(payload.body);

    // FIX: Check if contentType is missing and content looks like an image URL,
    // then set contentType to "image"
    if (
      !receivedMessage.contentType &&
      receivedMessage.content &&
      receivedMessage.content.startsWith("http")
    ) {
      receivedMessage.contentType = "image";
    }

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

  const handleSelectImage = async () => {
    const file = await showPickerOptions();
    if (file) {
      setSelectedImage(file);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() && !selectedImage) return;
    const client = stompClientRef.current;
    if (!client || !client.connected) {
      console.warn("No underlying stomp connection");
      return;
    }
    setIsSending(true);
    let chatMessage: {
      senderId: string | undefined;
      recipientId: string;
      senderName: string | undefined;
      recipientName: string;
      content: string;
      timestamp: string;
      contentType: string;
    };
    try {
      if (selectedImage) {
        const imageUrl = await uploadImageToCloudinary(selectedImage);
        chatMessage = {
          senderId: senderUsername,
          recipientId: receiverUsername,
          senderName: user?.fullName,
          recipientName: receiverFullName,
          content: imageUrl,
          timestamp: new Date().toISOString(),
          contentType: "image",
        };
      } else {
        chatMessage = {
          senderId: senderUsername,
          recipientId: receiverUsername,
          senderName: user?.fullName,
          recipientName: receiverFullName,
          content: message,
          timestamp: new Date().toISOString(),
          contentType: "text",
        };
      }
      setMessages((prev) => [...prev, chatMessage]);
      client.send("/app/chat", {}, JSON.stringify(chatMessage));
      setMessage("");
      setSelectedImage(null);
    } catch (error) {
      console.error("Error sending message:", error);
    }
    setIsSending(false);
  };

  const formatTimestamp = (timestamp?: string): string => {
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
                  type={msg.contentType === "image" ? "image" : "text"}
                  time={formatTimestamp(msg.timestamp)}
                  text={msg.content}
                  imageUrl={
                    msg.contentType === "image" ? msg.content : undefined
                  }
                />
              ))}
            </ScrollView>
          </View>

          {/* Selected image preview with remove option */}
          {selectedImage && (
            <View style={{ padding: 10 }}>
              <Text style={{ color: "#000", marginBottom: 4 }}>
                Selected Image Preview:
              </Text>
              <View style={{ width: 100, height: 100, position: "relative" }}>
                <Image
                  source={{ uri: selectedImage.uri }}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 8,
                  }}
                />
                <Pressable
                  onPress={() => setSelectedImage(null)}
                  style={{
                    position: "absolute",
                    top: -8,
                    right: -8,
                  }}
                >
                  <Icon name="close-circle" size={24} color="red" />
                </Pressable>
              </View>
            </View>
          )}

          {/* Chat Input & Actions */}
          <View className="flex-row items-center px-5 bg-white py-8">
            <Pressable onPress={handleSelectImage}>
              <Icon name="image" size={28} color="#00b0b9" />
            </Pressable>
            <Icon className="mx-2" name="location" size={28} color="#00b0b9" />
            <TextInput
              placeholder="Nhập tin nhắn..."
              className="flex-1 bg-[rgb(217,217,217,0.6)] rounded-[20px] px-5 py-3 text-black mr-2"
              value={message}
              onChangeText={setMessage}
              onSubmitEditing={sendMessage}
            />
            <Pressable onPress={sendMessage}>
              {isSending ? (
                <ActivityIndicator size="small" color="#00b0b9" />
              ) : (
                <Icon name="send" size={28} color="#00b0b9" />
              )}
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatDetails;
