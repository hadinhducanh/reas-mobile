import React, { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import LoadingButton from "../../../components/LoadingButton";
import { useNavigation } from "@react-navigation/native";
import Header from "../../../components/Header";

const ProfileDetail: React.FC = () => {
  // State quản lý chế độ chỉnh sửa
  const [isEditing, setIsEditing] = useState(false);

  // Các state chứa giá trị mặc định của form
  const [fullName, setFullName] = useState("John Doe");
  const [email, setEmail] = useState("johndoe@example.com");
  const [phoneNumber, setPhoneNumber] = useState("123-456-7890");
  const [address, setAddress] = useState("123 Main St");

  // Các state khác (ví dụ như mã quốc gia)
  const [countryCode, setCountryCode] = useState("+84");

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

  // Kiểm tra email hợp lệ
  const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Hiển thị icon kiểm tra email (checkmark nếu hợp lệ, close nếu không)
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

  // Hàm xử lý khi ấn nút Edit/Save
  const handleEditSave = async () => {
    if (!isEditing) {
      // Chuyển sang chế độ chỉnh sửa
      setIsEditing(true);
    } else {
      // Thực hiện lưu dữ liệu (giả lập loading 3 giây)
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsEditing(false);
      // Ở đây bạn có thể gọi API để lưu dữ liệu thay đổi nếu cần
    }
  };

  const textInputStyle = () =>
    `flex-1 text-[16px] text-[#0b1d2d] ${
      isEditing ? "font-normal" : "font-bold"
    }`;

  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-[#F6F9F9]">
      <Header title="Profile" showOption={false} />

      {/* Content Container */}
      <View className="flex-1 mb-5">
        {/* Form Container */}
        <View className="flex-1 flex-col justify-center bg-white rounded-[10px] mx-[20px] px-[20px] mb-[10px] items-center">
          {/* Avatar */}
          <View className="bg-[#a9b4bd] w-[100px] h-[100px] flex items-center justify-center rounded-full mb-10">
            <Icon name="camera-outline" size={40} color="white" />
          </View>

          {/* Full Name Input */}
          <View className="w-full h-[50px] mb-[20px]">
            <View className="flex-row h-[50px] px-[6px] items-center bg-[#e8f3f6] rounded-[8px]">
              <View className="w-[40px] h-[40px] bg-[#00b0b9] rounded-[8px] justify-center items-center mr-[10px]">
                <Icon name="person-outline" size={20} color="#ffffff" />
              </View>
              <TextInput
                placeholder="Full Name"
                placeholderTextColor="#738aa0"
                className={textInputStyle()}
                value={fullName}
                onChangeText={setFullName}
                editable={isEditing}
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
                className={textInputStyle()}
                value={email}
                onChangeText={setEmail}
                editable={isEditing}
              />
              {renderValidationIcon()}
            </View>
          </View>

          {/* Phone Input */}
          <View className="w-full h-[50px] mb-[30px]">
            <View className="flex-row h-full px-[6px] items-center bg-[#e8f3f6] rounded-[8px]">
              <View className="w-[40px] h-[40px] bg-[#00b0b9] rounded-[8px] justify-center items-center mr-[10px]">
                <Icon name="phone-portrait-outline" size={20} color="#ffffff" />
              </View>
              {/* Country Code */}
              <View className="px-[10px] justify-center items-center border-r border-r-[#738aa0] mr-[10px]">
                <Text className="text-[16px] text-[#0b1d2d]">
                  {countryCode}
                </Text>
              </View>
              <TextInput
                placeholder="123-456-6789"
                placeholderTextColor="#738aa0"
                keyboardType="number-pad"
                value={phoneNumber}
                onChangeText={handlePhoneChange}
                className={textInputStyle()}
                editable={isEditing}
              />
              {renderValidationIcon()}
            </View>
          </View>

          {/* Address Input */}
          <View className="w-full h-[50px] mb-[20px]">
            <View className="flex-row h-[50px] px-[6px] items-center bg-[#e8f3f6] rounded-[8px]">
              <View className="w-[40px] h-[40px] bg-[#00b0b9] rounded-[8px] justify-center items-center mr-[10px]">
                <Icon name="home-outline" size={20} color="#ffffff" />
              </View>
              <TextInput
                placeholder="Address"
                placeholderTextColor="#738aa0"
                className={textInputStyle()}
                value={address}
                onChangeText={setAddress}
                editable={isEditing}
              />
            </View>
          </View>

          {/* Nút Edit/Save */}
          <LoadingButton
            title={isEditing ? "Save change" : "Edit profile"}
            onPress={handleEditSave}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfileDetail;
