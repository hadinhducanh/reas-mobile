import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  Pressable,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import TabHeader from "../../../components/TabHeader";
import ExchangeCard from "../../../components/ExchangeCard";
import Header from "../../../components/Header";

const ExchangeHistory: React.FC = () => {
  const handleSend = async () => {
    // Test Loading: delay 3 giây
    await new Promise((resolve) => setTimeout(resolve, 3000));
  };
  const navigation = useNavigation();
  const data = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
  const renderItem = ({}) => <ExchangeCard />;

  return (
    <SafeAreaView className="flex-1 bg-[#f6f9f9]">
      <View>
        <Header title="Exchange history" showOption={false} />
        <TabHeader />
      </View>

      <FlatList data={data} renderItem={renderItem}>
        <ExchangeCard />
        <ExchangeCard />
        <ExchangeCard />
        <ExchangeCard />
      </FlatList>
    </SafeAreaView>
  );
};

export default ExchangeHistory;
