import React, { useEffect, useState } from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import "./locales/i18n";
import { NavigationContainer } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";
import SplashScreen from "./src/screens/SplashScreen";
import { SafeAreaView } from "react-native-safe-area-context";

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
