import React, { useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../../components/Header";
import Icon from "react-native-vector-icons/Ionicons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../navigation/AppNavigator";
import LoadingButton from "../../../components/LoadingButton";

const About: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleContact = () => {};

  return (
    <SafeAreaView className="flex-1 bg-[#00B0B9]" edges={["top"]}>
      <Header
        title="Abount us"
        backgroundColor="bg-[#00B0B9]"
        backIconColor="white"
        textColor="text-white"
        optionIconColor="white"
        showOption={false}
        onBackPress={() =>
          navigation.navigate("MainTabs", { screen: "Account" })
        }
      />

      <ScrollView className="flex-1 bg-white px-4 py-6">
        <View className="pb-14">
          <View className="items-center mb-6">
            <View className="w-[228px] h-[228px] rounded-full border-[6px] border-white justify-center items-center">
              <View className="w-[216px] h-[216px] rounded-full bg-[#00b0b9] justify-center items-center">
                <View className="w-[200px] h-[200px] rounded-full overflow-hidden">
                  <Image
                    source={{
                      uri: "https://res.cloudinary.com/dpysbryyk/image/upload/v1739892939/REAS/Logo/Logo.png",
                    }}
                    className="w-full h-full object-cover"
                    resizeMode="cover"
                  />
                </View>
              </View>
            </View>

            <Text className="text-xl font-bold">REAS</Text>
            <Text className="text-sm text-gray-500 mt-1 text-center">
              "Innovating for a Better Tomorrow"
            </Text>
          </View>

          <View className="p-5 rounded-lg mb-6">
            <View className="flex-row items-center">
              <Icon name="location-outline" size={20} color="#00b0b9" />
              <Text className="ml-2 text-black text-base">
                123 Innovation Drive{"\n"}
                Silicon Valley, CA 94025
              </Text>
            </View>

            <View className="flex-row items-center my-5">
              <Icon name="call-outline" size={20} color="#00b0b9" />
              <Text className="ml-2 text-black text-base">
                (1) 555-123-4567
              </Text>
            </View>

            <View className="flex-row items-center">
              <Icon name="mail-outline" size={20} color="#00b0b9" />
              <Text className="ml-2 text-black text-base">
                contact@techcorp.com
              </Text>
            </View>
          </View>

          {/* Our Story */}
          <View className="p-5 mb-6">
            <Text className="text-xl font-semibold text-gray-800">
              Our Story
            </Text>
            <Text className="text-base text-gray-500 mt-2">
              Founded in 2025, REAS Solutions has been at the forefront of
              technological innovation. We’ve grown from a small startup to a
              leading technology provider, serving clients worldwide with
              cutting-edge solutions.
            </Text>
          </View>

          <LoadingButton
            title="Contact us"
            onPress={handleContact}
            buttonClassName="p-4"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default About;
