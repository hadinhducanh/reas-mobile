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
import Header from "../../components/Header";
import ItemCard from "../../components/ItemCard";
import { RootStackParamList } from "../../navigation/AppNavigator";

type ItemType = {
  id: number;
  name: string;
  price: string;
  image: string;
  location: string;
  description: string;
  isFavorited: boolean;
};

const { width } = Dimensions.get("window");

const ItemDetailScreen: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, "ItemDetail">>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { item } = route.params;
  const [isFavorite, setIsFavorite] = useState(item.isFavorited);

  const imageArray = item.image ? item.image.split(",") : [];

  const setFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const [itemList, setItemList] = useState<ItemType[]>([
    {
      id: 1,
      name: "iPhone 20",
      price: "150.000",
      image: "https://via.placeholder.com/150",
      location: "Vinhome Grand Park",
      description: "Brand new iPhone 20 with latest features.",
      isFavorited: false,
    },
    {
      id: 2,
      name: "Samsung Galaxy S25",
      price: "150.000",
      image: "https://via.placeholder.com/150",
      location: "District 1, HCMC",
      description: "Latest Samsung flagship phone.",
      isFavorited: false,
    },
    {
      id: 3,
      name: "Samsung Galaxy S24",
      price: "150.000",
      image: "https://via.placeholder.com/150",
      location: "District 3, HCMC",
      description: "Latest Samsung flagship phone1.",
      isFavorited: false,
    },
  ]);

  const toggleLike = (itemId: number) => {
    setItemList((prevList) =>
      prevList.map((it) =>
        it.id === itemId ? { ...it, isFavorited: !it.isFavorited } : it
      )
    );
  };

  const renderHorizontalSection = (title: string, data: ItemType[]) => (
    <View className="p-5">
      <View className="flex-row justify-between items-center">
        <Text className="font-semibold text-xl">{title}</Text>
        <Text className="font-bold underline text-lg text-[#00B0B9]">
          Tất cả
        </Text>
      </View>
      <View className="py-1">
        <FlatList
          data={data}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View className="mr-2 w-48 h-100">
              <ItemCard
                item={item}
                navigation={navigation}
                toggleLike={toggleLike}
              />
            </View>
          )}
        />
      </View>
    </View>
  );

  const renderContent = () => (
    <View>
      <FlatList
        data={imageArray}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item: image }) => (
          <View className="relative">
            <Image
              source={{ uri: image }}
              className="w-full h-60 bg-gray-300"
              style={{ width: width, height: 340 }}
            />
            <Pressable
              className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg"
              onPress={setFavorite}
            >
              <Icon
                name={isFavorite ? "heart" : "heart-outline"}
                size={24}
                color="#ff0000"
              />
            </Pressable>
          </View>
        )}
      />

      <View className="p-5 bg-white">
        <Text className="text-2xl font-bold text-gray-900">{item.name}</Text>
        <Text className="text-2xl font-semibold text-[#00B0B9] mt-1">
          {item.price} VND
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
              {item.location}, HCM
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
          {/* Hàng 1 */}
          <View className="flex-row border-b border-gray-300">
            <View className="w-[40%] px-2 py-4 bg-gray-200">
              <Text className="text-base font-semibold text-gray-500">
                Tình trạng
              </Text>
            </View>
            <View className="px-2 py-4">
              <Text className="text-base">Đã sử dụng</Text>
            </View>
          </View>
          {/* Hàng 2 */}
          <View className="flex-row border-b border-gray-300">
            <View className="w-[40%] px-2 py-4 bg-gray-200">
              <Text className="text-base font-semibold text-gray-500">
                Thiết bị
              </Text>
            </View>
            <View className="flex-1 px-2 py-4">
              <Text className="text-base">Máy giặt</Text>
            </View>
          </View>
          {/* Hàng 3 */}
          <View className="flex-row border-b border-gray-300">
            <View className="w-[40%] px-2 py-4 bg-gray-200">
              <Text className="text-base font-semibold text-gray-500">
                Hãng
              </Text>
            </View>
            <View className="flex-1 px-2 py-4">
              <Text className="text-base">Samsung</Text>
            </View>
          </View>
          {/* Hàng 4 */}
          <View className="flex-row border-b border-gray-300">
            <View className="w-[40%] px-2 py-4 bg-gray-200">
              <Text className="text-base font-semibold text-gray-500">
                Phương thức trao đổi
              </Text>
            </View>
            <View className="flex-1 px-2 py-4">
              <Text className="text-base">Bằng tiền</Text>
            </View>
          </View>
          {/* Hàng 5 */}
          <View className="flex-row">
            <View className="w-[40%] px-2 py-4 bg-gray-200">
              <Text className="text-base font-semibold text-gray-500">
                Loại giao dịch
              </Text>
            </View>
            <View className="flex-1 px-2 py-4">
              <Text className="text-base">Gặp mặt trực tiếp</Text>
            </View>
          </View>
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

      {renderHorizontalSection("Bài đăng khác của Ngọc Cường", itemList)}

      {renderHorizontalSection("Bài đăng tương tự", itemList)}
    </View>
  );

  return (
    <>
      <SafeAreaView className="flex-1 bg-gray-100" edges={["top"]}>
        <Header title="" setFavorites={setFavorite} />
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
        <Pressable className="flex-1 border-[1px] border-[#00B0B9] bg-white p-3 rounded-lg items-center flex-row justify-center active:bg-[rgb(0,176,185,0.1)]">
          <Icon name="call-outline" size={25} color="#00B0B9" />
          <Text className="text-[#00B0B9] font-bold ml-1">Call</Text>
        </Pressable>
        <Pressable className="flex-1 border-[1px] border-[#00B0B9] bg-white p-3 rounded-lg mx-2 items-center flex-row justify-center active:bg-[rgb(0,176,185,0.1)]">
          <Icon name="chatbubble-outline" size={25} color="#00B0B9" />
          <Text className="text-[#00B0B9] font-bold ml-1">SMS</Text>
        </Pressable>
        <Pressable
          className="flex-1 bg-[#00B0B9] p-3 rounded-lg items-center flex-row justify-center active:bg-[rgb(0,176,185,0.9)]"
          onPress={() => navigation.navigate("CreateExchange", { item })}
        >
          <Icon name="swap-horizontal" size={25} color="white" />
          <Text className="text-white font-bold ml-1">Exchange</Text>
        </Pressable>
      </View>
    </>
  );
};

export default ItemDetailScreen;
