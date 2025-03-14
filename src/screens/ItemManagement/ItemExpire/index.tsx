import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  Pressable,
  Dimensions,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import {
  useRoute,
  RouteProp,
  useNavigation,
  NavigationProp,
} from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ItemType, RootStackParamList } from "../../../navigation/AppNavigator";
import Header from "../../../components/Header";
import LoadingButton from "../../../components/LoadingButton";
import DeleteConfirmModal from "../../../components/DeleteConfirmModal";

const { width } = Dimensions.get("window");

const ItemExpire: React.FC = () => {
  const [itemList] = useState<ItemType[]>([
    {
      id: 1,
      name: "iPhone 20",
      price: 30000000,
      images: "https://via.placeholder.com/150",
      location: "Vinhome Grand Park",
      description: "Brand new iPhone 20 with latest features.",
      isFavorited: false,
    },
    {
      id: 2,
      name: "Samsung Galaxy S25",
      price: 30000000,
      images: "https://via.placeholder.com/150",
      location: "District 1, HCMC",
      description: "Latest Samsung flagship phone.",
      isFavorited: false,
    },
    {
      id: 3,
      name: "Samsung Galaxy S24",
      price: 30000000,
      images: "https://via.placeholder.com/150",
      location: "District 3, HCMC",
      description: "Latest Samsung flagship phone1.",
      isFavorited: false,
    },
  ]);

  const data = [
    { label: "Tình trạng", value: "Đã sử dụng" },
    { label: "Thiết bị", value: "Máy giặt" },
    { label: "Hãng", value: "Samsung" },
    { label: "Phương thức trao đổi", value: "Tự đến lấy" },
    { label: "Loại giao dịch", value: "Giao dịch mở" },
  ];
  const [deletedVisible, setDeletedVisible] = useState(false);

  const route = useRoute<RouteProp<RootStackParamList, "ItemDetails">>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { itemId } = route.params;
  const item = itemList.find((item) => item.id === itemId);

  const imageArray = item?.images ? item.images.split(",") : [];

  const formatPrice = (price: number | undefined): string => {
    return price !== undefined ? price.toLocaleString("vi-VN") : "0";
  };

  const handleUpdate = async () => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
  };

  const handleDelete = async () => {
    setDeletedVisible(true);
  };

  const handleCancel = () => {
    setDeletedVisible(false);
  };

  const handleConfirm = () => {
    setDeletedVisible(false);
  };

  const renderContent = () => (
    <View>
      <FlatList
        data={imageArray}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({}) => (
          <View className="relative">
            <Image
              source={{
                uri: "https://goldsun.vn/pic/ProductItem/Noi-com-d_637625508222561223.jpg",
              }}
              className="w-full h-60"
              style={{ width: width, height: 340 }}
            />
            <View
              className="w-full h-60 bg-gray-500 absolute opacity-70 justify-center items-center"
              style={{ width: width, height: 340 }}
            >
              <Icon name="time-outline" size={80} color="#00B0B9" />
              <Text className="text-xl font-bold">Expired item</Text>
            </View>
          </View>
        )}
      />

      <View className="p-5 bg-white">
        <Text className="text-2xl font-bold text-gray-900">{item?.name}</Text>
        <Text className="text-2xl font-semibold text-[#00B0B9] mt-1">
          {formatPrice(item?.price)} VND
        </Text>
        <Text
          className="text-gray-500 font-bold text-base mt-1"
          style={{ fontStyle: "italic" }}
        >
          *Có nhận trao đổi bằng tiền
        </Text>

        <View className="mt-3">
          <View className="flex flex-row items-center">
            <Icon name="location-outline" size={25} color="black" />
            <Text className="ml-1 text-gray-500 text-lg">
              {item?.location}, HCM
            </Text>
          </View>
          <View className="flex flex-row items-center mt-2">
            <Icon name="time-outline" size={25} color="black" />
            <Text className="ml-1 text-gray-500 text-lg">Đăng 2 giờ trước</Text>
          </View>
        </View>

        <View className="border-2 py-2 border-gray-300 rounded-xl mt-5 flex-row justify-between">
          <Pressable
            className="flex-row items-center"
            onPress={() => navigation.navigate("OwnerItem")}
          >
            <Icon name="person-circle-outline" size={70} color="gray" />
            <View>
              <Text className="text-lg font-bold">Ngọc Cường</Text>
              <Text className="text-gray-500 my-1">
                Phản hồi 94%:{" "}
                <Text className="underline text-black">10 đã bán</Text>
              </Text>
              <View className="flex-row items-center">
                <View className="w-3 h-3 bg-[#738aa0] rounded-full mr-1" />
                <Text className="text-gray-500">Hoạt động 2 giờ trước</Text>
              </View>
            </View>
          </Pressable>
          <Pressable
            className="flex-col justify-center items-center px-5 border-l-2 border-gray-300"
            onPress={() => navigation.navigate("OwnerFeedback")}
          >
            <View className="flex-row items-center">
              <Text className="mr-1 text-xl font-bold">5.0</Text>
              <Icon name="star" size={20} color="yellow" />
            </View>
            <Text className="underline">5 đánh giá</Text>
          </Pressable>
        </View>
      </View>

      <View className="p-5 my-5 bg-white">
        <Text className="text-xl font-bold mb-3">Mô tả chi tiết</Text>

        {/* Display */}
        <View className="mb-3">
          <Text className="text-lg font-semibold mb-1">Display:</Text>
          <View className="pl-3">
            <Text className="text-base mb-0.5">
              • Technology: Super Retina XDR OLED
            </Text>
            <Text className="text-base mb-0.5">• Size: 6.1 inches</Text>
            <Text className="text-base mb-0.5">
              • Resolution: 2556 x 1179 pixels, 460 ppi
            </Text>
            <Text className="text-base mb-0.5">
              • Features: Dynamic Island, HDR, True Tone, Wide color (P3),
              Haptic Touch
            </Text>
            <Text className="text-base mb-0.5">
              • Brightness: Up to 1000 nits (typical), 1600 nits (HDR peak),
              2000 nits (outdoor peak)
            </Text>
          </View>
        </View>

        {/* Dimensions and Weight */}
        <View className="mb-3">
          <Text className="text-lg font-semibold mb-1">
            Dimensions and Weight:
          </Text>
          <View className="pl-3">
            <Text className="text-base mb-0.5">• Height: 147.6 mm</Text>
            <Text className="text-base mb-0.5">• Width: 71.6 mm</Text>
            <Text className="text-base mb-0.5">• Thickness: 7.8 mm</Text>
          </View>
        </View>

        {/* Thông tin chi tiết */}
        <Text className="text-xl font-bold mt-4 mb-3">Thông tin chi tiết</Text>
        <View className="border border-gray-300 rounded-md overflow-hidden">
          {data.map((info, index) => (
            <View key={index} className="flex-row border-b border-gray-300">
              <View className="w-[40%] px-2 py-4 bg-gray-200">
                <Text className="text-base font-semibold text-gray-500">
                  {info.label}
                </Text>
              </View>
              <View className="px-2 py-4">
                <Text className="text-base">{info.value}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Điều khoản và điều kiện */}
        <View className="mt-5">
          <Text className="text-xl font-semibold mb-1">
            Điều khoản và điều kiện trao đổi:
          </Text>
          <Text className="text-base mb-0.5">• Giao dịch gặp mặt</Text>
          <Text className="text-base mb-0.5">• Không trả hàng</Text>
          <Text className="text-base mb-0.5">• Chỉ nhận chuyển khoản</Text>
        </View>
      </View>
    </View>
  );

  return (
    <>
      <SafeAreaView className="flex-1 bg-gray-100" edges={["top"]}>
        <Header title="" showOption={false} />
        <FlatList
          data={[{}]}
          keyExtractor={(_, index) => index.toString()}
          renderItem={null}
          ListHeaderComponent={renderContent}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        />
      </SafeAreaView>
      <View
        className={`${
          Platform.OS === "ios" ? "pt-4 pb-7" : "py-5"
        } px-5 bg-white rounded-t-xl flex-row items-center`}
      >
        <View className="flex-1 mr-2">
          <LoadingButton
            title="Extend"
            onPress={handleUpdate}
            buttonClassName="p-3 border-[#00B0B9] border-2 bg-white"
            iconName="time-outline"
            iconSize={25}
            iconColor="#00B0B9"
            showIcon={true}
            textColor="text-[#00B0B9]"
          />
        </View>
        <View className="flex-1">
          <LoadingButton
            title="Delete"
            onPress={handleDelete}
            buttonClassName="p-3 border-transparent border-2 bg-[#00B0B9]"
            iconName="trash-outline"
            iconSize={25}
            iconColor="white"
            showIcon={true}
            textColor="text-white"
          />
        </View>
      </View>

      <DeleteConfirmModal
        visible={deletedVisible}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
    </>
  );
};

export default ItemExpire;
