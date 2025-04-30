import React, { useCallback, useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import LoadingButton from "../../../components/LoadingButton";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { changePasswordThunk } from "../../../redux/thunk/authThunks";
import { z } from "zod";
import Header from "../../../components/Header";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/AppNavigator";
import ErrorModal from "../../../components/ErrorModal";
import { useTranslation } from "react-i18next";

const passwordRegex =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
const specialCharsRegex = /[!@#$%^&*()_\-+={[}\]|\\:;"'<,>.?/`~]/;

const passwordSchema = z
  .object({
    oldPassword: z.string().min(1, "Old password is required"),
    newPassword: z
      .string()
      .min(1, "New password is required")
      .regex(
        passwordRegex,
        "New password must be at least 8 characters long, contain one uppercase letter, one digit, and one special character"
      ),
  })
  .refine((data) => data.oldPassword === data.newPassword, {
    message: "Passwords do not match. Please try again.",
    path: ["confirmPassword"],
  });

const ResetPassword: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { loading } = useSelector((state: RootState) => state.auth);

  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");

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

  const handleChangePassword = useCallback(async () => {
    const trimmedOldPassword = oldPassword.trim();
    const trimmedNewPassword = newPassword.trim();

    if (!trimmedOldPassword || !trimmedNewPassword) {
      setTitle("Missing information");
      setContent("All fields are required. Please fill them in to proceed.");
      setVisible(true);
      return;
    }

    const result = passwordSchema.safeParse({
      oldPassword: trimmedOldPassword,
      newPassword: trimmedNewPassword,
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
      const response = await dispatch(
        changePasswordThunk({
          oldPassword: trimmedOldPassword,
          newPassword: trimmedNewPassword,
        })
      ).unwrap();

      if (response) {
        Alert.alert("Reset password", "Successfully", [
          {
            text: "OK",
            onPress: () => {
              setOldPassword("");
              setNewPassword("");
            },
          },
        ]);
      } else {
        Alert.alert(
          "Reset password failed",
          response || "Something went wrong"
        );
      }
    } catch (err: any) {
      setTitle("Reset password failed");
      setContent(err?.message ? t(err.message) : "Something went wrong");
      setVisible(true);
      return;
    }
  }, [dispatch, oldPassword, newPassword]);

  useEffect(() => {
    setIsLengthValid(newPassword.length >= 8 && newPassword.length <= 20);
    setHasUpperCase(/[A-Z]/.test(newPassword));
    setHasLowerCase(/[a-z]/.test(newPassword));
    setHasDigit(/[0-9]/.test(newPassword));
    setHasSpecialChar(specialCharsRegex.test(newPassword));
  }, [newPassword]);

  return (
    <SafeAreaView className="flex-1 bg-[#F6F9F9]">
      <Header
        title="Reset password"
        showOption={false}
        onBackPress={() =>
          navigation.navigate("MainTabs", { screen: "Account" })
        }
      />

      {/* Form */}
      <View className="bg-white rounded-tl-[10px] rounded-tr-[10px] mx-5 p-5">
        <Text className="text-[16px] text-[#738aa0] mt-[20px] mb-[30px] font-light">
          Enter new password and confirm.
        </Text>

        {/* Old Password Input */}
        <View className="w-full h-[50px] mb-[30px]">
          <View className="flex-row h-[50px] px-[6px] items-center bg-[#e8f3f6] rounded-[8px]">
            <View className="w-[40px] h-[40px] bg-[#00b0b9] rounded-[8px] justify-center items-center mr-[10px]">
              <Icon name="key-outline" size={20} color="#ffffff" />
            </View>
            <TextInput
              placeholder="Old password"
              placeholderTextColor="#738aa0"
              secureTextEntry={passwordVisible}
              className="flex-1 text-[16px] text-[#0b1d2d]"
              value={oldPassword}
              onChangeText={setOldPassword}
            />
            <Icon
              name={passwordVisible ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="black"
              onPress={() => setPasswordVisible(!passwordVisible)}
              style={{ marginLeft: 10 }}
            />
          </View>
        </View>

        <View className="w-full h-[50px] mb-[30px]">
          <View className="flex-row h-[50px] px-[6px] items-center bg-[#e8f3f6] rounded-[8px]">
            <View className="w-[40px] h-[40px] bg-[#00b0b9] rounded-[8px] justify-center items-center mr-[10px]">
              <Icon name="key-outline" size={20} color="#ffffff" />
            </View>
            <TextInput
              placeholder="New password"
              placeholderTextColor="#738aa0"
              secureTextEntry={confirmPasswordVisible}
              className="flex-1 text-[16px] text-[#0b1d2d]"
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <Icon
              name={confirmPasswordVisible ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="black"
              onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
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
              Password must be between 8 and 20 characters
            </Text>
          </View>

          <View className="flex-row items-center mb-1">
            <Icon
              name="checkmark-circle-outline"
              size={18}
              color={
                hasUpperCase && hasLowerCase && hasDigit ? "#00b0b9" : "gray"
              }
            />
            <Text className="ml-2 text-base text-gray-500">
              Must include uppercase, lowercase letters and numbers
            </Text>
          </View>

          <View className="flex-row items-center mb-1">
            <Icon
              name="checkmark-circle-outline"
              size={18}
              color={hasSpecialChar ? "#00b0b9" : "gray"}
            />
            <Text className="ml-2 text-base text-gray-500">
              Must include at least one special character !@#$%^&*()_-
            </Text>
          </View>
        </View>

        <ErrorModal
          content={content}
          title={title}
          visible={visible}
          onCancel={() => setVisible(false)}
        />

        <LoadingButton
          disable={
            newPassword.length > 0 &&
            ((!hasUpperCase && !hasLowerCase && !hasDigit) ||
              !isLengthValid ||
              !hasSpecialChar)
          }
          title="Change Password"
          onPress={handleChangePassword}
          loading={loading}
          buttonClassName={`py-4 ${
            newPassword.length > 0 &&
            ((!hasUpperCase && !hasLowerCase && !hasDigit) ||
              !isLengthValid ||
              !hasSpecialChar)
              ? "bg-gray-300"
              : ""
          }`}
          textColor={
            newPassword.length > 0 &&
            ((!hasUpperCase && !hasLowerCase && !hasDigit) ||
              !isLengthValid ||
              !hasSpecialChar)
              ? "text-[#00b0b9]"
              : "text-white"
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default ResetPassword;
