import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useDispatch } from "react-redux";
import { resetItemUpload } from "../redux/slices/itemSlice";
import { defaultUploadItem, useUploadItem } from "../context/ItemContext";

// Import các màn hình thuộc flow tạo item
import UploadScreen from "../screens/PostItemScreen";
import TypeOfItemScreen from "../screens/PostItemScreen/TypeOfItem";
import TypeOfItemDetailScreen from "../screens/PostItemScreen/TypeOfItemDetail";
import ItemConditionScreen from "../screens/PostItemScreen/ItemCondition";
import MethodOfExchangeScreen from "../screens/PostItemScreen/MethodOfExchange";
import ExchangeDesiredItemScreen from "../screens/PostItemScreen/ExchangeDesiredItem";
import BrandSelectionScreen from "../screens/PostItemScreen/BrandSelectionScreen";

const CreateItemStack = createNativeStackNavigator();

export default function CreateItemFlow() {
  const dispatch = useDispatch();
  const { setUploadItem, setIsCheckFreeContext } = useUploadItem();

  useEffect(() => {
    return () => {
      // Khi người dùng rời khỏi flow (CreateItemFlow bị unmount),
      // reset lại state tạo item
      setUploadItem(defaultUploadItem);
      setIsCheckFreeContext(false);
      dispatch(resetItemUpload());
    };
  }, [dispatch, setUploadItem, setIsCheckFreeContext]);

  return (
    <CreateItemStack.Navigator screenOptions={{ headerShown: false }}>
      <CreateItemStack.Screen name="UploadScreen" component={UploadScreen} />
      <CreateItemStack.Screen
        name="TypeOfItemScreen"
        component={TypeOfItemScreen}
      />
      <CreateItemStack.Screen
        name="TypeOfItemDetailScreen"
        component={TypeOfItemDetailScreen}
      />
      <CreateItemStack.Screen
        name="ItemConditionScreen"
        component={ItemConditionScreen}
      />
      <CreateItemStack.Screen
        name="MethodOfExchangeScreen"
        component={MethodOfExchangeScreen}
      />
      <CreateItemStack.Screen
        name="ExchangeDesiredItemScreen"
        component={ExchangeDesiredItemScreen}
      />
      <CreateItemStack.Screen
        name="BrandSelectionScreen"
        component={BrandSelectionScreen}
      />
    </CreateItemStack.Navigator>
  );
}
