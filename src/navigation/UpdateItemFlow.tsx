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
import TypeOfItemUpdateScreen from "../screens/ItemManagement/TypeOfItem";
import TypeOfItemDetailUpdateScreen from "../screens/ItemManagement/TypeOfItemDetail";
import ItemConditionUpdateScreen from "../screens/ItemManagement/ItemCondition";
import MethodOfExchangeUpdateScreen from "../screens/ItemManagement/MethodOfExchange";
import ExchangeDesiredItemUpdateScreen from "../screens/ItemManagement/ExchangeDesiredItem";
import BrandSelectionUpdateScreen from "../screens/ItemManagement/BrandSelectionScreen";

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
          name="TypeOfItemUpdateScreen"
          component={TypeOfItemUpdateScreen}
        />
        <UpdateItemStack.Screen
          name="TypeOfItemDetailUpdateScreen"
          component={TypeOfItemDetailUpdateScreen}
        />
        <UpdateItemStack.Screen
          name="ItemConditionUpdateScreen"
          component={ItemConditionUpdateScreen}
        />
        <UpdateItemStack.Screen
          name="MethodOfExchangeUpdateScreen"
          component={MethodOfExchangeUpdateScreen}
        />
        <UpdateItemStack.Screen
          name="ExchangeDesiredItemUpdateScreen"
          component={ExchangeDesiredItemUpdateScreen}
        />
        <UpdateItemStack.Screen
          name="BrandSelectionUpdateScreen"
          component={BrandSelectionUpdateScreen}
        />
        <UpdateItemStack.Screen
          name="LocationOfUser"
          component={LocationOfUser}
        />
      </UpdateItemStack.Navigator>
    </>
  );
}
