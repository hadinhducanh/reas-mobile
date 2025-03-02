import React, { useState } from "react";
import {  ScrollView, Text, TextInput, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/MaterialIcons";
import { RootStackParamList } from "../../../navigation/AppNavigator";
import { SafeAreaView } from "react-native-safe-area-context";

const ExchangeDesiredItemScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    return (
        <SafeAreaView className="flex-1 bg-[#F6F9F9]">
            <ScrollView contentInsetAdjustmentBehavior="automatic" className="flex-1">
                <View className="w-full h-14 flex-row items-center px-4">
                    {/* Nút Back */}
                    <TouchableOpacity onPress={() => navigation.goBack()} className="w-10">
                        <Icon name="arrow-back-ios" size={20} color="black" />
                    </TouchableOpacity>

                    {/* Tiêu đề căn giữa */}
                    <View className="flex-1 items-center">
                        <Text className="text-2xl font-semibold text-black">Your desired item for exchange</Text>
                    </View>

                    <View className="w-10" />
                </View>

                {/* Content */}
                <View className="items-center mt-4">
                    <TouchableOpacity 
                    onPress={() => navigation.navigate("ExchangeDesiredItemTypeOfItemScreen")}
                    className="w-11/12 h-16 bg-white rounded-lg mt-2 flex-row justify-between items-center px-4">
                        <Text className="text-l font-normal text-black">Type of item</Text>
                        <Icon name="arrow-forward-ios" size={20} color="#6b7280" />
                    </TouchableOpacity>

                    <TouchableOpacity className="w-11/12 h-16 bg-white rounded-lg mt-2 flex-row justify-between items-center px-4">
                        <Text className="text-l font-normal text-black">Brand</Text>
                        <Icon name="arrow-forward-ios" size={20} color="#6b7280" />
                    </TouchableOpacity>

                    {/* Min & Max Price */}
                    <View className="flex flex-row justify-center gap-4 mt-4 mb-2">
                        {/* Min Price */}
                        <View className="w-52 h-14 rounded-md border border-[#00B0B9] bg-white px-2 py-1">
                            <Text className="text-teal-500 text-xs font-bold text-center">Min price</Text>
                            <View className="flex flex-row justify-between items-center mt-1">
                                <TextInput
                                    className="flex-1 text-slate-500 text-sm font-normal px-1"
                                    placeholder="0"
                                    value={minPrice}
                                    onChangeText={setMinPrice}
                                    keyboardType="numeric"
                                />
                                <Text className="text-slate-500 text-sm font-normal">đ</Text>
                            </View>
                        </View>

                        {/* Max Price */}
                        <View className="w-52 h-14 rounded-md border border-[#00B0B9] bg-white px-2 py-1">
                            <Text className="text-teal-500 text-xs font-bold text-center">Max price</Text>
                            <View className="flex flex-row justify-between items-center mt-1">
                                <TextInput
                                    className="flex-1 text-slate-500 text-sm font-normal px-1"
                                    placeholder="10,000"
                                    value={maxPrice}
                                    onChangeText={setMaxPrice}
                                    keyboardType="numeric"
                                />
                                <Text className="text-slate-500 text-sm font-normal">đ</Text>
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity className="w-11/12 h-16 bg-white rounded-lg mt-2 flex-row justify-between items-center px-4">
                        <Text className="text-l font-normal text-black">Item condition</Text>
                        <Icon name="arrow-forward-ios" size={20} color="#6b7280" />
                    </TouchableOpacity>

                    {/* Done Button */}
                    <TouchableOpacity
                        className="w-11/12 h-14 bg-[#00B0B9] rounded-lg mt-6 flex items-center justify-center"
                        onPress={() => console.log("Done button pressed")}
                    >
                        <Text className="text-white text-lg font-semibold">Done</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ExchangeDesiredItemScreen;
