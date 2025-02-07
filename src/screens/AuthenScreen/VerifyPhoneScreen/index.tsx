import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import LoadingButton from "../../../components/LoadingButton";

const VerifyPhoneScreen: React.FC = () => {
  // State cho mã quốc gia và số điện thoại
  const [countryCode, setCountryCode] = useState("+84");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSend = async () => {
    // Test Loading: delay 3 giây
    await new Promise((resolve) => setTimeout(resolve, 3000));
  };

  // Hàm định dạng số điện thoại theo mẫu "123-456-6789"
  const formatPhoneNumber = (digits: string) => {
    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 6) {
      return digits.slice(0, 3) + "-" + digits.slice(3);
    } else {
      return (
        digits.slice(0, 3) +
        "-" +
        digits.slice(3, 6) +
        "-" +
        digits.slice(6, 10)
      );
    }
  };

  const handlePhoneChange = (input: string) => {
    const cleaned = input.replace(/\D/g, "");
    const limited = cleaned.slice(0, 10);
    const formatted = formatPhoneNumber(limited);
    setPhoneNumber(formatted);
  };

  const isValidPhone = (phone: string) => {
    const regex = /^\d{3}-\d{3}-\d{4}$/;
    return regex.test(phone);
  };

  const renderValidationIcon = () => {
    if (phoneNumber.trim().length === 0) {
      return null;
    }
    if (isValidPhone(phoneNumber)) {
      return (
        <Icon
          name="checkmark-outline"
          size={20}
          color="#00b0b9"
          style={styles.validationIcon}
        />
      );
    } else {
      return (
        <Icon
          name="close-outline"
          size={20}
          color="red"
          style={styles.validationIcon}
        />
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header: Back Button & Title */}
      <View style={styles.headerContainer}>
        <View style={styles.backButtonContainer}>
          <Icon name="chevron-back-outline" size={24} color="#0b1d2d" />
        </View>
        <Text style={styles.headerTitle}>Verify your phone number</Text>
      </View>

      {/* Form nằm ngay dưới Header */}
      <View style={styles.formContainer}>
        <Text style={styles.instructions}>
          We have sent you an SMS with a code to number +17 123-456-789
        </Text>

        {/* Input cho số điện thoại với mã quốc gia */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <View style={styles.inputIconContainer}>
              <Icon name="phone-portrait-outline" size={20} color="#ffffff" />
            </View>
            {/* Container cho mã quốc gia */}
            <View style={styles.countryCodeContainer}>
              <Text style={styles.countryCodeText}>{countryCode}</Text>
            </View>
            {/* Ô nhập số điện thoại */}
            <TextInput
              placeholder="123-456-6789"
              placeholderTextColor="#738aa0"
              style={[styles.textInput, { flex: 1 }]}
              keyboardType="number-pad"
              value={phoneNumber}
              onChangeText={handlePhoneChange}
            />
            {renderValidationIcon()}
          </View>
        </View>

        <LoadingButton title="Confirm" onPress={handleSend} />
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
  },
  formContainer: {
    backgroundColor: "#ffffff",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    marginHorizontal: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 20,
  },
  instructions: {
    fontSize: 16,
    fontFamily: "DM Sans",
    color: "#738aa0",
    marginTop: 20,
    marginBottom: 30,
    fontWeight: "700",
  },
  inputContainer: {
    width: "100%",
    height: 50,
    marginBottom: 30,
  },
  inputWrapper: {
    flexDirection: "row",
    height: "100%",
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
  countryCodeContainer: {
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 1,
    borderRightColor: "#738aa0",
    marginRight: 10,
  },
  countryCodeText: {
    fontSize: 16,
    fontFamily: "DM Sans",
    color: "#0b1d2d",
  },
  textInput: {
    fontSize: 16,
    fontFamily: "DM Sans",
    color: "#0b1d2d",
  },
  validationIcon: {
    marginLeft: 10,
  },
});

export default VerifyPhoneScreen;
