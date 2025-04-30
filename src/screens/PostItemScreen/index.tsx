import React, { useEffect, useState, useCallback } from "react";
import {
  ActivityIndicator,
  Alert,
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

import { RootStackParamList } from "../../navigation/AppNavigator";
import { AppDispatch, RootState } from "../../redux/store";
import Header from "../../components/Header";
import ChooseImage from "../../components/ChooseImage";
import LoadingButton from "../../components/LoadingButton";
import { defaultUploadItem, useUploadItem } from "../../context/ItemContext";
import { TypeExchange } from "../../common/enums/TypeExchange";
import NavigationListItem from "../../components/NavigationListItem";
import Toggle from "../../components/Toggle";
import ConfirmModal from "../../components/DeleteConfirmModal";
import Icon from "react-native-vector-icons/MaterialIcons";
import { uploadToCloudinary } from "../../utils/CloudinaryImageUploader";
import LocationService from "../../services/LocationService";
import {
  resetLocation,
  setUserLocationIdState,
  setUserPlaceIdState,
} from "../../redux/slices/userSlice";
import { PlaceDetail } from "../../common/models/location";
import { uploadItemThunk } from "../../redux/thunk/itemThunks";
import ErrorModal from "../../components/ErrorModal";
import { useTranslation } from "react-i18next";
import { set } from "zod";

export default function UploadItem() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { userLocationId } = useSelector((state: RootState) => state.user);
  const { itemUpload, loading } = useSelector((state: RootState) => state.item);
  const dispatch = useDispatch<AppDispatch>();
  const { uploadItem, setUploadItem } = useUploadItem();

  const [isCheckedFree, setIsCheckedFree] = useState<boolean>(
    uploadItem.isCheckedFree
  );
  const [isMoneyAccepted, setIsMoneyAccepted] = useState(
    uploadItem.isMoneyAccepted
  );
  const [price, setPrice] = useState<string>(
    uploadItem.price === null ? "" : uploadItem.price.toString() || ""
  );
  const [itemName, setItemName] = useState<string>(uploadItem.itemName);
  const [description, setDescription] = useState<string>(
    uploadItem.description
  );
  const [termCondition, setTermCondition] = useState<string | null>(
    uploadItem.termsAndConditionsExchange
  );
  const [images, setImages] = useState<string>(uploadItem.imageUrl);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [locationDetail, setLocationDetail] = useState<PlaceDetail>();

  const [visible, setVisible] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  const [title, setTitle] = useState<string>("");

  useEffect(() => {
    setUploadItem(defaultUploadItem);
  }, []);

  useEffect(() => {
    if (!uploadItem) return;

    setPrice(uploadItem.price != null ? uploadItem.price.toString() : "");
    setItemName(uploadItem.itemName || "");
    setDescription((uploadItem.description || "").replace(/\\n/g, "\n"));
    setTermCondition(
      (uploadItem.termsAndConditionsExchange || "").replace(/\\n/g, "\n")
    );
    setImages(uploadItem.imageUrl || "");
    setIsCheckedFree(!!uploadItem.isCheckedFree);
    setIsMoneyAccepted(!!uploadItem.isMoneyAccepted);
  }, [
    uploadItem.price === null,
    uploadItem.itemName.length === 0,
    uploadItem.description.length === 0,
    uploadItem.termsAndConditionsExchange?.length === 0,
    uploadItem.imageUrl.length === 0,
    uploadItem.isCheckedFree,
    uploadItem.isMoneyAccepted,
  ]);

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

  const handleCreateItem = useCallback(async () => {
    setConfirmVisible(false);

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

    const uploadItemRequest = {
      itemName: uploadItem.itemName.trim(),
      description: uploadItem.description.trim(),
      price: uploadItem.price === null ? 0 : uploadItem.price,
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
      desiredItem:
        uploadItem.desiredItem?.description.length !== 0
          ? uploadItem.desiredItem
          : null,
      userLocationId: userLocationId,
    };

    await dispatch(uploadItemThunk(uploadItemRequest)).unwrap();
  }, [setUploadItem, uploadItem, userLocationId, dispatch]);

  useEffect(() => {
    if (itemUpload !== null) {
      dispatch(resetLocation());
      setUploadItem(defaultUploadItem);
      navigation.navigate("UploadItemSuccess");
    }
  }, [itemUpload, dispatch]);

  const toggleCheckboxFree = useCallback(() => {
    setIsCheckedFree((prev) => {
      setUploadItem((prevUpload) => ({
        ...prevUpload,
        isCheckedFree: !prev,
      }));
      return !prev;
    });
  }, [setUploadItem, isCheckedFree]);

  const toggleCheckboxDesiredItem = useCallback(() => {
    setIsMoneyAccepted((prev) => {
      setUploadItem((prevUpload) => ({
        ...prevUpload,
        isMoneyAccepted: !prev,
      }));
      return !prev;
    });
  }, [setUploadItem, isMoneyAccepted]);

  useEffect(() => {
    const fetchLocationDetails = async () => {
      if (user && user.userLocations && user.userLocations.length) {
        let targetLocation = null;

        if (userLocationId !== 0) {
          targetLocation = user.userLocations.find(
            (loc) => loc.id === userLocationId
          );
        }

        if (!targetLocation) {
          const primaryLocations = user.userLocations.filter(
            (loc) => loc.primary
          );
          if (primaryLocations.length > 0) {
            targetLocation = primaryLocations[0];
          }
        }

        if (targetLocation) {
          try {
            const details =
              await LocationService.getPlaceDetailsByReverseGeocode(
                `${targetLocation.latitude},${targetLocation.longitude}`
              );
            dispatch(setUserPlaceIdState(details.place_id));
            dispatch(setUserLocationIdState(targetLocation.id));
            setLocationDetail(details);
          } catch (error) {
            console.error("Error fetching location details:", error);
          }
        }
      }
    };

    fetchLocationDetails();
  }, [user, userLocationId]);

  const handleConfirm = async () => {
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

  return (
    <SafeAreaView className="flex-1 bg-[#F6F9F9]" edges={["top"]}>
      <Header
        title="Upload your item"
        showBackButton={false}
        showOption={false}
      />
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
              require
              value={uploadItem.categoryName}
              route="TypeOfItemScreen"
              defaultValue="Select type"
            />

            <NavigationListItem
              title="Brand"
              require
              value={uploadItem.brandName}
              route="BrandSelectionScreen"
              defaultValue="Select brand"
            />

            <NavigationListItem
              title="Condition"
              require
              value={uploadItem.conditionItemName}
              route="ItemConditionScreen"
              defaultValue="Select condition"
            />

            <NavigationListItem
              title="Method of exchange"
              require
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
                <Text className="text-black text-base">
                  Price<Text className="text-red-500">*</Text>
                </Text>
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
              <Text className="text-black text-base">
                Name<Text className="text-red-500">*</Text>
              </Text>
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
                value={termCondition!}
                onChangeText={(text) =>
                  handleFieldChange("termsAndConditionsExchange", text)
                }
                multiline={true}
                textAlignVertical="top"
              />
            </View>

            <View className="py-5">
              <LoadingButton
                title="Upload"
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
        title="Confirm upload"
        content="Are you sure to upload this item?"
        visible={confirmVisible}
        onCancel={handleCancel}
        onConfirm={handleCreateItem}
      />
    </SafeAreaView>
  );
}
