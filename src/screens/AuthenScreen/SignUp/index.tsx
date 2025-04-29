import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import LoadingButton from "../../../components/LoadingButton";
import {
  NavigationProp,
  useNavigation,
  useNavigationState,
} from "@react-navigation/native";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import {
  fetchUserInfoThunk,
  sendOtpThunk,
} from "../../../redux/thunk/authThunks";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Header from "../../../components/Header";
import { RootStackParamList } from "../../../navigation/AppNavigator";
import Auth from "../../../components/Auth";
import ErrorModal from "../../../components/ErrorModal";
import { useTranslation } from "react-i18next";

const emailRegex =
  /^[^\.][a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/;
const passwordRegex =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
const specialCharsRegex = /[!@#$%^&*()_\-+={[}\]|\\:;"'<,>.?/`~]/;

const signUpSchema = z
  .object({
    email: z
      .string()
      .min(1, "Please enter your email.")
      .email("Please enter a valid email address."),
    fullName: z.string().min(1, "Please enter your full name."),
    password: z
      .string()
      .min(1, "Please enter your password.")
      .regex(
        passwordRegex,
        "Password must be at least 8 characters long and include an uppercase letter, a number, and a special character."
      ),
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match. Please try again.",
    path: ["confirmPassword"],
  });

const SignUp: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { accessToken, loading, loadingGoogle, user } = useSelector(
    (state: RootState) => state.auth
  );
  const registrationToken = useSelector(
    (state: RootState) => state.notification.token
  );
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const state = useNavigationState((state) => state);

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(true);
  const [isLengthValid, setIsLengthValid] = useState(false);
  const [hasUpperCase, setHasUpperCase] = useState(false);
  const [hasLowerCase, setHasLowerCase] = useState(false);
  const [hasDigit, setHasDigit] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);

  const [visible, setVisible] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const { t } = useTranslation();

  const isValidEmail = useCallback(
    (email: string) => emailRegex.test(email),
    []
  );
  const trimmedEmail = email.trim();
  const isEmailValid =
    trimmedEmail.length > 0 ? isValidEmail(trimmedEmail) : true;

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

  const handleSignUp = useCallback(async () => {
    const trimmedEmail = email.trim();
    const trimmedFullName = fullName.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    if (
      !trimmedEmail ||
      !trimmedFullName ||
      !trimmedPassword ||
      !trimmedConfirmPassword
    ) {
      setTitle("Missing information");
      setContent("All fields are required. Please fill them in to proceed.");
      setVisible(true);
      return;
    }

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

      setTitle("Invalid information");
      setContent(errorMessage);
      setVisible(true);
      return;
    }

    try {
      const signUpDTO = {
        fullName: trimmedFullName,
        email: trimmedEmail,
        password: trimmedPassword,
        registrationTokens: registrationToken ? [registrationToken] : [],
      };
      await dispatch(sendOtpThunk(signUpDTO)).unwrap();
      navigation.navigate("OTP", { signUpDTO });
    } catch (err: any) {
      setTitle("Authentication failed");
      setContent(err?.message ? t(err.message) : "Something went wrong");
      setVisible(true);
      return;
    }
  }, [dispatch, email, fullName, password, confirmPassword, navigation]);

  const handleTogglePasswordVisibility = useCallback(() => {
    setPasswordVisible((prev) => !prev);
  }, []);

  const handleToggleConfirmPasswordVisibility = useCallback(() => {
    setConfirmPasswordVisible((prev) => !prev);
  }, []);

  const handleNavigateToSignIn = useCallback(() => {
    const targetIndex = state.index - 1;

    if (targetIndex > 0 && state.routes[targetIndex].name === "SignIn") {
      navigation.goBack();
    } else {
      navigation.navigate("SignIn");
    }
  }, [navigation]);

  useEffect(() => {
    const handleLoginFlow = async () => {
      if (!accessToken || user) return;

      try {
        const result = await dispatch(fetchUserInfoThunk()).unwrap();

        if (result.firstLogin) {
          navigation.reset({
            index: 0,
            routes: [{ name: "Profile" }],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [
              {
                name: "MainTabs",
                state: { routes: [{ name: "Account" }] },
              },
            ],
          });
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    };

    handleLoginFlow();
  }, [accessToken, user, dispatch, navigation]);

  useEffect(() => {
    setIsLengthValid(password.length >= 8 && password.length <= 20);
    setHasUpperCase(/[A-Z]/.test(password));
    setHasLowerCase(/[a-z]/.test(password));
    setHasDigit(/[0-9]/.test(password));
    setHasSpecialChar(specialCharsRegex.test(password));
  }, [password]);

  const handleBackPress = () => {
    const targetIndex = state.index - 1;

    if (targetIndex > 0 && state.routes[targetIndex].name === "MainTabs") {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: "MainTabs",
            state: { routes: [{ name: "Account" }] },
          },
        ],
      });
    } else {
      navigation.goBack();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView className="flex-1 bg-[#F6F9F9]">
        <KeyboardAwareScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          extraScrollHeight={20}
          enableOnAndroid={true}
          keyboardShouldPersistTaps="handled"
        >
          <Header title="" showOption={false} onBackPress={handleBackPress} />

          {/* Content Container */}
          <View className="flex-1 justify-between">
            {/* Form Container */}
            <View className="flex-1 flex-col justify-center bg-white rounded-tl-[10px] rounded-tr-[10px] mx-[20px] px-[20px]  mb-[10px]">
              <Text className="text-[28px] font-bold leading-[36px] text-[#0b1d2d] mb-[10px]">
                Welcome to <Text className="text-[#00b0b9]">REAS!</Text>
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
                  {fullName && (
                    <Icon
                      name="close-circle-outline"
                      size={20}
                      color="black"
                      onPress={() => setFullName("")}
                      style={{ marginLeft: 10 }}
                    />
                  )}
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
                  {email && (
                    <Icon
                      name="close-circle-outline"
                      size={20}
                      color="black"
                      onPress={() => setEmail("")}
                      style={{ marginLeft: 10 }}
                    />
                  )}
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
                  {password && (
                    <Icon
                      name="close-circle-outline"
                      size={20}
                      color="black"
                      onPress={() => setPassword("")}
                      style={{ marginLeft: 10 }}
                    />
                  )}
                  <Icon
                    name={passwordVisible ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="black"
                    onPress={handleTogglePasswordVisibility}
                    style={{ marginLeft: 10 }}
                  />
                </View>
              </View>

              <View className="w-full h-[50px] mb-3">
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
                  {confirmPassword && (
                    <Icon
                      name="close-circle-outline"
                      size={20}
                      color="black"
                      onPress={() => setConfirmPassword("")}
                      style={{ marginLeft: 10 }}
                    />
                  )}
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

              <View className="mb-5 px-2">
                <View className="flex-row items-center mb-1">
                  <Icon
                    name="checkmark-circle-outline"
                    size={18}
                    color={isLengthValid ? "#00b0b9" : "gray"}
                  />
                  <Text className="ml-2 text-base text-gray-500">
                    Mật khẩu phải từ 8 đến 20 ký tự
                  </Text>
                </View>

                <View className="flex-row items-center mb-1">
                  <Icon
                    name="checkmark-circle-outline"
                    size={18}
                    color={
                      hasUpperCase && hasLowerCase && hasDigit
                        ? "#00b0b9"
                        : "gray"
                    }
                  />
                  <Text className="ml-2 text-base text-gray-500">
                    Bao gồm số, chữ viết hoa, chữ viết thường
                  </Text>
                </View>

                <View className="flex-row items-center mb-1">
                  <Icon
                    name="checkmark-circle-outline"
                    size={18}
                    color={hasSpecialChar ? "#00b0b9" : "gray"}
                  />
                  <Text className="ml-2 text-base text-gray-500">
                    Bao gồm ít nhất một ký tự đặc biệt !@#$%^&*()_-
                  </Text>
                </View>
              </View>

              {/* Sign Up Button */}
              <LoadingButton
                disable={
                  !isEmailValid ||
                  (password.length > 0 &&
                    ((!hasUpperCase && !hasLowerCase && !hasDigit) ||
                      !isLengthValid ||
                      !hasSpecialChar))
                }
                title="Sign up"
                onPress={handleSignUp}
                loading={loading}
                buttonClassName={`py-4 ${
                  !isEmailValid ||
                  (password.length > 0 &&
                    ((!hasUpperCase && !hasLowerCase && !hasDigit) ||
                      !isLengthValid ||
                      !hasSpecialChar))
                    ? "bg-gray-300"
                    : ""
                }`}
                textColor={
                  !isEmailValid ||
                  (password.length > 0 &&
                    ((!hasUpperCase && !hasLowerCase && !hasDigit) ||
                      !isLengthValid ||
                      !hasSpecialChar))
                    ? "text-[#00b0b9]"
                    : "text-white"
                }
              />

              <View className="flex-row items-center my-5 px-20">
                <View className="flex-1 h-px bg-gray-500" />
                <Text className="text-sm font-semibold text-gray-500 mx-5">
                  Or
                </Text>
                <View className="flex-1 h-px bg-gray-500" />
              </View>

              <View className="items-center">
                <Auth />
              </View>

              {/* Sign In Link */}
              <Pressable onPress={handleNavigateToSignIn}>
                <Text className="text-sm text-center text-[#738aa0] mt-3">
                  Already have an account?
                  <Text className="text-[#00b0b9]"> Sign in.</Text>
                </Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAwareScrollView>

        {(loading || loadingGoogle) && (
          <View
            className="absolute inset-0 bg-black opacity-50 justify-center items-center"
            pointerEvents="auto"
          ></View>
        )}

        <ErrorModal
          content={content}
          title={title}
          visible={visible}
          onCancel={() => setVisible(false)}
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default SignUp;
