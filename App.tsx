import React, { useEffect, useState } from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import "./locales/i18n";
import { NavigationContainer } from "@react-navigation/native";
import { StyleSheet, Text, View } from "react-native";
import SplashScreen from "./src/screens/SplashScreen";
import { SafeAreaView } from "react-native-safe-area-context";
import SignUpScreen from "./src/screens/AuthenScreen/SignUpScreen";
import ForgotPassScreen from "./src/screens/AuthenScreen/ForgotPassScreen";
import ForgotPassSuccessScreen from "./src/screens/AuthenScreen/ForgotPassSuccessScreen";
import ResetPassword from "./src/screens/AuthenScreen/ResetPasswordScreen";
import SignUpSuccessScreen from "./src/screens/AuthenScreen/SignUpSuccessScreen";
import VerifyPhoneScreen from "./src/screens/AuthenScreen/VerifyPhoneScreen";
import OTPScreen from "./src/screens/AuthenScreen/OTPScreen";
import SignInScreen from "./src/screens/AuthenScreen/SignInScreen";
import ResetPasswordScreen from "./src/screens/AuthenScreen/ResetPasswordScreen";

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F9F9",
  },
});

export default App;
