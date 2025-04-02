import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

import Header from "../../../../components/Header";
import LoadingButton from "../../../../components/LoadingButton";
import { AppDispatch, RootState } from "../../../../redux/store";
import { getSubscriptionThunk } from "../../../../redux/thunk/subscriptionThunks";

const ExtendPremium: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { plans, loading, error } = useSelector((state: RootState) => state.subscription);
  const [selectedExtension, setSelectedExtension] = useState<number | null>(null);

  useEffect(() => {
    dispatch(getSubscriptionThunk());
  }, [dispatch]);

  const handleSubscribe = () => {
    if (selectedExtension !== null) {
      console.log("Subscribing to plan:", selectedExtension);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#00B0B9]" edges={["top"]}>
      <Header
        title="Choose your plan"
        backgroundColor="bg-[#00B0B9]"
        backIconColor="white"
        textColor="text-white"
        optionIconColor="white"
        showOption={false}
      />

      <View className="flex-1 bg-gray-100 px-4 py-6 flex-col">

        {loading && <Text className="text-center text-lg text-gray-500">Loading...</Text>}
        {error && <Text className="text-center text-lg text-red-500">{error}</Text>}

       <View className="bg-white p-5 rounded-lg shadow-md mb-4 border-2 border-gray-200">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-lg font-semibold text-gray-900">Current Plan</Text>
            <View className="bg-green-100 px-3 py-1 rounded-full">
              <Text className="text-green-600 text-xs font-semibold">Active</Text>
            </View>
          </View>
          
          <View className="flex-row justify-between items-center">
            <Text className="text-base text-gray-900 font-semibold">Annual Premium</Text>
            <Text className="text-lg font-bold text-gray-900">$99</Text>
          </View>

          <Text className="text-sm text-gray-500 mt-1">Next billing date: March 15, 2025</Text>
        </View>

        <View className="my-4">
          {plans.length > 0 ? (
            plans.map((plan) => (
              <TouchableOpacity
                key={plan.id}
                onPress={() => setSelectedExtension(plan.id)}
                className={`flex-row justify-between items-center p-5 mb-2 rounded-lg border-2 bg-white ${
                  selectedExtension === plan.id ? "border-[#00b0b9]" : "border-gray-200"
                }`}
              >
                <View>
                  <Text className="text-base font-semibold text-gray-900">{plan.name}</Text>
                  <Text className="text-sm text-gray-400">{plan.description}</Text>
                </View>
                <Text className="text-lg font-bold text-gray-900">{Number(plan.price).toLocaleString()}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text className="text-center text-lg text-gray-500">No plans available</Text>
          )}
        </View>

        <LoadingButton title="Check out" onPress={handleSubscribe} buttonClassName="p-4" />
      </View>
    </SafeAreaView>
  );
};

export default ExtendPremium;
