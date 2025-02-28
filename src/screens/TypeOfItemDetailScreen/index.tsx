import React, { useState } from "react";
import { SafeAreaView, ScrollView, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { RootStackParamList } from "../../navigation/AppNavigator";



const TypeOfItemDetailScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [isSelected, setIsSelected] = useState(false);

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
                        <Text className="text-2xl font-semibold text-black">Type of item detail</Text>
                    </View>

                    {/* Phần tử ẩn để giữ khoảng trống bên phải, tránh bị lệch */}
                    <View className="w-10" />
                </View>



                {/* Content */}
                <TouchableOpacity
                    onPress={() => setIsSelected(!isSelected)}
                    className={`w-11/12 h-16 rounded-lg mt-2 ml-4 flex-row justify-between items-center px-4 ${isSelected ? "bg-[#00b0b91A]" : "bg-white"
                        }`}
                >
                    {/* Text hiển thị nội dung */}
                    <Text className="text-l font-normal text-black">Stove</Text>

                    {/* Radio Button */}
                    <Icon
                        name={isSelected ? "radio-button-checked" : "radio-button-unchecked"}
                        size={24}
                        color="#00b0b9"
                    />
                </TouchableOpacity>
            </ScrollView>
            {/* Header */}

        </SafeAreaView>
    );
};

export default TypeOfItemDetailScreen;
