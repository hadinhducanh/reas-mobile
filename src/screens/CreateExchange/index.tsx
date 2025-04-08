import React, { useCallback, useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/AppNavigator";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import LoadingButton from "../../components/LoadingButton";
import MatchedList from "../../components/MatchedList";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { ItemResponse } from "../../common/models/item";
import {
  defaultExchangeItem,
  useExchangeItem,
} from "../../context/ExchangeContext";
import ChooseMethodExchangeModal from "../../components/ChooseMethodExchangeModal";
import { MethodExchange } from "../../common/enums/MethodExchange";
import CalendarModal from "../../components/SchedulePicker";
import SetLocation from "../../components/SetLocation";
import ErrorModal from "../../components/ErrorModal";
import ChooseLocationModal from "../../components/ChooseLocationModal";
import ConfirmModal from "../../components/DeleteConfirmModal";
import { resetPlaceDetail } from "../../redux/slices/locationSlice";
import LocationModal from "../../components/LocationModal";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  getAllItemOfCurrentUserByStatusThunk,
  getRecommendedItemsInExchangeThunk,
} from "../../redux/thunk/itemThunks";
import { StatusItem } from "../../common/enums/StatusItem";

const CreateExchange: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, "CreateExchange">>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useDispatch<AppDispatch>();
  const { itemId } = route.params;
  const { itemDetail, itemSuggested, loading } = useSelector(
    (state: RootState) => state.item
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const hasConfirmedRef = useRef(false);
  const pendingBeforeRemoveEvent = useRef<any>(null);

  const { exchangeItem, setExchangeItem } = useExchangeItem();
  const [warningVisible, setWarningVisible] = useState(false);

  const [items, setItems] = useState<ItemResponse[]>([]);
  const item = items.find((item) => item.id === itemId);

  const [selectedItem, setSelectedItem] = useState<ItemResponse | null>(
    exchangeItem.selectedItem
  );
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(
    null
  );
  const [methodVisible, setMethodVisible] = useState(false);
  const [calendarVisible, setCalendarVisible] = useState<boolean>(false);
  const [locationVisible, setLocationVisible] = useState<boolean>(false);
  const [locationShowVisible, setLocationShowVisible] =
    useState<boolean>(false);

  const [deliveryVisible, setDeliveryVisible] = useState<boolean>(false);
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);
  const [errorTitleInput, setErrorTitleInput] = useState<string>("");
  const [errorContentInput, setErrorContentInput] = useState<string>("");
  const [errorVisible, setErrorVisible] = useState<boolean>(false);
  const [additionalNotes, setAdditionalNotes] = useState<string>(
    exchangeItem.additionalNotes
  );

  const handleSelectItem = (item: ItemResponse) => {
    const index = items.findIndex((i) => i.id === item.id);
    if (index !== -1) {
      setExchangeItem({
        ...exchangeItem,
        buyerItemId: item.id,
        selectedItem: item,
      });
      setSelectedItem(item);
      setSelectedItemIndex(index);
      setItems((prevItems) => prevItems.filter((i) => i.id !== item.id));
    }
  };

  const handleRemoveItem = () => {
    if (selectedItem !== null && selectedItemIndex !== null) {
      setItems((prevItems) => {
        const newItems = [...prevItems];
        if (selectedItemIndex > newItems.length) {
          newItems.push(selectedItem);
        } else {
          newItems.splice(selectedItemIndex, 0, selectedItem);
        }
        return newItems;
      });
    }

    setExchangeItem({
      ...exchangeItem,
      buyerItemId: 0,
      selectedItem: null,
    });
    setSelectedItem(null);
    setSelectedItemIndex(null);
  };

  const [modalVisible, setModalVisible] = useState(false);

  const handleProposeExchange = () => {
    const isRecommended = itemSuggested.some(
      (recItem) => recItem.id === exchangeItem.selectedItem?.id
    );

    if (
      (!itemDetail?.moneyAccepted && !exchangeItem.selectedItem) ||
      !exchangeItem.methodExchangeName ||
      !exchangeItem.exchangeLocation ||
      !selectedDateTime
    ) {
      Alert.alert("Invalid information", "All fields are required.");
      return;
    } else if (
      itemDetail?.moneyAccepted &&
      exchangeItem.selectedItem === null
    ) {
      setExchangeItem({
        ...exchangeItem,
        sellerItemId: itemDetail?.id!,
        paidByUserId: user?.id!,
        paidBy: user,
        exchangeDateExtend: selectedDateTime!,
        estimatePrice: itemDetail.price,
        buyerItemId: null,
      });

      navigation.navigate("ConfirmExchange");
    } else if (isRecommended || itemDetail?.desiredItem === null) {
      setExchangeItem({
        ...exchangeItem,
        sellerItemId: itemDetail?.id!,
        selectedItem: exchangeItem.selectedItem,
        paidByUserId:
          itemDetail?.price! > exchangeItem.selectedItem?.price!
            ? user?.id!
            : itemDetail?.owner.id!,
        paidBy:
          itemDetail?.price! > exchangeItem.selectedItem?.price!
            ? user
            : itemDetail?.owner!,
        exchangeDateExtend: selectedDateTime!,
        estimatePrice:
          itemDetail?.price === 0
            ? 0
            : itemDetail?.price! - exchangeItem.selectedItem?.price! < 0
            ? -(itemDetail?.price! - exchangeItem.selectedItem?.price!)
            : itemDetail?.price! - exchangeItem.selectedItem?.price!,
      });

      navigation.navigate("ConfirmExchange");
    } else {
      setModalVisible(true);
    }
  };

  const handleContinue = () => {
    setModalVisible(false);
    setExchangeItem({
      ...exchangeItem,
      sellerItemId: itemDetail?.id!,
      selectedItem: exchangeItem.selectedItem,
      paidByUserId:
        itemDetail?.price! > exchangeItem.selectedItem?.price!
          ? user?.id!
          : itemDetail?.owner.id!,
      paidBy:
        itemDetail?.price! > exchangeItem.selectedItem?.price!
          ? user
          : itemDetail?.owner!,
      exchangeDateExtend: selectedDateTime!,
      estimatePrice:
        itemDetail?.price === 0
          ? 0
          : itemDetail?.price! - exchangeItem.selectedItem?.price! < 0
          ? -(itemDetail?.price! - exchangeItem.selectedItem?.price!)
          : itemDetail?.price! - exchangeItem.selectedItem?.price!,
    });
    navigation.navigate("ConfirmExchange");
  };

  useEffect(() => {
    if (itemDetail !== null && itemDetail.desiredItem !== null) {
      dispatch(
        getRecommendedItemsInExchangeThunk({
          sellerItemId: itemDetail?.id,
          limit: 4,
        })
      );
    }
  }, [itemId]);

  useEffect(() => {
    if (itemSuggested) {
      setItems(itemSuggested);
    }
  }, [itemSuggested]);

  const formatPrice = (price: number | undefined): string => {
    return price !== undefined ? price.toLocaleString("vi-VN") : "0";
  };

  const handleSetLocation = () => {
    if (exchangeItem.methodExchangeName.length === 0) {
      setErrorVisible(true);
      setErrorTitleInput("Invalid");
      setErrorContentInput("Please choose your method exchange first.");
    } else if (
      exchangeItem.methodExchange === MethodExchange.DELIVERY &&
      user?.userLocations
    ) {
      setDeliveryVisible(true);
    } else if (
      exchangeItem.methodExchange === MethodExchange.PICK_UP_IN_PERSON
    ) {
      setLocationShowVisible(true);
    } else {
      setLocationVisible(true);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (hasConfirmedRef.current) return;

      if (
        JSON.stringify(exchangeItem) !== JSON.stringify(defaultExchangeItem)
      ) {
        pendingBeforeRemoveEvent.current = e;
        e.preventDefault();
        setWarningVisible(true);
      }
    });

    return unsubscribe;
  }, [navigation, exchangeItem]);

  const handleConfirm = async () => {
    hasConfirmedRef.current = true;
    dispatch(resetPlaceDetail());
    setWarningVisible(false);
    setExchangeItem(defaultExchangeItem);
    if (pendingBeforeRemoveEvent.current) {
      navigation.dispatch(pendingBeforeRemoveEvent.current.data.action);
    }
  };

  const handleCancel = () => {
    setWarningVisible(false);
  };

  const handleAdditionalNotes = useCallback(
    (value: string) => {
      setAdditionalNotes(value);
      setExchangeItem((prev) => ({
        ...prev,
        additionalNotes: value.trim().replace(/\n/g, "\\n"),
      }));
    },
    [setExchangeItem]
  );

  const formatExchangeDate = (exchangeDate: string): string => {
    const dt = new Date(exchangeDate);

    const formattedTime = dt.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });

    const day = dt.getDate().toString().padStart(2, "0");
    const month = (dt.getMonth() + 1).toString().padStart(2, "0");
    const year = dt.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;

    return `${formattedTime} ${formattedDate}`;
  };

  const getLocationDisplay = (): string => {
    if (exchangeItem.methodExchangeName.length === 0) {
      return "Set location";
    }

    switch (exchangeItem.methodExchange) {
      case MethodExchange.PICK_UP_IN_PERSON:
        return exchangeItem.exchangeLocation.split("//")[1] || "Set location";
      case MethodExchange.DELIVERY:
      case MethodExchange.MEET_AT_GIVEN_LOCATION:
        return exchangeItem.exchangeLocation.length !== 0
          ? exchangeItem.exchangeLocation.split("//")[1]
          : "Set location";
      default:
        return "Set location";
    }
  };

  return (
    <>
      <SafeAreaView className="flex-1 bg-[#F6F9F9]" edges={["top"]}>
        <Header title="Create exchange" showOption={false} />
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#00b0b9" />
          </View>
        ) : (
          <>
            <KeyboardAwareScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              extraScrollHeight={20}
              enableOnAndroid={true}
              keyboardShouldPersistTaps="handled"
            >
              <ScrollView className="mx-5" showsVerticalScrollIndicator={false}>
                <View className="py-5">
                  <Text className="text-lg text-gray-500 font-medium mb-1">
                    You want to exchange for:
                  </Text>
                  <View className="rounded-md p-3 flex-row items-center bg-white">
                    <View className="w-40 h-28 rounded-md ">
                      <Image
                        source={{
                          uri: itemDetail?.imageUrl.split(", ")[0],
                        }}
                        className="w-full h-full object-contain"
                        resizeMode="contain"
                      />
                    </View>

                    <View className="ml-3 flex-1">
                      <Text className="text-lg font-bold text-gray-900">
                        {itemDetail?.itemName}
                      </Text>
                      <Text className="text-gray-500 text-base my-1">
                        Listed by {itemDetail?.owner.fullName}
                      </Text>
                      <Text className="text-[#00B0B9] text-xl font-semibold">
                        {itemDetail?.price === 0
                          ? "Free"
                          : formatPrice(itemDetail?.price) + " VND"}
                      </Text>
                    </View>
                  </View>
                </View>

                <View>
                  {itemDetail?.desiredItem === null ? (
                    ""
                  ) : (
                    <MatchedList
                      items={items}
                      onSelectItem={handleSelectItem}
                    />
                  )}

                  <Pressable
                    className="flex-row justify-center items-center bg-gray-100 border-[1px] border-gray-300 px-5 py-4 rounded-lg active:bg-gray-200 mt-5"
                    onPress={() => navigation.navigate("BrowseItems")}
                  >
                    <Icon name="folder-open" size={20} />
                    <Text className="text-center text-lg text-gray-500 font-medium mx-1">
                      Browse my items
                    </Text>
                  </Pressable>

                  <View className="bg-gray-100 p-4 rounded-lg border border-gray-300 mt-10">
                    <Text className="text-gray-500 text-lg font-medium mb-2">
                      Your chosen item
                    </Text>
                    {exchangeItem.selectedItem ? (
                      <View
                        key={item?.id}
                        className="mb-3 flex-row justify-between w-full items-center bg-white rounded-lg p-3"
                      >
                        <View className="w-20 h-20 rounded-md overflow-hidden">
                          <Image
                            source={{
                              uri: exchangeItem.selectedItem.imageUrl.split(
                                ", "
                              )[0],
                            }}
                            className="w-full h-full object-contain"
                            resizeMode="contain"
                          />
                        </View>
                        <Text
                          className="text-gray-700 text-lg mx-3 font-medium flex-1"
                          numberOfLines={1}
                          ellipsizeMode="tail"
                          style={{ flexShrink: 1 }}
                        >
                          {exchangeItem.selectedItem.itemName}
                        </Text>

                        <View className="flex-1">
                          <LoadingButton
                            title="Remove"
                            onPress={handleRemoveItem}
                            buttonClassName="border-2 border-[#00B0B9] py-3 px-5 bg-white"
                            textColor="text-[#00B0B9]"
                          />
                        </View>
                      </View>
                    ) : (
                      <View className="py-10">
                        <Text className="text-gray-300 text-center text-base mb-1">
                          Please add an item you want to exchange
                        </Text>
                        <Text className="text-gray-300 text-center text-base">
                          (optional for free exchange)
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                <View className="mt-8">
                  <Text className="font-bold text-lg text-gray-500">
                    Exchange Details
                  </Text>

                  <View className="bg-white mt-2 rounded-lg p-4">
                    <View className="items-center flex-row justify-between mb-3">
                      <Text className="text-base text-gray-500">Method</Text>
                      <Pressable onPress={() => setMethodVisible(true)}>
                        <Text
                          className={`text-right text-base text-[#00b0b9] underline font-normal`}
                        >
                          {exchangeItem.methodExchangeName.length !== 0
                            ? exchangeItem.methodExchangeName
                            : "Choose your method"}
                        </Text>
                      </Pressable>
                    </View>
                    <View className="items-center flex-row justify-between mb-3">
                      <Text className="text-base text-gray-500">Type</Text>
                      <Text className="text-right text-base text-[#00b0b9] font-normal">
                        {itemDetail?.desiredItem === null
                          ? "Open"
                          : "Open with desired item"}
                      </Text>
                    </View>

                    <View className="items-center flex-row justify-between mb-3">
                      <Text className="text-base text-gray-500 w-1/2">
                        Meeting location
                      </Text>
                      <Pressable
                        className="flex-row items-center w-1/2 justify-end"
                        onPress={handleSetLocation}
                      >
                        <Icon
                          name="location-outline"
                          size={20}
                          color="#00B0B9"
                        />
                        <Text
                          className="text-base underline text-[#00b0b9] font-normal "
                          numberOfLines={1}
                        >
                          {getLocationDisplay()}
                        </Text>
                      </Pressable>
                    </View>

                    <View className="items-center flex-row justify-between">
                      <Text className="text-base text-gray-500">
                        Date & Time
                      </Text>
                      <Pressable
                        className="flex-row items-center justify-end"
                        onPress={() => setCalendarVisible(true)}
                      >
                        <Icon
                          name="calendar-clear-outline"
                          size={20}
                          color="#00B0B9"
                        />
                        <Text className="ml-2 underline text-[#00B0B9] font-normal text-base">
                          {selectedDateTime
                            ? formatExchangeDate(selectedDateTime.toISOString())
                            : "Choose Schedule"}
                        </Text>
                      </Pressable>
                    </View>

                    {itemDetail?.moneyAccepted && (
                      <Text
                        className="text-gray-500 font-semibold text-right mt-5"
                        style={{ fontStyle: "italic" }}
                      >
                        *Accept exchange with cash
                      </Text>
                    )}
                  </View>
                </View>

                <View className="my-5">
                  <Text className="font-bold text-lg text-gray-500">
                    Note (Optional)
                  </Text>

                  <View className="w-full h-40 bg-white rounded-lg mt-4 px-5 py-3">
                    <TextInput
                      className="flex-1 text-base font-normal text-gray-500"
                      placeholder="Aaaaa"
                      placeholderTextColor="#d1d5db"
                      multiline={true}
                      textAlignVertical="top"
                      value={additionalNotes}
                      onChangeText={(text) => handleAdditionalNotes(text)}
                    />
                  </View>
                </View>
              </ScrollView>
            </KeyboardAwareScrollView>

            <View
              className={`${
                Platform.OS === "ios" ? "pt-4 pb-7" : "py-3"
              } px-5 bg-white mt-auto rounded-t-xl flex-row items-center`}
            >
              <LoadingButton
                buttonClassName="p-4"
                title="Propose exchange"
                onPress={handleProposeExchange}
              />
            </View>
          </>
        )}
      </SafeAreaView>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          className="flex-1 bg-[rgba(0,0,0,0.2)]"
          onPress={() => setModalVisible(false)}
        >
          <View className="absolute inset-0 justify-center items-center">
            <View className="w-[80%] bg-white rounded-md p-5">
              <Text className="text-[#00B0B9] text-2xl font-bold mb-2 text-center">
                Warning
              </Text>
              <Text className="text-gray-500 mb-4 text-xl text-center">
                This item is not in the desired list. The exchange might be less
                likely to be accepted.
              </Text>

              <View className="flex-row justify-between mt-2 mx-3">
                <View className="flex-1 mr-2">
                  <LoadingButton
                    title="Cancel"
                    onPress={() => setModalVisible(false)}
                    buttonClassName="p-4 bg-white border-2 border-[#00B0B9]"
                    textColor="text-[#00B0B9]"
                  />
                </View>
                <View className="flex-1">
                  <LoadingButton
                    title="Continue"
                    onPress={handleContinue}
                    buttonClassName="p-4 border-2 border-transparent"
                  />
                </View>
              </View>
            </View>
          </View>
        </Pressable>
      </Modal>

      <ChooseMethodExchangeModal
        methods={itemDetail?.methodExchanges ?? []}
        visible={methodVisible}
        onCancel={() => setMethodVisible(false)}
      />

      <ErrorModal
        title={errorTitleInput}
        content={errorContentInput}
        visible={errorVisible}
        onCancel={() => setErrorVisible(false)}
      />

      <ChooseLocationModal
        locations={user?.userLocations || []}
        visible={deliveryVisible}
        onCancel={() => setDeliveryVisible(false)}
      />

      {itemDetail?.userLocation.specificAddress && (
        <LocationModal
          visible={locationShowVisible}
          onClose={() => setLocationShowVisible(false)}
          place_id={
            itemDetail.userLocation.latitude +
            "," +
            itemDetail.userLocation.longitude
          }
        />
      )}

      <SetLocation
        visible={locationVisible}
        onCancel={() => setLocationVisible(false)}
      />

      <CalendarModal
        visible={calendarVisible}
        onClose={() => setCalendarVisible(false)}
        onSelectDateTime={(date) => setSelectedDateTime(date)}
      />

      <ConfirmModal
        title="Warning"
        content={`You have unsaved item. ${"\n"} Do you really want to leave?`}
        visible={warningVisible}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
    </>
  );
};

export default CreateExchange;
