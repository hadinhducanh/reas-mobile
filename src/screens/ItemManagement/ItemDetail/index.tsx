import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  Pressable,
  Dimensions,
  Platform,
  Modal,
  ActivityIndicator,
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
import dayjs from "dayjs";
import LocationModal from "../../../components/LocationModal";

const { width } = Dimensions.get("window");

const ItemDetails: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, "ItemDetails">>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { itemId } = route.params;
  const dispatch = useDispatch<AppDispatch>();
  const { itemDetail, itemRecommnand, loading } = useSelector(
    (state: RootState) => state.item
  );
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const [locationVisible, setLocationVisible] = useState<boolean>(false);

  const data = [
    { label: "Tình trạng", value: itemDetail?.conditionItem },
    { label: "Thiết bị", value: itemDetail?.category.categoryName },
    { label: "Hãng", value: itemDetail?.brand.brandName },
    { label: "Phương thức trao đổi", value: "All of methods" },
    {
      label: "Loại giao dịch",
      value:
        itemDetail?.desiredItem !== null ? "Open with desired item" : "Open",
    },
  ];

  const imageArray = itemDetail?.imageUrl
    ? itemDetail.imageUrl.split(", ")
    : [];

  const formatPrice = (price: number | undefined): string => {
    return price !== undefined ? price.toLocaleString("vi-VN") : "0";
  };

  function formatRelativeTime(timeStr: Date | undefined): string {
    const givenTime = dayjs(timeStr);
    const now = dayjs();

    const diffInSeconds = now.diff(givenTime, "second");

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
      const minutes = now.diff(givenTime, "minute");
      return `${minutes} minutes ago`;
    } else if (diffInSeconds < 86400) {
      const hours = now.diff(givenTime, "hour");
      return `${hours} hours ago`;
    } else if (diffInSeconds < 86400 * 30) {
      const days = now.diff(givenTime, "day");
      return `${days} days ago`;
    } else if (diffInSeconds < 86400 * 30 * 12) {
      const months = now.diff(givenTime, "month");
      return `${months} months ago`;
    } else {
      const years = now.diff(givenTime, "year");
      return `${years} years ago`;
    }
  }

  useEffect(() => {
    dispatch(getItemDetailThunk(itemId));
  }, [dispatch, itemId]);

  const handleCreateExchange = () => {
    if (!accessToken) {
      navigation.navigate("SignIn");
    } else {
      navigation.navigate("CreateExchange", { itemId });
    }
  };

  const renderContent = () => (
    <View className="flex-1">
      <FlatList
        data={imageArray}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item: image }) => (
          <View className="relative" style={{ width: width }}>
            <View className={`w-[${width}] h-96 bg-white`}>
              <Image
                source={{ uri: image }}
                className="w-full h-full"
                resizeMode="contain"
              />
            </View>

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
          {itemDetail?.price === 0
            ? "Free"
            : formatPrice(itemDetail?.price) + " VND"}
        </Text>
        {itemDetail?.moneyAccepted && (
          <Text
            className="text-gray-500 font-bold text-base mt-1"
            style={{ fontStyle: "italic" }}
          >
            *Có nhận trao đổi bằng tiền
          </Text>
        )}

        <View className="mt-3">
          <Pressable onPress={() => setLocationVisible(true)}>
            <View className="flex flex-row items-center">
              <Icon name="location-outline" size={25} color="black" />
              <Text
                className="ml-1 text-gray-500 text-lg underline w-10/12"
                numberOfLines={1}
              >
                {itemDetail?.userLocation.specificAddress.split("//")[1]}
              </Text>
            </View>
          </Pressable>

          <View className="flex flex-row items-center mt-2">
            <Icon name="time-outline" size={25} color="black" />
            <Text className="ml-1 text-gray-500 text-lg">
              Đăng {formatRelativeTime(itemDetail?.approvedTime)}
            </Text>
          </View>
        </View>

        <View className="border-2 py-2 border-gray-300 rounded-xl mt-5 flex-row justify-between">
          <Pressable
            className="flex-row items-center"
            onPress={() => navigation.navigate("OwnerItem")}
          >
            <Icon name="person-circle-outline" size={75} color="gray" />
            <View className="ml-1">
              <Text className="text-lg font-bold">
                {itemDetail?.owner.fullName}
              </Text>
              <Text className="text-gray-500 my-1">
                Sản phẩm:{" "}
                <Text className="underline text-black">
                  {itemDetail?.owner.numOfExchangedItems} đã bán
                </Text>
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
              <Text className="mr-1 text-xl font-bold">
                {itemDetail?.owner.numOfRatings}
              </Text>
              <Icon name="star" size={20} color="yellow" />
            </View>
            <Text className="underline">
              {itemDetail?.owner.numOfFeedbacks} đánh giá
            </Text>
          </Pressable>
        </View>
      </View>

      <View className="p-5 my-5 bg-white">
        <Text className="text-xl font-bold mb-3">Mô tả chi tiết</Text>
        <View className="mb-3">
          {itemDetail?.description.split("\\n").map((line, index) => (
            <Text className="text-lg font-normal mb-1" key={index}>
              {line}
            </Text>
          ))}
        </View>

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

        {itemDetail?.termsAndConditionsExchange && (
          <View className="mt-5">
            <Text className="text-xl font-semibold mb-1">
              Điều khoản và điều kiện trao đổi:
            </Text>
            {itemDetail?.termsAndConditionsExchange
              .split("\\n")
              .map((line, index) => (
                <Text className="text-base mb-0.5" key={index}>
                  {line}
                </Text>
              ))}
          </View>
        )}
      </View>

      <HorizontalSection
        title="Bài đăng khác của Ngọc Cường"
        data={itemRecommnand.content}
        navigation={navigation}
      />

      <HorizontalSection
        title="Bài đăng tương tự"
        data={itemRecommnand.content}
        navigation={navigation}
      />
    </View>
  );

  return (
    <>
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#00b0b9" />
        </View>
      ) : (
        <>
          <SafeAreaView className="flex-1 bg-gray-100" edges={["top"]}>
            <Header
              title=""
              onBackPress={() =>
                navigation.reset({
                  index: 0,
                  routes: [
                    {
                      name: "MainTabs",
                      state: { routes: [{ name: "Home" }] },
                    },
                  ],
                })
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
                onPress={handleCreateExchange}
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
      )}

      {itemDetail?.userLocation.specificAddress && (
        <LocationModal
          visible={locationVisible}
          onClose={() => setLocationVisible(false)}
          place_id={itemDetail.userLocation.specificAddress
            .split("//")[0]
            .trim()}
        />
      )}
    </>
  );
};

export default ItemDetails;
