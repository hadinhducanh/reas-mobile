import React, { useEffect, useState, useCallback } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation, useNavigationState } from "@react-navigation/native";
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
import { uploadItemThunk } from "../../redux/thunk/itemThunks";
import { resetItemUpload } from "../../redux/slices/itemSlice";
import NavigationListItem from "../../components/NavigationListItem";
import Toggle from "../../components/Toggle";
import ConfirmModal from "../../components/DeleteConfirmModal";
import Icon from "react-native-vector-icons/MaterialIcons";
import { uploadToCloudinary } from "../../utils/CloudinaryImageUploader";

export default function UploadItem() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const state = useNavigationState((state) => state);

  const targetIndex = state.index - 1;

  const { user } = useSelector((state: RootState) => state.auth);
  const { itemUpload, loading } = useSelector((state: RootState) => state.item);
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
        setUploadItem((prev) => ({ ...prev, [field]: value }));
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

    const priceItem = isCheckedFree
      ? 0
      : parseInt(price.replace(/,/g, ""), 10) || 0;
    const formattedDescription = description.replace(/\n/g, "\n");
    const formattedTermAndCondition = termCondition.replace(/\n/g, "\n");

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

      const uploadItemRequest = {
        itemName: uploadItem.itemName.trim(),
        description: formattedDescription.trim(),
        price: uploadItem.price,
        conditionItem: uploadItem.conditionItem,
        imageUrl: processedImages,
        methodExchanges: uploadItem.methodExchanges,
        isMoneyAccepted: uploadItem.isMoneyAccepted,
        typeExchange: uploadItem.typeExchange,
        typeItem: uploadItem.typeItem,
        termsAndConditionsExchange: formattedTermAndCondition.trim(),
        categoryId: uploadItem.categoryId,
        brandId: uploadItem.brandId,
        desiredItem:
          uploadItem.desiredItem?.categoryId !== 0
            ? uploadItem.desiredItem
            : null,
      };

      await dispatch(uploadItemThunk(uploadItemRequest));
    }
  }, [setUploadItem, uploadItem, dispatch]);

  useEffect(() => {
    if (itemUpload !== null) {
      dispatch(resetItemUpload());
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

  return (
    <SafeAreaView className="flex-1 bg-[#F6F9F9]" edges={["top"]}>
      <Header
        title="Upload your item"
        showBackButton={
          targetIndex > 0 && state.routes[targetIndex].name === "BrowseItems"
            ? true
            : false
        }
        showOption={false}
      />
      {loading || isUploadingImages ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#00b0b9" />
        </View>
      ) : (
        <ScrollView className="mx-5" showsVerticalScrollIndicator={false}>
          <KeyboardAwareScrollView
            extraScrollHeight={10}
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
                    className="flex-1 text-lg font-normal text-black"
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
                  className="flex-1 text-lg font-normal text-black"
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

      <ConfirmModal
        title="Confirm upload"
        content="Are you sure you to upload this item?"
        visible={confirmVisible}
        onCancel={handleCancel}
        onConfirm={handleCreateItem}
      />
    </SafeAreaView>
  );
}
