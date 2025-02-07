import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import LoadingButton from "../../../components/LoadingButton";

const ForgotPassScreen: React.FC = () => {
  const [email, setEmail] = useState("");

  const handleSend = async () => {
    // Test Loading: delay 3 giây
    await new Promise((resolve) => setTimeout(resolve, 3000));
  };

  const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const renderValidationIcon = () => {
    if (email.trim().length === 0) {
      return null;
    }
    if (isValidEmail(email)) {
      return (
        <Icon
          name="checkmark-outline"
          size={20}
          color="#00b0b9"
          style={styles.passwordToggleIcon}
        />
      );
    } else {
      return (
        <Icon
          name="close-outline"
          size={20}
          color="red"
          style={styles.passwordToggleIcon}
        />
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header: Back Button & Title */}
      <View style={styles.headerContainer}>
        <View style={styles.backButtonContainer}>
          <Icon name="chevron-back-outline" size={24} color="#0b1d2d" />
        </View>
        <Text style={styles.headerTitle}>Forgot Password</Text>
      </View>

      {/* Form nằm ngay dưới Header */}
      <View style={styles.formContainer}>
        <Text style={styles.instructions}>
          Please enter your email address. You will receive a link to create a
          new password via email
        </Text>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <View style={styles.inputIconContainer}>
              <Icon name="mail-outline" size={20} color="#ffffff" />
            </View>
            <TextInput
              placeholder="Email"
              placeholderTextColor="#738aa0"
              style={styles.textInput}
              value={email}
              onChangeText={setEmail}
            />
            {renderValidationIcon()}
          </View>
        </View>

        <LoadingButton title="Send" onPress={handleSend} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F6F9F9",
  },
  headerContainer: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  backButtonContainer: {
    position: "absolute",
    left: 20,
    top: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "DM Sans",
  },
  formContainer: {
    backgroundColor: "#ffffff",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    marginHorizontal: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 20,
  },
  instructions: {
    fontSize: 16,
    fontFamily: "DM Sans",
    color: "#738aa0",
    marginTop: 20,
    marginBottom: 30,
    fontWeight: "700",
  },
  inputContainer: {
    width: "100%",
    height: 50,
    marginBottom: 30,
  },
  inputWrapper: {
    flexDirection: "row",
    height: 50,
    paddingHorizontal: 6,
    alignItems: "center",
    backgroundColor: "#e8f3f6",
    borderRadius: 8,
  },
  inputIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: "#00b0b9",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: "DM Sans",
    color: "#0b1d2d",
  },
  passwordToggleIcon: {
    marginLeft: 10,
  },
});

export default ForgotPassScreen;
