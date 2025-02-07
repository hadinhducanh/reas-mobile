import React, { useState } from "react";
import { Pressable, Text, StyleSheet, ActivityIndicator } from "react-native";

type ButtonProps = {
  title: string;
  onPress: () => Promise<void> | void;
  backgroundColor?: string;
};

const LoadingButton: React.FC<ButtonProps> = ({
  title,
  onPress,
  backgroundColor,
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

  const baseBackgroundColor = backgroundColor || "#00b0b9";

  return (
    <Pressable
      onPress={handlePress}
      disabled={loading}
      style={[styles.button, { backgroundColor: baseBackgroundColor }]}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#ffffff" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "100%",
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
  },
});

export default LoadingButton;
