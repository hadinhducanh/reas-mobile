import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, FlatList, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useRoute, RouteProp, useNavigation, NavigationProp } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ItemType } from "../../navigation/AppNavigator";
import CardItem from "../../components/CardItem";

// Định nghĩa kiểu dữ liệu cho Item

// Định nghĩa kiểu dữ liệu cho navigation
type RootStackParamList = {
  ItemDetail: { itemId: number };
};
const items: ItemType[] = [
  {
    id: 1,
    name: "iPhone 20",
    price: 30000000,
    images: ["https://via.placeholder.com/150"],
    location: "Vinhome Grand Park",
    description: "Brand new iPhone 20 with latest features.",
  },
  {
    id: 2,
    name: "Samsung Galaxy S25",
    price: 30000000,
    images: ["https://via.placeholder.com/150"],
    location: "District 1, HCMC",
    description: "Latest Samsung flagship phone.",
  },
  {
    id: 3,
    name: "Samsung Galaxy S24",
    price: 30000000,
    images: ["https://via.placeholder.com/150"],
    location: "District 3, HCMC",
    description: "Latest Samsung flagship phone1.",
  },
];
const otherItems = [
  {
    id: 4,
    name: "MacBook Pro M3",
    price: 30000000,
    images: ["https://via.placeholder.com/150"],
    location: "Hà Nội",
    description: "Brand new iPhone 20 with latest features.",
  },
  {
    id: 5,
    name: "AirPods Pro 2",
    price: 30000000,
    images: ["https://via.placeholder.com/150"],
    location: "Hồ Chí Minh",
    description: "Brand new iPhone 20 with latest features.",
  },
  {
    id: 6,
    name: "iPad Air 5",
    price: 30000000,
    images: ["https://via.placeholder.com/150"],
    location: "Đà Nẵng",
    description: "Brand new iPhone 20 with latest features.",
  },
];

const DEFAULT_IMAGES = [
  "https://images.samsung.com/is/image/samsung/p6pim/uk/sm-a546blgdeub/gallery/uk-galaxy-a54-5g-sm-a546-sm-a546blgdeub-535771507?$650_519_PNG$",
  "https://th.bing.com/th/id/OIP.O0rIASYz32F8Z3B6XjV4EAHaHa?w=1080&h=1080&rs=1&pid=ImgDetMain",
  "https://th.bing.com/th/id/OIP.FKs0EoX8cwWU1zzBGsVLtwHaEK?rs=1&pid=ImgDetMain",
  "https://images.samsung.com/is/image/samsung/p6pim/my/sm-a065fzkgxme/gallery/my-galaxy-a06-sm-a065-519973-sm-a065fzkgxme-543318449?$650_519_PNG$"
];

const ItemDetailScreen: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, "ItemDetail">>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { itemId } = route.params;
  const item = items.find((i) => i.id === itemId);
  

  const screenWidth = Dimensions.get("window").width;
  const [activeIndex, setActiveIndex] = useState(0);

  // const images = item.images && item.images.length > 0 ? item.images : DEFAULT_IMAGES;
  const images = DEFAULT_IMAGES;
  const onScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / screenWidth);
    setActiveIndex(index);
  };

  const data = [
    { label: "Tình trạng", value: "Đã sử dụng" },
    { label: "Thiết bị", value: "Máy giặt" },
    { label: "Hãng", value: "Samsung" },
    { label: "Phương thức trao đổi", value: "Tự đến lấy" },
    { label: "Loại giao dịch", value: "Giao dịch mở" },
  ];
  console.log("Item ID from route:", itemId);
