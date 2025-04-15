import React from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { View, Text, Image, ImageBackground } from "react-native";

interface ExchangeInfo {
  images: string[];
  dateTime: string;
  exchangeId: string;
  additionalPayment: string;
}

interface LocationInfo {
  latitude: number;
  longitude: number;
  label?: string;
}

type MessageType = "text" | "image" | "location" | "exchange";

interface ChatMessageProps {
  isSender: boolean;
  type: MessageType;
  text?: string;
  images?: string[];
  imageUrl?: string; // For a single image message
  location?: LocationInfo;
  exchange?: ExchangeInfo;
  time?: string;
}

const Message: React.FC<ChatMessageProps> = ({
  isSender,
  type,
  text,
  images,
  imageUrl,
  location,
  exchange,
  time,
}) => {
  // Determine alignment and background based on sender
  const alignmentClass = isSender ? "self-end" : "self-start";
  const backgroundClass = isSender
    ? "bg-[rgba(0,176,185,0.4)]"
    : "bg-[rgba(217,217,217,0.6)]";

  const renderContent = () => {
    switch (type) {
      case "text":
        return <Text className="text-sm text-black">{text}</Text>;
      case "image":
        if (imageUrl) {
          return (
            <Image
              source={{ uri: imageUrl }}
              className="w-40 h-40 rounded-lg"
              resizeMode="cover"
            />
          );
        } else if (images && images.length > 0) {
          return (
            <View className="flex-row space-x-2">
              {images.map((uri, index) => (
                <ImageBackground
                  key={index}
                  source={{ uri }}
                  className="w-20 h-20 rounded-lg"
                />
              ))}
            </View>
          );
        }
        return null;
      case "location":
        return (
          <View className="flex-col">
            <Text className="text-sm text-black">
              {location?.label || "Location"}
            </Text>
            <Text className="text-xs text-black">
              Lat: {location?.latitude}, Lon: {location?.longitude}
            </Text>
          </View>
        );
      case "exchange":
        return (
          <View className="w-full items-start">
            <View className="flex-row w-full justify-between mb-1 items-center">
              {/* First item container */}
              <View className="w-[42%] h-[130px] items-center bg-white rounded-lg p-2 flex-col justify-center">
                <View className="w-full h-3/4">
                  <View className="w-full h-[80px] items-center bg-[rgba(217,217,217,0.6)] rounded-lg py-2 mb-1">
                    <Image
                      // source can be added here if needed
                      resizeMode="stretch"
                      className="w-[55px] h-[41px]"
                    />
                  </View>
                  <View>
                    <Text className="text-[#738AA0] text-xs">
                      Suncook rice...
                    </Text>
                    <Text className="text-[#738AA0] text-xs font-bold">
                      150.000 VND
                    </Text>
                  </View>
                </View>
              </View>
              <Icon name="swap-horizontal-outline" size={24} color="#00b0b9" />
              {/* Second item container */}
              <View className="w-[42%] h-[130px] items-center bg-white rounded-lg p-2 flex-col justify-center">
                <View className="w-full h-3/4">
                  <View className="w-full h-[80px] items-center bg-[rgba(217,217,217,0.6)] rounded-lg py-2 mb-1">
                    <Image
                      // source can be added here if needed
                      resizeMode="stretch"
                      className="w-[55px] h-[41px]"
                    />
                  </View>
                  <View>
                    <Text className="text-[#738AA0] text-xs">
                      Suncook rice...
                    </Text>
                    <Text className="text-[#738AA0] text-xs font-bold">
                      150.000 VND
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Exchange info */}
            <View className="py-1">
              <View className="flex-row">
                <Text className="text-[#738AA0] text-sm">Date & Time: </Text>
                <Text className="text-black text-sm font-bold underline">
                  {exchange?.dateTime || "N/A"}
                </Text>
              </View>
              <View className="flex-row my-1">
                <Text className="text-[#738AA0] text-sm">Exchange ID: </Text>
                <Text className="text-black text-sm font-bold">
                  {exchange?.exchangeId || "N/A"}
                </Text>
              </View>
              <View className="flex-row">
                <Text className="text-[#738AA0] text-sm">
                  Additional payment:{" "}
                </Text>
                <Text className="text-[#00b0b9] text-sm font-bold">
                  {exchange?.additionalPayment || "0 VND"}
                </Text>
              </View>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View className="px-5">
      {isSender ? (
        <View
          className={`${alignmentClass} ${backgroundClass} max-w-[70%] rounded-lg p-3 my-1`}
        >
          {renderContent()}
          {time && (
            <Text className="text-[10px] text-black mt-1 text-right">
              {time}
            </Text>
          )}
        </View>
      ) : (
        <View className="flex-row ">
          <View className="w-12 h-12 rounded-full items-center justify-center">
            <Icon name="person-circle-outline" size={45} color="gray" />
          </View>
          <View
            className={`${alignmentClass} ${backgroundClass} max-w-[70%] rounded-lg p-3 my-2`}
          >
            {renderContent()}
            {time && (
              <Text className="text-[10px] text-black mt-1 text-right">
                {time}
              </Text>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

export default Message;
