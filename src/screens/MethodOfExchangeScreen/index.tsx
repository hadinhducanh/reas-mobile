import React, { useState } from "react";
import { SafeAreaView, ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../../navigation/AppNavigator";

const MethodOfExchangeScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

    // Hàm lưu vào AsyncStorage
    const saveSelectedMethod = async (method: string) => {
        try {
            await AsyncStorage.setItem("selectedMethod", method);
            console.log("Saved selected method:", method);
        } catch (error) {
            console.error("Failed to save method:", error);
        }
    };

    // Xác nhận lựa chọn -> Lưu & Điều hướng về UploadScreen
    const handleConfirm = async () => {
        if (selectedMethod) {
            await saveSelectedMethod(selectedMethod);
            navigation.goBack();
        } else {
            alert("Please select a method!");
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F6F9F9]">
            <ScrollView className="flex-1">
                {/* Header */}
                <View className="w-full h-14 flex-row items-center px-4">
                    <TouchableOpacity onPress={() => navigation.goBack()} className="w-10">
                        <Icon name="arrow-back-ios" size={20} color="black" />
                    </TouchableOpacity>
                    <View className="flex-1 items-center">
                        <Text className="text-2xl font-semibold text-black">Method of Exchange</Text>
                    </View>
                    <View className="w-10" />
                </View>

                {/* Các lựa chọn phương thức giao dịch */}
                {["Pick-up in person", "Delivery", "Meet in a different location"].map((method) => (
                    <TouchableOpacity
                        key={method}
                        onPress={() => setSelectedMethod(method)}
                        className={`w-11/12 h-16 rounded-lg mt-2 ml-4 flex-row justify-between items-center px-4 ${
                            selectedMethod === method ? "bg-[#00b0b91A]" : "bg-white"
                        }`}
                    >
                        <Text className="text-l font-normal text-black">{method}</Text>
                        <Icon
                            name={selectedMethod === method ? "radio-button-checked" : "radio-button-unchecked"}
                            size={24}
                            color="#00b0b9"
                        />
                    </TouchableOpacity>
                ))}

                {/* Nút xác nhận */}
                <TouchableOpacity
                    onPress={handleConfirm}
                    className="w-11/12 h-14 bg-[#00b0b9] rounded-lg mt-6 ml-4 flex items-center justify-center"
                >
                    <Text className="text-lg font-semibold text-white">Confirm</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default MethodOfExchangeScreen;
