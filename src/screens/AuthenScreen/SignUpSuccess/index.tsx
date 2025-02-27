import React from "react";
import { View, Text } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import LoadingButton from "../../../components/LoadingButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

const SignUpSuccess: React.FC = () => {
  const navigation = useNavigation<any>();
  const handleSend = async () => {
    navigation.navigate("MainTabs", { screen: "Account" });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f6f9f9] items-center">
      <View className="w-[90%] h-[90%] bg-white rounded-[10px] p-[20px] flex flex-col justify-center items-center">
        {/* Image Container với background và icon ở giữa */}
        <View className="w-[266px] h-[266px] relative overflow-hidden mb-[20px] rounded-[10px]">
          <View className="absolute inset-0 bg-[#dfecec]" />
          <Icon
            name="person-outline"
            size={120}
            color="#ffffff"
            className="absolute top-1/2 left-1/2 -translate-x-[60px] -translate-y-[60px]"
          />
        </View>

        {/* Title */}
        <Text className="text-[22px] font-bold leading-[30.8px] text-[#0b1d2d] text-center mt-[20px]">
          Account Created!
        </Text>

        {/* Subtitle */}
        <Text className="text-[16px] font-bold leading-[24px] text-[#738aa0] text-center mt-[10px]">
          Your account had been created{"\n"} successfully.
        </Text>
      </View>

      {/* Button */}
      <View className="w-[90%] mt-[20px]">
        <LoadingButton title="Get started" onPress={handleSend} />
      </View>
    </SafeAreaView>
  );
};

export default SignUpSuccess;
