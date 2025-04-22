import React, { useState } from "react";
import { Modal, View, Text, Image, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { FeedbackResponse } from "../../common/models/feedback";
import dayjs from "dayjs";
import ImagePreviewModal from "../ImagePreviewModal";

interface ChooseLocationModalProps {
  feedback: FeedbackResponse;
}

const FeedbackCard: React.FC<ChooseLocationModalProps> = ({ feedback }) => {
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const formatPrice = (price: number | undefined): string => {
    if (price === undefined) return "0";
    return price.toLocaleString("vi-VN");
  };

  function formatRelativeTime(timeStr: Date | undefined): string {
    const givenTime = dayjs(timeStr);
    const now = dayjs();

    const diffInSeconds = now.diff(givenTime, "second");

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
      const minutes = now.diff(givenTime, "minute");
      return `${minutes} minutes ago`;
    } else if (diffInSeconds < 86400) {
      const hours = now.diff(givenTime, "hour");
      return `${hours} hours ago`;
    } else if (diffInSeconds < 86400 * 30) {
      const days = now.diff(givenTime, "day");
      return `${days} days ago`;
    } else if (diffInSeconds < 86400 * 30 * 12) {
      const months = now.diff(givenTime, "month");
      return `${months} months ago`;
    } else {
      const years = now.diff(givenTime, "year");
      return `${years} years ago`;
    }
  }

  const imageUrls = feedback.imageUrl ? feedback.imageUrl.split(", ") : [];

  return (
    <>
      <View className=" bg-white p-5">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="items-center">
              <Icon name="person-circle-outline" size={40} color="gray" />
            </View>
            <Text className="text-lg font-bold">{feedback.user.fullName}</Text>
          </View>
        </View>

        {imageUrls.length > 0 && (
          <View className="flex-row flex-wrap gap-2 mt-2">
            {imageUrls.map((uri, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setSelectedIndex(index);
                  setImageModalVisible(true);
                }}
                className="w-20 h-28 rounded-lg overflow-hidden mr-2"
              >
                <Image source={{ uri }} className="w-full h-full rounded-lg" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {feedback?.comment && (
          <View className="mt-2">
            {feedback?.comment.split("\\n").map((line, index) => (
              <Text className="text-gray-700" key={index}>
                {line}
              </Text>
            ))}
          </View>
        )}

        <View className="flex-row items-center mt-2">
          {[1, 2, 3, 4, 5].map((num) => (
            <Icon
              key={num}
              name="star"
              size={16}
              color={num <= feedback?.rating! ? "#FFD700" : "#dfecec"}
            />
          ))}
          <Text className="ml-2 text-gray-500 text-sm">
            | {formatRelativeTime(feedback.creationDate)}
          </Text>
        </View>

        <View className="flex-row items-center bg-[#D6F2F4] rounded-lg mt-4 p-3">
          <View className="" />
          <View className="w-12 h-12 bg-white rounded-md mr-3">
            <Image
              source={{
                uri: feedback?.item.imageUrl.split(", ")[0],
              }}
              className="w-full h-full object-contain"
              resizeMode="contain"
            />
          </View>
          <View>
            <Text className="text-gray-700 font-medium">
              {feedback?.item.itemName}
            </Text>
            <Text className="text-[#00B0B9] font-bold">
              {feedback?.item.price === 0
                ? "Free"
                : formatPrice(feedback?.item.price) + " VND"}
            </Text>
          </View>
        </View>
        <View className="border-b border-gray-300 my-4" />
      </View>
      <ImagePreviewModal
        visible={imageModalVisible}
        onClose={() => setImageModalVisible(false)}
        initialIndex={selectedIndex}
        imageUrls={imageUrls}
      />
    </>
  );
};

export default FeedbackCard;
