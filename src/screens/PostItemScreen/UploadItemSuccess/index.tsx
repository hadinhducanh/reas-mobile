import React, { useEffect } from "react";
import { ActivityIndicator, Platform, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../navigation/AppNavigator";
import Header from "../../../components/Header";
import HorizontalSection from "../../../components/HorizontalSection";
import LoadingButton from "../../../components/LoadingButton";
import Icon from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { getRecommendedItemsThunk } from "../../../redux/thunk/itemThunks";
import { resetItemDetailState } from "../../../redux/slices/itemSlice";

const UploadItemSuccess: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { itemRecommnand, itemUpload, loading, itemAvailable } = useSelector(
    (state: RootState) => state.item
  );

  useEffect(() => {
    if (itemUpload && itemUpload.desiredItem !== null) {
      dispatch(getRecommendedItemsThunk({ id: itemUpload.id, limit: 4 }));
    }
  }, [dispatch, itemUpload]);

  const hanleBackPress = () => {
    dispatch(resetItemDetailState());
    navigation.navigate("MainTabs", { screen: "Items" });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f6f9f9]">
      <Header
        title="Upload successfully"
        showOption={false}
        onBackPress={hanleBackPress}
      />
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#00b0b9" />
        </View>
      ) : (
        <>
          <View className="flex-1 justify-center p-5">
            <View
              className={`bg-white rounded-xl p-6 items-center justify-center shadow-lg ${
                itemRecommnand.length === 0 ? "h-full" : ""
              }`}
            >
              <View
                className={`${
                  itemRecommnand.length === 0 ? "w-60 h-60" : "w-20 h-20"
                } relative overflow-hidden mb-6 rounded-xl`}
              >
                <View className="absolute inset-0 bg-[#dfecec]" />
                <Icon
                  name="checkmark-outline"
                  size={itemRecommnand.length === 0 ? 120 : 50}
                  color="#ffffff"
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                />
              </View>
              <Text
                className={`text-2xl font-bold text-[#0b1d2d] text-center ${
                  itemRecommnand.length === 0 ? "" : "my-5"
                } `}
              >
                Upload item successfully!
              </Text>
              <Text className="text-lg font-medium text-gray-500 text-center">
                Your item is in review queue right now.{"\n"}Please wait for
                approval before the item{"\n"}is available to exchange.
              </Text>
            </View>

            {itemRecommnand.length !== 0 && (
              <View className="mt-6">
                <HorizontalSection
                  title={`You may want to check out items based${"\n"}on your desired item:`}
                  data={itemRecommnand}
                  navigation={navigation}
                />
              </View>
            )}
          </View>

          <View
            className={`mt-6 px-5 bg-white rounded-t-xl flex-row items-center justify-center ${
              Platform.OS === "ios" ? "pt-4 pb-7" : "py-3"
            } shadow-inner`}
          >
            <LoadingButton
              title="Back to items"
              buttonClassName="w-full p-4"
              onPress={hanleBackPress}
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default UploadItemSuccess;
