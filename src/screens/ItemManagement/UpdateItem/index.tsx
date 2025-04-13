import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useDispatch, useSelector } from "react-redux";
import { RootStackParamList } from "../../../navigation/AppNavigator";
import { AppDispatch, RootState } from "../../../redux/store";
import { defaultUploadItem, useUploadItem } from "../../../context/ItemContext";
import { uploadToCloudinary } from "../../../utils/CloudinaryImageUploader";
import { TypeExchange } from "../../../common/enums/TypeExchange";
import {
  updateItemThunk,
  uploadItemThunk,
} from "../../../redux/thunk/itemThunks";
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
  const { uploadItem, setUploadItem } = useUploadItem();

  const [isCheckedFree, setIsCheckedFree] = useState<boolean>(
    uploadItem.isCheckedFree
  );
  const [isMoneyAccepted, setIsMoneyAccepted] = useState(
    uploadItem.isMoneyAccepted
  );
  const [price, setPrice] = useState<string>(uploadItem.price.toString());
  const [itemName, setItemName] = useState<string>(uploadItem.itemName);
  const [description, setDescription] = useState<string>(
    uploadItem.description
  );
  const [termCondition, setTermCondition] = useState<string>(
    uploadItem.termsAndConditionsExchange
  );
  const [images, setImages] = useState<string>(uploadItem.imageUrl);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [exitVisible, setExitVisible] = useState(false);
  const [locationDetail, setLocationDetail] = useState<PlaceDetail>();

  const pendingBeforeRemoveEvent = useRef<any>(null);
  const hasConfirmedRef = useRef(false);

  useEffect(() => {
    if (itemDetail && itemDetail.desiredItem) {
      setPrice(itemDetail?.price.toString());
      setItemName(itemDetail.itemName);
      setDescription(itemDetail.description.replace(/\\n/g, "\n"));
      setTermCondition(
        itemDetail.termsAndConditionsExchange
          ? itemDetail.termsAndConditionsExchange.replace(/\\n/g, "\n")
          : ""
      );
      setImages(itemDetail.imageUrl);
      setIsCheckedFree(itemDetail.price === 0 ? true : false);
      setIsMoneyAccepted(itemDetail.moneyAccepted);

      setUploadItem({
        ...uploadItem,
        price: itemDetail.price,
        itemName: itemDetail.itemName,
        description: itemDetail.description,
        termsAndConditionsExchange: itemDetail.termsAndConditionsExchange,
        imageUrl: itemDetail.imageUrl,
        isCheckedFree: itemDetail.price === 0 ? true : false,
        isMoneyAccepted: itemDetail.moneyAccepted,
        brandName: itemDetail.brand.brandName,
        brandId: itemDetail.brand.id,
        conditionItem: itemDetail.conditionItem,
        conditionItemName: getConditionItemLabel(itemDetail.conditionItem),
        methodExchanges: itemDetail.methodExchanges,
        methodExchangeName: getMethodExchangeLabel(itemDetail.methodExchanges),
        typeItem: itemDetail.typeItem,
        categoryName: itemDetail.category.categoryName,
        categoryId: itemDetail.category.id,
        desiredItem: {
          ...uploadItem,
          categoryId:
            itemDetail.desiredItem.categoryId === null
              ? 0
              : itemDetail.desiredItem.categoryId,
          conditionItem:
            itemDetail.desiredItem.conditionItem === null
              ? ConditionItem.NO_CONDITION
              : itemDetail.desiredItem.conditionItem,
          brandId:
            itemDetail.desiredItem.brandId === null
              ? 0
              : itemDetail.desiredItem.brandId,
          minPrice: itemDetail.desiredItem.minPrice,
          maxPrice:
            itemDetail.desiredItem.maxPrice === null
              ? 0
              : itemDetail.desiredItem.maxPrice,
          description: itemDetail.desiredItem.description,
        },
        typeItemDesire:
          itemDetail.category.id === null
            ? TypeItem.NO_TYPE
            : itemDetail.desiredItem.typeItem,
        conditionDesiredItemName:
          itemDetail.desiredItem.conditionItem === null
            ? ""
            : getConditionItemLabel(itemDetail.desiredItem.conditionItem),
        brandDesiredItemName:
          itemDetail.desiredItem.brandId === null
            ? ""
            : itemDetail.desiredItem.brandName,
        categoryDesiredItemName:
          itemDetail.desiredItem.categoryId === null
            ? ""
            : itemDetail.desiredItem.categoryName,
      });
    } else if (itemDetail && !itemDetail.desiredItem) {
      setPrice(itemDetail?.price.toString());
      setItemName(itemDetail.itemName);
      setDescription(itemDetail.description.replace(/\\n/g, "\n"));
      setTermCondition(
        itemDetail.termsAndConditionsExchange
          ? itemDetail.termsAndConditionsExchange.replace(/\\n/g, "\n")
          : ""
      );
      setImages(itemDetail.imageUrl);
      setIsCheckedFree(itemDetail.price === 0 ? true : false);
      setIsMoneyAccepted(itemDetail.moneyAccepted);

      setUploadItem({
        ...uploadItem,
        price: itemDetail.price,
        itemName: itemDetail.itemName,
        description: itemDetail.description,
        termsAndConditionsExchange: itemDetail.termsAndConditionsExchange,
        imageUrl: itemDetail.imageUrl,
        isCheckedFree: itemDetail.price === 0 ? true : false,
        isMoneyAccepted: itemDetail.moneyAccepted,
        brandName: itemDetail.brand.brandName,
        brandId: itemDetail.brand.id,
        conditionItem: itemDetail.conditionItem,
        conditionItemName: getConditionItemLabel(itemDetail.conditionItem),
        methodExchanges: itemDetail.methodExchanges,
        methodExchangeName: getMethodExchangeLabel(itemDetail.methodExchanges),
        typeItem: itemDetail.typeItem,
        categoryName: itemDetail.category.categoryName,
        categoryId: itemDetail.category.id,
      });
    }
  }, [itemDetail]);

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
  }, [user, userLocationId, itemDetail, dispatch]);

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
        setUploadItem((prev) => ({ ...prev, price: priceValue }));
      } else {
        if (field === "itemName") setItemName(value);
        else if (field === "description") setDescription(value);
        else if (field === "termsAndConditionsExchange")
          setTermCondition(value);
        setUploadItem((prev) => ({
          ...prev,
          [field]: value.trim().replace(/\n/g, "\\n"),
        }));
      }
    },
    [setUploadItem]
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

    const priceItem = isCheckedFree
      ? 0
      : parseInt(price.replace(/,/g, ""), 10) || 0;

    if (
      !images ||
      !uploadItem.categoryId ||
      !uploadItem.brandId ||
      !uploadItem.conditionItem ||
      (!price && priceItem > 0 && isCheckedFree) ||
      !itemName ||
      !description ||
      !uploadItem.methodExchanges
    ) {
      Alert.alert("Invalid information", "All fields are required.");
      return;
    } else if (description.trim().length < 20) {
      Alert.alert(
        "Invalid information",
        "Description must be at least 20 characters long."
      );
      return;
    } else {
      setIsUploadingImages(true);
      const processedImages = await processImages();
      setIsUploadingImages(false);

      setImages(processedImages);
      setUploadItem((prev) => ({ ...prev, imageUrl: processedImages }));

      if (uploadItem.desiredItem?.categoryId !== 0) {
        setUploadItem((prev) => ({
          ...prev,
          typeExchange: TypeExchange.EXCHANGE_WITH_DESIRED_ITEM,
        }));
      }

      const updateItemRequest = {
        id: itemDetail?.id!,
        itemName: uploadItem.itemName.trim(),
        description: uploadItem.description.trim(),
        price: uploadItem.price,
        conditionItem: uploadItem.conditionItem,
        imageUrl: processedImages,
        methodExchanges: uploadItem.methodExchanges,
        isMoneyAccepted: uploadItem.isMoneyAccepted,
        termsAndConditionsExchange:
          uploadItem.termsAndConditionsExchange &&
          uploadItem.termsAndConditionsExchange.trim().length !== 0
            ? uploadItem.termsAndConditionsExchange.trim()
            : null,
        categoryId: uploadItem.categoryId,
        brandId: uploadItem.brandId,
        userLocationId: userLocationId,
        desiredItem:
          uploadItem.desiredItem?.description.length !== 0
            ? uploadItem.desiredItem
            : null,
      };

      await dispatch(updateItemThunk(updateItemRequest)).unwrap();
    }
  }, [setUploadItem, uploadItem, dispatch, userLocationId]);

  useEffect(() => {
    if (itemUpdate !== null) {
      dispatch(resetLocation());
      dispatch(resetItemDetailState());
      setUploadItem(defaultUploadItem);

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
      setUploadItem((prevUpload) => ({
        ...prevUpload,
        isCheckedFree: !prev,
      }));
      return !prev;
    });
  }, [setUploadItem]);

  const toggleCheckboxDesiredItem = useCallback(() => {
    setIsMoneyAccepted((prev) => {
      setUploadItem((prevUpload) => ({
        ...prevUpload,
        isMoneyAccepted: !prev,
      }));
      return !prev;
    });
  }, [setUploadItem]);

  const handleConfirm = async () => {
    setConfirmVisible(true);
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
  }, [navigation, uploadItem]);

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
              value={uploadItem.categoryName}
              route="TypeOfItemScreen"
              defaultValue="Select type"
            />

            <NavigationListItem
              title="Brand"
              value={uploadItem.brandName}
              route="BrandSelectionScreen"
              defaultValue="Select brand"
            />

            <NavigationListItem
              title="Condition"
              value={uploadItem.conditionItemName}
              route="ItemConditionScreen"
              defaultValue="Select condition"
            />

            <NavigationListItem
              title="Method of exchange"
              value={
                uploadItem.methodExchanges.length === 3
                  ? "All method exchanges"
                  : uploadItem.methodExchanges.length > 0
                  ? uploadItem.methodExchangeName
                  : ""
              }
              route="MethodOfExchangeScreen"
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
              <Text className="text-black text-base">
                Description{" "}
                <Text className="text-[#00b0b9] font-semibold">
                  (at least 20 characters)
                </Text>
              </Text>
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
              onPress={() => navigation.navigate("ExchangeDesiredItemScreen")}
              className="w-full bg-white rounded-lg mt-4 flex-row justify-between items-center px-5 py-3"
            >
              <View>
                <Text className="text-base font-normal text-black">
                  Add your desired item for exchanging
                </Text>
                {JSON.stringify(uploadItem.desiredItem) !==
                JSON.stringify(defaultUploadItem.desiredItem) ? (
                  <Text
                    className="text-[#00b0b9] text-lg underline font-bold"
                    onPress={() =>
                      navigation.navigate("ExchangeDesiredItemScreen")
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

      <ConfirmModal
        title="Confirm update"
        content="Are you sure you to update this item?"
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
