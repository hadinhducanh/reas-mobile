import React, { useCallback, memo } from "react";
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { AppDispatch, RootState } from "../../redux/store";
import { logoutUserThunk } from "../../redux/thunk/authThunks";
import { logout } from "../../redux/slices/authSlice";
import Header from "../../components/Header";

type AccountListItemProps = {
  iconName: string;
  label: string;
  onPress?: () => void;
  iconColor?: string;
};

const AccountListItem: React.FC<AccountListItemProps> = memo(
  ({ iconName, label, onPress, iconColor = "#00B0B9" }) => (
    <Pressable
      className="h-[70px] bg-white border-t-[1px] border-[#DBE9F5] flex-row items-center pl-5 active:bg-gray-200"
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
  const { user, accessToken } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<any>();

  const isLoggedIn = !!user;

  const handleLogout = useCallback(() => {
    dispatch(logout());
    dispatch(logoutUserThunk());
  }, [dispatch]);

  const navigateToProfile = useCallback(() => {
    if (!accessToken) {
      navigation.navigate("SignIn");
    } else {
      navigation.navigate("Profile");
    }
  }, [navigation]);
  const navigateToChangePassword = useCallback(() => {
    if (!accessToken) {
      navigation.navigate("SignIn");
    } else {
      navigation.navigate("ResetPassword");
    }
  }, [navigation]);
  const navigateToExchangeHistory = useCallback(
    () => navigation.navigate("ExchangeHistory"),
    [navigation]
  );
  const navigateToStatistics = useCallback(
    () => navigation.navigate("Statistics"),
    [navigation]
  );
  const navigateToLanguage = useCallback(
    () => navigation.navigate("ChatHistory"),
    [navigation]
  );
  const navigateToSignIn = useCallback(
    () => navigation.navigate("SignIn"),
    [navigation]
  );
  const navigateToSignUp = useCallback(
    () => navigation.navigate("SignUp"),
    [navigation]
  );

  return (
    <SafeAreaView className="bg-[#00B0B9] flex-1" edges={["top"]}>
      <View className="flex-1 bg-white">
        <Header
          title="Account"
          backgroundColor="bg-[#00B0B9]"
          showBackButton={false}
          textColor="text-white"
          showOption={false}
        />

        {isLoggedIn ? (
          <View className="mx-5 h-[100px] justify-start flex-row items-center ">
            <Icon name="person-circle-outline" size={85} color="gray" />
            <View className="ml-3">
              <Text className="text-[18px] font-bold">{user?.fullName}</Text>
              <View className="flex-row items-center justify-center mt-[6px]">
                <Text className="text-[13px] mr-1">5.0</Text>
                {[...Array(5)].map((_, idx) => (
                  <Icon key={idx} name="star" size={14} color="#FFA43D" />
                ))}
                <Text className="ml-1 text-[13px] font-semibold text-[#00B0B9]">
                  (5 đánh giá)
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View className="px-5 h-[100px] justify-between flex-row items-center bg-white">
            <Icon name="person-circle-outline" size={85} color="gray" />

            <View className="flex-row w-[60%]">
              <Pressable
                className="flex-1 bg-white py-3 rounded-lg border-[1px] border-[#00B0B9] active:bg-gray-200"
                onPress={navigateToSignIn}
              >
                <Text className="text-center text-[#00B0B9] font-bold">
                  Sign In
                </Text>
              </Pressable>
              <Pressable
                className="flex-1 bg-[#00B0B9] py-3 ml-2 rounded-lg active:bg-[#00b0b9e0]"
                onPress={navigateToSignUp}
              >
                <Text className="text-center text-white font-bold">
                  Sign Up
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        <View className="h-full">
          <AccountListItem
            iconName="person-outline"
            label="Personal information"
            onPress={navigateToProfile}
          />
          <AccountListItem
            iconName="key-outline"
            label="Change password"
            onPress={navigateToChangePassword}
          />
          <AccountListItem
            iconName="swap-horizontal-outline"
            label="Exchanges history"
            onPress={navigateToExchangeHistory}
          />
          <AccountListItem
            iconName="stats-chart-sharp"
            label="Statistics"
            onPress={navigateToStatistics}
          />
          <AccountListItem
            iconName="globe-outline"
            label="Language"
            // onPress={navigateToLanguage}
          />
          <AccountListItem iconName="heart-outline" label="Favorites" />
          <AccountListItem
            iconName="information-circle-outline"
            label="About"
          />
          <AccountListItem
            iconName="log-out-outline"
            label="Sign Out"
            onPress={handleLogout}
            iconColor="#F44336"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default React.memo(Account);
