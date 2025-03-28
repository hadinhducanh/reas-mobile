import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../../../components/Header";
import LoadingButton from "../../../../components/LoadingButton";
import SubscriptionService from "../../../../services/SubscriptionService";
import { SubscriptionResponse } from "../../../../common/models/subscription";

const ExtendPremium: React.FC = () => {
  const [selectedExtension, setSelectedExtension] = useState<string | null>(null);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchSubscriptionPlans = async () => {
      setLoading(true);
      try {
        const data = await SubscriptionService.getSubscription();
  
        if (Array.isArray(data)) {
          setSubscriptionPlans(data);
        } else {
          console.error("Unexpected API response format:", data);
          setSubscriptionPlans([]);
        }
      } catch (error) {
        console.error("Failed to fetch subscription plans", error);
        setSubscriptionPlans([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchSubscriptionPlans();
  }, []);
  
  const handleSubscribe = () => {
    if (!selectedExtension) return;
    console.log("User selected subscription plan ID:", selectedExtension);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#00B0B9]" edges={["top"]}>
      <Header
        title="Extend Subscription"
        backgroundColor="bg-[#00B0B9]"
        backIconColor="white"
        textColor="text-white"
        optionIconColor="white"
        showOption={false}
      />

      <View className="flex-1 bg-gray-100 px-4 py-6 flex-col">
        {loading ? (
          <Text className="text-center text-lg text-gray-500">Loading plans...</Text>
        ) : (
          <View className="my-4">
            {subscriptionPlans.map((plan) => (
              <TouchableOpacity
                key={plan.id}
                onPress={() => setSelectedExtension(plan.id.toString())}
                className={`flex-row justify-between items-center p-5 mb-2 rounded-lg border-2 bg-white ${
                  selectedExtension === plan.id.toString() ? "border-[#00b0b9]" : "border-gray-200"
                }`}
              >
                <View>
                  <Text className="text-base font-semibold text-gray-900">{plan.name}</Text>
                  <Text className="text-sm text-gray-600">{plan.description}</Text>
                </View>
                <Text className="text-lg font-bold text-gray-900">{Number(plan.price).toLocaleString()}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <LoadingButton
          title="Extend Now"
          onPress={handleSubscribe}
          buttonClassName="p-4"
          disable={!selectedExtension}
        />
      </View>
    </SafeAreaView>
  );
};

export default ExtendPremium;
