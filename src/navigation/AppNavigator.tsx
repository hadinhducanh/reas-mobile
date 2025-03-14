import React from "react";
import { Text, SafeAreaView, View, Platform } from "react-native";
import {
  NavigationContainer,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/Ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "../screens/Home";
import AccountScreen from "../screens/AccountScreen";

import SignInScreen from "../screens/AuthenScreen/SignIn";
import SignUpScreen from "../screens/AuthenScreen/SignUp";
import ProfileDetailScreen from "../screens/AccountScreen/ProfileDetail";
import ExchangeHistoryScreen from "../screens/Exchanges/ExchangeHistory";
import ChatHistoryScreen from "../screens/Chat/ChatHistory";
import ExchangeDetailScreen from "../screens/Exchanges/ExchangeDetail";
import ChatDetailsScreen from "../screens/Chat/ChatDetails";
import StatisticsScreen from "../screens/Statistics";
import OTPScreen from "../screens/AuthenScreen/OTP";
import SignUpSuccessScreen from "../screens/AuthenScreen/SignUpSuccess";
import ItemDetailScreen from "../screens/ItemDetail";
import ResetPassword from "../screens/AuthenScreen/ResetPassword";
import CreateExchange from "../screens/CreateExchange";
import BrowseItems from "../screens/CreateExchange/BrowseItems";
import DifferentItem from "../screens/CreateExchange/DifferentItem";
import ConfirmExchange from "../screens/CreateExchange/ConfirmExchange";
import AccpectRejectExchange from "../screens/CreateExchange/AccpectRejectExchange";
import FeedbackItem from "../screens/AccountScreen/FeedbackItem";
import SearchResult from "../screens/SearchResult";
import OwnerItem from "../screens/Owner/OwnerItem";
import OwnerFeedback from "../screens/Owner/OwnerFeedback";
import Favorite from "../screens/Favortie";
import Notifications from "../screens/Notification";
import FilterMap from "../screens/FilterMap";
import UploadScreen from "../screens/PostItemScreen";
import TypeOfItemScreen from "../screens/PostItemScreen/TypeOfItem";
import TypeOfItemDetailScreen from "../screens/PostItemScreen/TypeOfItemDetail";
import ItemConditionScreen from "../screens/PostItemScreen/ItemCondition";
import MethodOfExchangeScreen from "../screens/PostItemScreen/MethodOfExchange";
import ExchangeDesiredItemTypeOfItemScreen from "../screens/PostItemScreen/ExchangeDesiredItem/TypeOfItem";
import BrandSelectionScreen from "../screens/PostItemScreen/BrandSelectionScreen";
import ExchangeDesiredItemBrandSelectionScreen from "../screens/PostItemScreen/ExchangeDesiredItem/BrandSelectionScreen";
import ExchangeDesiredItemConditionScreen from "../screens/PostItemScreen/ExchangeDesiredItem/ItemCondition";
import ItemDetails from "../screens/ItemDetail";
import ItemManagement from "../screens/ItemManagement";
import ItemPreview from "../screens/ItemManagement/ItemPreview";
import ItemExpire from "../screens/ItemManagement/ItemExpire";
import LanguageSwitch from "../screens/LanguageSwitch";
import LanguageSwitchModal from "../screens/LanguageSwitch";
import ExchangeDesiredItemScreen from "../screens/PostItemScreen/ExchangeDesiredItem";
import Premium from "../screens/Premium";
import ExtendPremium from "../screens/Premium/ExtendPremium";
import About from "../screens/About";

export type ItemType = {
  id: number;
  name: string;
  price: number;
  images: string;
  location: string;
  description: string;
  isFavorited: boolean;
};

export type MainTabsParamList = {
  Home: undefined;
  UploadScreen: undefined;
  Exchanges: undefined;
  Account: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabsParamList>;
  SignIn: undefined;
  SignUp: undefined;
  Profile: undefined;
  ExchangeHistory: undefined;
  ExchangeDetail: { statusDetail: string };
  ChatHistory: undefined;
  ChatDetails: undefined;
  Statistics: undefined;
  ItemDetails: { itemId: number };
  ItemPreview: { itemId: number };
  TypeOfItemScreen: undefined;
  TypeOfItemDetailScreen: undefined;
  ItemConditionScreen: undefined;
  UploadScreen: undefined;
  MethodOfExchangeScreen: undefined;
  ExchangeDesiredItemScreen: undefined;
  ExchangeDesiredItemTypeOfItemScreen: undefined;
  BrandSelectionScreen: undefined;
  SignUpSuccess: undefined;
  OTP: undefined;
  ResetPassword: undefined;
  CreateExchange: { itemId: number };
  BrowseItems: undefined;
  DifferentItem: undefined;
  ConfirmExchange: undefined;
  AccpectRejectExchange: undefined;
  FeedbackItem: undefined;
  SearchResult: undefined;
  OwnerItem: undefined;
  OwnerFeedback: undefined;
  Favorite: undefined;
  Notifications: undefined;
  FilterMap: undefined;
  ExchangeDesiredItemBrandSelectionScreen: undefined;
  ExchangeDesiredItemConditionScreen: undefined;
  Premium: undefined;
  ExtendPremium: undefined;
  About: undefined;
};

const TabArr = [
  { route: "Home", label: "Home", component: HomeScreen, type: "home-outline" },
  {
    route: "Items",
    label: "Items",
    component: ItemManagement,
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
    component: ExchangeHistoryScreen,
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

const Stack = createStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={BottomTabs} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Profile" component={ProfileDetailScreen} />
        <Stack.Screen name="ExchangeDetail" component={ExchangeDetailScreen} />
        <Stack.Screen name="ChatHistory" component={ChatHistoryScreen} />
        <Stack.Screen name="ChatDetails" component={ChatDetailsScreen} />
        <Stack.Screen name="Statistics" component={StatisticsScreen} />
        <Stack.Screen name="OTP" component={OTPScreen} />
        <Stack.Screen name="SignUpSuccess" component={SignUpSuccessScreen} />
        <Stack.Screen name="ItemDetails" component={ItemDetails} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
        <Stack.Screen name="CreateExchange" component={CreateExchange} />
        <Stack.Screen name="FeedbackItem" component={FeedbackItem} />
        <Stack.Screen name="SearchResult" component={SearchResult} />
        <Stack.Screen name="OwnerItem" component={OwnerItem} />
        <Stack.Screen name="OwnerFeedback" component={OwnerFeedback} />
        <Stack.Screen name="Favorite" component={Favorite} />
        <Stack.Screen name="Notifications" component={Notifications} />
        <Stack.Screen name="FilterMap" component={FilterMap} />
        <Stack.Screen name="ItemPreview" component={ItemExpire} />
        <Stack.Screen name="Premium" component={Premium} />
        <Stack.Screen name="ExtendPremium" component={ExtendPremium} />
        <Stack.Screen name="About" component={About} />
        <Stack.Screen
          name="ExchangeDesiredItemScreen"
          component={ExchangeDesiredItemScreen}
        />
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
        <Stack.Screen name="BrowseItems" component={BrowseItems} />
        <Stack.Screen name="DifferentItem" component={DifferentItem} />
        <Stack.Screen name="ConfirmExchange" component={ConfirmExchange} />
        <Stack.Screen
          name="AccpectRejectExchange"
          component={AccpectRejectExchange}
        />
        <Stack.Screen
          name="ExchangeDesiredItemTypeOfItemScreen"
          component={ExchangeDesiredItemTypeOfItemScreen}
        />
        <Stack.Screen
          name="BrandSelectionScreen"
          component={BrandSelectionScreen}
        />
        <Stack.Screen
          name="ExchangeDesiredItemBrandSelectionScreen"
          component={ExchangeDesiredItemBrandSelectionScreen}
        />
        <Stack.Screen
          name="ExchangeDesiredItemConditionScreen"
          component={ExchangeDesiredItemConditionScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
