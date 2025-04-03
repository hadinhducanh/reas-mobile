import React, { useState } from "react";
import { Text, View, Platform } from "react-native";
import {
  NavigationContainer,
  NavigatorScreenParams,
  useNavigation,
  useNavigationState,
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
import OTPScreen from "../screens/AuthenScreen/OTP";
import SignUpSuccessScreen from "../screens/AuthenScreen/SignUpSuccess";
import ResetPassword from "../screens/AccountScreen/ResetPassword";
import CreateExchange from "../screens/CreateExchange";
import BrowseItems from "../screens/CreateExchange/BrowseItems";
import ConfirmExchange from "../screens/CreateExchange/ConfirmExchange";
import AccpectRejectExchange from "../screens/CreateExchange/AccpectRejectExchange";
import FeedbackItem from "../screens/AccountScreen/FeedbackItem";
import SearchResult from "../screens/SearchResult";
import OwnerItem from "../screens/Owner/OwnerItem";
import OwnerFeedback from "../screens/Owner/OwnerFeedback";
import Favorite from "../screens/AccountScreen/Favorite";
import Notifications from "../screens/Notification";
import ItemExpire from "../screens/ItemManagement/ItemExpire";
import Premium from "../screens/AccountScreen/SubscriptionPlan";
import About from "../screens/AccountScreen/About";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import UploadItemSuccess from "../screens/PostItemScreen/UploadItemSuccess";
import ExtendPremium from "../screens/AccountScreen/SubscriptionPlan/ExtendSubscriptionPlan";
import Statistics from "../screens/AccountScreen/Statistics";
import ItemDetails from "../screens/ItemManagement/ItemDetail";
import FilterMap from "../screens/SearchResult/FilterMap";
import { SignupDto } from "../common/models/auth";
import CreateItemFlow from "./UploadItemFlow";
import { defaultUploadItem, useUploadItem } from "../context/ItemContext";
import ConfirmModal from "../components/DeleteConfirmModal";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import ItemManagement from "../screens/ItemManagement";
import UploadItemFlow from "./UploadItemFlow";
import UploadItem from "../screens/PostItemScreen";
import { StatusExchange } from "../common/enums/StatusExchange";
import { resetItemDetailState } from "../redux/slices/itemSlice";
import { TypeItem } from "../common/enums/TypeItem";
import Payment from "../screens/Payment";
import OrderFailed from "../screens/OrderScreen/OrderFailed";
import OrderSuccess from "../screens/OrderScreen/OrderSuccess";

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
  Upload: undefined;
  Exchanges: undefined;
  Account: undefined;
  Items: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabsParamList>;
  SignIn: undefined;
  SignUp: undefined;
  Profile: undefined;
  ExchangeHistory: undefined;
  ExchangeDetail: { statusDetail: StatusExchange; exchangeId: number };
  ChatHistory: undefined;
  ChatDetails: { receiverUsername: string; receiverFullName: string };
  Statistics: undefined;
  ItemDetails: { itemId: number };
  ItemPreview: { itemId: number };
  TypeOfItemScreen: undefined;
  TypeOfItemDetailScreen: undefined;
  ItemConditionScreen: undefined;
  MethodOfExchangeScreen: undefined;
  ExchangeDesiredItemScreen: undefined;
  ExchangeDesiredItemTypeOfItemScreen: undefined;
  BrandSelectionScreen: undefined;
  SignUpSuccess: undefined;
  OTP: { signUpDTO: SignupDto };
  ResetPassword: undefined;
  CreateExchange: { itemId: number };
  BrowseItems: undefined;
  DifferentItem: undefined;
  ConfirmExchange: undefined;
  AccpectRejectExchange: { exchangeId: number };
  FeedbackItem: { exchangeId: number };
  SearchResult: {
    searchTextParam?: string;
    itemType?: TypeItem;
    range?: number;
  };
  OwnerItem: { userId: number };
  OwnerFeedback: { userId: number };
  Favorite: undefined;
  Notifications: undefined;
  FilterMap: undefined;
  Premium: undefined;
  ExtendPremium: undefined;
  About: undefined;
  UploadItemSuccess: undefined;
  UploadScreen: undefined;
  Account: undefined;
  Payment: { payOSURL: string; returnUrl: string; cancelUrl: string };
  OrderFailed: undefined;
  OrderSuccess: undefined;
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
    component: UploadItemFlow,
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

function BottomTabs() {
  const dispatch = useDispatch<AppDispatch>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const { uploadItem, setUploadItem } = useUploadItem();
  const hasUnsavedData =
    JSON.stringify(uploadItem) !== JSON.stringify(defaultUploadItem);

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [pendingTabName, setPendingTabName] = useState<
    keyof MainTabsParamList | null
  >(null);

  const handleConfirm = async () => {
    setConfirmVisible(false);
    dispatch(resetItemDetailState());
    setUploadItem(defaultUploadItem);

    if (pendingTabName) {
      navigation.navigate("MainTabs", { screen: pendingTabName });
      setPendingTabName(null);
    }
  };

  const handleCancel = () => {
    setConfirmVisible(false);
    setPendingTabName(null);
  };

  return (
    <>
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
            listeners={({ navigation }) => ({
              tabPress: (e) => {
                if (
                  !accessToken &&
                  item.route !== "Account" &&
                  item.route !== "Home"
                ) {
                  e.preventDefault();
                  navigation.navigate("SignIn");
                } else if (hasUnsavedData && item.route !== "Upload") {
                  e.preventDefault();
                  setPendingTabName(item.route as keyof MainTabsParamList);
                  setConfirmVisible(true);
                }
              },
            })}
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
      <ConfirmModal
        title="Warning"
        content={`You have unsaved item. ${"\n"} Do you really want to leave?`}
        visible={confirmVisible}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
    </>
  );
}

const Stack = createStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}
      >
        <Stack.Screen name="MainTabs" component={BottomTabs} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Profile" component={ProfileDetailScreen} />
        <Stack.Screen name="ExchangeDetail" component={ExchangeDetailScreen} />
        <Stack.Screen name="ChatHistory" component={ChatHistoryScreen} />
        <Stack.Screen name="ChatDetails" component={ChatDetailsScreen} />
        <Stack.Screen name="Statistics" component={Statistics} />
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
        <Stack.Screen name="UploadItemSuccess" component={UploadItemSuccess} />
        <Stack.Screen name="BrowseItems" component={BrowseItems} />
        {/* <Stack.Screen name="DifferentItem" component={DifferentItem} /> */}
        <Stack.Screen name="ConfirmExchange" component={ConfirmExchange} />
        <Stack.Screen name="UploadScreen" component={UploadItem} />
        <Stack.Screen
          name="AccpectRejectExchange"
          component={AccpectRejectExchange}
        />
        <Stack.Screen name="Payment" component={Payment} />
        <Stack.Screen name="OrderFailed" component={OrderFailed} />
        <Stack.Screen name="OrderSuccess" component={OrderSuccess} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
