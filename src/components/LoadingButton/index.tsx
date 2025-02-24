import React, { useState } from "react";
import { Pressable, Text, ActivityIndicator } from "react-native";

type ButtonProps = {
  title: string;
  onPress: () => Promise<void> | void;
  loadingColor?: string;
  buttonClassName?: string;
  textColor?: string;
};

const LoadingButton: React.FC<ButtonProps> = ({
  title,
  onPress,
  loadingColor,
  buttonClassName = "",
  textColor = "",
}) => {
  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await onPress();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const baseBackgroundColor = "#00b0b9";
  const baseTextColor = textColor || "text-white";
  const indicatorColor = loadingColor || "#ffffff";

  return (
    <Pressable
      onPress={handlePress}
      disabled={loading}
      className={`w-full py-4 rounded-lg flex justify-center items-center bg-[${baseBackgroundColor}] ${buttonClassName}`}
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
