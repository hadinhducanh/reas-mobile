import React, { useEffect, useState } from "react";
import { ScrollView, Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { getBrandsThunk } from "../../../redux/thunk/brandThunks";
import { RootState, AppDispatch } from "../../../redux/store";
import { Brand } from "../../../common/models/brand";
import { RootStackParamList } from "../../../navigation/AppNavigator";

const BrandSelectionScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch<AppDispatch>();
  const { brands, loading, error } = useSelector((state: RootState) => state.brand);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Gọi API để lấy danh sách thương hiệu
  useEffect(() => {
    dispatch(getBrandsThunk());
  }, [dispatch]);

  // Lấy dữ liệu từ AsyncStorage khi vào màn hình
  useEffect(() => {
    const getStoredBrand = async () => {
      try {
        const storedBrand = await AsyncStorage.getItem("selectedBrand");
        if (storedBrand) {
          const parsedBrand: Brand = JSON.parse(storedBrand); // Chuyển JSON string về object
          setSelectedOption(parsedBrand.brandName);
        }
      } catch (error) {
        console.error("Failed to retrieve brand:", error);
      }
    };
    getStoredBrand();
  }, []);


  // Khi chọn một thương hiệu, lưu vào AsyncStorage và quay lại màn hình trước
  const handleSelectBrand = async (brand: Brand) => {
    try {
        const brandData = JSON.stringify({ id: brand.id, brandName: brand.brandName }); // Chuyển thành chuỗi JSON
        await AsyncStorage.setItem("selectedBrand", brandData);
        setSelectedOption(brand.brandName);
        navigation.goBack();
    } catch (error) {
        console.error("Failed to save brand:", error);
    }
};

  return (
    <SafeAreaView className="flex-1 bg-[#F6F9F9]">
      <ScrollView contentInsetAdjustmentBehavior="automatic" className="flex-1">
        {/* Header */}
        <View className="w-full h-14 flex-row items-center px-4">
          <TouchableOpacity onPress={() => navigation.goBack()} className="w-10">
            <Icon name="arrow-back-ios" size={20} color="black" />
          </TouchableOpacity>
          <View className="flex-1 items-center">
            <Text className="text-2xl font-semibold text-black">Brand</Text>
          </View>
          <View className="w-10" />
        </View>

        {/* Hiển thị trạng thái loading hoặc lỗi */}
        {loading && <ActivityIndicator size="large" color="#00b0b9" />}
        {error && <Text className="text-red-500 text-center mt-4">{error}</Text>}

        {/* Danh sách thương hiệu */}
        {brands.map((brand: Brand) => {
          const isSelected = selectedOption === brand.brandName;
          return (
            <TouchableOpacity
              key={brand.id}
              onPress={() => handleSelectBrand(brand)} // Truyền cả object Brand
              className={`w-11/12 h-16 rounded-lg mt-2 ml-4 flex-row justify-between items-center px-4 ${isSelected ? "bg-[#00b0b91A]" : "bg-white"
                }`}
            >
              <Text className={`text-lg font-normal ${isSelected ? "text-[#00b0b9] font-bold" : "text-black"}`}>
                {brand.brandName}
              </Text>
              <Icon
                name={isSelected ? "radio-button-checked" : "radio-button-unchecked"}
                size={24}
                color="#00b0b9"
              />
            </TouchableOpacity>
          );
        })}

      </ScrollView>
    </SafeAreaView>
  );
};

export default BrandSelectionScreen;
