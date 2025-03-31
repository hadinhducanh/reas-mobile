import React, { useEffect } from "react";
import { ScrollView, Text, View } from "react-native";
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

const UploadItemSuccess: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { itemRecommnand, itemUpload } = useSelector(
    (state: RootState) => state.item
  );

  useEffect(() => {
    if (itemUpload && itemUpload?.desiredItem !== null) {
      dispatch(
        getRecommendedItemsThunk({
          id: itemUpload?.id,
        })
      );
    }
  }, [dispatch, itemUpload?.id]);

  return (
    <SafeAreaView className="flex-1" edges={["top"]}>
      <Header
        title="Upload successfully"
        showOption={false}
        onBackPress={() => navigation.navigate("MainTabs", { screen: "Items" })}
      />

      <View className="flex-1 bg-[#F6F9F9]">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 px-5 justify-center items-center">
            <View className="w-full bg-white rounded-md items-center">
              <View className="w-[266px] h-[266px] relative overflow-hidden my-[20px] rounded-[10px]">
                <View className="absolute inset-0 bg-[#dfecec]" />
                <Icon
                  name="checkmark-circle-outline"
                  size={130}
                  color="#ffffff"
                  className="absolute top-1/4 left-1/4"
                />
              </View>
              <Text className="text-xl font-bold text-[#0B1D2D] mb-2">
                Upload item successfully !
              </Text>
              <Text className="text-base text-center text-gray-500">
                Your item is in review queue right now. Please wait for approval
                before the item is available to exchange
              </Text>
            </View>
          </View>

          <View className="mt-8">
            <HorizontalSection
              title="Bài đăng tương tự"
              data={itemRecommnand}
              navigation={navigation}
            />
          </View>

          <View className="py-5 mx-5">
            <LoadingButton
              title="Back to items"
              buttonClassName="p-4"
              onPress={() =>
                navigation.navigate("MainTabs", { screen: "Items" })
              }
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default UploadItemSuccess;
