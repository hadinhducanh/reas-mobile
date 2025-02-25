import React from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  ImageBackground,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import ExchangeCard from "../../components/ExchangeCard";
import ChatRow from "../../components/ChatRow";
import { useNavigation } from "@react-navigation/native";
import ChatMessage from "../../components/ChatMessage";
import { TextInput } from "react-native-gesture-handler";
import { KeyboardAvoidingView } from "react-native";

const ChatDetailsScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-[#00b0b9]" edges={["top"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <View className="flex-1">
          {/* Header */}
          <View className="flex-row items-center justify-start h-[60px] px-5">
            <Pressable
              className="flex-row"
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Icon name="chevron-back-outline" size={24} color="#fff" />
            </Pressable>
            <View className=" mx-3 w-12 h-12 rounded-full bg-[#738aa0]" />

            <Text className="text-[18px] font-bold text-white">
              Ha Dinh Duc Anh
            </Text>
          </View>

          <View className="flex-1 bg-white">
            <ScrollView className="bg-white" scrollEnabled={true}>
              <Text className="py-4 font-base text-center">14:00</Text>
              <ChatMessage
                isSender={true}
                type="text"
                time="14:02"
                text="Hello, how are you?"
              />
              <ChatMessage
                isSender={false}
                type="text"
                text="Hello, how are you?"
                time="14:02"
              />
              <ChatMessage
                isSender={false}
                type="exchange"
                location={{
                  latitude: 37.7749,
                  longitude: -122.4194,
                  label: "San Francisco",
                }}
              />
              <ChatMessage
                isSender={true}
                type="text"
                time="14:02"
                text="Hello, how are you?"
              />
            </ScrollView>
          </View>

          {/* Input Chat */}
          <View className="flex-row items-center px-5 bg-white py-8">
            <Icon name="image" size={28} color="#00b0b9" />
            <Icon className="mx-2" name="location" size={28} color="#00b0b9" />
            <TextInput
              placeholder="Nhập tin nhắn..."
              className="flex-1 bg-[rgb(217,217,217,0.6)] rounded-[20px] px-5 py-3 text-black mr-2"
            />
            <Icon name="send" size={28} color="#00b0b9" />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatDetailsScreen;
