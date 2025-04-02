import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import { WebView, WebViewNavigation } from "react-native-webview";
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/AppNavigator";

const Payment: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, "Payment">>();
  const { payOSURL, returnUrl, cancelUrl } = route.params;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleNavigationChange = (navState: WebViewNavigation) => {
    const { url } = navState;
    if (url.startsWith(returnUrl)) {
      navigation.navigate("OrderSuccess");
    }
    if (url.startsWith(cancelUrl)) {
      navigation.navigate("OrderFailed");
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-[#00B0B9]" edges={["top"]}>
      <Header
        title="Payment"
        backgroundColor="bg-[#00B0B9]"
        backIconColor="white"
        textColor="text-white"
        optionIconColor="white"
        showOption={false}
      />

      <WebView
        className="flex-1"
        source={{ uri: payOSURL }}
        onNavigationStateChange={handleNavigationChange}
      />
    </SafeAreaView>
  );
};

export default Payment;
