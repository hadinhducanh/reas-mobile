import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { View, Text, SafeAreaView, StyleSheet } from "react-native";
import HomeScreen from "../screens/HomeScreen";
import FavoriteScreen from "../screens/FavortieScreen";

const Tab = createBottomTabNavigator();


const CategoryScreen = () => (
  <SafeAreaView style={styles.screenContainer}>
    <Text style={styles.contentText}>This is Category Screen</Text>
  </SafeAreaView>
);
const PostScreen = () => (
  <SafeAreaView style={styles.screenContainer}>
    <Text style={styles.contentText}>This is Post Screen</Text>
  </SafeAreaView>
);

const AccountScreen = () => (
  <SafeAreaView style={styles.screenContainer}>
    <Text style={styles.contentText}>This is Account Screen</Text>
  </SafeAreaView>
);

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let icons: { [key: string]: string } = {
              Home: "home-outline",
              Category: "grid-outline",
              Post: "add-circle-outline",
              Favorite: "heart-outline",
              Account: "person-outline",
            };
            return <Icon name={icons[route.name as keyof typeof icons]} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#00B0B9",
          tabBarInactiveTintColor: "#738AA0",
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Tab.Screen name="Category" component={CategoryScreen} options={{ headerShown: false }} />
        <Tab.Screen name="Post" component={PostScreen} options={{ headerShown: false }} />
        <Tab.Screen name="Favorite" component={FavoriteScreen} options={{ headerShown: false }} />
        <Tab.Screen name="Account" component={AccountScreen} options={{ headerShown: false }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  screenContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  contentText: { fontSize: 18, textAlign: "center" },
});
