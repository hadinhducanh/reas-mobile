import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import LoadingButton from "../../../components/LoadingButton";
import { useNavigation } from "@react-navigation/native";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import {
  fetchUserInfoThunk,
  sendOtpThunk,
} from "../../../redux/thunk/authThunks";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Header from "../../../components/Header";

const emailRegex =
  /^[^\.][a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/;
const passwordRegex =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
const signUpSchema = z
  .object({
    email: z.string().min(1, "Email is required").email("Email is invalid"),
    fullName: z.string().min(1, "Full Name is required"),
    password: z
      .string()
      .min(1, "Password is required")
      .regex(
        passwordRegex,
        "Password must be at least 8 characters long, contain one uppercase letter, one digit, and one special character"
      ),
    confirmPassword: z
      .string()
      .min(1, "Confirm Password is required")
      .regex(
        passwordRegex,
        "Password must be at least 8 characters long, contain one uppercase letter, one digit, and one special character"
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const SignUp: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { accessToken, loading, otp } = useSelector(
    (state: RootState) => state.auth
  );
  const navigation = useNavigation<any>();

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(true);

  const validationIcon = useMemo(() => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return null;
    return emailRegex.test(email) ? (
      <Icon
        name="checkmark-outline"
        size={20}
        color="#00b0b9"
        style={{ marginLeft: 10 }}
      />
    ) : (
      <Icon
        name="close-outline"
        size={20}
        color="red"
        style={{ marginLeft: 10 }}
      />
    );
  }, [email]);

  const handleSignUp = useCallback(async () => {
    const trimmedEmail = email.trim();
    const trimmedFullName = fullName.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    // Kiểm tra rỗng
    if (
      !trimmedEmail ||
      !trimmedFullName ||
      !trimmedPassword ||
      !trimmedConfirmPassword
    ) {
      Alert.alert("Sign up Failed", "All fields are required");
      return;
    }

    // Validate dữ liệu với schema
    const result = signUpSchema.safeParse({
      email: trimmedEmail,
      fullName: trimmedFullName,
      password: trimmedPassword,
      confirmPassword: trimmedConfirmPassword,
    });
    if (!result.success) {
      const errorMessage = result.error.errors
        .map((error) => error.message)
        .join("\n");
      Alert.alert("Sign up Failed", errorMessage);
      return;
    }

    try {
      const signUpDTO = {
        fullName: trimmedFullName,
        email: trimmedEmail,
        password: trimmedPassword,
      };
      // Chờ đến khi OTP được gửi thành công (với dispatch sendOtpThunk)
      await dispatch(sendOtpThunk(signUpDTO)).unwrap();
      // Sau khi gửi OTP, chuyển hướng sang màn hình OTP và truyền SignUpDTO qua params
      navigation.navigate("OTP", { signUpDTO });
    } catch (err: any) {
      Alert.alert("Sign up Failed", err.message || "Sign up failed");
    }
  }, [dispatch, email, fullName, password, confirmPassword, navigation]);

  const handleTogglePasswordVisibility = useCallback(() => {
    setPasswordVisible((prev) => !prev);
  }, []);

  const handleToggleConfirmPasswordVisibility = useCallback(() => {
    setConfirmPasswordVisible((prev) => !prev);
  }, []);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleNavigateToSignIn = useCallback(() => {
    navigation.navigate("SignIn");
  }, [navigation]);

  useEffect(() => {
    if (accessToken) {
      dispatch(fetchUserInfoThunk());
      navigation.navigate("MainTabs", { screen: "Account" });
    }
  }, [accessToken, dispatch, navigation]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView className="flex-1 bg-[#F6F9F9]">
        <KeyboardAwareScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          extraScrollHeight={20} // Điều chỉnh khoảng cách thêm khi input bị che
          enableOnAndroid={true}
          keyboardShouldPersistTaps="handled"
        >
          <Header title="" showOption={false} />

          {/* Content Container */}
          <View className="flex-1 justify-between">
            {/* Form Container */}
            <View className="flex-1 flex-col justify-center bg-white rounded-tl-[10px] rounded-tr-[10px] mx-[20px] px-[20px] mt-[25px] mb-[10px]">
              <Text className="text-[28px] font-bold leading-[36px] text-[#0b1d2d] mb-[10px]">
                Welcome to REAS!
              </Text>
              <Text className="text-[16px] font-bold leading-[24px] text-[#738aa0] mb-[20px]">
                Sign up to continue
              </Text>

              {/* Full Name Input */}
              <View className="w-full h-[50px] mb-[20px]">
                <View className="flex-row h-[50px] px-[6px] items-center bg-[#e8f3f6] rounded-[8px]">
                  <View className="w-[40px] h-[40px] bg-[#00b0b9] rounded-[8px] justify-center items-center mr-[10px]">
                    <Icon name="person-outline" size={20} color="#ffffff" />
                  </View>
                  <TextInput
                    placeholder="Full Name"
                    placeholderTextColor="#738aa0"
                    className="flex-1 text-[16px] text-[#0b1d2d]"
                    value={fullName}
                    onChangeText={setFullName}
                  />
                </View>
              </View>

              {/* Email Input */}
              <View className="w-full h-[50px] mb-[20px]">
                <View className="flex-row h-[50px] px-[6px] items-center bg-[#e8f3f6] rounded-[8px]">
                  <View className="w-[40px] h-[40px] bg-[#00b0b9] rounded-[8px] justify-center items-center mr-[10px]">
                    <Icon name="mail-outline" size={20} color="#ffffff" />
                  </View>
                  <TextInput
                    placeholder="Email"
                    placeholderTextColor="#738aa0"
                    className="flex-1 text-[16px] text-[#0b1d2d]"
                    value={email}
                    onChangeText={setEmail}
                  />
                  {validationIcon}
                </View>
              </View>

              {/* Password Input */}
              <View className="w-full h-[50px] mb-[20px]">
                <View className="flex-row h-[50px] px-[6px] items-center bg-[#e8f3f6] rounded-[8px]">
                  <View className="w-[40px] h-[40px] bg-[#00b0b9] rounded-[8px] justify-center items-center mr-[10px]">
                    <Icon name="key-outline" size={20} color="#ffffff" />
                  </View>
                  <TextInput
                    placeholder="Password"
                    placeholderTextColor="#738aa0"
                    secureTextEntry={passwordVisible}
                    className="flex-1 text-[16px] text-[#0b1d2d]"
                    value={password}
                    onChangeText={setPassword}
                  />
                  <Icon
                    name={passwordVisible ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="black"
                    onPress={handleTogglePasswordVisibility}
                    style={{ marginLeft: 10 }}
                  />
                </View>
              </View>

              {/* Confirm Password Input */}
              <View className="w-full h-[50px] mb-[20px]">
                <View className="flex-row h-[50px] px-[6px] items-center bg-[#e8f3f6] rounded-[8px]">
                  <View className="w-[40px] h-[40px] bg-[#00b0b9] rounded-[8px] justify-center items-center mr-[10px]">
                    <Icon name="key-outline" size={20} color="#ffffff" />
                  </View>
                  <TextInput
                    placeholder="Confirm Password"
                    placeholderTextColor="#738aa0"
                    secureTextEntry={confirmPasswordVisible}
                    className="flex-1 text-[16px] text-[#0b1d2d]"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                  />
                  <Icon
                    name={
                      confirmPasswordVisible ? "eye-off-outline" : "eye-outline"
                    }
                    size={20}
                    color="black"
                    onPress={handleToggleConfirmPasswordVisibility}
                    style={{ marginLeft: 10 }}
                  />
                </View>
              </View>

              {/* Sign Up Button */}
              <LoadingButton
                title="Sign up"
                onPress={handleSignUp}
                loading={loading}
              />
              {/* Sign In Link */}
              <Pressable onPress={handleNavigateToSignIn}>
                <Text className="text-sm text-[#738aa0] mt-3">
                  Already have an account?
                  <Text className="text-[#00b0b9]"> Sign in.</Text>
                </Text>
              </Pressable>
            </View>

            {/* Social Buttons Container */}
            <View className="flex-row justify-between mx-[20px] mb-[20px]">
              <View className="w-[48%] h-[50px] bg-white rounded-bl-[10px] rounded-br-[10px] justify-center items-center">
                <Icon name="logo-facebook" size={25} color="blue" />
              </View>
              <View className="w-[48%] h-[50px] bg-white rounded-bl-[10px] rounded-br-[10px] justify-center items-center">
                <Icon name="logo-google" size={25} color="red" />
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default SignUp;
