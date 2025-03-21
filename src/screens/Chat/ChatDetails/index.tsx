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
import { TextInput } from "react-native-gesture-handler";
import { KeyboardAvoidingView } from "react-native";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { RootStackParamList } from "../../../navigation/AppNavigator";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import {
  useExpoImagePicker,
  PickedImageFile,
} from "../../../hook/useExpoImagePicker";
import { fetchChatMessagesThunk } from "../../../redux/thunk/chatThunk";
import { uploadImageToCloudinary } from "../../../utils/CloudinaryImageUploader";
import { WEB_SOCKET_ENDPOINT } from "../../../common/constant";
import { ChatMessage } from "../../../common/models/chat";
import Message from "../../../components/ChatMessage";
import { formatTimestamp } from "../../../utils/TimestampFormatter";

const ChatDetails: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const route = useRoute<RouteProp<RootStackParamList, "ChatDetails">>();
  const { receiverUsername, receiverFullName } = route.params;
  const { chatMessages } = useSelector((state: RootState) => state.chat);
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
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const client = Stomp.over(() => new SockJS(WEB_SOCKET_ENDPOINT));
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

  const onMessageReceived = (payload: any) => {
    const receivedMessage = JSON.parse(payload.body);
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
    const fetchChat = async () => {
      const response = await dispatch(
        fetchChatMessagesThunk({
          senderId: senderUsername || "",
          recipientId: receiverUsername,
        })
      );

      if (response.payload) {
        setMessages(response.payload as ChatMessage[]);
      }
    };
    fetchChat();
  }, []);

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

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
            <ScrollView
              ref={scrollViewRef}
              onContentSizeChange={scrollToBottom} // NEW: auto-scroll on content change
              className="bg-white"
            >
              {messages.map((msg, index) => (
                <Message
                  key={index}
                  isSender={msg.senderId === senderUsername}
                  type={msg.contentType === "image" ? "image" : "text"}
                  time={formatTimestamp(msg.timestamp)}
                  text={msg.contentType === "text" ? msg.content : undefined}
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
