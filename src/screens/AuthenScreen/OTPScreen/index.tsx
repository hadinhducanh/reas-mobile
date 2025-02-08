import React, { useRef, useState } from "react";
import { View, Text, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import LoadingButton from "../../../components/LoadingButton";

const OTPScreen: React.FC = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);

  // Tạo ref cho 4 ô TextInput để chuyển focus tự động
  const otp1Ref = useRef<TextInput>(null);
  const otp2Ref = useRef<TextInput>(null);
  const otp3Ref = useRef<TextInput>(null);
  const otp4Ref = useRef<TextInput>(null);

  const handleSend = async () => {
    // Ghép các số OTP lại thành chuỗi
    const otpValue = otp.join("");
    // Test Loading: delay 3 giây
    await new Promise((resolve) => setTimeout(resolve, 3000));
    console.log("OTP entered:", otpValue);
  };

  // Xử lý khi nhập số ở mỗi ô
  const handleChange = (index: number, value: string) => {
    // Chỉ cho phép nhập số (0-9) hoặc xóa (để trống)
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Nếu nhập xong (không phải rỗng) chuyển focus sang ô tiếp theo
      if (value !== "") {
        if (index === 0) {
          otp2Ref.current?.focus();
        } else if (index === 1) {
          otp3Ref.current?.focus();
        } else if (index === 2) {
          otp4Ref.current?.focus();
        }
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F6F9F9]">
      {/* Header */}
      <View className="relative flex-row items-center justify-center h-[50px] px-[20px] pt-[20px]">
        <View className="absolute left-[20px] top-[20px]">
          <Icon name="chevron-back-outline" size={24} color="#0b1d2d" />
        </View>
        <Text className="text-[18px] text-[#0b1d2d]">Verify OTP</Text>
      </View>

      {/* Form */}
      <View className="bg-white rounded-tl-[10px] rounded-tr-[10px] mx-[20px] px-[20px] py-[30px] mt-[20px]">
        <Text className="text-[16px] text-[#738aa0] mb-[30px] font-light">
          Enter your OTP code here.
        </Text>

        <View className="flex-row justify-around mb-[30px]">
          <TextInput
            ref={otp1Ref}
            keyboardType="number-pad"
            maxLength={1}
            value={otp[0]}
            onChangeText={(value) => handleChange(0, value)}
            className="w-[60px] h-[60px] rounded-[8px] bg-[#e8f3f6] text-center text-[20px] text-[#0b1d2d]"
          />
          <TextInput
            ref={otp2Ref}
            keyboardType="number-pad"
            maxLength={1}
            value={otp[1]}
            onChangeText={(value) => handleChange(1, value)}
            className="w-[60px] h-[60px] rounded-[8px] bg-[#e8f3f6] text-center text-[20px] text-[#0b1d2d]"
          />
          <TextInput
            ref={otp3Ref}
            keyboardType="number-pad"
            maxLength={1}
            value={otp[2]}
            onChangeText={(value) => handleChange(2, value)}
            className="w-[60px] h-[60px] rounded-[8px] bg-[#e8f3f6] text-center text-[20px] text-[#0b1d2d]"
          />
          <TextInput
            ref={otp4Ref}
            keyboardType="number-pad"
            maxLength={1}
            value={otp[3]}
            onChangeText={(value) => handleChange(3, value)}
            className="w-[60px] h-[60px] rounded-[8px] bg-[#e8f3f6] text-center text-[20px] text-[#0b1d2d]"
          />
        </View>

        <Text className="text-[16px] text-[#738aa0] mb-[20px]">
          Didn't receive the OTP?
          <Text className="text-[#00b0b9]"> Resend.</Text>
        </Text>

        <LoadingButton title="Verify" onPress={handleSend} />
      </View>
    </SafeAreaView>
  );
};

export default OTPScreen;
