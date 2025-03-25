import React, { useState, useEffect } from "react";
import { View, Text, Modal, Pressable } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { MethodExchange } from "../../common/enums/MethodExchange";
import {
  defaultExchangeItem,
  useExchangeItem,
} from "../../context/ExchangeContext";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { getPlaceDetailsThunk } from "../../redux/thunk/locationThunks";
import { resetPlaceDetail } from "../../redux/slices/locationSlice";

const exchangeMethods = [
  { label: "Pick up in person", value: MethodExchange.PICK_UP_IN_PERSON },
  { label: "Delivery", value: MethodExchange.DELIVERY },
  {
    label: "Meet at a given location",
    value: MethodExchange.MEET_AT_GIVEN_LOCATION,
  },
];

interface ChooseMethodExchangeModalProps {
  methods: MethodExchange[];
  visible: boolean;
  onCancel: () => void;
}

const ChooseMethodExchangeModal: React.FC<ChooseMethodExchangeModalProps> = ({
  methods,
  visible,
  onCancel,
}) => {
  const { exchangeItem, setExchangeItem } = useExchangeItem();
  const [selectedMethodLocal, setSelectedMethodLocal] =
    useState<MethodExchange>(
      exchangeItem.methodExchange || MethodExchange.NO_METHOD
    );
  const { itemDetail } = useSelector((state: RootState) => state.item);
  const { loading } = useSelector((state: RootState) => state.location);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    setSelectedMethodLocal(
      exchangeItem.methodExchange || MethodExchange.NO_METHOD
    );
  }, [exchangeItem.methodExchange]);

  const handleSelectMethod = (method: MethodExchange) => {
    if (selectedMethodLocal === method) {
      setExchangeItem({
        ...exchangeItem,
        methodExchange: MethodExchange.NO_METHOD,
        methodExchangeName: "",
        exchangeLocation: defaultExchangeItem.exchangeLocation,
        locationGoong: defaultExchangeItem.locationGoong,
      });
      dispatch(resetPlaceDetail());
    } else {
      dispatch(resetPlaceDetail());
      if (
        method === MethodExchange.PICK_UP_IN_PERSON &&
        itemDetail?.userLocation.specificAddress
      ) {
        dispatch(getPlaceDetailsThunk(itemDetail.userLocation.specificAddress));
        if (loading) {
          setExchangeItem({
            ...exchangeItem,
            exchangeLocation: itemDetail.userLocation.specificAddress,
          });
        }
      }
      const methodMatch = exchangeMethods.find(
        (methodItem) => methodItem.value === method
      );
      setExchangeItem({
        ...exchangeItem,

        methodExchange: method,
        methodExchangeName: methodMatch?.label!,
      });
      onCancel();
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable
        className="flex-1 bg-black/50 justify-center items-center"
        onPress={onCancel}
      >
        <View
          onStartShouldSetResponder={() => true}
          className="w-4/5 bg-white rounded-xl p-6"
        >
          <Text className="text-center text-xl font-bold text-[#00B0B9]">
            Select method
          </Text>
          <Text className="text-center text-base text-gray-500 mt-1">
            Please choose your method
          </Text>

          <View className="mt-6">
            {methods.map((method) => {
              const isSelected = selectedMethodLocal === method;
              const methodMatch = exchangeMethods.find(
                (methodItem) => methodItem.value === method
              );
              return (
                <Pressable
                  key={method}
                  onPress={() => handleSelectMethod(method)}
                  className={`flex-row items-center justify-between border ${
                    isSelected
                      ? "border-[#00B0B9] bg-[#00B0B9] "
                      : "border-gray-200"
                  } rounded-lg p-4 mb-4`}
                >
                  <View className="flex-row items-center">
                    <Text
                      className={`font-semibold text-base ${
                        isSelected ? "text-white" : "text-gray-500"
                      }`}
                    >
                      {methodMatch?.label}
                    </Text>
                  </View>
                  {isSelected ? (
                    <Icon name="radio-button-checked" size={20} color="white" />
                  ) : (
                    <Icon
                      name="radio-button-unchecked"
                      size={20}
                      color="#00B0B9"
                    />
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

export default ChooseMethodExchangeModal;
