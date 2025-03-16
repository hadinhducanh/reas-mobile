import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

import { RootStackParamList } from "../../navigation/AppNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppDispatch, RootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/Header";
import ChooseImage from "../../components/ChooseImage";
import LoadingButton from "../../components/LoadingButton";
import { defaultUploadItem, useUploadItem } from "../../context/ItemContext";
import { ConditionItem } from "../../common/enums/ConditionItem";
import { MethodExchange } from "../../common/enums/MethodExchange";
import { TypeExchange } from "../../common/enums/TypeExchange";
import { uploadItemThunk } from "../../redux/thunk/itemThunks";
import { resetItemDetail } from "../../redux/slices/itemSlice";

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

  const selectedBrand = brands.find((brand) => brand.id === uploadItem.brandId);
  const selectedTypeItemDetail = categories.find(
    (category) => category.id === uploadItem.categoryId
  );
  const selectedItemCondition = itemConditions.find(
    (itemCondition) => itemCondition.value === uploadItem.conditionItem
  );
  const selectedMethodExchanges = methodExchanges
    .filter((method) => uploadItem.methodExchanges.includes(method.value))
    .map((method) => method.label)
    .join(", ");

  const [price, setPrice] = useState<string>(uploadItem.price.toString());
  const [itemName, setItemName] = useState<string>(uploadItem.itemName);
  const [description, setDescription] = useState<string>(
    uploadItem.description
  );
  const [termCondition, setTermCondition] = useState<string>(
    uploadItem.termsAndConditionsExchange
  );
  const [images, setImages] = useState<string>(uploadItem.imageUrl);

  const handleCreateItem = async () => {
    const priceItem = isCheckedFree
      ? 0
      : parseInt(price.toString().replace(/,/g, ""), 10) || 0;

    if (description.trim().length < 20) {
      Alert.alert(
        "Invalid Description",
        "Description must be at least 20 characters long."
      );
      return;
    }

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
      Alert.alert("Missing Information", "All fields is required.");
      return;
    } else {
      if (uploadItem.desiredItem?.categoryId !== 0) {
        setUploadItem({
          ...uploadItem,
          typeExchange: TypeExchange.EXCHANGE_WITH_DESIRED_ITEM,
        });
      }

      const uploadItemRequest = {
        itemName: uploadItem.itemName,
        description: uploadItem.description,
        price: uploadItem.price,
        conditionItem: uploadItem.conditionItem,
        imageUrl: "abc",
        methodExchanges: uploadItem.methodExchanges,
        isMoneyAccepted: uploadItem.isMoneyAccepted,
        typeExchange: uploadItem.typeExchange,
        typeItem: uploadItem.typeItem,
        termsAndConditionsExchange: uploadItem.termsAndConditionsExchange,
        categoryId: uploadItem.categoryId,
        brandId: uploadItem.brandId,
        desiredItem:
          uploadItem.desiredItem?.categoryId !== 0
            ? uploadItem.desiredItem
            : null,
      };

      // console.log(uploadItemRequest);

      await dispatch(uploadItemThunk(uploadItemRequest));
    }
  };

  useEffect(() => {
    if (itemUpload?.itemName.length) {
      setUploadItem(defaultUploadItem);
      setIsCheckFreeContext(false);
      setItemName("");
      setImages("");
      setDescription("");
      setPrice("");
      dispatch(resetItemDetail());
      navigation.navigate("UploadItemSuccess");
    }
  }, [itemUpload, dispatch]);

  const toggleCheckboxFree = () => {
    setIsCheckedFree(!isCheckedFree);
    setIsCheckFreeContext(!isCheckedFree);
  };
  const toggleCheckboxDesiredItem = () => {
    setIsMoneyAccepted(!isMoneyAccepted);
    setUploadItem({
      ...uploadItem,
      isMoneyAccepted: isMoneyAccepted,
    });
  };

  const formatPrice = (value: string): string => {
    const numericValue = value.replace(/\D/g, "");
    return numericValue
      ? parseInt(numericValue, 10).toLocaleString("en-US")
      : "";
  };

  const handlePriceChange = (value: string) => {
    const priceItem = parseInt(value.replace(/,/g, ""), 10) || 0;
    setPrice(value);

    setUploadItem({
      ...uploadItem,
      price: priceItem,
    });
  };

  const handleNameChange = (value: string) => {
    setItemName(value);
    setUploadItem({
      ...uploadItem,
      itemName: value,
    });
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    setUploadItem({
      ...uploadItem,
      description: value,
    });
  };

  const handleTermConditionChange = (value: string) => {
    setTermCondition(value);
    setUploadItem({
      ...uploadItem,
      termsAndConditionsExchange: value,
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F6F9F9]">
      <Header
        title="Upload your item"
        showBackButton={false}
        showOption={false}
      />
      <ScrollView className="mx-5" showsVerticalScrollIndicator={false}>
        <ChooseImage
          images={images}
          setImages={setImages}
          isUploadEvidence={false}
        />

        <TouchableOpacity
          onPress={() => navigation.navigate("TypeOfItemScreen")}
          className="w-full bg-white rounded-lg mt-4 flex-row justify-between items-center px-5 py-3"
        >
          <View>
            <Text className="text-base text-black">Type of item</Text>
            <Text
              className={`text-lg font-semibold ${
                selectedTypeItemDetail ? "text-[#00b0b9]" : "text-black"
              }  mt-1`}
            >
              {selectedTypeItemDetail?.categoryName || "Select type"}
            </Text>
          </View>
          <Icon name="arrow-forward-ios" size={20} color="black" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("BrandSelectionScreen")}
          className="w-full bg-white rounded-lg mt-4 flex-row justify-between items-center px-5 py-3"
        >
          <View>
            <Text className="text-base text-black">Brand</Text>
            <Text
              className={`text-lg font-semibold ${
                selectedBrand ? "text-[#00b0b9]" : "text-black"
              }  mt-1`}
            >
              {selectedBrand?.brandName || "Select brand"}
            </Text>
          </View>
          <Icon name="arrow-forward-ios" size={20} color="black" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("ItemConditionScreen")}
          className="w-full bg-white rounded-lg mt-4 flex-row justify-between items-center px-5 py-3"
        >
          <View>
            <Text className="text-base text-black">Condition</Text>
            <Text
              className={`text-lg font-semibold ${
                selectedItemCondition ? "text-[#00b0b9]" : "text-black"
              }  mt-1`}
            >
              {selectedItemCondition?.label || "Select condition"}
            </Text>
          </View>
          <Icon name="arrow-forward-ios" size={20} color="black" />
        </TouchableOpacity>

        <View className="flex-row items-center justify-between mt-4 px-5">
          <Text className="text-lg font-medium text-gray-500">
            I want to give it for free
          </Text>
          <TouchableOpacity
            onPress={toggleCheckboxFree}
            className="w-6 h-6 bg-white rounded-sm justify-center items-center border-2 border-[#00b0b9]"
          >
            {isCheckedFree && <Icon name="check" size={15} color="#00B0B9" />}
          </TouchableOpacity>
        </View>

        {!isCheckedFree && (
          <View className="w-full bg-white rounded-lg mt-4 px-5 py-3">
            <Text className="text-black text-base">Min price</Text>
            <View className="flex-row justify-between items-center mt-1">
              <TextInput
                className="flex-1 text-lg font-normal text-black"
                placeholder="0"
                placeholderTextColor="#d1d5db"
                value={formatPrice(price)}
                onChangeText={handlePriceChange}
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
              onChangeText={handleNameChange}
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
            onChangeText={handleDescriptionChange}
            multiline={true}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate("MethodOfExchangeScreen")}
          className="w-full bg-white rounded-lg mt-4 flex-row justify-between items-center px-5 py-3"
        >
          <View>
            <Text className="text-base text-black">Method of exchange</Text>
            <Text
              className={`text-lg font-semibold ${
                selectedMethodExchanges ? "text-[#00b0b9]" : "text-black"
              }  mt-1`}
            >
              {uploadItem.methodExchanges.length === 3
                ? "All method exchanges"
                : uploadItem.methodExchanges.length > 0
                ? selectedMethodExchanges
                : "Select methods"}
            </Text>
          </View>
          <Icon name="arrow-forward-ios" size={20} color="black" />
        </TouchableOpacity>

        {!isCheckedFree && (
          <View className="flex-row items-center justify-between mt-4 px-5">
            <Text className="text-lg font-medium text-gray-500">
              Accept exchanging with money
            </Text>
            <TouchableOpacity
              onPress={toggleCheckboxDesiredItem}
              className="w-6 h-6 bg-white rounded-sm justify-center items-center border-2 border-[#00b0b9]"
            >
              {isMoneyAccepted && (
                <Icon name="check" size={15} color="#00B0B9" />
              )}
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          onPress={() => navigation.navigate("ExchangeDesiredItemScreen")}
          className="w-full bg-white rounded-lg mt-4 flex-row justify-between items-center px-5 py-3"
        >
          <View>
            <Text className="text-base font-normal text-black">
              Add your desired item for exchanging
            </Text>
            {uploadItem.desiredItem?.categoryId !== 0 ? (
              <Text
                className="text-[#00b0b9] text-lg underline font-bold"
                onPress={() => navigation.navigate("ExchangeDesiredItemScreen")}
              >
                Detail
              </Text>
            ) : (
              <Text className="text-lg font-bold">(Optional)</Text>
            )}
          </View>

          <Icon name="arrow-forward-ios" size={20} color="black" />
        </TouchableOpacity>

        <View className="w-full h-40 bg-white rounded-lg mt-4 px-5 py-3 border-2 border-[#00B0B9]">
          <Text className="text-black text-base">
            Exchange’s terms and conditions
          </Text>
          <TextInput
            className="flex-1 text-lg font-normal text-black"
            placeholder="Aaaaa"
            placeholderTextColor="#d1d5db"
            value={termCondition}
            onChangeText={handleTermConditionChange}
            multiline={true}
            textAlignVertical="top"
          />
        </View>

        <View className="py-5">
          <LoadingButton
            title="Create"
            buttonClassName="p-4"
            onPress={handleCreateItem}
            loading={loading}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
