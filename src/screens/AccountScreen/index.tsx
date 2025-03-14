import React, { useCallback, memo, useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
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
import LanguageSwitchModal from "../LanguageSwitch";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  const { user, accessToken } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [languageSwitchVisible, setLanguageSwitchVisible] = useState(false);

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
  const navigateToStatistics = useCallback(
    () => navigation.navigate("Statistics"),
    [navigation]
  );
  const navigateToFavorite = useCallback(
    () => navigation.navigate("Favorite"),
    [navigation]
  );
  const navigateToPremium = useCallback(
    () => navigation.navigate("Premium"),
    [navigation]
  );
  const navigateToAbout = useCallback(
    () => navigation.navigate("About"),
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

  const handleCancel = () => {
    setLanguageSwitchVisible(false);
  };

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
              <View className="flex-1 mr-2">
                <LoadingButton
                  title="Sign in"
                  onPress={navigateToSignIn}
                  buttonClassName="border-2 border-[#00B0B9] py-3 bg-white"
                  textColor="text-[#00B0B9]"
                />
              </View>
              <View className="flex-1">
                <LoadingButton
                  title="Sign up"
                  onPress={navigateToSignUp}
                  buttonClassName="py-3 border-2 border-transparent"
                />
              </View>
            </View>
          </View>
        )}

        <View className="h-full">
          <AccountListItem
            iconName="person-outline"
            label={t("Personal information")}
            onPress={navigateToProfile}
          />
          <AccountListItem
            iconName="key-outline"
            label="Change password"
            onPress={navigateToChangePassword}
          />
          <AccountListItem
            iconName="stats-chart-sharp"
            label="Statistics"
            onPress={navigateToStatistics}
          />
          <AccountListItem
            iconName="globe-outline"
            label="Language"
            onPress={() => setLanguageSwitchVisible(!languageSwitchVisible)}
          />
          <AccountListItem
            iconName="heart-outline"
            label="Favorites"
            onPress={navigateToFavorite}
          />
          <AccountListItem
            iconName="wallet-outline"
            label="Premium"
            onPress={navigateToPremium}
          />
          <AccountListItem
            iconName="information-circle-outline"
            label="About"
            onPress={navigateToAbout}
          />
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
        onCancel={handleCancel}
      />
    </SafeAreaView>
  );
};

export default React.memo(Account);
