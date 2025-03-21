import React, { useState } from "react";
import { Pressable, Text, ActivityIndicator, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

type ButtonProps = {
  title: string;
  onPress: () => Promise<void> | void;
  loading?: boolean;
  loadingUploadImage?: boolean;
  loadingColor?: string;
  buttonClassName?: string;
  textColor?: string;
  iconName?: string;
  iconSize?: number;
  iconColor?: string;
  showIcon?: boolean;
};

const LoadingButton: React.FC<ButtonProps> = ({
  title,
  onPress,
  loadingUploadImage = false,
  loading = false,
  loadingColor,
  buttonClassName = "",
  textColor = "",
  iconName = "",
  iconSize = 0,
  iconColor = "",
  showIcon = false,
}) => {
  const baseBackgroundColor = "#00b0b9";
  const baseTextColor = textColor || "text-white";
  const indicatorColor = loadingColor || "#ffffff";

  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      className={`w-full rounded-full justify-center items-center bg-[${baseBackgroundColor}] ${buttonClassName} active:bg-[rgb(0,176,185,0.5)]
      `}
    >
      {loading || loadingUploadImage ? (
        <ActivityIndicator size="small" color={indicatorColor} />
      ) : (
        <View className="flex-row items-center">
          {showIcon && (
            <Icon
              className="mr-1"
              name={iconName}
              size={iconSize}
              color={iconColor}
            />
          )}

          <Text className={`text-base font-bold ${baseTextColor}`}>
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  );
};

export default LoadingButton;
