import React from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";

const SplashScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.circleContainer}>
        <View style={styles.innerCircle}>
          <ImageBackground
            style={styles.imageBackground}
            source={{
              uri: "https://res.cloudinary.com/dpysbryyk/image/upload/v1738837274/REAS/Logo/yphvs1utycnesn4ozy76.png",
            }}
          />
        </View>
      </View>
      <Text style={styles.text}>REAS</Text>
    </View>
  );
};

const IMAGE_SIZE = 200;
const BORDER_SIZE = 6;
const SPACING = 8;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    height: "100%",
    alignItems: "center",
    backgroundColor: "#00b0b9",
  },
  text: {
    fontSize: 28,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
    marginTop: 10,
  },
  circleContainer: {
    width: IMAGE_SIZE + BORDER_SIZE * 2 + SPACING * 2,
    height: IMAGE_SIZE + BORDER_SIZE * 2 + SPACING * 2,
    borderRadius: (IMAGE_SIZE + BORDER_SIZE * 2 + SPACING * 2) / 2,
    borderWidth: BORDER_SIZE,
    borderColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  innerCircle: {
    width: IMAGE_SIZE + SPACING * 2,
    height: IMAGE_SIZE + SPACING * 2,
    borderRadius: (IMAGE_SIZE + SPACING * 2) / 2,
    backgroundColor: "#00b0b9",
    justifyContent: "center",
    alignItems: "center",
  },
  imageBackground: {
    borderRadius: IMAGE_SIZE / 2,
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    overflow: "hidden",
  },
});

export default SplashScreen;
