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
import { RootStackParamList } from "../../../navigation/AppNavigator";
import Header from "../../../components/Header";
import LoadingButton from "../../../components/LoadingButton";
import ConfirmModal from "../../../components/DeleteConfirmModal";
import { ConditionItem } from "../../../common/enums/ConditionItem";
import { MethodExchange } from "../../../common/enums/MethodExchange";
import LocationModal from "../../../components/LocationModal";
import {
  addToFavoriteThunk,
  deleteFromFavoriteThunk,
} from "../../../redux/thunk/favoriteThunk";
import {
  resetExtendFree,
  resetItemDetailState,
  resetItemUpdateInExchange,
} from "../../../redux/slices/itemSlice";
import {
  changeItemStatusThunk,
  deleteItemThunk,
  extendItemForFreeThunk,
  getItemDetailThunk,
  isUpdatedItemInPendingExchangeThunk,
} from "../../../redux/thunk/itemThunks";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { StatusItem } from "../../../common/enums/StatusItem";
import { TypeItem } from "../../../common/enums/TypeItem";
import { getCurrentSubscriptionThunk } from "../../../redux/thunk/subscriptionThunks";
import ImagePreviewModal from "../../../components/ImagePreviewModal";
import ErrorModal from "../../../components/ErrorModal";

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

const statusStyles: Record<
  StatusItem,
  { textColor: string; backgroundColor: string }
> = {
  AVAILABLE: {
    textColor: "text-[#16A34A]",
    backgroundColor: "bg-[rgba(22,163,74,0.2)]",
  },
  EXPIRED: {
    textColor: "text-[#D067BD]",
    backgroundColor: "bg-[rgba(208,103,189,0.2)]",
  },
  REJECTED: {
    textColor: "text-[#FA5555]",
    backgroundColor: "bg-[rgba(250,85,85,0.2)]",
  },
  PENDING: {
    textColor: "text-[#00b0b9]",
    backgroundColor: "bg-[rgba(0,176,185,0.2)]",
  },
  NO_LONGER_FOR_EXCHANGE: {
    textColor: "text-[#748BA0]",
    backgroundColor: "bg-[rgba(116,139,160,0.2)]",
  },
  EXCHANGED: {
    textColor: "text-[#B2B200]",
    backgroundColor: "bg-[rgba(205,205,0,0.3)]",
  },
  IN_EXCHANGE: {
    textColor: "text-[#FFA43D]",
    backgroundColor: "bg-[rgba(255,164,61,0.4)]",
  },
};

const statusItems = [
  { label: "AVAILABLE", value: StatusItem.AVAILABLE },
  { label: "EXPIRED", value: StatusItem.EXPIRED },
  { label: "DEACTIVATED", value: StatusItem.NO_LONGER_FOR_EXCHANGE },
  { label: "PENDING", value: StatusItem.PENDING },
  { label: "REJECTED", value: StatusItem.REJECTED },
  { label: "EXCHANGED", value: StatusItem.EXCHANGED },
  { label: "IN EXCHANGE", value: StatusItem.IN_EXCHANGE },
];

