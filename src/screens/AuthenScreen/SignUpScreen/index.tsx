import React, { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import LoadingButton from "../../../components/LoadingButton";
import { useNavigation } from "@react-navigation/native";

const SignUpScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [confirmpasswordVisible, setConfirmpasswordVisible] = useState(true);

  const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const renderValidationIcon = () => {
    if (email.trim().length === 0) {
      return null;
    }
    if (isValidEmail(email)) {
      return (
        <Icon
          name="checkmark-outline"
          size={20}
          color="#00b0b9"
          style={{ marginLeft: 10 }}
        />
      );
    } else {
      return (
        <Icon
          name="close-outline"
          size={20}
          color="red"
          style={{ marginLeft: 10 }}
        />
      );
    }
  };

  const handleSignIn = async () => {
    //Test Loading
    await new Promise((resolve) => setTimeout(resolve, 3000));
  };

  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-[#F6F9F9]">
      {/* Header: Back Button */}
      <Pressable
        className="w-full px-[20px] pt-[20px] items-start"
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Icon name="chevron-back-outline" size={24} color="#0b1d2d" />
      </Pressable>

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

          {/* Username Input */}
          <View className="w-full h-[50px] mb-[20px]">
            <View className="flex-row h-[50px] px-[6px] items-center bg-[#e8f3f6] rounded-[8px]">
              <View className="w-[40px] h-[40px] bg-[#00b0b9] rounded-[8px] justify-center items-center mr-[10px]">
                <Icon name="person-outline" size={20} color="#ffffff" />
              </View>
              <TextInput
                placeholder="Full Name"
                placeholderTextColor="#738aa0"
                className="flex-1 text-[16px] text-[#0b1d2d]"
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
              {renderValidationIcon()}
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
          <View className="w-full h-[50px] mb-[20px]">
            <View className="flex-row h-[50px] px-[6px] items-center bg-[#e8f3f6] rounded-[8px]">
              <View className="w-[40px] h-[40px] bg-[#00b0b9] rounded-[8px] justify-center items-center mr-[10px]">
                <Icon name="key-outline" size={20} color="#ffffff" />
              </View>
              <TextInput
                placeholder="Confirm Password"
                placeholderTextColor="#738aa0"
                secureTextEntry={confirmpasswordVisible}
                className="flex-1 text-[16px] text-[#0b1d2d]"
              />
              <Icon
                name={
                  confirmpasswordVisible ? "eye-off-outline" : "eye-outline"
                }
                size={20}
                color="black"
                onPress={() =>
                  setConfirmpasswordVisible(!confirmpasswordVisible)
                }
                style={{ marginLeft: 10 }}
              />
            </View>
          </View>

          {/* Sign Up Button */}
          <LoadingButton title="Sign up" onPress={handleSignIn} />

          {/* Sign In Link */}
          <Pressable
            onPress={() => {
              navigation.navigate("SignIn");
            }}
          >
            <Text className="text-[13px] text-[#738aa0] mb-[20px]">
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
    </SafeAreaView>
  );
};

export default SignUpScreen;
