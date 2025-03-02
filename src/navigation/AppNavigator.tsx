import React from "react";
import { Text, SafeAreaView, View, Platform } from "react-native";
import { NavigationContainer, RouteProp } from "@react-navigation/native";
import {
  createStackNavigator,
  StackNavigationProp,
} from "@react-navigation/stack";
import Icon from "react-native-vector-icons/Ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "../screens/Home";
import FavoriteScreen from "../screens/Favortie";
import AccountScreen from "../screens/AccountScreen";

import SignInScreen from "../screens/AuthenScreen/SignIn";
import SignUpScreen from "../screens/AuthenScreen/SignUp";
import ProfileDetailScreen from "../screens/AccountScreen/ProfileDetail";
import ExchangeHistoryScreen from "../screens/AccountScreen/ExchangeHistory";
import ChatHistoryScreen from "../screens/Chat/ChatHistory";
import ExchangeDetailScreen from "../screens/AccountScreen/ExchangeDetail";
import ChatDetailsScreen from "../screens/Chat/ChatDetails";
import StatisticsScreen from "../screens/Statistics";
import OTPScreen from "../screens/AuthenScreen/OTP";
import SignUpSuccessScreen from "../screens/AuthenScreen/SignUpSuccess";
import ItemDetailScreen from "../screens/ItemDetail";
import UploadScreen from "../screens/UploadScreen";
import TypeOfItemScreen from "../screens/TypeOfItemScreen";
import TypeOfItemDetailScreen from "../screens/TypeOfItemDetailScreen";
import ItemConditionScreen from "../screens/ItemConditionScreen";
import MethodOfExchangeScreen from "../screens/MethodOfExchangeScreen";
import ExchangeTypeScreen from "../screens/ExchangeTypeScreen";
import ExchangeDesiredItemScreen from "../screens/ExchangeDesiredItemScreen";
import ResetPassword from "../screens/AuthenScreen/ResetPassword";
import CreateExchange from "../screens/CreateExchange";
import BrowseItems from "../screens/CreateExchange/BrowseItems";
import DifferentItem from "../screens/CreateExchange/DifferentItem";
import ConfirmExchange from "../screens/CreateExchange/ConfirmExchange";
import AccpectRejectExchange from "../screens/CreateExchange/AccpectRejectExchange";

type ItemType = {
  id: number;
  name: string;
  price: string;
  image: string;
  location: string;
  description: string;
  isFavorited: boolean;
};

// Định nghĩa kiểu cho các màn hình trong Stack Navigator
export type RootStackParamList = {
  MainTabs: undefined;
  SignIn: undefined;
  SignUp: undefined;
  Profile: undefined;
  ExchangeHistory: undefined;
  ExchangeDetail: undefined;
  ChatHistory: undefined;
  ChatDetails: undefined;
  Statistics: undefined;
  ItemDetail: { item: ItemType };
  TypeOfItemScreen: undefined;
  TypeOfItemDetailScreen: undefined;
  ItemConditionScreen: undefined;
  UploadScreen: undefined;
  MethodOfExchangeScreen: undefined;
  ExchangeTypeScreen: undefined;
  ExchangeDesiredItemScreen: undefined;
  SignUpSuccess: undefined;
  OTP: undefined;
  ResetPassword: undefined;
  CreateExchange: { item: ItemType };
  BrowseItems: undefined;
  DifferentItem: undefined;
  ConfirmExchange: undefined;
  AccpectRejectExchange: undefined;
};

const CategoryScreen = () => (
  <SafeAreaView className="flex-1 items-center justify-center bg-[#F6F9F9]">
    <Text className="text-[18px] text-center">This is Category Screen</Text>
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
    component: UploadScreen,
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

// Sử dụng kiểu RootStackParamList cho Stack Navigator
const Stack = createStackNavigator<RootStackParamList>();

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

        <Stack.Screen name="OTP" component={OTPScreen} />
        <Stack.Screen name="SignUpSuccess" component={SignUpSuccessScreen} />

        <Stack.Screen name="ItemDetail" component={ItemDetailScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
        <Stack.Screen name="CreateExchange" component={CreateExchange} />
        <Stack.Screen name="TypeOfItemScreen" component={TypeOfItemScreen} />
        <Stack.Screen
          name="TypeOfItemDetailScreen"
          component={TypeOfItemDetailScreen}
        />
        <Stack.Screen
          name="ItemConditionScreen"
          component={ItemConditionScreen}
        />
        <Stack.Screen name="UploadScreen" component={UploadScreen} />
        <Stack.Screen
          name="MethodOfExchangeScreen"
          component={MethodOfExchangeScreen}
        />
        <Stack.Screen
          name="ExchangeTypeScreen"
          component={ExchangeTypeScreen}
        />
        <Stack.Screen
          name="ExchangeDesiredItemScreen"
          component={ExchangeDesiredItemScreen}
        />
        <Stack.Screen name="BrowseItems" component={BrowseItems} />
        <Stack.Screen name="DifferentItem" component={DifferentItem} />
        <Stack.Screen name="ConfirmExchange" component={ConfirmExchange} />
        <Stack.Screen
          name="AccpectRejectExchange"
          component={AccpectRejectExchange}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