const ItemExpire: React.FC = () => {
  const [deletedVisible, setDeletedVisible] = useState(false);
  const [deactivateVisible, setDeactivateVisible] = useState(false);
  const [extendFreeVisible, setExtendFreeVisible] = useState(false);
  const [reOpenVisible, setReOpenVisible] = useState(false);

  const route = useRoute<RouteProp<RootStackParamList, "ItemDetails">>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { itemId } = route.params;
  const dispatch = useDispatch<AppDispatch>();
  const {
    itemDetail,
    itemSimilar,
    otherItemOfUser,
    itemUpdateInExchange,
    extendFree,
    loading,
  } = useSelector((state: RootState) => state.item);
  const { currentPlan } = useSelector((state: RootState) => state.subscription);
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const [isFavorite, setIsFavorite] = useState(itemDetail?.favorite);
  const [locationVisible, setLocationVisible] = useState<boolean>(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  const [title, setTitle] = useState<string>("");

  const statusStyle = itemDetail?.statusItem
    ? statusStyles[itemDetail.statusItem] || {
        textColor: "text-gray-500",
        backgroundColor: "bg-gray-200",
      }
    : { textColor: "text-gray-500", backgroundColor: "bg-gray-200" };

  const getConditionItemLabel = (status: ConditionItem | undefined): string => {
    const found = conditionItems.find((item) => item.value === status);
    return found ? found.label : "";
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

  const getTypeItemLabel = (status: TypeItem | undefined): string => {
    const found = typeItems.find((item) => item.value === status);
    return found ? found.name : "";
  };

  const getStatusItemLabel = (status: StatusItem | undefined): string => {
    const found = statusItems.find((item) => item.value === status);
    return found ? found.label : "";
  };

  const formatPrice = (price: number | undefined): string => {
    return price !== undefined ? price.toLocaleString("vi-VN") : "0";
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

  const dataDesired = useMemo(() => {
    const desired = itemDetail?.desiredItem;
    if (!desired) {
      return [];
    }

    const allFields = [
      {
        label: "Condition",
        value: getConditionItemLabel(desired.conditionItem),
      },
      {
        label: "Type",
        value: getTypeItemLabel(desired.typeItem),
      },
      { label: "Category", value: desired.categoryName },
      { label: "Brand", value: desired.brandName },
      {
        label: "Min price",
        value:
          desired.minPrice != null
            ? `${formatPrice(desired.minPrice)} VND`
            : "",
      },
      {
        label: "Max price",
        value:
          desired.maxPrice != null
            ? `${formatPrice(desired.maxPrice)} VND`
            : "",
      },
      { label: "Description", value: desired.description },
    ];

    return allFields.filter(({ value }) => value != null && value !== "");
  }, [itemDetail]);

  const imageArray = useMemo(() => {
    return itemDetail?.imageUrl ? itemDetail.imageUrl.split(", ") : [];
  }, [itemDetail?.imageUrl]);

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

  const formatExchangeDate = (exchangeDate: string): string => {
    const dt = new Date(exchangeDate);

    const day = dt.getDate().toString().padStart(2, "0");
    const month = (dt.getMonth() + 1).toString().padStart(2, "0");
    const year = dt.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;

    return formattedDate;
  };

  useFocusEffect(
    useCallback(() => {
      dispatch(getCurrentSubscriptionThunk());
      dispatch(resetItemDetailState());
      dispatch(getItemDetailThunk(itemId));
    }, [dispatch, itemId])
  );

  const handleFavoritePress = useCallback(() => {
    if (!accessToken) {
      navigation.navigate("SignIn");
      return;
    }
    if (itemDetail) {
      setIsFavorite((prev) => !prev);
      if (isFavorite) {
        dispatch(deleteFromFavoriteThunk(itemDetail?.id));
      } else {
        dispatch(addToFavoriteThunk(itemDetail?.id));
      }
    }
  }, [accessToken, dispatch, itemId, isFavorite, navigation]);

  const handleUpdate = async () => {
    if (itemDetail) {
      const response = await dispatch(
        isUpdatedItemInPendingExchangeThunk(itemDetail?.id)
      ).unwrap();
      if (response) {
        dispatch(resetItemUpdateInExchange());
        setTitle("Invalid");
        setContent(
          "This item is currently in exchange. Please try again later."
        );
        setVisible(true);
        return;
      } else {
        dispatch(resetItemUpdateInExchange());
        navigation.navigate("UpdateItem", { screen: "UpdateItemScreen" });
      }
    }
  };

  const handleExtend = async () => {
    navigation.navigate("ExtendItemPlan");
  };

  const handleExtendFree = async () => {
    setExtendFreeVisible(true);
  };

  const handleDeactivate = async () => {
    setDeactivateVisible(true);
  };

  const handleDelete = async () => {
    setDeletedVisible(true);
  };

  const handleReOpen = async () => {
    setReOpenVisible(true);
  };

  const handleCancelDelete = () => {
    setDeletedVisible(false);
  };

  const handleConfirmDelete = async () => {
    if (!itemDetail) return;

    try {
      const result = await dispatch(deleteItemThunk(itemDetail?.id)).unwrap();

      if (result) {
        setDeletedVisible(false);
        navigation.goBack();
      }
    } catch (error) {
      console.error("Could not delete item:", error);
    }
  };

  const handleCancelDeactivate = () => {
    setDeactivateVisible(false);
  };

  const handleConfirmDeactivate = async () => {
    if (!itemDetail) return;

    try {
      const result = await dispatch(
        changeItemStatusThunk({
          itemId: itemDetail?.id,
          statusItem: StatusItem.NO_LONGER_FOR_EXCHANGE,
        })
      ).unwrap();

      if (result) {
        setDeactivateVisible(false);
        navigation.goBack();
      }
    } catch (error) {
      console.error("Could not deactivate item:", error);
    }
  };

  const handleCancelReOpen = () => {
    setReOpenVisible(false);
  };

  const handleConfirmReOpen = async () => {
    if (!itemDetail) return;

    try {
      const result = await dispatch(
        changeItemStatusThunk({
          itemId: itemDetail.id,
          statusItem: StatusItem.AVAILABLE,
        })
      ).unwrap();

      if (result) {
        setReOpenVisible(false);
        navigation.goBack();
      }
    } catch (error) {
      console.error("Could not reopen item:", error);
    }
  };

  const handleCancelExtendFree = () => {
    setExtendFreeVisible(false);
  };

  const handleConfirmExtendFree = async () => {
    if (itemDetail) {
      await dispatch(extendItemForFreeThunk(itemId)).unwrap();
      setExtendFreeVisible(false);
    }
  };

  useEffect(() => {
    if (extendFree) {
      dispatch(resetExtendFree());
      navigation.goBack();
    }
  }, [extendFree]);

  const renderImageItem = useCallback(
    ({ item: image, index }: { item: string; index: number }) => (
      <TouchableOpacity
        onPress={() => {
          setSelectedIndex(index);
          setImageModalVisible(true);
        }}
      >
        <View className="relative" style={{ width: width }}>
          <View className={`w-[${width}] h-96 bg-white`}>
            <Image
              source={{ uri: image }}
              className="w-full h-full"
              resizeMode="contain"
            />
          </View>
        </View>
      </TouchableOpacity>
    ),
    [handleFavoritePress, isFavorite]
  );

  const imageUrls = itemDetail?.imageUrl
    ? itemDetail?.imageUrl.split(", ")
    : [];

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
          <View className="flex-row justify-between items-center">
            <Text className="text-2xl font-bold text-gray-900">
              {itemDetail?.itemName}
            </Text>
          </View>

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
              *Accept exchange with cash
            </Text>
          )}

          <View className="mt-3">
            <Text
              className={`text-[13px] font-medium ${statusStyle.textColor} ${statusStyle.backgroundColor} rounded-full py-1 px-3 self-start`}
            >
              {getStatusItemLabel(itemDetail?.statusItem)}
            </Text>
            <Pressable onPress={() => setLocationVisible(true)}>
              <View className="flex flex-row items-center mt-3">
                <Icon name="location-outline" size={25} color="black" />
                <Text
                  className="ml-1 text-gray-500 text-lg underline w-10/12"
                  numberOfLines={1}
                >
                  {itemDetail?.userLocation.specificAddress}
                </Text>
              </View>
            </Pressable>

            {itemDetail?.expiredTime &&
              itemDetail.statusItem === StatusItem.AVAILABLE && (
                <View className="flex flex-row items-center mt-2">
                  <Icon name="time-outline" size={25} color="black" />
                  <Text className="ml-1 text-gray-500 text-lg font-semibold">
                    Expire: {formatExchangeDate(itemDetail?.expiredTime)}
                  </Text>
                </View>
              )}

            {itemDetail?.approvedTime && (
              <View className="flex flex-row items-center mt-2">
                <Icon name="time-outline" size={25} color="black" />
                <Text className="ml-1 text-gray-500 text-lg">
                  Approved {formatRelativeTime(itemDetail?.approvedTime)}
                </Text>
              </View>
            )}
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
                  Items:{" "}
                  <Text className="underline text-black">
                    {itemDetail?.owner.numOfExchangedItems} exchange
                  </Text>
                </Text>
                <View className="flex-row items-center">
                  <Text className="text-gray-500">
                    Participant:{" "}
                    {formatRelativeTime(itemDetail?.owner.creationDate)}
                  </Text>
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
                {itemDetail?.owner.numOfFeedbacks} feedbacks
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

          {itemDetail?.desiredItem && (
            <>
              <Text className="text-xl font-bold mt-4 mb-3">Desired item</Text>
              <View className="border border-gray-300 rounded-md overflow-hidden">
                {dataDesired.map((info, index) => (
                  <View key={index}>
                    {info.label === "Description" ? (
                      <View
                        key={index}
                        className="flex-row border-b border-gray-300"
                      >
                        <View className="w-[40%] px-2 py-4 bg-gray-200">
                          <Text className="text-base font-semibold text-gray-500">
                            {info.label}
                          </Text>
                        </View>
                        <View className="px-2 py-4 flex-1">
                          {info.value.split("\\n").map((line, index) => (
                            <Text className="text-base mb-0.5" key={index}>
                              {line}
                            </Text>
                          ))}
                        </View>
                      </View>
                    ) : (
                      <View
                        key={index}
                        className="flex-row border-b border-gray-300"
                      >
                        <View className="w-[40%] px-2 py-4 bg-gray-200">
                          <Text className="text-base font-semibold text-gray-500">
                            {info.label}
                          </Text>
                        </View>
                        <View className="px-2 py-4 flex-1">
                          <Text className="text-base">{info.value}</Text>
                        </View>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </>
          )}

          {itemDetail?.termsAndConditionsExchange && (
            <View className="mt-5">
              <Text className="text-xl font-semibold mb-1">
                Terms and conditions:
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
        <Header title="" showOption={false} />
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
            <View
              className={`${
                Platform.OS === "ios" ? "pt-4 pb-7" : "py-5"
              } px-5 bg-white rounded-t-xl flex-row items-center`}
            >
              {itemDetail?.statusItem !== StatusItem.REJECTED &&
                itemDetail?.statusItem !== StatusItem.EXCHANGED &&
                itemDetail?.statusItem !== StatusItem.IN_EXCHANGE && (
                  <>
                    {itemDetail?.statusItem === StatusItem.EXPIRED ? (
                      <View className="flex-1 mr-2">
                        <LoadingButton
                          title={
                            currentPlan &&
                            currentPlan?.numberOfFreeExtensionLeft !== 0
                              ? "Extend free"
                              : "Extend"
                          }
                          onPress={
                            currentPlan &&
                            currentPlan?.numberOfFreeExtensionLeft !== 0
                              ? handleExtendFree
                              : handleExtend
                          }
                          buttonClassName="p-3 border-[#00B0B9] border-2 bg-white"
                          iconName="time-outline"
                          iconSize={25}
                          iconColor="#00B0B9"
                          showIcon={true}
                          textColor="text-[#00B0B9]"
                        />
                      </View>
                    ) : itemDetail?.statusItem ===
                      StatusItem.NO_LONGER_FOR_EXCHANGE ? (
                      <>
                        <View className="flex-1 mr-2">
                          <LoadingButton
                            title="Re-Open"
                            onPress={handleReOpen}
                            buttonClassName="p-3 border-[#00B0B9] border-2"
                            iconName="refresh-outline"
                            iconSize={25}
                            iconColor="white"
                            showIcon={true}
                          />
                        </View>
                        <View className="flex-1">
                          <LoadingButton
                            title="Delete"
                            onPress={handleDelete}
                            buttonClassName="p-3 border-transparent border-2 bg-[rgba(250,85,85)] active:bg-[rgba(250,85,85,0.5)]"
                            iconName="trash-outline"
                            iconSize={25}
                            iconColor="white"
                            showIcon={true}
                            textColor="text-white"
                          />
                        </View>
                      </>
                    ) : itemDetail?.statusItem === StatusItem.PENDING ? (
                      <>
                        <View className="flex-1 mr-2">
                          <LoadingButton
                            title="Update"
                            onPress={handleUpdate}
                            buttonClassName="p-3 border-[#00B0B9] border-2"
                            iconName="reader-outline"
                            iconSize={25}
                            iconColor="white"
                            showIcon={true}
                          />
                        </View>
                        <View className="flex-1">
                          <LoadingButton
                            title="Delete"
                            onPress={handleDelete}
                            buttonClassName="p-3 border-transparent border-2 bg-[rgba(250,85,85)] active:bg-[rgba(250,85,85,0.5)]"
                            iconName="trash-outline"
                            iconSize={25}
                            iconColor="white"
                            showIcon={true}
                            textColor="text-white"
                          />
                        </View>
                      </>
                    ) : (
                      <>
                        <View className="flex-1 mr-2">
                          <LoadingButton
                            title="Update"
                            onPress={handleUpdate}
                            buttonClassName="p-3 border-[#00B0B9] border-2"
                            iconName="reader-outline"
                            iconSize={25}
                            iconColor="white"
                            showIcon={true}
                          />
                        </View>
                        <View className="flex-1">
                          <LoadingButton
                            title="Deactivate"
                            onPress={handleDeactivate}
                            buttonClassName="p-3 border-transparent border-2 bg-[rgba(250,85,85)] active:bg-[rgba(250,85,85,0.5)]"
                            iconName="trash-outline"
                            iconSize={25}
                            iconColor="white"
                            showIcon={true}
                            textColor="text-white"
                          />
                        </View>
                      </>
                    )}
                  </>
                )}
            </View>
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

      <ErrorModal
        content={content}
        title={title}
        visible={visible}
        onCancel={() => setVisible(false)}
      />

      <ImagePreviewModal
        visible={imageModalVisible}
        onClose={() => setImageModalVisible(false)}
        initialIndex={selectedIndex}
        imageUrls={imageUrls}
      />

      <ConfirmModal
        title="Confirm deactivate"
        content="Are you sure to deactivate this item?"
        visible={deactivateVisible}
        onCancel={handleCancelDeactivate}
        onConfirm={handleConfirmDeactivate}
      />

      <ConfirmModal
        title="Confirm delete"
        content="Are you sure to delete this item?"
        visible={deletedVisible}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />

      <ConfirmModal
        title="Confirm extend"
        content={`You have ${
          currentPlan?.numberOfFreeExtensionLeft
        } extend free ${"\n"} Are you sure to extend this item?`}
        visible={extendFreeVisible}
        onCancel={handleCancelExtendFree}
        onConfirm={handleConfirmExtendFree}
      />

      <ConfirmModal
        title="Confirm reopen"
        content="Are you sure to reopen this item?"
        visible={reOpenVisible}
        onCancel={handleCancelReOpen}
        onConfirm={handleConfirmReOpen}
      />
    </>
  );
};

export default ItemExpire;
