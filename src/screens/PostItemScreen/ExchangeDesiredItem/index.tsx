import React, { useCallback, useState } from "react";
import { ScrollView, Text, TextInput, View, TouchableOpacity, Alert } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/MaterialIcons";
import { RootStackParamList } from "../../../navigation/AppNavigator";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ExchangeDesiredItemScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [minPrice, setMinPrice] = useState<string>('');
    const [maxPrice, setMaxPrice] = useState<string>('');
    const [selectedExchangeDesiredItemType, setSelectedExchangeDesiredItemType] = useState<string | null>(null);
    const [selectedExchangeDesiredItemBrand, setSelectedExchangeDesiredItemBrand] = useState<string | null>(null);
    const [selectedExchangeDesiredItemCondition, setSelectedExchangeDesiredItemCondition] = useState<string | null>(null);



    useFocusEffect(
        useCallback(() => {
            const fetchStoredData = async () => {
                try {
                    const [type, brand, condition] = await Promise.all([
                        AsyncStorage.getItem("selectedExchangeDesiredItemType"),
                        AsyncStorage.getItem("selectedStoredExchangeDesiredItemBrand"),
                        AsyncStorage.getItem("selectedExchangeDesiredItemCondition"),

                    ]);



                    if (type) setSelectedExchangeDesiredItemType(type);
                    if (brand) setSelectedExchangeDesiredItemBrand(brand);
                    if (condition) setSelectedExchangeDesiredItemCondition(condition);
                } catch (error) {
                    console.error("Failed to retrieve data:", error);
                }
            };

            fetchStoredData();
        }, [])
    );

    const formatPrice = (value: string): string => {
        const numericValue = value.replace(/\D/g, '');
        return numericValue ? parseInt(numericValue, 10).toLocaleString("en-US") : '';
    };

    const handleDonePress = async () => {
        const min = parseInt(minPrice.replace(/,/g, ""), 10) || 0;
        const max = parseInt(maxPrice.replace(/,/g, ""), 10) || 0;
    
        if (!minPrice || !maxPrice) {
            Alert.alert("Missing Information", "Please enter both Min and Max price.");
            return;
        }
    
        if (max < min) {
            Alert.alert("Invalid Price Range", "Max price cannot be lower than Min price.");
            return;
        }
    
        try {
            await AsyncStorage.multiSet([
                ["minPrice", minPrice || "0"],
                ["maxPrice", maxPrice || "0"]
            ]);
    
            console.log("Data saved successfully!");
    
            // Lấy lại tất cả dữ liệu đã lưu và console log
            const storedData = await AsyncStorage.multiGet([
                "minPrice",
                "maxPrice",
                "selectedExchangeDesiredItemType",
                "selectedStoredExchangeDesiredItemBrand",
                "selectedExchangeDesiredItemCondition"
            ]);
    
            console.log("Stored Data:", Object.fromEntries(storedData));
    
            navigation.pop(2);
        } catch (error) {
            console.error("Failed to save data:", error);
        }
    };
    

    const validateMinPrice = () => {
        const min = parseInt(minPrice.replace(/,/g, ""), 10) || 0;
        if (min < 0) {
            Alert.alert("Invalid Price", "Min price cannot be negative.");
            setMinPrice("0");
        }
    };

    const validateMaxPrice = () => {
        const min = parseInt(minPrice.replace(/,/g, ""), 10) || 0;
        const max = parseInt(maxPrice.replace(/,/g, ""), 10) || 0;

        if (max < 0) {
            Alert.alert("Invalid Price", "Max price cannot be negative.");
            setMaxPrice("0");
        } else if (max < min) {
            Alert.alert("Invalid Price Range", "Max price cannot be lower than Min price.");
            setMaxPrice(min.toLocaleString("en-US"));
        }
    };




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
                        className="w-11/12 h-20 bg-white rounded-lg mt-4 flex-row justify-between items-center px-4"
                    >
                        {/* Dòng chữ "Type of item" */}
                        <View>
                            <Text className="text-base font-normal text-black">
                                Type of item
                            </Text>
                            <Text className="text-lg font-semibold text-black mt-1">
                                {selectedExchangeDesiredItemType || "Select type of item"}
                            </Text>
                        </View>


                        {/* Biểu tượng mũi tên qua phải */}
                        <Icon name="arrow-forward-ios" size={20} color="#6b7280" />
                    </TouchableOpacity>


                    <TouchableOpacity
                        onPress={() => navigation.navigate("ExchangeDesiredItemBrandSelectionScreen")}
                        className="w-11/12 h-20 bg-white rounded-lg mt-4 flex-row justify-between items-center px-4"
                    >
                        {/* Dòng chữ "Type of item" */}
                        <View>
                            <Text className="text-base font-normal text-black">
                                Brand
                            </Text>
                            <Text className="text-lg font-semibold text-black mt-1">
                                {selectedExchangeDesiredItemBrand || "Select type of item"}
                            </Text>
                        </View>


                        {/* Biểu tượng mũi tên qua phải */}
                        <Icon name="arrow-forward-ios" size={20} color="#6b7280" />
                    </TouchableOpacity>

                   {/* Min & Max Price */}
                   <View className="flex flex-row justify-center gap-4 mt-4 mb-2">
                        {/* Min Price */}
                        <View className="w-52 h-20 rounded-md border border-[#00B0B9] bg-white px-2 py-1">
                            <Text className="text-teal-500 text-base font-bold text-center">Min price</Text>
                            <View className="flex flex-row justify-between items-center mt-1">
                                <TextInput
                                    className="flex-1 text-slate-500 text-lg font-normal px-1"
                                    placeholder="0"
                                    value={minPrice}
                                    onChangeText={(value) => setMinPrice(formatPrice(value))}
                                    keyboardType="numeric"
                                    onEndEditing={validateMinPrice} // Kiểm tra khi người dùng nhập xong
                                />
                                <Text className="text-slate-500 text-lg font-normal">đ</Text>
                            </View>
                        </View>

                        {/* Max Price */}
                        <View className="w-52 h-20 rounded-md border border-[#00B0B9] bg-white px-2 py-1">
                            <Text className="text-teal-500 text-base font-bold text-center">Max price</Text>
                            <View className="flex flex-row justify-between items-center mt-1">
                                <TextInput
                                    className="flex-1 text-slate-500 text-lg font-normal px-1"
                                    placeholder="0"
                                    value={maxPrice}
                                    onChangeText={(value) => setMaxPrice(formatPrice(value))}
                                    keyboardType="numeric"
                                    onEndEditing={validateMaxPrice} // Kiểm tra khi người dùng nhập xong
                                />
                                <Text className="text-slate-500 text-lg font-normal">đ</Text>
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={() => navigation.navigate("ExchangeDesiredItemConditionScreen")}
                        className="w-11/12 h-20 bg-white rounded-lg mt-4 flex-row justify-between items-center px-4"
                    >
                        {/* Dòng chữ "Type of item" */}
                        <View>
                            <Text className="text-base font-normal text-black">
                                Item condition
                            </Text>
                            <Text className="text-lg font-semibold text-black mt-1">
                                {selectedExchangeDesiredItemCondition || "Select item condition"}
                            </Text>
                        </View>


                        {/* Biểu tượng mũi tên qua phải */}
                        <Icon name="arrow-forward-ios" size={20} color="#6b7280" />
                    </TouchableOpacity>
                    {/* Done Button */}
                    <TouchableOpacity
                        className="w-11/12 h-14 bg-[#00B0B9] rounded-lg mt-6 flex items-center justify-center"
                        onPress={handleDonePress}
                    >
                        <Text className="text-white text-lg font-semibold">Done</Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ExchangeDesiredItemScreen;
