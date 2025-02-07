import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import LoadingButton from "../../../components/LoadingButton";

const SignInScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [remember, setRemember] = useState(false);

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
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>

          {/* Username Input */}
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

          {/* Remember Me & Forgot Password */}
          <View style={styles.rememberContainer}>
            <TouchableOpacity
              style={styles.rememberWrapper}
              onPress={() => setRemember(!remember)}
              activeOpacity={0.8}
            >
              <View
                style={[styles.checkbox, remember && styles.checkboxChecked]}
              >
                {remember && <Text style={styles.checkMark}>✓</Text>}
              </View>
              <Text style={styles.rememberText}>Remember me</Text>
            </TouchableOpacity>
            <Text style={styles.forgotPassword}>Forgot password?</Text>
          </View>

          {/* Sign In Button */}
          <LoadingButton title="Sign in" onPress={handleSignIn} />

          {/* Sign Up Link */}
          <Text style={styles.signUpText}>
            Don’t have an account?
            <Text style={styles.signUpLink}>Sign up.</Text>
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
    flex: 1, // Chiếm phần không gian còn lại
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
  rememberContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  rememberWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 18,
    height: 18,
    backgroundColor: "#e6eff8",
    borderRadius: 4,
    marginRight: 6,
    marginLeft: 6,
  },
  rememberText: {
    fontSize: 11,
    fontFamily: "DM Sans",
    fontWeight: "400",
    color: "#738aa0",
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
    fontSize: 11,
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
  checkboxChecked: {
    backgroundColor: "#00b0b9",
  },
  checkMark: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 18,
  },
});

export default SignInScreen;
