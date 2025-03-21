import React, { useEffect, useState } from "react";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
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
import { useIsFocused } from "@react-navigation/native";

const CreateItemStack = createNativeStackNavigator();

export default function CreateItemFlow() {
  const isFocused = useIsFocused();
  const { setUploadItem } = useUploadItem();

  useEffect(() => {
    if (!isFocused) {
      setUploadItem(defaultUploadItem);
    }
  }, [isFocused]);
  return (
    <>
      <CreateItemStack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}
      >
        <CreateItemStack.Screen
          name="UploadScreen"
          component={UploadScreen}
          options={{
            gestureEnabled: false,
          }}
        />
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
      {/* <ConfirmModal
        title="Confirm upload"
        content="Are you sure you to upload this item?"
        visible={confirmVisible}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      /> */}
    </>
  );
}
