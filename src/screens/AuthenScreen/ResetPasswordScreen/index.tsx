import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import LoadingButton from "../../../components/LoadingButton";

const ResetPasswordScreen: React.FC = () => {
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [confirmpasswordVisible, setConfirmpasswordVisible] = useState(true);

  const handleSend = async () => {
    // Test Loading: delay 3 giây
    await new Promise((resolve) => setTimeout(resolve, 3000));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header: Back Button & Title */}
      <View style={styles.headerContainer}>
        <View style={styles.backButtonContainer}>
          <Icon name="chevron-back-outline" size={24} color="#0b1d2d" />
        </View>
        <Text style={styles.headerTitle}>Reset Password</Text>
      </View>

      {/* Form nằm ngay dưới Header */}
      <View style={styles.formContainer}>
        <Text style={styles.instructions}>Enter new password and confirm.</Text>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <View style={styles.inputIconContainer}>
              <Icon name="key-outline" size={20} color={"#ffffff"} />
            </View>
            <TextInput
              placeholder="Password"
              placeholderTextColor="#738aa0"
              secureTextEntry={passwordVisible}
              style={styles.textInput}
            />
            <Icon
              name={passwordVisible ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="black"
              onPress={() => setPasswordVisible(!passwordVisible)}
              style={styles.passwordToggleIcon}
            />
          </View>
        </View>

        {/* Confirm Password Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <View style={styles.inputIconContainer}>
              <Icon name="key-outline" size={20} color={"#ffffff"} />
            </View>
            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor="#738aa0"
              style={styles.textInput}
              secureTextEntry={confirmpasswordVisible}
            />
            <Icon
              name={confirmpasswordVisible ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="black"
              onPress={() => setConfirmpasswordVisible(!confirmpasswordVisible)}
              style={styles.passwordToggleIcon}
            />
          </View>
        </View>

        <LoadingButton title="Change Password" onPress={handleSend} />
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
    fontWeight: "300",
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

export default ResetPasswordScreen;
