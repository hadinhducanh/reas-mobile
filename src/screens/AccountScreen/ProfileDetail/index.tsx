import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import LoadingButton from "../../../components/LoadingButton";
import { useNavigation } from "@react-navigation/native";
import Header from "../../../components/Header";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/AppNavigator";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import ChooseImage from "../../../components/ChooseImage";
import { boolean } from "zod";

const ProfileDetail: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);

  const { user } = useSelector((state: RootState) => state.auth);

  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [enable, setEnable] = useState<boolean>(false);

  const [transferReceiptImage, setTransferReceiptImage] = useState<string>("");

  const [countryCode, setCountryCode] = useState("+84");

  useEffect(() => {
    if (user) {
      setFullName(user?.fullName);
      setEmail(user.email);
      if (user.phone) {
        setPhoneNumber(user.phone);
      }
      if (user.userLocations.length !== 0) {
        setAddress(user.userLocations[0].specificAddress);
      }
      if (user.image) {
        setTransferReceiptImage(user.image);
      }
    }
  }, [user]);

  useEffect(() => {
    if (fullName && email && phoneNumber && address) {
      setEnable(true);
    } else {
      setEnable(false);
    }
  }, [fullName, email, phoneNumber, address]);

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

  const handleEditSave = async () => {
    // if (!isEditing) {
    setIsEditing(!isEditing);
    // } else {
    //   await new Promise((resolve) => setTimeout(resolve, 1500));
    //   setIsEditing(false);
    // }
  };

  const textInputStyle = () =>
    `flex-1 text-[16px] text-[#0b1d2d] ${
      isEditing ? "font-normal" : "font-bold"
    }`;

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <SafeAreaView className="flex-1 bg-[#F6F9F9]">
      <Header
        title="Profile"
        showOption={false}
        onBackPress={() =>
          navigation.reset({
            index: 0,
            routes: [
              {
                name: "MainTabs",
                state: { routes: [{ name: "Account" }] },
              },
            ],
          })
        }
      />

      <View className="flex-1 mb-5">
        <View className="flex-1 flex-col justify-center bg-white rounded-[10px] mx-[20px] px-[20px] mb-[10px] items-center">
          {isEditing ? (
            <ChooseImage
              transferReceiptImage={transferReceiptImage}
              setTransferReceiptImage={setTransferReceiptImage}
              isProfile={true}
            />
          ) : (
            <View className="bg-[#a9b4bd] w-[180px] h-[180px] flex items-center justify-center rounded-full mb-10 relative">
              <View className="w-full h-full rounded-full overflow-hidden">
                <Image
                  source={{ uri: user?.image }}
                  className="w-full h-full rounded-full"
                />
              </View>
            </View>
          )}

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

          <View className="w-full h-[50px] mb-[30px]">
            <View className="flex-row h-full px-[6px] items-center bg-[#e8f3f6] rounded-[8px]">
              <View className="w-[40px] h-[40px] bg-[#00b0b9] rounded-[8px] justify-center items-center mr-[10px]">
                <Icon name="phone-portrait-outline" size={20} color="#ffffff" />
              </View>
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
            </View>
          </View>

          <View className="w-full h-[50px] mb-[20px]">
            <View className="flex-row h-[50px] px-[6px] items-center bg-[#e8f3f6] rounded-[8px]">
              <View className="w-[40px] h-[40px] bg-[#00b0b9] rounded-[8px] justify-center items-center mr-[10px]">
                <Icon name="home-outline" size={20} color="#ffffff" />
              </View>
              <TextInput
                placeholder="Choose location"
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
            disable={isEditing ? !enable : false}
            buttonClassName={`py-4 ${!enable ? "bg-gray-300" : ""}`}
            textColor={!enable ? "text-[#00b0b9]" : "text-white"}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfileDetail;
