import { useCallback, useEffect, useState } from "react";
import { Alert, Image, Platform, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import { ActionSheetIOS } from "react-native";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";

import { RootStackParamList } from "../../navigation/AppNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function UploadScreen() {

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [isChecked, setIsChecked] = useState(false);
    const [price, setPrice] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [quantity, setQuantity] = useState("");
    const [condition, setCondition] = useState("");
    const [images, setImages] = useState<string[]>([]); // Lưu trữ các ảnh đã chọn
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
    const [selectedCondition, setSelectedCondition] = useState<string | null>(null);

    // Lấy dữ liệu từ AsyncStorage khi vào trang UploadScreen
    useFocusEffect(
        useCallback(() => {
            const getSelectedMethod = async () => {
                try {
                    const method = await AsyncStorage.getItem("selectedMethod");
                    if (method) {
                        setSelectedMethod(method);
                    }
                } catch (error) {
                    console.error("Failed to retrieve method:", error);
                }
            };
            getSelectedMethod();
        }, [])
    );

    useFocusEffect(
        useCallback(() => {
            const getCondition = async () => {
                try {
                    const condition = await AsyncStorage.getItem("selectedCondition");
                    if (condition) {
                        setSelectedCondition(condition);
                    }
                } catch (error) {
                    console.error("Failed to retrieve condition:", error);
                }
            };

            getCondition();
        }, [])
    );

    const toggleCheckbox = () => {
        setIsChecked(!isChecked);
    };
    // Hàm mở camera để chụp ảnh
    const openCamera = async () => {
        if (images.length >= 4) {
            Alert.alert("Limit reached", "You can only upload up to 4 photos.");
            return;
        }

        // Xin quyền truy cập camera
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Permission denied", "Sorry, we need camera permissions to make this work!");
            return;
        }

        // Mở camera
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images, // Chỉ chụp ảnh
            quality: 1, // Chất lượng ảnh (từ 0 đến 1)
            allowsEditing: true, // Cho phép chỉnh sửa ảnh
        });

        if (!result.canceled) {
            const newImage = result.assets[0].uri; // Lấy URI của ảnh đã chụp
            setImages((prevImages) => [...prevImages, newImage]); // Thêm ảnh vào danh sách
        }
    };

    // Hàm mở thư viện ảnh
    const openImageLibrary = async () => {
        // Kiểm tra số lượng ảnh hiện tại
        if (images.length >= 4) {
            Alert.alert("Limit reached", "You can only upload up to 4 photos.");
            return;
        }

        // Xin quyền truy cập thư viện ảnh
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Permission denied", "Sorry, we need camera roll permissions to make this work!");
            return;
        }

        // Mở thư viện ảnh
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images, // Chỉ cho phép chọn ảnh
            allowsMultipleSelection: true, // Cho phép chọn nhiều ảnh
            quality: 1, // Chất lượng ảnh (từ 0 đến 1)
            selectionLimit: 4 - images.length, // Giới hạn số lượng ảnh có thể chọn
        });

        if (!result.canceled) {
            const selectedImages = result.assets.map((asset) => asset.uri); // Lấy URIs của các ảnh đã chọn
            setImages((prevImages) => [...prevImages, ...selectedImages]); // Cập nhật state với các ảnh đã chọn
        }
    };

    // Hàm hiển thị menu lựa chọn (chụp ảnh hoặc chọn ảnh từ thư viện)
    const showImagePickerOptions = () => {
        // Kiểm tra số lượng ảnh hiện tại
        if (images.length >= 4) {
            Alert.alert("Limit reached", "You can only upload up to 4 photos.");
            return;
        }

        if (Platform.OS === "ios") {
            ActionSheetIOS.showActionSheetWithOptions(
                {
                    options: ["Cancel", "Take Photo", "Choose from Library"],
                    cancelButtonIndex: 0,
                },
                (buttonIndex) => {
                    if (buttonIndex === 1) {
                        openCamera();
                    } else if (buttonIndex === 2) {
                        openImageLibrary();
                    }
                }
            );
        } else {
            // Đối với Android, sử dụng Alert
            Alert.alert(
                "Select Option",
                "Choose an option",
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "Take Photo", onPress: openCamera },
                    { text: "Choose from Library", onPress: openImageLibrary },
                ]
            );
        }
    };

    // Hàm xóa ảnh
    const deleteImage = (index: number) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };



    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView
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
                    <View className="flex-row flex-wrap mt-2 ml-4">
                        {/* Phần "Add up to 4 photos" */}
                        {images.length < 4 && (
                            <TouchableOpacity
                                onPress={showImagePickerOptions}
                                className="w-20 h-32 bg-transparent border-2 border-dashed border-gray-300 rounded-lg justify-center items-center mr-2"
                            >
                                {/* Biểu tượng camera */}
                                <View className="flex justify-center items-center">
                                    <Icon name="photo-camera" size={24} color="#00b0b9" />
                                </View>
                                {/* Dòng chữ "Add up to 4 photos" */}
                                <Text
                                    className="text-center text-xs font-light text-gray-500 mt-2"
                                    numberOfLines={2}
                                    ellipsizeMode="tail"
                                    style={{ width: 64 }}
                                >
                                    Add up to 4 photos
                                </Text>
                            </TouchableOpacity>
                        )}

                        {/* Hiển thị các ảnh đã chọn */}
                        {images.map((uri, index) => (
                            <View
                                key={index}
                                className="w-20 h-32 bg-transparent border-2 border-dashed border-gray-300 rounded-lg justify-center items-center mr-2"
                            >
                                <Image
                                    source={{ uri }}
                                    className="w-full h-full rounded-lg"
                                />
                                {/* Nút xóa ảnh */}
                                <TouchableOpacity
                                    onPress={() => deleteImage(index)}
                                    className="absolute top-0 right-0 bg-red-500 rounded-full w-6 h-6 justify-center items-center"
                                >
                                    <Icon name="close" size={14} color="#ffffff" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>

                    {/* Type of item section */}
                    <TouchableOpacity
                        onPress={() => navigation.navigate("TypeOfItemScreen")}
                        className="w-11/12 h-12 bg-white rounded-lg mt-4 ml-4 flex-row justify-between items-center px-4"
                    >
                        {/* Dòng chữ "Type of item" */}
                        <Text className="text-xs font-normal text-black">
                            Type of item
                        </Text>

                        {/* Biểu tượng mũi tên qua phải */}
                        <Icon name="arrow-forward-ios" size={20} color="#6b7280" />
                    </TouchableOpacity>

                    {/* Brand section */}
                    <View className="w-11/12 h-12 bg-white rounded-lg mt-4 ml-4">
                        <Text className="text-xs font-normal text-black mt-4 ml-4">
                            Brand
                        </Text>
                    </View>

                    {/* Phần chọn điều kiện món hàng */}
                    <TouchableOpacity
                        onPress={() => navigation.navigate("ItemConditionScreen")}
                        className="w-11/12 h-16 bg-white rounded-lg mt-4 ml-4 px-4 py-2 flex-row justify-between items-center"
                    >
                        {/* View bọc phần Text để giữ nó bên trái */}
                        <View>
                            <Text className="text-xs font-normal text-black">Condition</Text>
                            <Text className="text-sm font-semibold text-black mt-1">
                                {selectedCondition || "Select condition"}
                            </Text>
                        </View>

                        {/* Icon nằm bên phải */}
                        <Icon name="arrow-forward-ios" size={20} color="#6b7280" />
                    </TouchableOpacity>


                    <TouchableOpacity
                        onPress={toggleCheckbox}
                        className="flex-row items-center justify-between mt-4 ml-7"
                    >
                        {/* Dòng chữ "I want to give it for free" */}
                        <Text className="text-sm font-bold text-[#738aa0]">
                            I want to give it for free
                        </Text>
                        {/* Checkbox */}
                        <View className="w-5 h-5 bg-white rounded-sm justify-center items-center mr-6">
                            {isChecked && <Icon name="check" size={14} color="#00B0B9" />}
                        </View>
                    </TouchableOpacity>


                    {/* Price section */}
                    {!isChecked && (
                        <View className="w-11/12 h-12 bg-white rounded-lg mt-4 ml-4 justify-center">
                            <TextInput
                                className="text-xs font-normal text-black ml-4"
                                placeholder="Price"
                                placeholderTextColor="#d1d5db" // Màu placeholder
                                value={price}
                                onChangeText={setPrice}
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
                            value={title}
                            onChangeText={setTitle}
                        />
                    </View>

                    {/* Description section */}
                    <View className="w-11/12 h-24 bg-white rounded-lg mt-4 ml-4">
                        <TextInput
                            className="text-xs font-normal text-black ml-4 pt-2"
                            placeholder="Description"
                            placeholderTextColor="#d1d5db"
                            value={description}
                            onChangeText={setDescription}
                            multiline={true}
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
                                {selectedMethod || "Select a method"}
                            </Text>
                        </View>
                        <Icon name="arrow-forward-ios" size={20} color="#6b7280" />

                    </TouchableOpacity>



                    {/* Accept exchanging with money text */}
                    <Text className="text-sm font-bold text-[#738aa0] mt-4 ml-5">
                        Accept exchanging with money
                    </Text>

                    {/* Choose your exchange type section */}
                    <TouchableOpacity
                        onPress={() => navigation.navigate("ExchangeTypeScreen")}
                        className="w-11/12 h-12 bg-white rounded-lg mt-4 ml-4 flex-row justify-between items-center px-4"
                    >
                        {/* Dòng chữ "Type of item" */}
                        <Text className="text-xs font-normal text-black">
                            Choose your exchange type
                        </Text>

                        {/* Biểu tượng mũi tên qua phải */}
                        <Icon name="arrow-forward-ios" size={20} color="#6b7280" />
                    </TouchableOpacity>

                    <Text className="text-sm font-bold text-[#738aa0] mt-4 ml-5">
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
                    <View className="w-11/12 py-3 flex-row justify-center items-center bg-[#00b0b9] rounded-lg mt-8 mx-4 mb-8">
                        <Text className="text-base font-bold text-white">
                            Create
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}