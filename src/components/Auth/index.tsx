import React, { useEffect, useCallback } from "react";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { authenticateGoogleUserkThunk } from "../../redux/thunk/authThunks";
import { ActivityIndicator, Pressable, Text } from "react-native";
import { View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export default function GoogleSignInScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { loadingGoogle } = useSelector((state: RootState) => state.auth);
  const registrationToken = useSelector(
    (state: RootState) => state.notification.token
  );

  useEffect(() => {
    GoogleSignin.configure({
      scopes: ["https://www.googleapis.com/auth/drive.readonly"],
      webClientId:
        "711723606756-vr85td4uusgbam70441oupp671luqfgv.apps.googleusercontent.com",
    });
  }, []);

  const handleGoogleSignIn = useCallback(async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      if (userInfo.data?.user) {
        await dispatch(
          authenticateGoogleUserkThunk({
            email: userInfo.data.user.email,
            fullName: userInfo.data.user.name || "",
            googleId: userInfo.data.user.id,
            photoUrl: userInfo.data.user.photo || "",
            registrationTokens: registrationToken ? [registrationToken] : [],
          })
        );
      }
    } catch (error: any) {
      switch (error.code) {
        case statusCodes.SIGN_IN_CANCELLED:
          break;
        case statusCodes.IN_PROGRESS:
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          break;
        default:
          console.error("Lỗi đăng nhập: ", error);
          break;
      }
    }
  }, [dispatch]);

  return (
    <Pressable
      onPress={handleGoogleSignIn}
      disabled={loadingGoogle}
      className={`w-full rounded-full justify-center items-center bg-white px-3 py-4 border-2 border-[#00b0b9]  active:bg-[rgb(0,176,185,0.5)]`}
    >
      {loadingGoogle ? (
        <ActivityIndicator size="small" color="#00b0b9" />
      ) : (
        <View className="flex-row items-center">
          <Icon className="mr-1" name="logo-google" size={20} color="red" />

          <Text className="text-base font-bold text-[#00b0b9]">
            Sign in with google
          </Text>
        </View>
      )}
    </Pressable>
  );
}
