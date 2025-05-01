import React, { useCallback, memo, useState, useMemo, useEffect } from "react";
import { View, Text, Pressable, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AppDispatch, RootState } from "../../redux/store";
import { logoutUserThunk } from "../../redux/thunk/authThunks";
import { logout } from "../../redux/slices/authSlice";
import Header from "../../components/Header";
import { RootStackParamList } from "../../navigation/AppNavigator";
import LoadingButton from "../../components/LoadingButton";
import LanguageSwitchModal from "./LanguageSwitch";
import { useTranslation } from "react-i18next";
import { getCurrentSubscriptionThunk } from "../../redux/thunk/subscriptionThunks";

type AccountListItemProps = {
  iconName: string;
  label: string;
  onPress?: () => void;
  iconColor?: string;
};

const AccountListItem: React.FC<AccountListItemProps> = memo(
  ({ iconName, label, onPress, iconColor = "#00B0B9" }) => (
    <Pressable
      className="h-[70px] bg-white border-t border-[#DBE9F5] flex-row items-center pl-5 active:bg-gray-200"
      onPress={onPress}
    >
      <View className="relative mr-2">
        <Icon
          name={iconName}
          size={24}
          color={iconColor}
          style={{ position: "absolute" }}
        />
        <Icon name={iconName} size={24} color={iconColor} />
      </View>
      <Text className="text-[14px]">{label}</Text>
    </Pressable>
  )
);