console.log("Found item:", item);
console.log("Navigating to ID:", itemId);
console.log("Route params:", route.params);




  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        {/* Ảnh item */}
        <View className="relative">
          <FlatList
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(image, index) => index.toString()}
            onScroll={onScroll}
            renderItem={({ item: image }) => (
              <Image source={{ uri: image }} className="w-full h-96" style={{ width: screenWidth }} />
            )}
          />

          {/* Chỉ báo trang ảnh */}
          <View className="absolute bottom-3 self-center flex-row">
            {images.map((_, index) => (
              <View
                key={index}
                className={`w-2.5 h-2.5 mx-1 rounded-full ${index === activeIndex ? "bg-[#00B0B9]" : "bg-gray-300"}`}
              />
            ))}
          </View>

          {/* Nút quay lại */}
          <TouchableOpacity className="absolute top-5 left-5 bg-white p-2 rounded-full" onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={25} color="#333" />
          </TouchableOpacity>

          {/* Nút yêu thích */}
          <TouchableOpacity className="absolute top-5 right-5 bg-white p-2 rounded-full">
            <Icon name="heart-outline" size={24} color="#00B0B9" />
          </TouchableOpacity>
        </View>

        {/* Thông tin item */}
        <View className="p-5">
          <Text className="text-2xl font-bold text-gray-900">{item?.name}</Text>
          <Text className="text-2xl font-semibold text-[#00B0B9] mt-1">{item?.price} VND</Text>
          <Text className="ml-1 text-gray-500 text-xs">*Cá nhân trao đổi bằng tiền</Text>

          {/* Địa điểm */}
          <View className="flex-row items-center mt-3">
            <Icon name="location-outline" size={24} color="#000" />
            <Text className="ml-1 text-black text-sm">{item?.location}</Text>
          </View>

          <View className="flex-row items-center mt-3">
            <Icon name="time-outline" size={24} color="#000" />
            <Text className="ml-1 text-black text-sm">Đăng 2 giờ trước</Text>
          </View>

          {/* Thông tin người bán */}
          <View className="bg-white p-4 border border-gray-300 rounded-2xl mt-3">
            <View className="flex-row items-center justify-between">
              {/* Avatar + Tên */}
              <View className="flex-row items-center flex-1">
                <View className="w-12 h-12 bg-gray-400 rounded-full" />
                <View className="ml-3">
                  <Text className="font-semibold text-gray-900">Ngọc Cường</Text>
                  <Text className="text-xs text-gray-500">Phản hồi: 94%  ·  10 đã bán</Text>
                  <Text className="text-xs text-gray-500">● Hoạt động 2 giờ trước</Text>
                </View>
              </View>

              {/* Đường kẻ dọc */}
              <View className="w-[1px] h-12 bg-gray-300 mx-4" />

              {/* Đánh giá */}
              <View className="items-end">
                <View className="flex-row items-center">
                  <Text className="text-lg font-semibold text-gray-900">5.0</Text>
                  <Icon name="star" size={16} color="#FFA500" className="ml-1" />
                </View>
                <Text className="text-xs text-gray-500">5 đánh giá</Text>
              </View>
            </View>
          </View>

          {/* Mô tả chi tiết */}
          <View className="bg-white p-4 mt-3">
            <Text className="text-lg font-semibold text-gray-900">Mô tả chi tiết</Text>

            <Text className="text-sm font-semibold mt-2">Display:</Text>
            <Text className="text-sm text-gray-700">• Technology: Super Retina XDR OLED</Text>
            <Text className="text-sm text-gray-700">• Size: 6.1 inches</Text>
            <Text className="text-sm text-gray-700">• Resolution: 2556 x 1179 pixels, 460 ppi</Text>
            <Text className="text-sm text-gray-700">
              • Features: Dynamic Island, HDR, True Tone, Wide color (P3), Haptic Touch
            </Text>
            <Text className="text-sm text-gray-700">
              • Brightness: Up to 1000 nits (typical), 1600 nits (HDR peak), 2000 nits (outdoor peak)
            </Text>

            <Text className="text-sm font-semibold mt-3">Dimensions and Weight:</Text>
            <Text className="text-sm text-gray-700">• Height: 147.6 mm</Text>
            <Text className="text-sm text-gray-700">• Width: 71.6 mm</Text>
            <Text className="text-sm text-gray-700">• Thickness: 7.8 mm</Text>
          </View>

          {/* Bảng thông tin */}
          <View className="bg-white p-4 mt-3">
           
            <Text className="text-lg font-semibold text-gray-900">Thông tin chi tiết</Text>
            <View className="w-full border border-gray-300 rounded-lg bg-white mt-2">

              {data.map((info, index) => (
                <View key={index} className={`flex-row border-b border-gray-300 ${index === data.length - 1 ? "border-b-0" : ""}`}>
                  <View className="flex-1 bg-gray-200 p-3 justify-center">
                    <Text className="text-xs font-medium text-gray-600">{info.label}</Text>
                  </View>
                  <View className="flex-1 bg-white p-3 justify-center">
                    <Text className="text-sm text-black">{info.value}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Điều khoản và điều kiện trao đổi */}
          <View className="bg-white p-4 mt-3">
            <Text className="text-lg font-semibold text-gray-900">Điều khoản và điều kiện trao đổi</Text>
            <Text className="text-sm text-gray-700 mt-2">• Giao dịch gặp mặt</Text>
            <Text className="text-sm text-gray-700">• Không trả lại đồ</Text>
            <Text className="text-sm text-gray-700">• Chỉ nhận chuyển khoản</Text>
          </View>

             {/* Bài đăng khác */}
          <View className="bg-white p-4 mt-3">
            <Text className="text-lg font-semibold text-gray-900">Bài đăng khác</Text>
            {otherItems.map((otherItem) => (
              <CardItem
                key={otherItem.id}
                id={otherItem.id}
                name={otherItem.name}
                price={otherItem.price}
                image={otherItem.images[0]}
                location={otherItem.location}
                description={otherItem.description}
                onPress={() => navigation.navigate("ItemDetail", { itemId: otherItem.id })}
              />
            ))}
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ItemDetailScreen;
