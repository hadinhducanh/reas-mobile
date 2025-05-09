import React, { useRef, useState } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import LoadingButton from "../../../components/LoadingButton";
import { sendOtpThunk, signupUserThunk } from "../../../redux/thunk/authThunks";
import Header from "../../../components/Header";
import ErrorModal from "../../../components/ErrorModal";
import { useTranslation } from "react-i18next";

interface SignUpDTO {
  fullName: string;
  email: string;
  password: string;
  registrationTokens: string[];
}

const OTP: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, otp } = useSelector((state: RootState) => state.auth);
  const [visible, setVisible] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const { t } = useTranslation();

  const [otpInput, setOtp] = useState(Array(6).fill(""));

  const otpRefs = Array.from({ length: 6 }, (_, i) => useRef<TextInput>(null));

  const handleChange = (index: number, value: string) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otpInput];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value !== "" && index < otpInput.length - 1) {
        otpRefs[index + 1].current?.focus();
      }
    }
  };

  const verifyOTP = async () => {
    const userEnteredOTP = otpInput.join("").trim();
    const systemOTP = String(otp).trim();
    if (userEnteredOTP === systemOTP) {
      const { signUpDTO } = route.params as { signUpDTO: SignUpDTO };
      try {
        const result = await dispatch(signupUserThunk(signUpDTO)).unwrap();
        if (result.accessToken) {
          navigation.navigate("SignUpSuccess");
        }
      } catch (error: any) {
        setTitle("Authentication Failed");
        setContent(error?.message ? t(error.message) : "Something went wrong");
        setVisible(true);
        return;
      }
    } else {
      setTitle("OTP Verification");
      setContent("The OTP you entered is invalid. Please try again.");
      setVisible(true);
      return;
    }
  };

  const resendOTP = async () => {
    const { signUpDTO } = route.params as { signUpDTO: SignUpDTO };
    try {
      await dispatch(sendOtpThunk(signUpDTO)).unwrap();
      setTitle("Notification");
      setContent("A new OTP has been sent to your email.");
      setVisible(true);
    } catch (error: any) {
      setTitle("Resend Failed");
      setContent(
        error?.message
          ? error.message
          : "Unable to resend OTP. Please try again later."
      );
      setVisible(true);
    }
  };

  const inputStyle =
    "w-[48px] h-[48px] rounded-[8px] bg-[#e8f3f6] text-center text-[20px] text-[#0b1d2d]";

  return (
    <SafeAreaView className="flex-1 bg-[#F6F9F9]">
      <Header title="Verify OTP" showOption={false} />

      <View className="bg-white rounded-tl-[10px] rounded-tr-[10px] mx-[20px] px-[20px] py-[30px] mt-[20px]">
        <Text className="text-[16px] text-[#738aa0] mb-[30px] font-light">
          Enter your OTP code here.
        </Text>

        <View className="flex-row justify-around mb-[30px]">
          {otpInput.map((digit, index) => (
            <TextInput
              key={index}
              ref={otpRefs[index]}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(value) => handleChange(index, value)}
              className={inputStyle}
            />
          ))}
        </View>

        <ErrorModal
          content={content}
          title={title}
          visible={visible}
          onCancel={() => setVisible(false)}
        />

        <LoadingButton
          title="Verify"
          onPress={verifyOTP}
          loading={loading}
          buttonClassName="py-4"
        />

        <Pressable onPress={resendOTP}>
          <Text className="text-[16px] text-[#738aa0] mt-3">
            Didn't receive the OTP?{" "}
            <Text className="text-[#00b0b9]">Resend.</Text>
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default OTP;
