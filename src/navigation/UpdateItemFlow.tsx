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
import LocationOfUser from "../screens/AccountScreen/ProfileDetail/LocationOfUser";

const UpdateItemStack = createNativeStackNavigator();

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
      <UpdateItemStack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}
      >
        <UpdateItemStack.Screen
          name="UpdateItemScreen"
          component={UpdateItem}
          options={{
            gestureEnabled: false,
          }}
        />
        <UpdateItemStack.Screen
          name="TypeOfItemScreen"
          component={TypeOfItemScreen}
        />
        <UpdateItemStack.Screen
          name="TypeOfItemDetailScreen"
          component={TypeOfItemDetailScreen}
        />
        <UpdateItemStack.Screen
          name="ItemConditionScreen"
          component={ItemConditionScreen}
        />
        <UpdateItemStack.Screen
          name="MethodOfExchangeScreen"
          component={MethodOfExchangeScreen}
        />
        <UpdateItemStack.Screen
          name="ExchangeDesiredItemScreen"
          component={ExchangeDesiredItemScreen}
        />
        <UpdateItemStack.Screen
          name="BrandSelectionScreen"
          component={BrandSelectionScreen}
        />
        <UpdateItemStack.Screen
          name="LocationOfUser"
          component={LocationOfUser}
        />
      </UpdateItemStack.Navigator>
    </>
  );
}
