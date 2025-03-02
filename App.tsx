import React, { useEffect, useState } from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import "./locales/i18n";
import { StyleSheet } from "react-native";
import SplashScreen from "./src/screens/Splash";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import "./global.css";
import ChatHistoryScreen from "./src/screens/Chat/ChatHistory";
import OrderFailedScreen from "./src/screens/OrderScreen/OrderFailed";
import { Provider } from "react-redux";
import store from "./src/redux/store";

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
      <Provider store={store}>
        <AppNavigator />
      </Provider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F9F9",
  },
});

export default App;
