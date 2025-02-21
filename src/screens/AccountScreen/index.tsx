import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";

const AccountScreen: React.FC = () => {
  const isLoggedIn = false;
  const navigation = useNavigation();

  return (
    <SafeAreaView className="bg-[#00B0B9]">
      <View className="flex-1 ">
        <View className="h-[50px] bg-[#00B0B9] items-center justify-center">
          <Text className="text-[18px] font-bold text-white">Account</Text>
        </View>
        {/* Phần thông tin người dùng hoặc nút đăng nhập/đăng ký */}
        {isLoggedIn ? (
          <View className="mx-5 h-[100px] justify-start flex-row items-center ">
            <View className="w-[70px] h-[70px] rounded-full bg-[#738aa0]" />
            <View className="ml-3">
              <Text className="text-[18px] font-bold">Ngọc Cường</Text>
              <View className="flex-row items-center justify-center mt-[6px]">
                <Text className="text-[13px] mr-1">5.0</Text>
                <Icon name="star" size={14} color="#FFA43D" />
                <Icon name="star" size={14} color="#FFA43D" />
                <Icon name="star" size={14} color="#FFA43D" />
                <Icon name="star" size={14} color="#FFA43D" />
                <Icon name="star" size={14} color="#FFA43D" />
                <Text className="ml-1 text-[13px] font-semibold text-[#00B0B9]">
                  (5 đánh giá)
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View className="px-5 h-[100px] justify-between flex-row items-center bg-white">
            <View className="w-[70px] h-[70px] rounded-full bg-[#738aa0]" />
            <View className="flex-row w-[60%]">
              <Pressable
                className=" flex-1 bg-white py-3 rounded-lg border-[1px] border-[#00B0B9] active:bg-gray-200"
                onPress={() => navigation.navigate("SignIn")}
              >
                <Text className="text-center text-[#00B0B9] font-bold">
                  Sign In
                </Text>
              </Pressable>
              <Pressable
                className="flex-1 bg-[#00B0B9] py-3 ml-2 rounded-lg active:bg-[#00b0b9e0]"
                onPress={() => navigation.navigate("SignUp")}
              >
                <Text className="text-center text-white font-bold">
                  Sign Up
                </Text>
              </Pressable>
            </View>
          </View>
        )}
        <View>
          <Pressable
            className="h-[70px] bg-white border-t-[1px] border-[#DBE9F5] flex-row items-center pl-5 active:bg-gray-200"
            onPress={() => navigation.navigate("Profile")}
          >
            <View className="relative mr-2">
              <Icon
                name="person-outline"
                size={24}
                color="#00B0B9"
                style={{ position: "absolute" }}
              />
              <Icon name="person-outline" size={24} color="#00B0B9" />
            </View>
            <Text className="text-[14px]">Personal information</Text>
          </Pressable>
          <Pressable
            className="h-[70px] bg-white border-t-[1px] border-[#DBE9F5] flex-row items-center pl-5 active:bg-gray-200"
            onPress={() => navigation.navigate("ExchangeHistory")}
          >
            <View className="relative mr-2">
              <Icon
                name="swap-horizontal-outline"
                size={24}
                color="#00B0B9"
                style={{ position: "absolute" }}
              />
              <Icon name="swap-horizontal-outline" size={24} color="#00B0B9" />
            </View>
            <Text className="text-[14px]">Exchanges history</Text>
          </Pressable>
          <Pressable
            className="h-[70px] bg-white border-t-[1px] border-[#DBE9F5] flex-row items-center pl-5 active:bg-gray-200"
            onPress={() => navigation.navigate("Statistics")}
          >
            <View className="relative mr-2">
              <Icon
                name="stats-chart-sharp"
                size={24}
                color="#00B0B9"
                style={{ position: "absolute" }}
              />
              <Icon name="stats-chart-sharp" size={24} color="#00B0B9" />
            </View>
            <Text className="text-[14px]">Statistics</Text>
          </Pressable>
          <Pressable
            className="h-[70px] bg-white border-t-[1px] border-[#DBE9F5] flex-row items-center pl-5 active:bg-gray-200"
            onPress={() => navigation.navigate("ChatHistory")}
          >
            <View className="relative mr-2">
              <Icon
                name="globe-outline"
                size={24}
                color="#00B0B9"
                style={{ position: "absolute" }}
              />
              <Icon name="globe-outline" size={24} color="#00B0B9" />
            </View>
            <Text className="text-[14px]">Language</Text>
          </Pressable>
          <Pressable className="h-[70px] bg-white border-t-[1px] border-[#DBE9F5] flex-row items-center pl-5 active:bg-gray-200">
            <View className="relative mr-2">
              <Icon
                name="heart-outline"
                size={24}
                color="#00B0B9"
                style={{ position: "absolute" }}
              />
              <Icon name="heart-outline" size={24} color="#00B0B9" />
            </View>
            <Text className="text-[14px]">Favorites</Text>
          </Pressable>
          <Pressable className="h-[70px] bg-white border-t-[1px] border-[#DBE9F5] flex-row items-center pl-5 active:bg-gray-200">
            <View className="relative mr-2">
              <Icon
                name="information-circle-outline"
                size={24}
                color="#00B0B9"
                style={{ position: "absolute" }}
              />
              <Icon
                name="information-circle-outline"
                size={24}
                color="#00B0B9"
              />
            </View>
            <Text className="text-[14px]">About</Text>
          </Pressable>
          <Pressable className="h-[70px] bg-white border-t-[1px] border-[#DBE9F5] flex-row items-center pl-5 active:bg-gray-200">
            <View className="relative mr-2">
              <Icon
                name="log-out-outline"
                size={24}
                color="#F44336"
                style={{ position: "absolute" }}
              />
              <Icon name="log-out-outline" size={24} color="#F44336" />
            </View>
            <Text className="text-[14px] text-red-500 font-bold">Sign Out</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AccountScreen;
