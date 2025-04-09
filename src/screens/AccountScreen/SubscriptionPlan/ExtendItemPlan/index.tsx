import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { RootStackParamList } from "../../../../navigation/AppNavigator";
import { AppDispatch, RootState } from "../../../../redux/store";
import { getSubscriptionThunk } from "../../../../redux/thunk/subscriptionThunks";
import Header from "../../../../components/Header";
import LoadingButton from "../../../../components/LoadingButton";
import { CreatePaymentLinkRequest } from "../../../../common/models/payment";
import { createPaymentLinkThunk } from "../../../../redux/thunk/paymentThunk";

const ExtendItemPlan: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { checkoutUrl, loadingPayment } = useSelector(
    (state: RootState) => state.payment
  );
  const { plans, loading, error } = useSelector(
    (state: RootState) => state.subscription
  );
  const dispatch = useDispatch<AppDispatch>();
  const [pendingNavigation, setPendingNavigation] = useState<{
    returnUrl: string;
    cancelUrl: string;
  } | null>(null);

  useEffect(() => {
    dispatch(getSubscriptionThunk());
  }, [dispatch]);

  const planName = plans.length > 0 ? plans[3].name : "Annual Plan";
  const planPrice =
    plans.length > 0 ? `${plans[3].price.toLocaleString()}` : "$49.99";

  const handleSubscribe = async () => {
    try {
      const createPaymentLinkRequest: CreatePaymentLinkRequest = {
        description: "Extend item",
        subscriptionPlanId: plans[3].id,
        returnUrl:
          "https://user-images.githubusercontent.com/16245250/38747567-7af6fbbc-3f75-11e8-9f52-16720dbf8231.png",
        cancelUrl:
          "https://img.freepik.com/premium-vector/transaction-is-cancelled-red-stamp_545399-2577.jpg",
      };
      await dispatch(createPaymentLinkThunk(createPaymentLinkRequest));
      setPendingNavigation({
        returnUrl: createPaymentLinkRequest.returnUrl,
        cancelUrl: createPaymentLinkRequest.cancelUrl,
      });
    } catch (error) {
      console.error("Error creating payment link:", error);
    }
  };

  useEffect(() => {
    if (checkoutUrl && pendingNavigation) {
      navigation.navigate("Payment", {
        payOSURL: checkoutUrl,
        returnUrl: pendingNavigation.returnUrl,
        cancelUrl: pendingNavigation.cancelUrl,
      });

      setPendingNavigation(null);
    }
  }, [checkoutUrl, pendingNavigation]);

  return (
    <SafeAreaView className="flex-1 bg-[#00B0B9]" edges={["top"]}>
      <Header
        title="Extend"
        backgroundColor="bg-[#00B0B9]"
        backIconColor="white"
        textColor="text-white"
        optionIconColor="white"
        showOption={false}
      />

      <View className="flex-1 bg-gray-100 px-4 py-6 flex-col justify-center">
        <View className="items-center">
          <Icon name="sparkles" size={40} color="#FBBF24" />
          <Text className="text-2xl font-bold mt-5">Extend item</Text>
          <Text className="text-base text-gray-500 mt-1 text-center">
            Unlock more features and extend your item listing
          </Text>
        </View>

        <View className="bg-white mt-8 px-5 py-6 rounded-lg">
          <Text className="text-xl font-bold mb-6 text-black">Extend item</Text>

          <View className="flex-row items-center">
            <Icon name="sync-circle" size={20} color="#00b0b9" />
            <View className="ml-2">
              <Text className="font-medium text-lg text-black">
                Extended Duration
              </Text>
              <Text className="text-sm text-gray-500">
                Items stay visible for 2 weeks longer
              </Text>
            </View>
          </View>
        </View>

        <View className="bg-white my-8 p-5 rounded-lg flex-row justify-between items-center">
          {loading && (
            <Text className="text-center text-lg text-gray-500">
              Loading...
            </Text>
          )}
          {error && (
            <Text className="text-center text-lg text-red-500">{error}</Text>
          )}
          <View>
            <Text className="text-xl font-bold text-black">{planName}</Text>
          </View>

          <View>
            <Text className="text-2xl font-bold text-[#00b0b9]">
              {planPrice} VND
            </Text>
          </View>
        </View>

        <LoadingButton
          title="Check out"
          onPress={handleSubscribe}
          buttonClassName="p-4"
          loading={loadingPayment}
        />
      </View>
    </SafeAreaView>
  );
};

export default ExtendItemPlan;
