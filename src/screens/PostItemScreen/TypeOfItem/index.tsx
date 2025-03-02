import React from "react";
import {  ScrollView, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { RootStackParamList } from "../../../navigation/AppNavigator";
import { SafeAreaView } from "react-native-safe-area-context";



const TypeOfItemScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    return (
        <SafeAreaView className="flex-1 bg-[#F6F9F9]">
            <ScrollView
                scrollEnabled={true}
                contentInsetAdjustmentBehavior="automatic"
                className="flex-1"
            >
                <View className="w-full h-14 flex-row items-center px-4">
                    {/* Nút Back */}
                    <TouchableOpacity onPress={() => navigation.goBack()} className="w-10">
                        <Icon name="arrow-back-ios" size={20} color="black" />
                    </TouchableOpacity>

                    {/* Tiêu đề căn giữa */}
                    <View className="flex-1 items-center">
                        <Text className="text-2xl font-semibold text-black">Type of item</Text>
                    </View>

                    {/* Phần tử ẩn để giữ khoảng trống bên phải, tránh bị lệch */}
                    <View className="w-10" />
                </View>



                {/* Content */}
                <View className="items-center mt-4">
                    <TouchableOpacity 
                        onPress={() => navigation.navigate("TypeOfItemDetailScreen")}
                        className="w-11/12 h-16 bg-white rounded-lg mt-2 ml-4 flex-row justify-between items-center px-4">
                        <Text className="text-l font-normal text-black">
                            Kitchen appliances
                        </Text>

                        <Icon name="arrow-forward-ios" size={20} color="#6b7280" />
                    </TouchableOpacity>
                    <View className="w-11/12 h-16 bg-white rounded-lg mt-2 ml-4 flex-row justify-between items-center px-4">
                        <Text className="text-l font-normal text-black">
                            Cleaning & Laundry Appliances
                        </Text>

                        <Icon name="arrow-forward-ios" size={20} color="#6b7280" />
                    </View>
                    <View className="w-11/12 h-16 bg-white rounded-lg mt-2 ml-4 flex-row justify-between items-center px-4">
                        <Text className="text-l font-normal text-black">
                            Cooling & Heating Devices
                        </Text>

                        <Icon name="arrow-forward-ios" size={20} color="#6b7280" />
                    </View>
                    <View className="w-11/12 h-16 bg-white rounded-lg mt-2 ml-4 flex-row justify-between items-center px-4">
                        <Text className="text-l font-normal text-black">
                            Electronics & Entertainment Devices
                        </Text>

                        <Icon name="arrow-forward-ios" size={20} color="#6b7280" />
                    </View>
                    <View className="w-11/12 h-16 bg-white rounded-lg mt-2 ml-4 flex-row justify-between items-center px-4">
                        <Text className="text-l font-normal text-black">
                            Lighting & Security Devices
                        </Text>

                        <Icon name="arrow-forward-ios" size={20} color="#6b7280" />
                    </View>
                    <View className="w-11/12 h-16 bg-white rounded-lg mt-2 ml-4 flex-row justify-between items-center px-4">
                        <Text className="text-l font-normal text-black">
                            Bedroom Appliances
                        </Text>

                        <Icon name="arrow-forward-ios" size={20} color="#6b7280" />
                    </View>
                    <View className="w-11/12 h-16 bg-white rounded-lg mt-2 ml-4 flex-row justify-between items-center px-4">
                        <Text className="text-l font-normal text-black">
                            Living Room Appliances
                        </Text>

                        <Icon name="arrow-forward-ios" size={20} color="#6b7280" />
                    </View>
                    <View className="w-11/12 h-16 bg-white rounded-lg mt-2 ml-4 flex-row justify-between items-center px-4">
                        <Text className="text-l font-normal text-black">
                            Bathroom Appliances
                        </Text>

                        <Icon name="arrow-forward-ios" size={20} color="#6b7280" />
                    </View>
                    <View className="w-11/12 h-16 bg-white rounded-lg mt-2 ml-4 flex-row justify-between items-center px-4">
                        <Text className="text-l font-normal text-black">
                            Cleaning & Storage Equipment
                        </Text>

                        <Icon name="arrow-forward-ios" size={20} color="#6b7280" />
                    </View>


                </View>
            </ScrollView>
            {/* Header */}

        </SafeAreaView>
    );
};

export default TypeOfItemScreen;
