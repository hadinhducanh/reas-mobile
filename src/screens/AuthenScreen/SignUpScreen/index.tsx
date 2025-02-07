import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import LoadingButton from "../../../components/LoadingButton";

const SignUpScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [confirmpasswordVisible, setConfirmpasswordVisible] = useState(true);

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

  const handleSignIn = async () => {
    //Test Loading
    await new Promise((resolve) => setTimeout(resolve, 3000));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header: Back Button */}
      <View style={styles.headerContainer}>
        <Icon name="chevron-back-outline" size={24} color="#0b1d2d" />
      </View>

      {/* Content Container */}
      <View style={styles.contentContainer}>
        {/* Form Container: chiếm phần còn lại của không gian */}
        <View style={styles.formContainer}>
          <Text style={styles.title}>Welcome to REAS!</Text>
          <Text style={styles.subtitle}>Sign up to continue</Text>

          {/* Username Input */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <View style={styles.inputIconContainer}>
                <Icon name="person-outline" size={20} color={"#ffffff"} />
              </View>
              <TextInput
                placeholder="Full Name"
                placeholderTextColor="#738aa0"
                style={styles.textInput}
              />
            </View>
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <View style={styles.inputIconContainer}>
                <Icon name="mail-outline" size={20} color={"#ffffff"} />
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
                secureTextEntry={confirmpasswordVisible}
                style={styles.textInput}
              />
              <Icon
                name={
                  confirmpasswordVisible ? "eye-off-outline" : "eye-outline"
                }
                size={20}
                color="black"
                onPress={() =>
                  setConfirmpasswordVisible(!confirmpasswordVisible)
                }
                style={styles.passwordToggleIcon}
              />
            </View>
          </View>

          {/* Sign Up Button */}
          <LoadingButton title="Sign up" onPress={handleSignIn} />

          {/* Sign In Link */}
          <Text style={styles.signUpText}>
            Already have an account?
            <Text style={styles.signUpLink}> Sign in.</Text>
          </Text>
        </View>

        {/* Social Buttons Container */}
        <View style={styles.socialButtonsContainer}>
          <View style={styles.socialButton}>
            <Icon name="logo-facebook" size={25} color={"blue"} />
          </View>
          <View style={styles.socialButton}>
            <Icon name="logo-google" size={25} color={"red"} />
          </View>
        </View>
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
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: "flex-start",
  },

  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  formContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    marginHorizontal: 20,
    paddingHorizontal: 20,
    marginTop: 25,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontFamily: "DM Sans",
    fontWeight: "700",
    lineHeight: 36,
    color: "#0b1d2d",
    marginBottom: 10,
  },
  passwordToggleIcon: {
    marginLeft: 10,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "DM Sans",
    fontWeight: "700",
    lineHeight: 24,
    color: "#738aa0",
    marginBottom: 20,
  },
  inputContainer: {
    width: "100%",
    height: 50,
    marginBottom: 20,
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
  inputIcon: {
    width: 16,
    height: 16,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: "DM Sans",
    color: "#0b1d2d",
  },

  forgotPassword: {
    fontSize: 11,
    fontFamily: "DM Sans",
    fontWeight: "400",
    color: "#00b0b9",
  },
  signInButton: {
    width: "100%",
    paddingVertical: 13,
    backgroundColor: "#00b0b9",
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  signInText: {
    fontSize: 16,
    fontFamily: "DM Sans",
    fontWeight: "700",
    color: "#ffffff",
  },
  signUpText: {
    fontSize: 13,
    fontFamily: "DM Sans",
    marginBottom: 20,
    color: "#738aa0",
  },
  signUpLink: {
    color: "#00b0b9",
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  socialButton: {
    width: "48%",
    height: 50,
    backgroundColor: "#ffffff",
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SignUpScreen;
