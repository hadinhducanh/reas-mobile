import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Alert, Modal, ScrollView, Text, TextInput, View } from "react-native";
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
import { ConditionItem } from "../../common/enums/ConditionItem";
import { MethodExchange } from "../../common/enums/MethodExchange";
import { TypeExchange } from "../../common/enums/TypeExchange";
import { uploadItemThunk } from "../../redux/thunk/itemThunks";
import { resetItemUpload } from "../../redux/slices/itemSlice";
import NavigationListItem from "../../components/NavigationListItem";
import Toggle from "../../components/Toggle";
import ConfirmModal from "../../components/DeleteConfirmModal";

const itemConditions = [
  { label: "Brand new", value: ConditionItem.BRAND_NEW },
  { label: "Like new", value: ConditionItem.LIKE_NEW },
  { label: "Excellent condition", value: ConditionItem.EXCELLENT },
  { label: "Good condition", value: ConditionItem.GOOD },
  { label: "Fair condition", value: ConditionItem.FAIR },
  { label: "Poor condition", value: ConditionItem.POOR },
  { label: "For parts / Not working", value: ConditionItem.NOT_WORKING },
];

const methodExchanges = [
  { label: "Pick up in person", value: MethodExchange.PICK_UP_IN_PERSON },
  { label: "Delivery", value: MethodExchange.DELIVERY },
  {
    label: "Meet at a given location",
    value: MethodExchange.MEET_AT_GIVEN_LOCATION,
  },
];

export default function UploadScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { brands } = useSelector((state: RootState) => state.brand);
  const { user } = useSelector((state: RootState) => state.auth);
  const { categories } = useSelector((state: RootState) => state.category);
  const { itemUpload, loading } = useSelector((state: RootState) => state.item);
  const dispatch = useDispatch<AppDispatch>();
  const {
    uploadItem,
    setUploadItem,
    isCheckFreeContext,
    setIsCheckFreeContext,
  } = useUploadItem();

  const [isCheckedFree, setIsCheckedFree] =
    useState<boolean>(isCheckFreeContext);
  const [isMoneyAccepted, setIsMoneyAccepted] = useState(false);
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

  const selectedBrand = brands.find((brand) => brand.id === uploadItem.brandId);

  const selectedTypeItemDetail = useMemo(
    () => categories.find((category) => category.id === uploadItem.categoryId),
    [categories, uploadItem.categoryId]
  );
  const selectedItemCondition = useMemo(
    () =>
      itemConditions.find((cond) => cond.value === uploadItem.conditionItem),
    [uploadItem.conditionItem]
  );
  const selectedMethodExchanges = useMemo(() => {
    const methods = methodExchanges.filter((method) =>
      uploadItem.methodExchanges.includes(method.value)
    );
    return methods.map((method) => method.label).join(", ");
  }, [uploadItem.methodExchanges]);

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

  const uploadToCloudinary = useCallback(
    async (
      uri: string,
      creatorName: string | undefined
    ): Promise<string | null> => {
      try {
        const data = new FormData();
        const timestamp = new Date().getTime();
        data.append("file", {
          uri,
          type: "image/jpeg",
          name: `${creatorName}-${timestamp}.jpg`,
        } as any);
        data.append("upload_preset", "reas_image_upload");
        data.append("cloud_name", "dpysbryyk");
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/dpysbryyk/image/upload`,
          { method: "POST", body: data }
        );
        const json = await response.json();
        return json.secure_url;
      } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        return null;
      }
    },
    []
  );

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
      !selectedTypeItemDetail ||
      !selectedBrand ||
      !selectedItemCondition ||
      (!price && priceItem > 0 && isCheckedFree) ||
      !itemName ||
      !description ||
      !selectedMethodExchanges
    ) {
      Alert.alert("Missing Information", "All fields are required.");
      return;
    } else if (description.trim().length < 20) {
      Alert.alert(
        "Invalid Description",
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
  }, [
    description,
    isCheckedFree,
    itemName,
    images,
    price,
    processImages,
    selectedBrand,
    selectedItemCondition,
    selectedMethodExchanges,
    selectedTypeItemDetail,
    termCondition,
    uploadItem,
    dispatch,
  ]);

  useEffect(() => {
    if (itemUpload?.itemName.length) {
      setUploadItem(defaultUploadItem);
      setIsCheckFreeContext(false);
      setItemName("");
      setPrice("");
      setDescription("");
      setTermCondition("");
      setImages("");
      dispatch(resetItemUpload());
      navigation.navigate("UploadItemSuccess");
    }
  }, [itemUpload, dispatch, navigation, setUploadItem, setIsCheckFreeContext]);

  const toggleCheckboxFree = useCallback(() => {
    setIsCheckedFree((prev) => {
      setIsCheckFreeContext(!prev);
      return !prev;
    });
  }, [setIsCheckFreeContext]);

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
        showBackButton={false}
        showOption={false}
      />
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
            value={selectedTypeItemDetail?.categoryName}
            route="TypeOfItemScreen"
            defaultValue="Select type"
          />

          <NavigationListItem
            title="Brand"
            value={selectedBrand?.brandName}
            route="BrandSelectionScreen"
            defaultValue="Select brand"
          />

          <NavigationListItem
            title="Condition"
            value={selectedItemCondition?.label}
            route="ItemConditionScreen"
            defaultValue="Select condition"
          />

          <NavigationListItem
            title="Method of exchange"
            value={
              uploadItem.methodExchanges.length === 3
                ? "All method exchanges"
                : uploadItem.methodExchanges.length > 0
                ? selectedMethodExchanges
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
                className="flex-1 text-lg font-normal text-[#00B0B9]"
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

          <NavigationListItem
            title="Add your desired item for exchanging"
            value={uploadItem.desiredItem?.categoryId !== 0 ? "Detail" : ""}
            route="ExchangeDesiredItemScreen"
            defaultValue="(Optional)"
          />

          <View className="w-full h-40 bg-white rounded-lg mt-4 px-5 py-3 border-2 border-[#00B0B9]">
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
      <ConfirmModal
        title="Confirm upload"
        content="Are you sure you to upload this item?"
        visible={confirmVisible}
        onCancel={handleCancel}
        onConfirm={handleCreateItem}
      />
      <Modal
        transparent
        visible={loading || isUploadingImages}
        animationType="fade"
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        ></View>
      </Modal>
    </SafeAreaView>
  );
}
