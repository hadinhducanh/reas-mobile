import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import LoadingButton from "../../../components/LoadingButton";

const OTPScreen: React.FC = () => {
  // Lưu trữ mã OTP dưới dạng mảng gồm 4 phần tử
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
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.backButtonContainer}>
          <Icon name="chevron-back-outline" size={24} color="#0b1d2d" />
        </View>
        <Text style={styles.headerTitle}>Verify OTP</Text>
      </View>

      {/* Form */}
      <View style={styles.formContainer}>
        <Text style={styles.instructions}>Enter your OTP code here.</Text>

        <View style={styles.otpContainer}>
          <TextInput
            ref={otp1Ref}
            style={styles.otpInput}
            keyboardType="number-pad"
            maxLength={1}
            value={otp[0]}
            onChangeText={(value) => handleChange(0, value)}
          />
          <TextInput
            ref={otp2Ref}
            style={styles.otpInput}
            keyboardType="number-pad"
            maxLength={1}
            value={otp[1]}
            onChangeText={(value) => handleChange(1, value)}
          />
          <TextInput
            ref={otp3Ref}
            style={styles.otpInput}
            keyboardType="number-pad"
            maxLength={1}
            value={otp[2]}
            onChangeText={(value) => handleChange(2, value)}
          />
          <TextInput
            ref={otp4Ref}
            style={styles.otpInput}
            keyboardType="number-pad"
            maxLength={1}
            value={otp[3]}
            onChangeText={(value) => handleChange(3, value)}
          />
        </View>
        {/* Sign Up Link */}
        <Text style={styles.signUpText}>
          Didn't receive the OTP?
          <Text style={styles.signUpLink}> Resend.</Text>
        </Text>

        <LoadingButton title="Verify" onPress={handleSend} />
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
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  backButtonContainer: {
    position: "absolute",
    left: 20,
    top: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "DM Sans",
    color: "#0b1d2d",
  },
  formContainer: {
    backgroundColor: "#ffffff",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    marginHorizontal: 20,
    paddingHorizontal: 20,
    paddingVertical: 30,
    marginTop: 20,
  },
  instructions: {
    fontSize: 16,
    fontFamily: "DM Sans",
    color: "#738aa0",
    marginBottom: 30,
    fontWeight: "300",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 30,
  },
  otpInput: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#e8f3f6",
    textAlign: "center",
    fontSize: 20,
    fontFamily: "DM Sans",
    color: "#0b1d2d",
  },
  signUpText: {
    fontSize: 16,
    fontFamily: "DM Sans",
    marginBottom: 20,
    color: "#738aa0",
  },
  signUpLink: {
    color: "#00b0b9",
  },
});

export default OTPScreen;
