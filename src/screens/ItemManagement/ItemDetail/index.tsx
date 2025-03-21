import React, { useEffect } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { RootStackParamList } from "../../../navigation/AppNavigator";
import { AppDispatch, RootState } from "../../../redux/store";
import { getItemDetailThunk } from "../../../redux/thunk/itemThunks";
import HorizontalSection from "../../../components/HorizontalSection";
import Header from "../../../components/Header";
import LoadingButton from "../../../components/LoadingButton";

const { width } = Dimensions.get("window");

const ItemDetails: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, "ItemDetails">>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { itemId } = route.params;
  const dispatch = useDispatch<AppDispatch>();
  const { itemDetail, itemRecommnand } = useSelector(
    (state: RootState) => state.item
  );
  // const item = itemList.find((item) => item.id === itemId);
  // const [isFavorite, setIsFavorite] = useState(item?.isFavorited);
  const data = [
    { label: "Tình trạng", value: "Đã sử dụng" },
    { label: "Thiết bị", value: "Máy giặt" },
    { label: "Hãng", value: "Samsung" },
    { label: "Phương thức trao đổi", value: "Tự đến lấy" },
    { label: "Loại giao dịch", value: "Giao dịch mở" },
  ];
  const imageArray = itemDetail?.imageUrl
    ? itemDetail.imageUrl.split(", ")
    : [];

  // const setFavorite = () => {
  //   setIsFavorite(!isFavorite);
  // };

  // const toggleLike = (itemId: number) => {
  //   setItemList((prevList) =>
  //     prevList.map((it) =>
  //       it.id === itemId ? { ...it, isFavorited: !it.isFavorited } : it
  //     )
  //   );
  // };

  const formatPrice = (price: number | undefined): string => {
    return price !== undefined ? price.toLocaleString("vi-VN") : "0";
  };

  useEffect(() => {
    dispatch(getItemDetailThunk(itemId));
  }, [dispatch]);

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
              // onPress={setFavorite}
            >
              <Icon name={"heart-outline"} size={24} color="#ff0000" />
            </Pressable>
          </View>
        )}
      />

      <View className="p-5 bg-white">
        <Text className="text-2xl font-bold text-gray-900">
          {itemDetail?.itemName}
        </Text>
        <Text className="text-2xl font-semibold text-[#00B0B9] mt-1">
          {formatPrice(itemDetail?.price)} VND
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
              {itemDetail?.userLocation.specificAddress}
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
              <Text className="text-lg font-bold">
                {itemDetail?.owner.fullName}
              </Text>
              <Text className="text-gray-500 my-1">
                Phản hồi 94%:
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
          <Text className="text-lg font-semibold mb-1">
            {itemDetail?.description}
          </Text>
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

      <HorizontalSection
        title="Bài đăng khác của Ngọc Cường"
        data={itemRecommnand.content}
        // toggleLike={toggleLike}
        navigation={navigation}
      />

      <HorizontalSection
        title="Bài đăng tương tự"
        data={itemRecommnand.content}
        // toggleLike={toggleLike}
        navigation={navigation}
      />
    </View>
  );

  return (
    <>
      <SafeAreaView className="flex-1 bg-gray-100" edges={["top"]}>
        <Header
          title=""
          onBackPress={() =>
            navigation.navigate("MainTabs", { screen: "Home" })
          }
        />
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
        <View className="flex-1">
          <LoadingButton
            title="Call"
            onPress={() => {}}
            buttonClassName="p-3 border-[#00B0B9] border-2 bg-white"
            iconName="call-outline"
            iconSize={25}
            iconColor="#00B0B9"
            showIcon={true}
            textColor="text-[#00B0B9]"
          />
        </View>
        <View className="flex-1 mx-2">
          <LoadingButton
            title="Chat"
            onPress={() =>
              navigation.navigate("ChatDetails", {
                receiverUsername: itemDetail!.owner.userName,
                receiverFullName: itemDetail!.owner.fullName,
              })
            }
            buttonClassName="p-3 border-[#00B0B9] border-2 bg-white"
            iconName="chatbubble-outline"
            iconSize={25}
            iconColor="#00B0B9"
            showIcon={true}
            textColor="text-[#00B0B9]"
          />
        </View>
        <View className="flex-1">
          <LoadingButton
            title="Exchange"
            onPress={() => navigation.navigate("CreateExchange", { itemId })}
            buttonClassName="p-3 border-transparent border-2 bg-[#00B0B9]"
            iconName="swap-horizontal"
            iconSize={25}
            iconColor="white"
            showIcon={true}
            textColor="text-white"
          />
        </View>
      </View>
    </>
  );
};

export default ItemDetails;
