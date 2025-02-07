import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import { Text, SafeAreaView, StyleSheet, View } from "react-native";
import HomeScreen from "../screens/HomeScreen";
import FavoriteScreen from "../screens/FavortieScreen";
import AccountScreen from "../screens/AccountScreen";

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

export default function AppNavigator() {
  return (
    <View style={styles.container}>
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
            return (
              <Icon
                name={icons[route.name as keyof typeof icons]}
                size={size}
                color={color}
              />
            );
          },
          tabBarActiveTintColor: "#00B0B9",
          tabBarInactiveTintColor: "#738AA0",
          tabBarStyle: styles.tabBarStyle,
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Category"
          component={CategoryScreen}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Post"
          component={PostScreen}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Favorite"
          component={FavoriteScreen}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Account"
          component={AccountScreen}
          options={{ headerShown: false }}
        />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F6F9F9",
  },
  contentText: { fontSize: 18, textAlign: "center" },
  container: {
    flex: 1,
    marginHorizontal: 8,
  },
  tabBarStyle: {
    borderRadius: 10,
    backgroundColor: "#ffffff",
    marginBottom: 8,
  },
});
