import React, { useEffect } from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import "./locales/i18n";
import { StyleSheet } from "react-native";
import SplashScreen from "./src/screens/Splash";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./global.css";
import { Provider } from "react-redux";
import store, { AppDispatch } from "./src/redux/store";
import { UploadItemProvider } from "./src/context/ItemContext";
import { ExchangeItemProvider } from "./src/context/ExchangeContext";
import { useNotification } from "./src/hook/useNotification";
import { useDispatch } from "react-redux";
import { setRegistrationTokenThunk } from "./src/redux/thunk/notificationThunk";
import { UpdateItemProvider } from "./src/context/UpdateItemContext";
import { AuthRestoreHandler } from "./src/components/AuthRestoreHandler";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider style={styles.container}>
        <AuthRestoreHandler />

        <UploadItemProvider>
          <UpdateItemProvider>
            <ExchangeItemProvider>
              <TokenHandler />
              <AppNavigator />
            </ExchangeItemProvider>
          </UpdateItemProvider>
        </UploadItemProvider>
      </SafeAreaProvider>
    </Provider>
  );
};

const TokenHandler: React.FC = () => {
  const token = useNotification();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (token) {
      dispatch(setRegistrationTokenThunk(token));
    }
  }, [token, dispatch]);

  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F9F9",
  },
});

export default App;
