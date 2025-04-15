import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { defaultUploadItem, useUploadItem } from "../context/ItemContext";

import TypeOfItemScreen from "../screens/PostItemScreen/TypeOfItem";
import TypeOfItemDetailScreen from "../screens/PostItemScreen/TypeOfItemDetail";
import ItemConditionScreen from "../screens/PostItemScreen/ItemCondition";
import MethodOfExchangeScreen from "../screens/PostItemScreen/MethodOfExchange";
import ExchangeDesiredItemScreen from "../screens/PostItemScreen/ExchangeDesiredItem";
import BrandSelectionScreen from "../screens/PostItemScreen/BrandSelectionScreen";
import { useIsFocused } from "@react-navigation/native";
import UpdateItem from "../screens/ItemManagement/UpdateItem";

const UploadItemStack = createNativeStackNavigator();

export default function UpdateItemFlow() {
  const isFocused = useIsFocused();
  const { setUploadItem } = useUploadItem();

  useEffect(() => {
    if (!isFocused) {
      setUploadItem(defaultUploadItem);
    }
  }, [isFocused]);
  return (
    <>
      <UploadItemStack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}
      >
        <UploadItemStack.Screen
          name="UpdateItemScreen"
          component={UpdateItem}
          options={{
            gestureEnabled: false,
          }}
        />
        <UploadItemStack.Screen
          name="TypeOfItemScreen"
          component={TypeOfItemScreen}
        />
        <UploadItemStack.Screen
          name="TypeOfItemDetailScreen"
          component={TypeOfItemDetailScreen}
        />
        <UploadItemStack.Screen
          name="ItemConditionScreen"
          component={ItemConditionScreen}
        />
        <UploadItemStack.Screen
          name="MethodOfExchangeScreen"
          component={MethodOfExchangeScreen}
        />
        <UploadItemStack.Screen
          name="ExchangeDesiredItemScreen"
          component={ExchangeDesiredItemScreen}
        />
        <UploadItemStack.Screen
          name="BrandSelectionScreen"
          component={BrandSelectionScreen}
        />
      </UploadItemStack.Navigator>
    </>
  );
}
