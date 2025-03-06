import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import LoadingButton from "../../../components/LoadingButton";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../../components/Header";

const FeedbackItem: React.FC = () => {
  const [feedback, setFeedback] = useState("");

  const handleSend = async () => {
    // Test Loading: delay 3 giây
    await new Promise((resolve) => setTimeout(resolve, 3000));
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f6f9f9]">
      {/* Header: Back Button */}
      <Header title="Leave a review" showOption={false} />

      <View className="items-center h-full ">
        <View className="w-[90%] h-[90%] bg-white rounded-[10px] flex flex-col items-center justify-center">
          <View className="w-[266px] h-[266px] relative overflow-hidden mb-[20px] rounded-[10px]">
            <View className="absolute inset-0 bg-[#dfecec]" />
            <Icon
              name="star-outline"
              size={120}
              color="#ffffff"
              className="absolute top-1/2 left-1/2 -translate-x-[60px] -translate-y-[60px]"
            />
          </View>

          {/* Title */}
          <Text className="text-[22px] font-bold text-[#0b1d2d] text-center mt-[5px]">
            Please Rate The Quality Of {"\n"} Service For The Order
          </Text>

          <View className="flex-row justify-between w-[65%] my-5">
            <Icon name="star" size={40} color="#dfecec" />
            <Icon name="star" size={40} color="#dfecec" />
            <Icon name="star" size={40} color="#dfecec" />
            <Icon name="star" size={40} color="#dfecec" />
            <Icon name="star" size={40} color="#dfecec" />
          </View>

          {/* Subtitle */}
          <Text className="text-[16px] leading-[24px] text-[#738aa0] text-center mt-[10px]">
            Your feedback help us improve {"\n"} service quality better!
          </Text>
          {/* Textbox nhập feedback */}
          <TextInput
            className="mt-4 h-40 w-[90%] align-top pl-4 rounded bg-[#dfecec]"
            placeholder="Enter your feedback"
            placeholderTextColor="#999"
            value={feedback}
            onChangeText={setFeedback}
            multiline
            scrollEnabled
          />
          {/* Button */}
          <View className="w-[90%] mt-[20px]">
            <LoadingButton
              title="Send review"
              onPress={handleSend}
              buttonClassName="py-4"
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default FeedbackItem;
