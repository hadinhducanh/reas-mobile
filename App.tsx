import React, { useEffect, useState } from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import "./locales/i18n";
import { StyleSheet } from "react-native";
import SplashScreen from "./src/screens/SplashScreen";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import "./global.css";
import ChatHistoryScreen from "./src/screens/ChatHistoryScreen";
import OrderFailedScreen from "./src/screens/OrderScreen/OrderFailedScreen";

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
    <SafeAreaProvider style={styles.container}>
      <AppNavigator />
    </SafeAreaProvider>
    // <ChatHistoryScreen />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F9F9",
  },
});

export default App;
