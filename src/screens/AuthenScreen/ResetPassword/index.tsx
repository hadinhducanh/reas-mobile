import React, { useCallback, useState } from "react";
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

// Schema xác thực mật khẩu với Zod (oldPassword và newPassword phải giống nhau)
const passwordRegex =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
const passwordSchema = z.object({
  oldPassword: z.string().min(1, "Old password is required"),
  newPassword: z
    .string()
    .min(1, "New password is required")
    .regex(
      passwordRegex,
      "New password must be at least 8 characters long, contain one uppercase letter, one digit, and one special character"
    ),
});

const ResetPassword: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const { loading } = useSelector((state: RootState) => state.auth);

  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");

  const [passwordVisible, setPasswordVisible] = useState(true);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(true);

  const handleChangePassword = useCallback(async () => {
    const trimmedOldPassword = oldPassword.trim();
    const trimmedNewPassword = newPassword.trim();

    if (!trimmedOldPassword || !trimmedNewPassword) {
      Alert.alert("Reset password failed", "All fields is required");
      return;
    }

    const result = passwordSchema.safeParse({
      oldPassword: trimmedOldPassword,
      newPassword: trimmedNewPassword,
    });
    if (!result.success) {
      const errorMessage = result.error.errors
        .map((error) => error.message)
        .join(" ");
      Alert.alert("Reset password failed", errorMessage);
      return;
    }

    try {
      const response = await dispatch(
        changePasswordThunk({
          oldPassword: trimmedOldPassword,
          newPassword: trimmedNewPassword,
        })
      ).unwrap(); // Lấy kết quả từ API

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
      Alert.alert(
        "Reset password failed",
        err.message || "Something went wrong"
      );
    }
  }, [dispatch, oldPassword, newPassword]);

  return (
    <SafeAreaView className="flex-1 bg-[#F6F9F9]">
      <Header title="Reset password" showOption={false} />

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
              placeholder="Password"
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

        {/* Confirm Password Input */}
        <View className="w-full h-[50px] mb-[30px]">
          <View className="flex-row h-[50px] px-[6px] items-center bg-[#e8f3f6] rounded-[8px]">
            <View className="w-[40px] h-[40px] bg-[#00b0b9] rounded-[8px] justify-center items-center mr-[10px]">
              <Icon name="key-outline" size={20} color="#ffffff" />
            </View>
            <TextInput
              placeholder="Confirm Password"
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

        <LoadingButton
          title="Change Password"
          onPress={handleChangePassword}
          loading={loading}
        />
      </View>
    </SafeAreaView>
  );
};

export default ResetPassword;
