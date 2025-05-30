import React, { useState } from "react";
import { Text, View, Platform } from "react-native";
import {
  NavigationContainer,
  NavigatorScreenParams,
  useNavigation,
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
import { SignupDto, UserResponse } from "../common/models/auth";
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
import ExtendItemPlan from "../screens/AccountScreen/SubscriptionPlan/ExtendItemPlan";
import UpdateItemFlow from "./UpdateItemFlow";
import LocationOfUser from "../screens/AccountScreen/ProfileDetail/LocationOfUser";
import { resetLocation } from "../redux/slices/userSlice";
import PaymentHistory from "../screens/AccountScreen/PaymentHistory";
import ReportedHistory from "../screens/AccountScreen/ReportedHistory";
import CriticalReport from "../screens/AccountScreen/CriticalReport";
import { TypeCriticalReport } from "../common/enums/TypeCriticalReport";
import { FeedbackResponse } from "../common/models/feedback";
import { ExchangeResponse } from "../common/models/exchange";
import { CriticalReportResponse } from "../common/models/criticalReport";
import { isReachMaxOfUploadItemThisMonthThunk } from "../redux/thunk/itemThunks";
import ErrorModal from "../components/ErrorModal";

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
export type UploadParamList = {
  UploadScreen: { fromBrowse?: boolean };
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
  TypeOfItemUpdateScreen: undefined;
  TypeOfItemDetailUpdateScreen: undefined;
  ItemConditionUpdateScreen: undefined;
  MethodOfExchangeUpdateScreen: undefined;
  ExchangeDesiredItemUpdateScreen: undefined;
  BrandSelectionUpdateScreen: undefined;
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
  ExtendItemPlan: undefined;
  ExtendPremiumSucess: undefined;
  About: undefined;
  UploadItemSuccess: undefined;
  UploadScreenBrowse: NavigatorScreenParams<UploadParamList>;
  Account: undefined;
  Payment: { payOSURL: string; returnUrl: string; cancelUrl: string };
  OrderFailed: undefined;
  OrderSuccess: undefined;
  UpdateItem: undefined;
  LocationOfUser: undefined;
  PaymentHistory: undefined;
  ReportedHistory: undefined;
  CriticalReport: {
    id?: number;
    typeOfReport: TypeCriticalReport;
    userReport?: UserResponse;
    feedbackReport?: FeedbackResponse;
    exchangeReport?: ExchangeResponse;
    criticalReport?: CriticalReportResponse;
  };
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
  const [confirmUploadMaxVisible, setConfirmUploadMaxVisible] = useState(false);
  const [pendingTabName, setPendingTabName] = useState<
    keyof MainTabsParamList | null
  >(null);
  const [previousTab, setPreviousTab] =
    useState<keyof MainTabsParamList>("Home");

  const handleConfirm = async () => {
    setConfirmVisible(false);
    dispatch(resetItemDetailState());
    dispatch(resetLocation());
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

  const handleCancelUploadMax = () => {
    setConfirmUploadMaxVisible(false);
    navigation.navigate("MainTabs", { screen: previousTab });
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
            listeners={({ navigation: tabNav }) => ({
              tabPress: async (e) => {
                if (
                  !accessToken &&
                  item.route !== "Account" &&
                  item.route !== "Home"
                ) {
                  e.preventDefault();
                  navigation.navigate("SignIn");
                } else if (item.route === "Upload") {
                  const { index, routes } = tabNav.getState();
                  setPreviousTab(routes[index].name as keyof MainTabsParamList);

                  const isMax = await dispatch(
                    isReachMaxOfUploadItemThisMonthThunk()
                  ).unwrap();

                  if (isMax) {
                    e.preventDefault();
                    setConfirmUploadMaxVisible(true);
                  }
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
      <ErrorModal
        content={`You have reached the upload limit.${"\n"}Please upgrade your subscription to upload more.`}
        title="Warning"
        visible={confirmUploadMaxVisible}
        onCancel={handleCancelUploadMax}
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
          gestureResponseDistance: 0,
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
        <Stack.Screen name="ReportedHistory" component={ReportedHistory} />
        <Stack.Screen name="PaymentHistory" component={PaymentHistory} />
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
        <Stack.Screen name="ExtendItemPlan" component={ExtendItemPlan} />
        <Stack.Screen name="About" component={About} />
        <Stack.Screen name="UploadItemSuccess" component={UploadItemSuccess} />
        <Stack.Screen name="BrowseItems" component={BrowseItems} />
        <Stack.Screen name="CriticalReport" component={CriticalReport} />
        <Stack.Screen name="ConfirmExchange" component={ConfirmExchange} />
        <Stack.Screen name="UploadScreenBrowse" component={UploadItemFlow} />
        <Stack.Screen name="UpdateItem" component={UpdateItemFlow} />
        <Stack.Screen
          name="AccpectRejectExchange"
          component={AccpectRejectExchange}
        />
        <Stack.Screen name="Payment" component={Payment} />
        <Stack.Screen name="LocationOfUser" component={LocationOfUser} />
        <Stack.Screen name="OrderFailed" component={OrderFailed} />
        <Stack.Screen name="OrderSuccess" component={OrderSuccess} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
