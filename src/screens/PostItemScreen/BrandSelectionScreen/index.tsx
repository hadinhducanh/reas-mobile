import React, { useEffect } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../redux/store";
import { RootStackParamList } from "../../../navigation/AppNavigator";
import Header from "../../../components/Header";
import { getAllBrandThunk } from "../../../redux/thunk/brandThunks";
import { useUploadItem } from "../../../context/ItemContext";

const BrandSelectionScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const state = useNavigationState((state) => state);
  const dispatch = useDispatch<AppDispatch>();
  const { brands, loading, error } = useSelector(
    (state: RootState) => state.brand
  );
  const { uploadItem, setUploadItem } = useUploadItem();

  let selectedBrandId: number = 0;
  let handleSelectBrand: (brandId: number, brandName: string) => void;

  const targetIndex = state.index - 1;

  if (
    targetIndex > 0 &&
    state.routes[targetIndex].name === "ExchangeDesiredItemScreen"
  ) {
    selectedBrandId = uploadItem.desiredItem?.brandId || 0;
    handleSelectBrand = (brandId: number, brandName: string) => {
      if (selectedBrandId === brandId) {
        setUploadItem({
          ...uploadItem,
          brandDesiredItemName: "",
          desiredItem: {
            ...uploadItem.desiredItem!,
            brandId: 0,
          },
        });
      } else {
        setUploadItem({
          ...uploadItem,
          brandDesiredItemName: brandName,
          desiredItem: {
            ...uploadItem.desiredItem!,
            brandId,
          },
        });
      }
      navigation.goBack();
    };
  } else {
    selectedBrandId = uploadItem.brandId;
    handleSelectBrand = (brandId: number, brandName: string) => {
      if (selectedBrandId === brandId) {
        setUploadItem({ ...uploadItem, brandId: 0, brandName: "" });
      } else {
        setUploadItem({ ...uploadItem, brandId, brandName });
      }
      navigation.goBack();
    };
  }

  useEffect(() => {
    dispatch(getAllBrandThunk());
  }, [dispatch]);

  return (
    <SafeAreaView className="flex-1 bg-[#F6F9F9]">
      <Header title="Brand" showOption={false} />

      <ScrollView className="flex-1 mx-5">
        {loading && <ActivityIndicator size="large" color="#00b0b9" />}
        {error && (
          <Text className="text-red-500 text-center mt-4">{error}</Text>
        )}

        {brands.map((brand) => {
          const isSelected = selectedBrandId === brand.id;
          return (
            <TouchableOpacity
              key={brand.id}
              onPress={() => handleSelectBrand(brand.id, brand.brandName)}
              className={`p-5 rounded-lg mt-3 flex-row justify-between items-center ${
                isSelected ? "bg-[#00b0b91A]" : "bg-white"
              }`}
            >
              <Text
                className={`text-lg ${
                  isSelected
                    ? "text-[#00b0b9] font-bold"
                    : "text-black font-normal"
                }`}
              >
                {brand.brandName}
              </Text>
              <Icon
                name={
                  isSelected ? "radio-button-checked" : "radio-button-unchecked"
                }
                size={24}
                color="#00b0b9"
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default BrandSelectionScreen;
