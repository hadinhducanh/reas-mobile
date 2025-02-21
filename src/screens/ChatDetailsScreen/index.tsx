import React from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import ExchangeCard from "../../components/ExchangeCard";
import ChatRow from "../../components/ChatRow";
import { useNavigation } from "@react-navigation/native";
import ChatMessage from "../../components/ChatMessage";
import { TextInput } from "react-native-gesture-handler";

const ChatDetailsScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-[#00b0b9]">
      <View>
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
      </View>
      <ScrollView className="bg-white" scrollEnabled={true}>
        <View>
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
        </View>
      </ScrollView>
      <View className="flex-row items-center p-5 bg-white w-full">
        <Icon name="image" size={28} color="#00b0b9" />
        <Icon className="mx-2" name="location" size={28} color="#00b0b9" />
        <TextInput
          placeholder="Aaaa..."
          className="text-black text-sm flex-1 bg-[rgb(217,217,217,0.6)] rounded-[20px] px-5 mr-2"
        />
        <Icon name="send" size={28} color="#00b0b9" />
      </View>
    </SafeAreaView>
  );
};

export default ChatDetailsScreen;
