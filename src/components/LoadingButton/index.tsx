import React, { useState } from "react";
import { Pressable, Text, ActivityIndicator } from "react-native";

type ButtonProps = {
  title: string;
  onPress: () => Promise<void> | void;
  loading?: boolean;
  loadingColor?: string;
  buttonClassName?: string;
  textColor?: string;
};

const LoadingButton: React.FC<ButtonProps> = ({
  title,
  onPress,
  loading = false,
  loadingColor,
  buttonClassName = "",
  textColor = "",
}) => {
  const baseBackgroundColor = "#00b0b9";
  const baseTextColor = textColor || "text-white";
  const indicatorColor = loadingColor || "#ffffff";

  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      className={`w-full py-4 rounded-lg flex justify-center items-center bg-[${baseBackgroundColor}] ${buttonClassName} active:bg-[rgb(0,176,185,0.5)]
      `}
    >
      {loading ? (
        <ActivityIndicator size="small" color={indicatorColor} />
      ) : (
        <Text className={`text-base font-bold ${baseTextColor}`}>{title}</Text>
      )}
    </Pressable>
  );
};

export default LoadingButton;
