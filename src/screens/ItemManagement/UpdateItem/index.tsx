import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useDispatch, useSelector } from "react-redux";
import { RootStackParamList } from "../../../navigation/AppNavigator";
import { AppDispatch, RootState } from "../../../redux/store";
import { uploadToCloudinary } from "../../../utils/CloudinaryImageUploader";
import { TypeExchange } from "../../../common/enums/TypeExchange";
import { updateItemThunk } from "../../../redux/thunk/itemThunks";
import Header from "../../../components/Header";
import ChooseImage from "../../../components/ChooseImage";
import NavigationListItem from "../../../components/NavigationListItem";
import Toggle from "../../../components/Toggle";
import Icon from "react-native-vector-icons/MaterialIcons";
import LoadingButton from "../../../components/LoadingButton";
import ConfirmModal from "../../../components/DeleteConfirmModal";
import { ConditionItem } from "../../../common/enums/ConditionItem";
import { MethodExchange } from "../../../common/enums/MethodExchange";
import { TypeItem } from "../../../common/enums/TypeItem";
import { resetItemDetailState } from "../../../redux/slices/itemSlice";
import { PlaceDetail } from "../../../common/models/location";
import LocationService from "../../../services/LocationService";
import {
  resetLocation,
  setUserLocationIdState,
  setUserPlaceIdState,
} from "../../../redux/slices/userSlice";
import { DesiredItemDto } from "../../../common/models/item";
import {
  defaultUpdateItem,
  useUpdateItem,
} from "../../../context/UpdateItemContext";
import ErrorModal from "../../../components/ErrorModal";

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

