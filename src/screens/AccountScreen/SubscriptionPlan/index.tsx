import React, { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../../components/Header";
import Icon from "react-native-vector-icons/Ionicons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../navigation/AppNavigator";
import LoadingButton from "../../../components/LoadingButton";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { getSubscriptionThunk } from "../../../redux/thunk/subscriptionThunks";

const Premium: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const { plans, loading, error } = useSelector(
    (state: RootState) => state.subscription
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getSubscriptionThunk());
  }, [dispatch]);

  const handleSubscribe = () => {
    if (!accessToken) {
      navigation.navigate("SignIn");
      return;
    }
    navigation.navigate("ExtendPremium");
  };

  const planName = plans.length > 0 ? plans[0].name : "Annual Plan";
  const planPrice =
    plans.length > 0 ? `${plans[0].price.toLocaleString()}` : "$49.99";

  return (
    <SafeAreaView className="flex-1" edges={["top"]}>
      <Header
        title="Premium subscription"
        backgroundColor="bg-[#00B0B9]"
        backIconColor="white"
        textColor="text-white"
        optionIconColor="white"
        showOption={false}
        onBackPress={() =>
          navigation.navigate("MainTabs", { screen: "Account" })
        }
      />
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#00b0b9" />
        </View>
      ) : (
        <View className="flex-1 bg-gray-100 px-4 py-6 flex-col justify-center">
          <View className="items-center">
            <Icon name="sparkles" size={40} color="#FBBF24" />
            <Text className="text-2xl font-bold mt-5">Upgrade to Premium</Text>
            <Text className="text-base text-gray-500 mt-1 text-center">
              Unlock more features and extend your item listing
            </Text>
          </View>

          <View className="bg-white mt-8 px-5 py-6 rounded-lg">
            <Text className="text-xl font-bold mb-6 text-black">
              Premium Benefits
            </Text>

            <View className="flex-row items-center">
              <Icon name="sync-circle" size={20} color="#00b0b9" />
              <View className="ml-2">
                <Text className="font-medium text-lg text-black">
                  Extended Listing Duration
                </Text>
                <Text className="text-sm text-gray-500">
                  Items stay visible for 30 days longer
                </Text>
              </View>
            </View>

            <View className="flex-row items-center my-5">
              <Icon name="layers-outline" size={20} color="#00b0b9" />
              <View className="ml-2">
                <Text className="font-medium text-lg text-black">
                  More Item Posts
                </Text>
                <Text className="text-sm text-gray-500">
                  Post up to 15 items simultaneously
                </Text>
              </View>
            </View>
          </View>

          <View className="bg-white my-8 p-5 rounded-lg flex-row justify-between items-center">
            <View>
              <Text className="text-xl font-bold text-black">{planName}</Text>
              <Text className="text-base text-gray-500 mt-2">
                1 month of premium features
              </Text>
            </View>

            <View>
              <Text className="text-2xl font-bold text-[#00b0b9]">
                {planPrice} VND
              </Text>
              <Text className="text-sm text-gray-500 ml-auto mt-2">
                per month
              </Text>
            </View>
          </View>

          <LoadingButton
            title="Choose your plan"
            onPress={handleSubscribe}
            buttonClassName="p-4"
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default Premium;
