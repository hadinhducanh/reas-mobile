import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  Pressable,
  Dimensions,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import {
  useRoute,
  RouteProp,
  useNavigation,
  NavigationProp,
  useFocusEffect,
} from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { RootStackParamList } from "../../../navigation/AppNavigator";
import { AppDispatch, RootState } from "../../../redux/store";
import {
  getItemDetailThunk,
  getOtherItemsOfUserThunk,
  getSimilarItemsThunk,
} from "../../../redux/thunk/itemThunks";
import HorizontalSection from "../../../components/HorizontalSection";
import Header from "../../../components/Header";
import LoadingButton from "../../../components/LoadingButton";
import dayjs from "dayjs";
import LocationModal from "../../../components/LocationModal";
import { ConditionItem } from "../../../common/enums/ConditionItem";
import { MethodExchange } from "../../../common/enums/MethodExchange";
import { resetItemDetailState } from "../../../redux/slices/itemSlice";
import {
  addToFavoriteThunk,
  deleteFromFavoriteThunk,
} from "../../../redux/thunk/favoriteThunk";
import { StatusItem } from "../../../common/enums/StatusItem";
import { TypeItem } from "../../../common/enums/TypeItem";

const { width } = Dimensions.get("window");

const conditionItems = [
  { label: "Brand new", value: ConditionItem.BRAND_NEW },
  { label: "Excellent", value: ConditionItem.EXCELLENT },
  { label: "Fair", value: ConditionItem.FAIR },
  { label: "Good", value: ConditionItem.GOOD },
  { label: "Not working", value: ConditionItem.NOT_WORKING },
  { label: "Poor", value: ConditionItem.POOR },
  { label: "Like new", value: ConditionItem.LIKE_NEW },
];

const methodExchanges = [
  { label: "Delivery", value: MethodExchange.DELIVERY },
  {
    label: "Meet at location",
    value: MethodExchange.MEET_AT_GIVEN_LOCATION,
  },
  { label: "Pick up", value: MethodExchange.PICK_UP_IN_PERSON },
];

const typeItems = [
  {
    name: "Kitchen",
    value: TypeItem.KITCHEN_APPLIANCES,
  },
  {
    name: "Cleaning & Laundry",
    value: TypeItem.CLEANING_LAUNDRY_APPLIANCES,
  },
  {
    name: "Cooling & Heating",
    value: TypeItem.COOLING_HEATING_APPLIANCES,
  },
  {
    name: "Electric & Entertainment",
    value: TypeItem.ELECTRONICS_ENTERTAINMENT_DEVICES,
  },
  {
    name: "Lighting & Security",
    value: TypeItem.LIGHTING_SECURITY_DEVICES,
  },
  {
    name: "Living room",
    value: TypeItem.LIVING_ROOM_APPLIANCES,
  },
  {
    name: "Bedroom",
    value: TypeItem.BEDROOM_APPLIANCES,
  },
  {
    name: "Bathroom",
    value: TypeItem.BATHROOM_APPLIANCES,
  },
];

