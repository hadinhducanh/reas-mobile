import React from "react";
import { Text, SafeAreaView, View, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";

import HomeScreen from "../screens/HomeScreen";
import FavoriteScreen from "../screens/FavortieScreen";
import AccountScreen from "../screens/AccountScreen";
import { createStackNavigator } from "@react-navigation/stack";
import SignInScreen from "../screens/AuthenScreen/SignInScreen";
import SignUpScreen from "../screens/AuthenScreen/SignUpScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ProfileDetailScreen from "../screens/AccountScreen/ProfileDetailScreen";
import ExchangeHistoryScreen from "../screens/AccountScreen/ExchangeHistoryScreen";
import ChatHistoryScreen from "../screens/ChatHistoryScreen";
import ExchangeDetailScreen from "../screens/AccountScreen/ExchangeDetailScreen";
import ChatDetailsScreen from "../screens/ChatDetailsScreen";
import StatisticsScreen from "../screens/StatisticsScreen";

const CategoryScreen = () => (
  <SafeAreaView className="flex-1 items-center justify-center bg-[#F6F9F9]">
    <Text className="text-[18px] text-center">This is Category Screen</Text>
  </SafeAreaView>
);

const PostScreen = () => (
  <SafeAreaView className="flex-1 items-center justify-center bg-[#F6F9F9]">
    <Text className="text-[18px] text-center">This is Post Screen</Text>
  </SafeAreaView>
);

const TabArr = [
  { route: "Home", label: "Home", component: HomeScreen, type: "home-outline" },
  {
    route: "Items",
    label: "Items",
    component: CategoryScreen,
    type: "grid-outline",
  },
  {
    route: "Upload",
    label: "Upload",
    component: PostScreen,
    type: "add-circle-outline",
  },
  {
    route: "Exchanges",
    label: "Exchanges",
    component: FavoriteScreen,
    type: "swap-horizontal-outline",
  },
  {
    route: "Account",
    label: "Account",
    component: AccountScreen,
    type: "person-outline",
  },
];

const Tab = createBottomTabNavigator();

// Bottom Tab Navigator
function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: Platform.OS === "ios" ? 85 : 72,
        },
        tabBarShowLabel: false,
      }}
    >
      {TabArr.map((item, index) => (
        <Tab.Screen
          key={index}
          name={item.route}
          component={item.component}
          options={{
            tabBarIcon: ({ focused }) => {
              if (item.route === "Upload") {
                return (
                  <View className="mt-[20px] h-[80px] w-[80px] items-center justify-center rounded-full bg-[#00B0B9]">
                    <Icon
                      name={item.type}
                      size={30}
                      color="#fff"
                      className="mb-[2px]"
                    />
                    <Text className="text-xs font-bold text-white">
                      {item.label}
                    </Text>
                  </View>
                );
              }
              const iconColor = focused ? "#00B0B9" : "#738AA0";
              return (
                <View className="mt-[25px] h-[75px] w-[75px] items-center justify-center rounded-full">
                  <Icon
                    name={item.type}
                    size={25}
                    color={iconColor}
                    className="mb-[2px]"
                  />
                  <Text
                    className={`text-xs font-bold ${
                      focused ? "text-[#00B0B9]" : "text-[#738AA0]"
                    }`}
                  >
                    {item.label}
                  </Text>
                </View>
              );
            },
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

const Stack = createStackNavigator();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Màn hình chính: Bottom Tab Navigator */}
        <Stack.Screen name="MainTabs" component={BottomTabs} />
        {/* Các màn hình Stack khác */}
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Profile" component={ProfileDetailScreen} />
        <Stack.Screen
          name="ExchangeHistory"
          component={ExchangeHistoryScreen}
        />
        <Stack.Screen name="ExchangeDetail" component={ExchangeDetailScreen} />
        <Stack.Screen name="ChatHistory" component={ChatHistoryScreen} />
        <Stack.Screen name="ChatDetails" component={ChatDetailsScreen} />
        <Stack.Screen name="Statistics" component={StatisticsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