const Account: React.FC = () => {
  const { t } = useTranslation();
  const { user, accessToken } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [languageSwitchVisible, setLanguageSwitchVisible] = useState(false);
  const isLoggedIn = !!user;
  const { currentPlan } = useSelector((state: RootState) => state.subscription);

  const navigateScreens = useCallback(
    <T extends keyof RootStackParamList>(
      route: T,
      requireAuth: boolean = false,
      params?: RootStackParamList[T]
    ) => {
      if (requireAuth && !accessToken) {
        navigation.navigate("SignIn", undefined);
      } else {
        navigation.navigate(route as any, params as any);
      }
    },
    [navigation, accessToken]
  );

  const handleLogout = useCallback(() => {
    dispatch(logout());
    dispatch(logoutUserThunk());
  }, [dispatch]);

  const toggleLanguageModal = useCallback(() => {
    setLanguageSwitchVisible((prev) => !prev);
  }, []);

  useEffect(() => {
    dispatch(getCurrentSubscriptionThunk());
  }, [dispatch, accessToken]);

  const accountItems = useMemo(() => {
    return [
      {
        iconName: "person-outline",
        label: t("Personal information"),
        route: "Profile",
        requireAuth: true,
      },
      {
        iconName: "key-outline",
        label: "Change password",
        route: "ResetPassword",
        requireAuth: true,
      },
      {
        iconName: "stats-chart-sharp",
        label: "Statistics",
        route: "Statistics",
        requireAuth: true,
      },
      {
        iconName: "globe-outline",
        label: "Language",
        onPress: toggleLanguageModal,
      },
      {
        iconName: "heart-outline",
        label: "Favorites",
        route: "Favorite",
        requireAuth: true,
      },
      {
        iconName: "wallet-outline",
        label: "Premium",
        route: currentPlan ? "ExtendPremium" : "Premium",
      },
      {
        iconName: "card-outline",
        label: "Payment history",
        route: "PaymentHistory",
        requireAuth: true,
      },
      {
        iconName: "clipboard-outline",
        label: "Report history",
        route: "ReportedHistory",
        requireAuth: true,
      },
      {
        iconName: "information-circle-outline",
        label: "About",
        route: "About",
      },
    ];
  }, [t, toggleLanguageModal]);

  return (
    <SafeAreaView className="bg-[#00B0B9] flex-1" edges={["top"]}>
      <ScrollView
        className="flex-1 bg-white"
        showsVerticalScrollIndicator={false}
      >
        <Header
          title="Account"
          backgroundColor="bg-[#00B0B9]"
          showBackButton={false}
          textColor="text-white"
          showOption={false}
        />

        {isLoggedIn ? (
          <Pressable
            onPress={() =>
              navigation.navigate("OwnerItem", {
                userId: user.id,
              })
            }
            className="mx-5 h-[100px] flex-row items-center"
          >
            {user.image ? (
              <View className="w-24 h-24 rounded-full items-center justify-center">
                <Image
                  source={{
                    uri: user.image,
                  }}
                  className="w-full h-full rounded-full"
                />
              </View>
            ) : (
              <Icon name="person-circle-outline" size={85} color="gray" />
            )}
            <View className="ml-3">
              <Text className="text-[18px] font-bold">{user?.fullName}</Text>
              <View className="flex-row items-center justify-center mt-[6px]">
                <Text className="text-[13px] mr-1">
                  {user.numOfRatings !== undefined
                    ? Number.isInteger(user.numOfRatings)
                      ? `${user.numOfRatings}.0`
                      : user.numOfRatings
                    : ""}
                </Text>
                {[1, 2, 3, 4, 5].map((num) => (
                  <Icon
                    key={`star-${num}`}
                    name="star"
                    size={16}
                    color={num <= user.numOfRatings! ? "#FFD700" : "#dfecec"}
                  />
                ))}
                <Text
                  onPress={() =>
                    navigation.navigate("OwnerFeedback", {
                      userId: user.id,
                    })
                  }
                  className="ml-1 text-[13px] font-semibold text-[#00B0B9] underline"
                >
                  ({user.numOfFeedbacks} feedbacks)
                </Text>
              </View>
            </View>
          </Pressable>
        ) : (
          <View className="px-5 h-[100px] flex-row items-center bg-white justify-between">
            <Icon name="person-circle-outline" size={85} color="gray" />
            <View className="flex-row w-[60%]">
              <View className="flex-1 mr-2">
                <LoadingButton
                  title="Sign in"
                  onPress={() => navigateScreens("SignIn")}
                  buttonClassName="border-2 border-[#00B0B9] py-3 bg-white"
                  textColor="text-[#00B0B9]"
                />
              </View>
              <View className="flex-1">
                <LoadingButton
                  title="Sign up"
                  onPress={() => navigateScreens("SignUp")}
                  buttonClassName="py-3 border-2 border-transparent"
                />
              </View>
            </View>
          </View>
        )}

        <View className="h-full">
          {accountItems.map((item, index) => (
            <AccountListItem
              key={index}
              iconName={item.iconName}
              label={item.label}
              onPress={
                item.onPress
                  ? item.onPress
                  : () =>
                      navigateScreens(
                        item.route as keyof RootStackParamList,
                        item.requireAuth
                      )
              }
            />
          ))}

          {isLoggedIn && (
            <Pressable
              onPress={() => {
                navigation.navigate("ChatDetails", {
                  receiverUsername: "admin",
                  receiverFullName: "Admin",
                });
              }}
              className="h-[70px] bg-white border-t border-[#DBE9F5] flex-row items-center pl-5 active:bg-gray-200"
            >
              <View className="relative mr-2">
                <Icon
                  name={"call-outline"}
                  size={24}
                  style={{ position: "absolute" }}
                  color={"#00B0B9"}
                />
                <Icon name="call-outline" size={24} color={"#00B0B9"} />
              </View>
              <Text className="text-[14px]">Contact with us</Text>
            </Pressable>
          )}

          {isLoggedIn && (
            <AccountListItem
              iconName="log-out-outline"
              label="Sign Out"
              onPress={handleLogout}
              iconColor="#F44336"
            />
          )}
        </View>
      </ScrollView>
      <LanguageSwitchModal
        visible={languageSwitchVisible}
        onCancel={() => setLanguageSwitchVisible(false)}
      />
    </SafeAreaView>
  );
};

export default Account;
