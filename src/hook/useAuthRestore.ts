import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { setTokens } from "../redux/slices/authSlice";
import { fetchUserInfoThunk } from "../redux/thunk/authThunks";
import { AppDispatch } from "../redux/store";

export function useAuthRestore() {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    const restore = async () => {
      const token = await AsyncStorage.getItem("ACCESS_TOKEN");
      if (token) {
        dispatch(setTokens({ accessToken: token }));
        await dispatch(fetchUserInfoThunk());
      }
    };
    restore();
  }, [dispatch]);
}
