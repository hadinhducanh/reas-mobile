import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
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
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import {
  authenticateUserThunk,
  fetchUserInfoThunk,
} from "../../../redux/thunk/authThunks";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Header from "../../../components/Header";
import { RootStackParamList } from "../../../navigation/AppNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Auth from "../../../components/Auth";
import ErrorModal from "../../../components/ErrorModal";
import { useTranslation } from "react-i18next";
import { RoleName } from "../../../common/enums/RoleName";
import { resetUserAuth } from "../../../redux/slices/authSlice";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SignIn: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { accessToken, loading, loadingGoogle, user } = useSelector(
    (state: RootState) => state.auth
  );
  const registrationToken = useSelector(
    (state: RootState) => state.notification.token
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [remember, setRemember] = useState(false);

  const { t } = useTranslation();
  const [visible, setVisible] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  const [title, setTitle] = useState<string>("");

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const state = useNavigationState((state) => state);

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

  const handleSignIn = useCallback(async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setTitle("Missing information");
      setContent("Please enter both your email and password to continue.");
      setVisible(true);
      return;
    }

    try {
      await dispatch(
        authenticateUserThunk({
          userNameOrEmailOrPhone: trimmedEmail,
          password: trimmedPassword,
          registrationTokens: registrationToken ? [registrationToken] : [],
        })
      ).unwrap();
    } catch (err: any) {
      setTitle("Authentication failed");
      setContent(err?.message ? t(err.message) : "Something went wrong");
      setVisible(true);
      return;
    }
  }, [dispatch, email, password, navigation]);

  useEffect(() => {
    const loadCredentials = async () => {
      try {
        const storedData = await AsyncStorage.getItem("CREDENTIALS");
        if (storedData) {
          const { savedEmail, savedPassword } = JSON.parse(storedData);
          setEmail(savedEmail);
          setPassword(savedPassword);
          setRemember(true);
        }
      } catch (error) {
        console.log("Error loading credentials:", error);
      }
    };

    loadCredentials();
  }, []);

  const handleTogglePasswordVisibility = useCallback(() => {
    setPasswordVisible((prev) => !prev);
  }, []);

  const toggleRemember = useCallback(() => {
    setRemember((prev) => !prev);
  }, []);

  const handleNavigateToSignUp = useCallback(() => {
    const targetIndex = state.index - 1;

    if (targetIndex > 0 && state.routes[targetIndex].name === "SignUp") {
      navigation.goBack();
    } else {
      navigation.navigate("SignUp");
    }
  }, [navigation]);

  useEffect(() => {
    const handleLogin = async () => {
      if (accessToken) {
        if (remember) {
          await AsyncStorage.setItem(
            "CREDENTIALS",
            JSON.stringify({ savedEmail: email, savedPassword: password })
          );
        } else {
          await AsyncStorage.removeItem("CREDENTIALS");
        }

        await dispatch(fetchUserInfoThunk());
      }
    };

    handleLogin();
  }, [accessToken, remember, email, password, dispatch]);

  const handleErrorModalClose = () => {
    setVisible(false);
    dispatch(resetUserAuth());
  };

  useEffect(() => {
    if (!user) return;

    if (user.roleName === RoleName.ROLE_STAFF) {
      setTitle("Access Denied");
      setContent(
        "Staff accounts cannot log in via mobile. Please use the web portal."
      );
      setVisible(true);
      return;
    }

    if (user.roleName === RoleName.ROLE_ADMIN) {
      setTitle("Access Denied");
      setContent(
        "Admin access is only available on the web portal. Please log in there."
      );
      setVisible(true);
      return;
    }

    if (user.firstLogin) {
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
  }, [user, navigation]);

  const handleBackPress = () => {
    const targetIndex = state.index - 1;

    if (targetIndex > 0 && state.routes[targetIndex].name === "SignUp") {
      navigation.goBack();
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
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView className="flex-1 bg-[#F6F9F9] relative">
        <KeyboardAwareScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          extraScrollHeight={20}
          enableOnAndroid={true}
          keyboardShouldPersistTaps="handled"
        >
          <Header title="" showOption={false} onBackPress={handleBackPress} />

          <View className="flex-1 justify-between">
            <View className="flex-1 flex-col justify-center bg-white rounded-tl-[10px] rounded-tr-[10px] mx-[20px] px-[20px] mb-[10px]">
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
                disable={!isEmailValid}
                title="Sign in"
                onPress={handleSignIn}
                loading={loading}
                buttonClassName={`py-4 ${!isEmailValid ? "bg-gray-300" : ""}`}
                textColor={!isEmailValid ? "text-[#00b0b9]" : "text-white"}
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

              <Pressable onPress={handleNavigateToSignUp}>
                <Text className="text-sm text-center mt-3 text-[#738aa0]">
                  Don’t have an account?{" "}
                  <Text className="text-[#00b0b9]">Create account</Text>
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
          onCancel={
            accessToken ? handleErrorModalClose : () => setVisible(false)
          }
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default SignIn;
