import { useCallback, useEffect, useState } from "react";
import { Alert, Image, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import { ActionSheetIOS } from "react-native";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";

import { RootStackParamList } from "../../../navigation/AppNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import ImagePickerComponent from "./ImagePickerComponent";
import { AppDispatch, RootState } from "../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { postItemThunk } from "../../../redux/thunk/itemThunks";

export default function UploadScreen() {

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [isCheckedFree, setIsCheckedFree] = useState(false);
    const [isCheckedDesiredItem, setIsCheckedDesiredItem] = useState(false);
    const [price, setPrice] = useState<number | null>(null);
    const [title, setTitle] = useState<string | null>(null)
    const [description1, setDescription1] = useState("");
    const [quantity, setQuantity] = useState("");
    const [condition, setCondition] = useState("");
    const [images, setImages] = useState<string[]>([]); // Lưu trữ các ảnh đã chọn
    const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
    const [selectedMethodsValue, setSelectedMethodsValue] = useState<string[]>([]);
    const [selectedCondition, setSelectedCondition] = useState<string | null>(null);
    const [selectedConditionValue, setSelectedConditionValue] = useState<string | null>(null);
    const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
    const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [selectedTypeValue, setSelectedTypeValue] = useState<string | null>(null);

    const { loading } = useSelector((state: RootState) => state.item);


    const dispatch = useDispatch<AppDispatch>();



    // Lấy dữ liệu từ AsyncStorage khi vào trang UploadScreen
    useFocusEffect(
        useCallback(() => {
            const fetchStoredData = async () => {
                try {
                    const [methods, condition, brand, type] = await Promise.all([
                        AsyncStorage.getItem("selectedMethods"),
                        AsyncStorage.getItem("selectedCondition"),
                        AsyncStorage.getItem("selectedBrand"),
                        AsyncStorage.getItem("selectedType"),

                    ]);

                    if (methods) {
                        const parsedMethods = JSON.parse(methods);
                        setSelectedMethodsValue(parsedMethods.map((method: { value: string }) => method.value));
                        setSelectedMethods(parsedMethods.map((method:{ label: string }) => method.label));
                        
                    }
                    if (condition) {
                        const parsedCondition = JSON.parse(condition);
                        setSelectedConditionValue(parsedCondition.value);
                        setSelectedCondition(parsedCondition.label);
                    }

                    if (brand) {
                        const parsedBrand = JSON.parse(brand);
                        setSelectedBrand(parsedBrand.brandName);
                        setSelectedBrandId(parsedBrand.id);
                    }
                    if (type) {
                        const parsedType = JSON.parse(type);
                        setSelectedTypeValue(parsedType.value);
                        setSelectedType(parsedType.label);
                    }

                } catch (error) {
                    console.error("Failed to retrieve or delete data:", error);
                }
            };

            fetchStoredData();
        }, [])
    );

    const handleCreateItem = async () => {
        const missingFields = [];
    
        if (!title) missingFields.push("title");
        if (!selectedType) missingFields.push("selectedType");
        if (!selectedBrandId) missingFields.push("selectedBrandId");
        if (!selectedCondition) missingFields.push("selectedCondition");
    
        if (missingFields.length > 0) {
            console.log("❌ Missing fields:", missingFields.join(", "));
            Alert.alert("Error", `Please fill in all required fields: ${missingFields.join(", ")}`);
            return;
        }
    
        const newItem = {
            itemName: title || "",
            description: description1 || "",
            price: isCheckedFree ? 0 : price || 0,
            conditionItem: selectedConditionValue || "",
            imageUrl: images.length > 0 ? images[0] : "",
            // imageUrl: "hehehege",
            methodExchanges: selectedMethodsValue || [],
            isMoneyAccepted: !isCheckedDesiredItem,
            typeExchange: isCheckedDesiredItem ? "EXCHANGE_WITH_DESIRED_ITEM" : "OPEN_EXCHANGE",
            typeItem: selectedTypeValue || "",
            termsAndConditionsExchange: condition || "",
            categoryId: 2, // Đúng với dữ liệu mẫu
            brandId: selectedBrandId ?? 2, // Đúng với dữ liệu mẫu
            desiredItem: isCheckedDesiredItem
                ? {
                    typeItem: "LIVING_ROOM_APPLIANCES",
                    categoryId: 2,
                    brandId: 2,
                    conditionItem: "LIKE_NEW",
                    minPrice: 1000,
                    maxPrice: 100000,
                } : undefined   // Đúng với dữ liệu mẫu
        };
        
        
        
        console.log("🛠 Sending newItem data:", JSON.stringify(newItem, null, 2)); // Log toàn bộ dữ liệu item
    
        try {
            const resultAction = await dispatch(postItemThunk(newItem)).unwrap();
            console.log("✅ Success:", resultAction);
            Alert.alert("Success", "Item created successfully!");
        } catch (err) {
            console.log("❌ Error creating item:", err);
    
            if (err instanceof Error) {
                console.log("🛠 Error message:", err.message);
                Alert.alert("Error", err.message || "Failed to create item.");
            } else {
                console.log("🛠 Unknown error:", JSON.stringify(err, null, 2));
                Alert.alert("Error", "Failed to create item.");
            }
        }
    };
    
    


    const toggleCheckboxFree = () => {
        setIsCheckedFree(!isCheckedFree);
    };
    const toggleCheckboxDesiredItem = () => {
        setIsCheckedDesiredItem(!isCheckedDesiredItem);
    };




    return (
        <SafeAreaView className="flex-1 bg-white">

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <KeyboardAwareScrollView
                    scrollEnabled={true}
                    contentInsetAdjustmentBehavior="automatic"
                    className="flex-1"
                >
                    <View className="w-full min-h-screen bg-[#f6f9f9]">

                        <View className="w-full h-14 items-center px-4 mt-2 ">


                            {/* Tiêu đề căn giữa */}
                            <View className="flex-1 items-center">
                                <Text className="text-2xl font-semibold text-black">Upload your item</Text>
                            </View>

                            {/* Phần tử ẩn để giữ khoảng trống bên phải, tránh bị lệch */}
                            <View className="w-10" />
                        </View>
                        {/* Phần chọn ảnh và hiển thị ảnh đã chọn */}
                        <ImagePickerComponent images={images} setImages={setImages} />

                        {/* Type of item section */}
                        <TouchableOpacity
                            onPress={() => navigation.navigate("TypeOfItemScreen")}
                            className="w-11/12 h-16 bg-white rounded-lg mt-4 ml-4 flex-row justify-between items-center px-4"
                        >
                            {/* Dòng chữ "Type of item" */}
                            <View>
                                <Text className="text-base font-normal text-black">
                                    Type of item
                                </Text>
                                <Text className="text-lg font-semibold text-black mt-1">
                                    {selectedType || "Select type of item"}
                                </Text>
                            </View>


                            {/* Biểu tượng mũi tên qua phải */}
                            <Icon name="arrow-forward-ios" size={20} color="#6b7280" />
                        </TouchableOpacity>

                        {/* Brand section */}
                        <TouchableOpacity
                            onPress={() => navigation.navigate("BrandSelectionScreen")}
                            className="w-11/12 h-16 bg-white rounded-lg mt-4 ml-4 px-4 py-2 flex-row justify-between items-center"
                        >
                            <View>
                                <Text className="text-base font-normal text-black">
                                    Brand
                                </Text>
                                <Text className="text-lg font-semibold text-black mt-1">
                                    {selectedBrand || "Select brand"}
                                </Text>
                            </View>
                            <Icon name="arrow-forward-ios" size={20} color="#6b7280" />

                        </TouchableOpacity>

                        {/* Phần chọn điều kiện món hàng */}
                        <TouchableOpacity
                            onPress={() => navigation.navigate("ItemConditionScreen")}
                            className="w-11/12 h-16 bg-white rounded-lg mt-4 ml-4 px-4 py-2 flex-row justify-between items-center"
                        >
                            {/* View bọc phần Text để giữ nó bên trái */}
                            <View>
                                <Text className="text-base font-normal text-black">Condition</Text>
                                <Text className="text-lg font-semibold text-black mt-1">
                                    {selectedCondition || "Select condition"}
                                </Text>
                            </View>

                            {/* Icon nằm bên phải */}
                            <Icon name="arrow-forward-ios" size={20} color="#6b7280" />
                        </TouchableOpacity>


                        <TouchableOpacity
                            onPress={toggleCheckboxFree}
                            className="flex-row items-center justify-between mt-4 ml-7"
                        >
                            {/* Dòng chữ "I want to give it for free" */}
                            <Text className="text-lg font-bold text-[#738aa0]">
                                I want to give it for free
                            </Text>
                            {/* Checkbox */}
                            <View className="w-5 h-5 bg-white rounded-sm justify-center items-center mr-6 border border-[#738aa0]">
                                {isCheckedFree && <Icon name="check" size={14} color="#00B0B9" />}
                            </View>
                        </TouchableOpacity>


                        {/* Price section */}
                        {!isCheckedFree && (
                            <View className="w-11/12 h-12 bg-white rounded-lg mt-4 ml-4 justify-center">
                                <TextInput
                                    className="text-xs font-normal text-black ml-4"
                                    placeholder="Price"
                                    placeholderTextColor="#d1d5db" // Màu placeholder
                                    value={price !== null ? price.toString() : ""}
                                    onChangeText={(text) => setPrice(text ? parseFloat(text) : null)}
                                    keyboardType="numeric" // Bàn phím số cho trường Price
                                />
                            </View>
                        )}


                        {/* Title section */}
                        <View className="w-11/12 h-12 bg-white rounded-lg mt-4 ml-4 justify-center">
                            <TextInput
                                className="text-xs font-normal text-black ml-4"
                                placeholder="Title"
                                placeholderTextColor="#d1d5db"
                                value={title ?? undefined}
                                onChangeText={setTitle}
                            />
                        </View>

                        {/* Description section */}
                        <View className="w-11/12 h-24 bg-white rounded-lg mt-4 ml-4">
                            <TextInput
                                className="text-xs font-normal text-black ml-4 pt-2"
                                placeholder="Description"
                                placeholderTextColor="#d1d5db"
                                value={description1}
                                onChangeText={setDescription1}
                                multiline={true} // Cho phép nhập nhiều dòng
                                textAlignVertical="top"
                            />
                        </View>

                        {/* Quantity section */}
                        <View className="w-11/12 h-12 bg-white rounded-lg mt-4 ml-4 justify-center">
                            <TextInput
                                className="text-xs font-normal text-black ml-4"
                                placeholder="Quantity"
                                placeholderTextColor="#d1d5db"
                                value={quantity}
                                onChangeText={setQuantity}
                                keyboardType="numeric" // Bàn phím số cho trường Quantity
                            />
                        </View>

                        {/* Method of exchange section */}
                        <TouchableOpacity
                            onPress={() => navigation.navigate("MethodOfExchangeScreen")}
                            className="w-11/12 h-16 bg-white rounded-lg mt-4 ml-4 px-4 py-2 flex-row justify-between items-center"
                        >
                            <View>
                                <Text className="text-xs font-normal text-black">Method of exchange</Text>
                                <Text className="text-sm font-semibold text-black mt-1">
                                    {selectedMethods.length > 0 ? selectedMethods.join(", ") : "Select methods"}
                                </Text>
                            </View>
                            <Icon name="arrow-forward-ios" size={20} color="#6b7280" />

                        </TouchableOpacity>



                        {/* Accept exchanging with money text */}
                        <TouchableOpacity
                            onPress={toggleCheckboxDesiredItem}
                            className="flex-row items-center justify-between mt-4 ml-7"
                        >
                            {/* Dòng chữ "I want to give it for free" */}
                            <Text className="text-sm font-bold text-[#738aa0]">
                                I want to desire an item for exchanging
                            </Text>
                            {/* Checkbox */}
                            <View className="w-5 h-5 bg-white rounded-sm justify-center items-center mr-6">
                                {isCheckedDesiredItem && <Icon name="check" size={14} color="#00B0B9" />}
                            </View>
                        </TouchableOpacity>

                        {/* Choose your exchange type section */}
                        {isCheckedDesiredItem && (
                            <TouchableOpacity
                                onPress={() => navigation.navigate("ExchangeDesiredItemScreen")}
                                className="w-11/12 h-16 bg-white rounded-lg mt-4 ml-4 px-4 py-2 flex-row justify-between items-center"
                            >
                                <View>
                                    <Text className="text-xs font-normal text-black">
                                        Add your desired item for exchanging (optional)
                                    </Text>
                                </View>

                                <Icon name="arrow-forward-ios" size={20} color="#6b7280" />
                            </TouchableOpacity>
                        )}




                        <Text className="text-sm font-bold text-[#0] mt-4 ml-5">
                            Exchange’s terms and conditions
                        </Text>

                        <View className="w-11/12 h-24 bg-white rounded-lg mt-4 ml-4">
                            <TextInput
                                className="text-xs font-normal text-black ml-4 pt-2"
                                placeholder="Write your terms and conditions here..."
                                placeholderTextColor="#d1d5db"
                                value={condition}
                                onChangeText={setCondition}
                                multiline={true} // Cho phép nhập nhiều dòng
                                textAlignVertical="top"
                            />
                        </View>

                        {/* Create button */}
                        <TouchableOpacity onPress={handleCreateItem} className="w-11/12 py-3 flex-row justify-center items-center bg-[#00b0b9] rounded-lg mt-8 mx-4 mb-8">
                            <Text className="text-base font-bold text-white">{loading ? "Creating..." : "Create"}</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAwareScrollView>

            </KeyboardAvoidingView>

        </SafeAreaView>
    );
}
