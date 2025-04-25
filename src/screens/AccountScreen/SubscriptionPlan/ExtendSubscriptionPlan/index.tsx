import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

import Header from "../../../../components/Header";
import LoadingButton from "../../../../components/LoadingButton";
import { AppDispatch, RootState } from "../../../../redux/store";
import {
  getCurrentSubscriptionThunk,
  getSubscriptionThunk,
} from "../../../../redux/thunk/subscriptionThunks";
import { createPaymentLinkThunk } from "../../../../redux/thunk/paymentThunk";
import { CreatePaymentLinkRequest } from "../../../../common/models/payment";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../../navigation/AppNavigator";
import { useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";

const ExtendPremium: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { currentPlan, plans, loading } = useSelector(
    (state: RootState) => state.subscription
  );
  const { checkoutUrl, loadingPayment } = useSelector(
    (state: RootState) => state.payment
  );
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [pendingNavigation, setPendingNavigation] = useState<{
    returnUrl: string;
    cancelUrl: string;
  } | null>(null);

  useFocusEffect(
    useCallback(() => {
      dispatch(getSubscriptionThunk());
      dispatch(getCurrentSubscriptionThunk());
    }, [dispatch])
  );

  const handleSubscribe = async () => {
    try {
      if (selectedPlan !== null) {
        const createPaymentLinkRequest: CreatePaymentLinkRequest = {
          description: "Extend Subcription",
          subscriptionPlanId: selectedPlan,
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
      }
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

  const formatExchangeDate = (exchangeDate: string): string => {
    const dt = new Date(exchangeDate);

    const day = dt.getDate().toString().padStart(2, "0");
    const month = (dt.getMonth() + 1).toString().padStart(2, "0");
    const year = dt.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;

    return `${formattedDate}`;
  };

  const isPastDate = (exchangeDate: string): boolean => {
    const inputDate = new Date(exchangeDate);
    const today = new Date();

    inputDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return inputDate < today;
  };

  const handleBackPress = () => {
    if (currentPlan) {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: "MainTabs",
            state: { routes: [{ name: "Account" }] },
          },
        ],
      });
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#00B0B9]" edges={["top"]}>
      <Header
        title="Extend subscription"
        backgroundColor="bg-[#00B0B9]"
        backIconColor="white"
        textColor="text-white"
        optionIconColor="white"
        showOption={false}
        onBackPress={handleBackPress}
      />

      {loading ? (
        <View className="flex-1 justify-center items-center bg-white">
          <ActivityIndicator size="large" color="#00b0b9" />
        </View>
      ) : (
        <>
          {currentPlan && (
            <View className="bg-white px-5 pt-3 flex-1">
              <View className="bg-white p-5 rounded-lg shadow-md mb-4 border-2 border-gray-200">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-lg font-semibold text-gray-900">
                    Current Plan
                  </Text>
                  <View
                    className={`${
                      isPastDate(currentPlan.endDate)
                        ? "bg-[rgba(250,85,85,0.2)]"
                        : "bg-[rgba(22,163,74,0.2)]"
                    } px-3 py-1 rounded-full`}
                  >
                    <Text
                      className={`${
                        isPastDate(currentPlan.endDate)
                          ? "text-[#FA5555]"
                          : "text-[#16A34A]"
                      } text-sm font-semibold`}
                    >
                      {isPastDate(currentPlan.endDate) ? "Inactive" : "Active"}
                    </Text>
                  </View>
                </View>

                <View className="flex-row justify-between items-center">
                  <Text className="text-base text-gray-900 font-semibold">
                    {currentPlan.subscriptionPlan.name}
                  </Text>
                </View>
                <Text className="text-sm text-gray-500 mt-1">
                  Start date: {formatExchangeDate(currentPlan.startDate)}
                </Text>
                <Text className="text-sm text-gray-500 mt-1">
                  Next billing date: {formatExchangeDate(currentPlan.endDate)}
                </Text>
              </View>
            </View>
          )}

          {!currentPlan && (
            <>
              {plans.length > 0 ? (
                <View className="bg-white flex-1 px-5 pt-3">
                  {plans
                    .filter((_, index) => index !== 3)
                    .map((plan) => (
                      <TouchableOpacity
                        key={plan.id}
                        onPress={() => setSelectedPlan(plan.id)}
                        className={`flex-row justify-between items-center p-5 mb-2 rounded-lg border-2 bg-white ${
                          selectedPlan === plan.id
                            ? "border-[#00b0b9]"
                            : "border-gray-200"
                        }`}
                      >
                        <View>
                          <Text className="text-base font-semibold text-gray-900">
                            {plan.name}
                          </Text>
                          <Text className="text-sm text-gray-400">
                            {plan.description}
                          </Text>
                        </View>
                        <Text className="text-lg font-bold text-gray-900">
                          {Number(plan.price).toLocaleString() + " VND"}
                        </Text>
                      </TouchableOpacity>
                    ))}

                  <View className="mt-5">
                    <LoadingButton
                      title="Subscribe now"
                      onPress={handleSubscribe}
                      buttonClassName="p-4"
                      loading={loadingPayment}
                    />
                  </View>
                </View>
              ) : (
                <View className="flex-1 justify-center items-center bg-white">
                  <Icon
                    name="remove-circle-outline"
                    size={70}
                    color={"#00b0b9"}
                  />
                  <Text className="text-gray-500">
                    No subcription plans available
                  </Text>
                </View>
              )}
            </>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

export default ExtendPremium;