export default function UpdateItem() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { user } = useSelector((state: RootState) => state.auth);
  const { userLocationId } = useSelector((state: RootState) => state.user);
  const { itemDetail, loading, itemUpdate } = useSelector(
    (state: RootState) => state.item
  );
  const dispatch = useDispatch<AppDispatch>();
  const { updateItem, setUpdateItem } = useUpdateItem();

  const [isCheckedFree, setIsCheckedFree] = useState<boolean>(
    updateItem.isCheckedFree
  );
  const [isMoneyAccepted, setIsMoneyAccepted] = useState(
    updateItem.isMoneyAccepted
  );
  const [price, setPrice] = useState<string>(
    updateItem.price === null ? "" : updateItem.price.toString()
  );
  const [itemName, setItemName] = useState<string>(updateItem.itemName);
  const [description, setDescription] = useState<string>(
    updateItem.description
  );
  const [termCondition, setTermCondition] = useState<string>(
    updateItem.termsAndConditionsExchange || ""
  );
  const [images, setImages] = useState<string>(updateItem.imageUrl);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [exitVisible, setExitVisible] = useState(false);
  const [locationDetail, setLocationDetail] = useState<PlaceDetail>();

  const [visible, setVisible] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  const [title, setTitle] = useState<string>("");

  const pendingBeforeRemoveEvent = useRef<any>(null);
  const hasConfirmedRef = useRef(false);

  const initialData = useRef<{
    id: number;
    itemName: string;
    description: string;
    price: number;
    conditionItem: ConditionItem;
    imageUrl: string;
    methodExchanges: MethodExchange[];
    isMoneyAccepted: boolean;
    termsAndConditionsExchange: string | null;
    categoryId: number;
    brandId: number;
    desiredItem?: DesiredItemDto | null;
    userLocationId: number;
  }>({
    id: 0,
    itemName: "",
    description: "",
    price: 0,
    conditionItem: ConditionItem.NO_CONDITION,
    imageUrl: "",
    methodExchanges: [],
    isMoneyAccepted: false,
    termsAndConditionsExchange: "",
    categoryId: 0,
    brandId: 0,
    desiredItem: null,
    userLocationId: 0,
  });

  useEffect(() => {
    if (itemDetail) {
      const isDesiredItemPresent = !!itemDetail.desiredItem;
      const typeExchangeValue = isDesiredItemPresent
        ? TypeExchange.EXCHANGE_WITH_DESIRED_ITEM
        : TypeExchange.OPEN_EXCHANGE;

      initialData.current = {
        id: itemDetail.id,
        itemName: itemDetail.itemName || "",
        description: itemDetail.description || "",
        price: itemDetail.price || 0,
        conditionItem: itemDetail.conditionItem,
        imageUrl: itemDetail.imageUrl,
        methodExchanges: itemDetail.methodExchanges,
        isMoneyAccepted: itemDetail.moneyAccepted,
        termsAndConditionsExchange: itemDetail.termsAndConditionsExchange,
        categoryId: itemDetail.category.id,
        brandId: itemDetail.brand.id,
        desiredItem: itemDetail.desiredItem
          ? { ...itemDetail.desiredItem }
          : null,
        userLocationId: itemDetail.userLocation.id,
      };

      setPrice(itemDetail.price?.toString() || "");
      setItemName(itemDetail.itemName || "");
      setDescription(itemDetail.description?.replace(/\\n/g, "\n") || "");
      setTermCondition(
        itemDetail.termsAndConditionsExchange
          ? itemDetail.termsAndConditionsExchange.replace(/\\n/g, "\n")
          : ""
      );
      setImages(itemDetail.imageUrl || "");
      setIsCheckedFree(itemDetail.price === 0);
      setIsMoneyAccepted(itemDetail.moneyAccepted || false);

      const updateItem = {
        price: itemDetail.price || 0,
        itemName: itemDetail.itemName || "",
        description: itemDetail.description || "",
        termsAndConditionsExchange:
          itemDetail.termsAndConditionsExchange || null,
        imageUrl: itemDetail.imageUrl || "",
        isCheckedFree: itemDetail.price === 0,
        isMoneyAccepted: itemDetail.moneyAccepted || false,
        brandName: itemDetail.brand.brandName || "",
        brandId: itemDetail.brand.id || 0,
        conditionItem: itemDetail.conditionItem,
        conditionItemName: getConditionItemLabel(itemDetail.conditionItem),
        methodExchanges: itemDetail.methodExchanges || [],
        methodExchangeName: getMethodExchangeLabel(itemDetail.methodExchanges),
        typeItem: itemDetail.typeItem,
        categoryName: itemDetail.category.categoryName || "",
        categoryId: itemDetail.category.id || 0,
        desiredItem: isDesiredItemPresent
          ? {
              categoryId: itemDetail.desiredItem.categoryId ?? null,
              conditionItem: itemDetail.desiredItem.conditionItem ?? null,
              brandId: itemDetail.desiredItem.brandId ?? null,
              minPrice: itemDetail.desiredItem.minPrice ?? 0,
              maxPrice: itemDetail.desiredItem.maxPrice ?? null,
              description: itemDetail.desiredItem.description || "",
            }
          : null,
        typeItemDesire: isDesiredItemPresent
          ? itemDetail.desiredItem.typeItem
          : TypeItem.NO_TYPE,
        conditionDesiredItemName: isDesiredItemPresent
          ? getConditionItemLabel(itemDetail.desiredItem.conditionItem)
          : "",
        brandDesiredItemName: isDesiredItemPresent
          ? itemDetail.desiredItem.brandName ?? ""
          : "",
        categoryDesiredItemName: isDesiredItemPresent
          ? itemDetail.desiredItem.categoryName ?? ""
          : "",
        typeExchange: typeExchangeValue,
        userLocationId: itemDetail.userLocation.id,
      };

      setUpdateItem(updateItem);
    }
  }, [itemDetail, setUpdateItem]);

  useEffect(() => {
    const fetchLocationDetails = async () => {
      if (user && user.userLocations && user.userLocations.length) {
        let targetLocation = null;

        if (userLocationId !== 0) {
          targetLocation = user.userLocations.find(
            (loc) => loc.id === userLocationId
          );
        } else {
          targetLocation = itemDetail?.userLocation;
        }

        if (targetLocation) {
          try {
            const details =
              await LocationService.getPlaceDetailsByReverseGeocode(
                `${targetLocation.latitude},${targetLocation.longitude}`
              );
            setLocationDetail(details);
            dispatch(setUserPlaceIdState(details.place_id));
            if (userLocationId === 0) {
              dispatch(setUserLocationIdState(targetLocation.id));
            }
          } catch (error) {
            console.error("Error fetching location details:", error);
          }
        }
      }
    };

    fetchLocationDetails();
  }, [user?.userLocations, itemDetail, userLocationId, dispatch]);

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

  const handleFieldChange = useCallback(
    (
      field:
        | "price"
        | "itemName"
        | "description"
        | "termsAndConditionsExchange",
      value: string
    ) => {
      if (field === "price") {
        const priceValue = parseInt(value.replace(/,/g, ""), 10) || 0;
        setPrice(value);
        setUpdateItem((prev) => ({ ...prev, price: priceValue }));
      } else {
        if (field === "itemName") setItemName(value);
        else if (field === "description") setDescription(value);
        else if (field === "termsAndConditionsExchange")
          setTermCondition(value);
        setUpdateItem((prev) => ({
          ...prev,
          [field]: value.trim().replace(/\n/g, "\\n"),
        }));
      }
    },
    [setUpdateItem]
  );

  const formatPrice = useCallback((value: string): string => {
    const numericValue = value.replace(/\D/g, "");
    return numericValue
      ? parseInt(numericValue, 10).toLocaleString("en-US")
      : "";
  }, []);

  const processImages = useCallback(async (): Promise<string> => {
    const imageArray = images.split(", ").filter((img) => img.trim() !== "");
    const uploadedUrls = await Promise.all(
      imageArray.map(async (uri) => await uploadToCloudinary(uri, user?.email))
    );
    const validUrls = uploadedUrls.filter((url) => url);
    return validUrls.join(", ");
  }, [images, uploadToCloudinary, user?.email]);

  const handleUpdateItem = useCallback(async () => {
    setConfirmVisible(false);

    const arraysEqual = (a: any[], b: any[]) =>
      a.length === b.length && a.every((val, idx) => val === b[idx]);

    const compareDesiredItems = (
      a: DesiredItemDto | null | undefined,
      b: DesiredItemDto | null | undefined
    ) => {
      if (a === undefined || a === null) {
        return b === undefined || b === null;
      }
      if (b === undefined || b === null) {
        return false;
      }

      return (
        a.categoryId === b.categoryId &&
        a.conditionItem === b.conditionItem &&
        a.brandId === b.brandId &&
        a.minPrice === b.minPrice &&
        a.maxPrice === b.maxPrice &&
        a.description === b.description
      );
    };

    const {
      id: initId,
      itemName: initName,
      description: initDescription,
      price: initPrice,
      conditionItem: initConditionItem,
      imageUrl: initImageUrl,
      methodExchanges: initMethodExchanges,
      isMoneyAccepted: initMoneyAccept,
      termsAndConditionsExchange: initTermsAndCondition,
      categoryId: initCategoryId,
      brandId: initBrandId,
      desiredItem: initDesiredItem,
      userLocationId: initUserLoc,
    } = initialData.current;

    const hasChanged =
      itemDetail?.id !== initId ||
      updateItem.itemName !== initName ||
      updateItem.description !== initDescription.replace(/\\n/g, "\n") ||
      updateItem.price !== initPrice ||
      updateItem.conditionItem !== initConditionItem ||
      updateItem.imageUrl !== initImageUrl ||
      !arraysEqual(updateItem.methodExchanges, initMethodExchanges) ||
      updateItem.isMoneyAccepted !== initMoneyAccept ||
      updateItem.termsAndConditionsExchange !== initTermsAndCondition ||
      updateItem.categoryId !== initCategoryId ||
      updateItem.brandId !== initBrandId ||
      !compareDesiredItems(updateItem.desiredItem, initDesiredItem) ||
      userLocationId !== initUserLoc;

    if (!hasChanged) {
      hasConfirmedRef.current = true;
      navigation.reset({
        index: 0,
        routes: [
          {
            name: "MainTabs",
            state: { routes: [{ name: "Items" }] },
          },
        ],
      });
      return;
    }

    setIsUploadingImages(true);
    const processedImages = await processImages();
    setIsUploadingImages(false);

    setImages(processedImages);
    setUpdateItem((prev) => ({ ...prev, imageUrl: processedImages }));

    if (updateItem.desiredItem?.categoryId !== 0) {
      setUpdateItem((prev) => ({
        ...prev,
        typeExchange: TypeExchange.EXCHANGE_WITH_DESIRED_ITEM,
      }));
    }

    const updateItemRequest = {
      id: itemDetail?.id!,
      itemName: updateItem.itemName.trim(),
      description: updateItem.description.trim(),
      price: updateItem.price === null ? 0 : updateItem.price,
      conditionItem: updateItem.conditionItem,
      imageUrl: processedImages,
      methodExchanges: updateItem.methodExchanges,
      isMoneyAccepted: updateItem.isMoneyAccepted,
      termsAndConditionsExchange:
        updateItem.termsAndConditionsExchange &&
        updateItem.termsAndConditionsExchange.trim().length !== 0
          ? updateItem.termsAndConditionsExchange.trim()
          : null,
      categoryId: updateItem.categoryId,
      brandId: updateItem.brandId,
      userLocationId: userLocationId,
      desiredItem:
        updateItem.desiredItem?.description.length !== 0
          ? updateItem.desiredItem
          : null,
    };

    await dispatch(updateItemThunk(updateItemRequest)).unwrap();
  }, [setUpdateItem, updateItem, dispatch, userLocationId]);

  useEffect(() => {
    if (itemUpdate !== null) {
      dispatch(resetLocation());
      dispatch(resetItemDetailState());
      setUpdateItem(defaultUpdateItem);

      hasConfirmedRef.current = true;
      navigation.reset({
        index: 0,
        routes: [
          {
            name: "MainTabs",
            state: { routes: [{ name: "Items" }] },
          },
        ],
      });
    }
  }, [itemUpdate, dispatch]);

  const toggleCheckboxFree = useCallback(() => {
    setIsCheckedFree((prev) => {
      setUpdateItem((prevUpload) => ({
        ...prevUpload,
        isCheckedFree: !prev,
      }));
      return !prev;
    });
  }, [setUpdateItem]);

  const toggleCheckboxDesiredItem = useCallback(() => {
    setIsMoneyAccepted((prev) => {
      setUpdateItem((prevUpload) => ({
        ...prevUpload,
        isMoneyAccepted: !prev,
      }));
      return !prev;
    });
  }, [setUpdateItem]);

  const handleConfirm = async () => {
    const priceItem = isCheckedFree
      ? 0
      : parseInt(price.replace(/,/g, ""), 10) || 0;
    if (
      !images ||
      !updateItem.categoryId ||
      !updateItem.brandId ||
      !updateItem.conditionItem ||
      (!price && priceItem > 0 && isCheckedFree) ||
      !itemName ||
      !description ||
      !updateItem.methodExchanges
    ) {
      setTitle("Missing information");
      setContent("All fields are required. Please fill them in to proceed.");
      setVisible(true);
      return;
    } else if (description.trim().length < 20) {
      setTitle("Invalid description");
      setContent("Please enter a description with at least 20 characters.");
      setVisible(true);
      return;
    } else {
      setConfirmVisible(true);
    }
  };

  const handleCancel = () => {
    setConfirmVisible(false);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (hasConfirmedRef.current) return;

      pendingBeforeRemoveEvent.current = e;
      e.preventDefault();
      setExitVisible(true);
    });

    return unsubscribe;
  }, [navigation, updateItem]);

  const handleCancelExit = () => {
    setExitVisible(false);
    pendingBeforeRemoveEvent.current = null;
  };

  const handleConfirmExit = async () => {
    hasConfirmedRef.current = true;
    setExitVisible(false);
    if (pendingBeforeRemoveEvent.current) {
      dispatch(resetLocation());
      navigation.dispatch(pendingBeforeRemoveEvent.current.data.action);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F6F9F9]" edges={["top"]}>
      <Header title="Update your item" showOption={false} />
      {loading || isUploadingImages ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#00b0b9" />
        </View>
      ) : (
        <ScrollView className="mx-5" showsVerticalScrollIndicator={false}>
          <KeyboardAwareScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            extraScrollHeight={20}
            enableOnAndroid={true}
            keyboardShouldPersistTaps="handled"
          >
            <ChooseImage
              images={images}
              setImages={setImages}
              isUploadEvidence={false}
            />

            <NavigationListItem
              title="Type of item"
              value={updateItem.categoryName}
              route="TypeOfItemUpdateScreen"
              defaultValue="Select type"
            />

            <NavigationListItem
              title="Brand"
              value={updateItem.brandName}
              route="BrandSelectionUpdateScreen"
              defaultValue="Select brand"
            />

            <NavigationListItem
              title="Condition"
              value={updateItem.conditionItemName}
              route="ItemConditionUpdateScreen"
              defaultValue="Select condition"
            />

            <NavigationListItem
              title="Method of exchange"
              value={
                updateItem.methodExchanges.length === 3
                  ? "All method exchanges"
                  : updateItem.methodExchanges.length > 0
                  ? updateItem.methodExchangeName
                  : ""
              }
              route="MethodOfExchangeUpdateScreen"
              defaultValue="Select methods"
            />

            <TouchableOpacity
              className="w-full bg-white rounded-lg mt-4 flex-row justify-between items-center px-5 py-3"
              onPress={() => navigation.navigate("LocationOfUser")}
            >
              <View className="w-[40px] h-[40px] bg-[#00b0b9] rounded-[8px] justify-center items-center mr-[10px]">
                <Icon name="location-on" size={22} color={"white"} />
              </View>
              <View className="flex-col items-start justify-start flex-1 w-full">
                <Text
                  className={`text-lg font-semibold text-black`}
                  numberOfLines={1}
                >
                  {locationDetail?.name}
                </Text>
                <Text
                  className={`text-base text-black w-full flex-wrap`}
                  numberOfLines={1}
                >
                  {locationDetail?.formatted_address}
                </Text>
              </View>

              <Icon name="arrow-forward-ios" size={24} color={"gray"} />
            </TouchableOpacity>

            <Toggle
              label="I want to give it for free"
              value={isCheckedFree}
              onToggle={toggleCheckboxFree}
            />

            {!isCheckedFree && (
              <View className="w-full bg-white rounded-lg mt-4 px-5 py-3">
                <Text className="text-black text-base">Price</Text>
                <View className="flex-row justify-between items-center mt-1">
                  <TextInput
                    className="flex-1 text-lg font-normal text-black py-2"
                    placeholder="0"
                    placeholderTextColor="#d1d5db"
                    value={formatPrice(price)}
                    onChangeText={(text) => handleFieldChange("price", text)}
                    keyboardType="numeric"
                  />
                  <Text className="font-bold text-[#00B0B9] text-lg">VND</Text>
                </View>
              </View>
            )}

            <View className="w-full bg-white rounded-lg mt-4 px-5 py-3">
              <Text className="text-black text-base">Name</Text>
              <View className="mt-1">
                <TextInput
                  className="flex-1 text-lg font-normal text-black py-2"
                  placeholder="Aaaaa"
                  placeholderTextColor="#d1d5db"
                  value={itemName}
                  onChangeText={(text) => handleFieldChange("itemName", text)}
                />
              </View>
            </View>

            <View className="w-full h-40 bg-white rounded-lg mt-4 px-5 py-3">
              <View className="flex-row justify-between">
                <Text className="text-black text-base">
                  Description<Text className="text-red-500">*</Text>
                </Text>
                <View className="flex-row items-center">
                  <Text className="text-gray-500 text-sm">
                    ({description.length}/at least 20)
                  </Text>
                </View>
              </View>
              <TextInput
                className="flex-1 text-lg font-normal text-black"
                placeholder="Aaaaa"
                placeholderTextColor="#d1d5db"
                value={description}
                onChangeText={(text) => handleFieldChange("description", text)}
                multiline={true}
                textAlignVertical="top"
              />
            </View>

            {!isCheckedFree && (
              <Toggle
                label="Accept exchanging with money"
                value={isMoneyAccepted}
                onToggle={toggleCheckboxDesiredItem}
              />
            )}

            <TouchableOpacity
              onPress={() =>
                navigation.navigate("ExchangeDesiredItemUpdateScreen")
              }
              className="w-full bg-white rounded-lg mt-4 flex-row justify-between items-center px-5 py-3"
            >
              <View>
                <Text className="text-base font-normal text-black">
                  Add your desired item for exchanging
                </Text>
                {JSON.stringify(updateItem.desiredItem) !==
                JSON.stringify(defaultUpdateItem.desiredItem) ? (
                  <Text
                    className="text-[#00b0b9] text-lg underline font-bold"
                    onPress={() =>
                      navigation.navigate("ExchangeDesiredItemUpdateScreen")
                    }
                  >
                    Detail
                  </Text>
                ) : (
                  <Text className="text-lg font-bold">(Optional)</Text>
                )}
              </View>

              <Icon name="arrow-forward-ios" size={20} color="black" />
            </TouchableOpacity>

            <View className="w-full h-40 bg-white rounded-lg mt-4 px-5 py-3">
              <Text className="text-black text-base">
                Exchange’s terms and conditions
              </Text>
              <TextInput
                className="flex-1 text-lg font-normal text-black"
                placeholder="Aaaaa"
                placeholderTextColor="#d1d5db"
                value={termCondition}
                onChangeText={(text) =>
                  handleFieldChange("termsAndConditionsExchange", text)
                }
                multiline={true}
                textAlignVertical="top"
              />
            </View>

            <View className="py-5">
              <LoadingButton
                title="Update"
                buttonClassName="p-4"
                onPress={handleConfirm}
                loading={loading}
                loadingUploadImage={isUploadingImages}
              />
            </View>
          </KeyboardAwareScrollView>
        </ScrollView>
      )}

      <ErrorModal
        content={content}
        title={title}
        visible={visible}
        onCancel={() => setVisible(false)}
      />

      <ConfirmModal
        title="Confirm update"
        content="Are you sure to update this item?"
        visible={confirmVisible}
        onCancel={handleCancel}
        onConfirm={handleUpdateItem}
      />

      <ConfirmModal
        title="Warning"
        content={`You have unsaved item. ${"\n"} Do you really want to leave?`}
        visible={exitVisible}
        onCancel={handleCancelExit}
        onConfirm={handleConfirmExit}
      />
    </SafeAreaView>
  );
}
