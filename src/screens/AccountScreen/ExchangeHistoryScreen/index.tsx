import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import TabHeader from "../../../components/TabHeader";
import ExchangeCard from "../../../components/ExchangeCard";

const ExchangeHistoryScreen: React.FC = () => {
  const [feedback, setFeedback] = useState("");

  const handleSend = async () => {
    // Test Loading: delay 3 giây
    await new Promise((resolve) => setTimeout(resolve, 3000));
  };
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-[#f6f9f9]">
      <View>
        <View className="relative flex-row items-center justify-center h-[60px]">
          <Text className="text-[18px] font-bold">Exchange history</Text>
          <Pressable
            className="absolute left-[20px] flex-row"
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Icon name="chevron-back-outline" size={24} color="#0b1d2d" />
          </Pressable>
        </View>
        <TabHeader />
      </View>
      <ScrollView scrollEnabled={true}>
        <ExchangeCard />
        <ExchangeCard />
        <ExchangeCard />
        <ExchangeCard />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ExchangeHistoryScreen;
