import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import LoadingButton from "../../../components/LoadingButton";

const ForgotPassSuccessScreen: React.FC = () => {
  const handleSend = async () => {
    // Test Loading: delay 3 giây
    await new Promise((resolve) => setTimeout(resolve, 3000));
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.contentContainer}>
        {/* Image Container với background và icon ở giữa */}
        <View style={styles.imageContainer}>
          <View style={styles.imageBackground} />
          <Icon
            name="key-outline"
            size={120}
            color="#ffffff"
            style={styles.centerImage}
          />
        </View>

        {/* Title */}
        <Text style={styles.titleText}>Your Password Has{"\n"}Been Reset!</Text>

        {/* Subtitle */}
        <Text style={styles.subtitleText}>
          Log in with your new password to {"\n"} continue your journey.
        </Text>
      </View>
      {/* Button */}
      <View style={styles.buttonContainer}>
        <LoadingButton title="Done" onPress={handleSend} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#f6f9f9",
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    width: "90%",
    height: "70%",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    width: 266,
    height: 266,
    position: "relative",
    overflow: "hidden",
    marginBottom: 20,
    borderRadius: 10,
  },
  imageBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#dfecec",
  },
  centerImage: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -60 }, { translateY: -60 }],
  },
  titleText: {
    fontFamily: "DM Sans",
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 30.8,
    color: "#0b1d2d",
    textAlign: "center",
    marginTop: 20,
  },
  subtitleText: {
    fontFamily: "DM Sans",
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 24,
    color: "#738aa0",
    textAlign: "center",
    marginTop: 10,
  },
  buttonContainer: {
    width: "90%",
    marginTop: 20,
  },
});

export default ForgotPassSuccessScreen;