const ItemDetails: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, "ItemDetails">>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { itemId } = route.params;
  const dispatch = useDispatch<AppDispatch>();
  const { itemDetail, itemSimilar, otherItemOfUser, loading } = useSelector(
    (state: RootState) => state.item
  );
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const [isFavorite, setIsFavorite] = useState(itemDetail?.favorite);
  const [locationVisible, setLocationVisible] = useState<boolean>(false);

  const getConditionItemLabel = (status: ConditionItem | undefined): string => {
    const found = conditionItems.find((item) => item.value === status);
    return found ? found.label : "";
  };

  const getTypeItemLabel = (status: TypeItem | undefined): string => {
    const found = typeItems.find((item) => item.value === status);
    return found ? found.name : "";
  };

  const getMethodExchangeLabel = (
    selectedMethods: MethodExchange[] | undefined
  ): string => {
    if (!selectedMethods || selectedMethods.length === 0) {
      return "";
    }
    return methodExchanges
      .filter((item) => selectedMethods.includes(item.value))
      .map((item) => item.label)
      .join(", ");
  };

  const data = useMemo(
    () => [
      {
        label: "Condition",
        value: getConditionItemLabel(itemDetail?.conditionItem),
      },
      {
        label: "Type",
        value: getTypeItemLabel(itemDetail?.typeItem),
      },
      { label: "Category", value: itemDetail?.category.categoryName },
      { label: "Brand", value: itemDetail?.brand.brandName },
      {
        label: "Exchange method",
        value:
          itemDetail?.methodExchanges.length === 3
            ? "All of methods"
            : getMethodExchangeLabel(itemDetail?.methodExchanges),
      },
      {
        label: "Exchange type",
        value:
          itemDetail?.desiredItem !== null ? "Open with desired item" : "Open",
      },
    ],
    [itemDetail]
  );

  const imageArray = useMemo(() => {
    return itemDetail?.imageUrl ? itemDetail.imageUrl.split(", ") : [];
  }, [itemDetail?.imageUrl]);

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

  useFocusEffect(
    useCallback(() => {
      dispatch(resetItemDetailState());
      dispatch(getItemDetailThunk(itemId));
    }, [dispatch, itemId])
  );

  useEffect(() => {
    if (itemDetail) {
      setIsFavorite(itemDetail.favorite);
      dispatch(getSimilarItemsThunk({ itemId: itemDetail.id, limit: 4 }));
      dispatch(
        getOtherItemsOfUserThunk({
          currItemId: itemDetail.id,
          userId: itemDetail.owner.id,
          limit: 4,
        })
      );
    }
  }, [dispatch, itemDetail, itemId]);

  const handleCreateExchange = useCallback(() => {
    if (!accessToken) {
      navigation.navigate("SignIn");
    } else {
      navigation.navigate("CreateExchange", { itemId });
    }
  }, [accessToken, navigation, itemId]);

  const handleChat = useCallback(() => {
    if (!accessToken) {
      navigation.navigate("SignIn");
    } else {
      navigation.navigate("ChatDetails", {
        receiverUsername: itemDetail!.owner.userName,
        receiverFullName: itemDetail!.owner.fullName,
      });
    }
  }, [accessToken, navigation, itemId]);

  const handleFavoritePress = useCallback(() => {
    if (!accessToken) {
      navigation.navigate("SignIn");
      return;
    }
    if (itemDetail) {
      setIsFavorite((prev) => !prev);
      if (isFavorite) {
        dispatch(deleteFromFavoriteThunk(itemDetail.id));
      } else {
        dispatch(addToFavoriteThunk(itemDetail.id));
      }
    }
  }, [accessToken, dispatch, itemId, isFavorite, navigation]);

  const renderImageItem = useCallback(
    ({ item: image }: { item: string }) => (
      <View className="relative" style={{ width: width }}>
        <View className={`w-[${width}] h-96 bg-white`}>
          <Image
            source={{ uri: image }}
            className="w-full h-full"
            resizeMode="contain"
          />
        </View>
        {accessToken && (
          <TouchableOpacity
            className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg"
            onPress={handleFavoritePress}
          >
            <Icon
              name={isFavorite ? "heart" : "heart-outline"}
              size={24}
              color="#ff0000"
            />
          </TouchableOpacity>
        )}
      </View>
    ),
    [handleFavoritePress, isFavorite]
  );

  const renderContent = useMemo(
    () => (
      <View className="flex-1">
        <FlatList
          data={imageArray}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderImageItem}
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
                  {itemDetail?.userLocation.specificAddress}
                </Text>
              </View>
            </Pressable>

            <View className="flex flex-row items-center mt-2">
              <Icon name="time-outline" size={25} color="black" />
              <Text className="ml-1 text-gray-500 text-lg">
                Upload {formatRelativeTime(itemDetail?.approvedTime)}
              </Text>
            </View>
          </View>

          <View className="border-2 py-2 border-gray-300 rounded-xl mt-5 flex-row justify-between">
            <Pressable
              className="flex-row items-center"
              onPress={() =>
                navigation.navigate("OwnerItem", {
                  userId: itemDetail?.owner.id!,
                })
              }
            >
              {itemDetail?.owner.image ? (
                <View className="w-24 h-24 rounded-full items-center justify-center p-2">
                  <Image
                    source={{
                      uri: itemDetail?.owner.image,
                    }}
                    className="w-full h-full rounded-full"
                  />
                </View>
              ) : (
                <View className="w-24 h-24 rounded-full items-center justify-center">
                  <Icon name="person-circle-outline" size={80} color="gray" />
                </View>
              )}
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
              onPress={() =>
                navigation.navigate("OwnerFeedback", {
                  userId: itemDetail?.owner.id!,
                })
              }
            >
              <View className="flex-row items-center">
                <Text className="mr-1 text-xl font-bold">
                  {itemDetail?.owner.numOfRatings !== undefined
                    ? Number.isInteger(itemDetail?.owner.numOfRatings)
                      ? `${itemDetail?.owner.numOfRatings}.0`
                      : itemDetail?.owner.numOfRatings
                    : "0.0"}
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
          <Text className="text-xl font-bold mb-3">Description</Text>
          <View className="mb-3">
            {itemDetail?.description.split("\\n").map((line, index) => (
              <Text className="text-lg font-normal mb-1" key={index}>
                {line}
              </Text>
            ))}
          </View>

          <Text className="text-xl font-bold mt-4 mb-3">
            Information details
          </Text>
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

        {!loading ? (
          <>
            {otherItemOfUser.length !== 0 && (
              <HorizontalSection
                title={`Bài đăng khác của ${itemDetail?.owner.fullName}`}
                data={otherItemOfUser}
                navigation={navigation}
              />
            )}

            {itemSimilar.length !== 0 && (
              <HorizontalSection
                title="Bài đăng tương tự"
                data={itemSimilar}
                navigation={navigation}
              />
            )}
          </>
        ) : (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#00b0b9" />
          </View>
        )}
      </View>
    ),
    [
      imageArray,
      renderImageItem,
      itemDetail,
      data,
      otherItemOfUser,
      itemSimilar,
      loading,
      navigation,
    ]
  );

  return (
    <>
      <SafeAreaView className="flex-1 bg-gray-100" edges={["top"]}>
        <Header title="" />
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#00b0b9" />
          </View>
        ) : (
          <>
            <FlatList
              data={[{}]}
              keyExtractor={(_, index) => index.toString()}
              renderItem={null}
              ListHeaderComponent={renderContent}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ flexGrow: 1 }}
            />
            {itemDetail?.statusItem !== StatusItem.SOLD && (
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
                    onPress={handleChat}
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
            )}
          </>
        )}
      </SafeAreaView>

      {itemDetail?.userLocation.specificAddress && (
        <LocationModal
          visible={locationVisible}
          onClose={() => setLocationVisible(false)}
          place_id={
            itemDetail.userLocation.latitude +
            "," +
            itemDetail.userLocation.longitude
          }
        />
      )}
    </>
  );
};

export default ItemDetails;
