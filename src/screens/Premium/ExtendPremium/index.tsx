import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../navigation/AppNavigator";
import Header from "../../../components/Header";
import LoadingButton from "../../../components/LoadingButton";

const ExtendPremium: React.FC = () => {
  const handleSubcribe = () => {};
  const [selectedExtension, setSelectedExtension] = useState<"1" | "2" | null>(
    null
  );

  return (
    <SafeAreaView className="flex-1 bg-[#00B0B9]" edges={["top"]}>
      <Header
        title="Extend subscription"
        backgroundColor="bg-[#00B0B9]"
        backIconColor="white"
        textColor="text-white"
        optionIconColor="white"
        showOption={false}
      />

      <View className="flex-1 bg-gray-100 px-4 py-6 flex-col">
        <View className="bg-white rounded-lg p-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-xl font-semibold text-black">
              Current Plan
            </Text>
            <Text
              className={`items-center text-[13px] font-medium text-[#16A34A] bg-[rgba(22,163,74,0.2)] rounded-full px-5 py-2`}
            >
              Active
            </Text>
          </View>

          <View className="flex-row justify-between">
            <Text className="text-base text-gray-500">Annual Premium</Text>
            <Text className="text-base font-semibold text-gray-900 px-2">
              $99/month
            </Text>
          </View>

          <Text className="text-sm text-gray-400 mt-1">
            Next billing date: March 15, 2025
          </Text>
        </View>

        <View className="my-4">
          {/* 1 Year Extension */}
          <TouchableOpacity
            onPress={() => setSelectedExtension("1")}
            className={`flex-row justify-between items-center p-5 mb-2 rounded-lg border-2 bg-white ${
              selectedExtension === "1" ? "border-[#00b0b9]" : "border-gray-200"
            }`}
          >
            <View>
              <Text className="text-base font-semibold text-gray-900">
                1 Month Extension
              </Text>
              <Text className="text-sm text-gray-400">
                Extend until March 15, 2026
              </Text>
            </View>
            <Text className="text-lg font-bold text-gray-900">$89</Text>
          </TouchableOpacity>

          {/* 2 Years Extension */}
          <TouchableOpacity
            onPress={() => setSelectedExtension("2")}
            className={`flex-row justify-between items-center p-5 rounded-lg border-2 bg-white ${
              selectedExtension === "2" ? "border-[#00b0b9]" : "border-gray-200"
            }`}
          >
            <View>
              <Text className="text-base font-semibold text-gray-900">
                2 Months Extension
              </Text>
              <Text className="text-sm text-gray-400">
                Extend until March 15, 2027
              </Text>
            </View>
            <Text className="text-lg font-bold text-gray-900">$169</Text>
          </TouchableOpacity>
        </View>

        <LoadingButton
          title="Extend now"
          onPress={handleSubcribe}
          buttonClassName="p-4"
        />
      </View>
    </SafeAreaView>
  );
};

export default ExtendPremium;
