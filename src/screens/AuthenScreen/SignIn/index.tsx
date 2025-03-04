import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  Alert,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import LoadingButton from "../../../components/LoadingButton";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import {
  authenticateUserThunk,
  fetchUserInfoThunk,
} from "../../../redux/thunk/authThunks";
import { z } from "zod";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Header from "../../../components/Header";
import { RootStackParamList } from "../../../navigation/AppNavigator";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const signInSchema = z.object({
  email: z.string().email("Email is invalid"),
  password: z.string(),
});

const SignIn: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { accessToken, loading } = useSelector(
    (state: RootState) => state.auth
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [remember, setRemember] = useState(false);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const isValidEmail = useCallback(
    (email: string) => emailRegex.test(email),
    []
  );

  const validationIcon = useMemo(() => {
    const trimmedEmail = email.trim();
    if (trimmedEmail.length === 0) return null;
    return isValidEmail(trimmedEmail) ? (
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
  }, [email, isValidEmail]);

  const handleGoogleSignIn = useCallback(() => {}, [dispatch]);

  const handleSignIn = useCallback(async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      Alert.alert("Sign in failed", "All fields is required");
      return;
    }

    const result = signInSchema.safeParse({
      email: trimmedEmail,
      password: trimmedPassword,
    });
    if (!result.success) {
      const errorMessage = result.error.errors
        .map((error) => error.message)
        .join(" ");
      Alert.alert("Sign in failed", errorMessage);
      return;
    }

    try {
      const res = await dispatch(
        authenticateUserThunk({
          userNameOrEmailOrPhone: trimmedEmail,
          password: trimmedPassword,
        })
      ).unwrap();

      if (res.accessToken) {
        dispatch(fetchUserInfoThunk());
        navigation.navigate("MainTabs", { screen: "Account" });
      }
    } catch (err: any) {
      Alert.alert("Sign in Failed", err.message || "Sign in failed");
    }
  }, [dispatch, email, password, navigation]);

  const handleTogglePasswordVisibility = useCallback(() => {
    setPasswordVisible((prev) => !prev);
  }, []);

  const toggleRemember = useCallback(() => {
    setRemember((prev) => !prev);
  }, []);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleNavigateToSignUp = useCallback(() => {
    navigation.navigate("SignUp");
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
          extraScrollHeight={20}
          enableOnAndroid={true}
          keyboardShouldPersistTaps="handled"
        >
          <Header title="" showOption={false} />

          {/* Content Container */}
          <View className="flex-1 justify-between">
            {/* Form Container */}
            <View className="flex-1 flex-col justify-center bg-white rounded-tl-[10px] rounded-tr-[10px] mx-[20px] px-[20px] mt-[25px] mb-[10px]">
              <Text className="text-[28px] font-bold leading-[36px] text-[#0b1d2d] mb-[10px]">
                Welcome Back!
              </Text>
              <Text className="text-[16px] font-bold leading-[24px] text-[#738aa0] mb-[20px]">
                Sign in to continue
              </Text>

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
              <View className="w-full h-[50px]">
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

              {/* Remember Me */}
              <View className="w-full flex-row justify-between my-3">
                <TouchableOpacity
                  className="flex-row items-center"
                  onPress={toggleRemember}
                  activeOpacity={0.8}
                >
                  <View
                    className={`w-[18px] h-[18px] rounded-[4px] mr-[6px] ml-[6px] ${
                      remember ? "bg-[#00b0b9]" : "bg-[#e6eff8]"
                    }`}
                  >
                    {remember && (
                      <Text className="text-white text-[14px] text-center leading-[18px]">
                        ✓
                      </Text>
                    )}
                  </View>
                  <Text className="text-sm text-[#738aa0]">Remember me</Text>
                </TouchableOpacity>
              </View>

              <LoadingButton
                title="Sign in"
                onPress={handleSignIn}
                loading={loading}
              />

              {/* Sign Up Link */}
              <Pressable onPress={handleNavigateToSignUp}>
                <Text className="text-sm mt-3 text-[#738aa0]">
                  Don’t have an account?{" "}
                  <Text className="text-[#00b0b9]">Sign up.</Text>
                </Text>
              </Pressable>
            </View>

            {/* Social Buttons Container */}
            <View className="flex-row justify-between mx-5 mb-5">
              <View className="w-[48%] h-[50px] bg-white rounded-bl-lg rounded-br-lg justify-center items-center">
                <Icon name="logo-facebook" size={25} color="blue" />
              </View>
              <Pressable
                className="w-[48%] h-[50px] bg-white rounded-bl-lg rounded-br-lg justify-center items-center active:bg-gray-200"
                onPress={handleGoogleSignIn}
              >
                <Icon name="logo-google" size={25} color="red" />
              </Pressable>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default SignIn;
