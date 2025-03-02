import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {  Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialIcons";

import { RootStackParamList } from "../../../navigation/AppNavigator";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ExchangeTypeScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [isSelected, setIsSelected] = useState(false);
    const handleSelection = async () => {
        const newSelection = !isSelected;
        setIsSelected(newSelection);
    
        try {
            await AsyncStorage.setItem("exchangeType", newSelection ? "Open exchange" : "");
            navigation.goBack(); // Quay lại trang UploadScreen sau khi lưu
        } catch (error) {
            console.error("Failed to save exchange type:", error);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F6F9F9]">
        <ScrollView
            scrollEnabled={true}
            contentInsetAdjustmentBehavior="automatic"
            className="flex-1"
        >
            <View className="w-full h-14 flex-row items-center px-4">
                <TouchableOpacity onPress={() => navigation.goBack()} className="w-10">
                    <Icon name="arrow-back-ios" size={20} color="black" />
                </TouchableOpacity>

                <View className="flex-1 items-center">
                    <Text className="text-2xl font-semibold text-black">Choose your exchange type</Text>
                </View>

                <View className="w-10" />
            </View>

            <View className="items-center mt-4">
                <TouchableOpacity
                    onPress={() => navigation.navigate("ExchangeDesiredItemScreen")}
                    className="w-11/12 h-16 bg-white rounded-lg mt-2 ml-4 flex-row justify-between items-center px-4"
                >
                    <Text className="text-l font-normal text-black">Exchange with a desired item</Text>
                    <Icon name="arrow-forward-ios" size={20} color="#6b7280" />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleSelection}
                    className={`w-11/12 h-16 rounded-lg mt-2 ml-4 flex-row justify-between items-center px-4 ${isSelected ? "bg-[#00b0b91A]" : "bg-white"}`}
                >
                    <Text className="text-l font-normal text-black">Open exchange</Text>
                    <Icon
                        name={isSelected ? "radio-button-checked" : "radio-button-unchecked"}
                        size={24}
                        color="#00b0b9"
                    />
                </TouchableOpacity>
            </View>
        </ScrollView>
    </SafeAreaView>
    );
};

export default ExchangeTypeScreen;
