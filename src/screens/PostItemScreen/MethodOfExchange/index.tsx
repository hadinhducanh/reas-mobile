import React, { useCallback, useEffect, useRef, useState } from "react";
import { ScrollView, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/MaterialIcons";
import { RootStackParamList } from "../../../navigation/AppNavigator";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../../components/Header";
import { MethodExchange } from "../../../common/enums/MethodExchange";
import LoadingButton from "../../../components/LoadingButton";
import { defaultUploadItem, useUploadItem } from "../../../context/ItemContext";
import ConfirmModal from "../../../components/DeleteConfirmModal";
import ErrorModal from "../../../components/ErrorModal";

const exchangeMethods = [
  { label: "Pick up in person", value: MethodExchange.PICK_UP_IN_PERSON },
  { label: "Delivery", value: MethodExchange.DELIVERY },
  {
    label: "Meet at a given location",
    value: MethodExchange.MEET_AT_GIVEN_LOCATION,
  },
];

const MethodOfExchangeScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { uploadItem, setUploadItem } = useUploadItem();

  const [selectedMethodExchanges, setSetSelectedMethodExchanges] = useState<
    Set<MethodExchange>
  >(new Set(uploadItem.methodExchanges || []));

  const pendingBeforeRemoveEvent = useRef<any>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [visible, setVisible] = useState<boolean>(false);
  const hasConfirmedRef = useRef(false);

  const toggleMethod = useCallback((methodValue: MethodExchange) => {
    setSetSelectedMethodExchanges((prev) => {
      const updatedMethods = new Set(prev);
      if (updatedMethods.has(methodValue)) {
        updatedMethods.delete(methodValue);
      } else {
        updatedMethods.add(methodValue);
      }
      return updatedMethods;
    });
  }, []);

  const handleConfirm = useCallback(() => {
    if (selectedMethodExchanges.size === 0) {
      setVisible(true);
      return;
    } else {
      hasConfirmedRef.current = true;

      const methods = exchangeMethods.filter((method) =>
        selectedMethodExchanges.has(method.value)
      );
      setUploadItem((prev) => ({
        ...prev,
        methodExchangeName: methods.map((method) => method.label).join(", "),
        methodExchanges: Array.from(selectedMethodExchanges),
      }));
      navigation.goBack();
    }
  }, [navigation, selectedMethodExchanges, setUploadItem]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (hasConfirmedRef.current) return;

      if (selectedMethodExchanges.size === 0) {
        return;
      }

      if (
        JSON.stringify(uploadItem.methodExchanges || []) !==
        JSON.stringify(Array.from(selectedMethodExchanges))
      ) {
        pendingBeforeRemoveEvent.current = e;
        e.preventDefault();
        setConfirmVisible(true);
      }
    });

    return unsubscribe;
  }, [navigation, uploadItem, selectedMethodExchanges]);

  const handleSure = async () => {
    hasConfirmedRef.current = true;
    setConfirmVisible(false);
    setUploadItem(defaultUploadItem);

    if (pendingBeforeRemoveEvent.current) {
      navigation.dispatch(pendingBeforeRemoveEvent.current.data.action);
    }
  };

  const handleCancel = () => {
    setConfirmVisible(false);
    pendingBeforeRemoveEvent.current = null;
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F6F9F9]">
      <Header title="Method of exchange" showOption={false} />

      <ScrollView className="flex-1 mx-5">
        {exchangeMethods.map((method) => {
          const isSelected = selectedMethodExchanges.has(method.value);
          return (
            <TouchableOpacity
              key={method.value}
              onPress={() => toggleMethod(method.value)}
              className={`p-5 rounded-lg mt-3 flex-row justify-between items-center ${
                isSelected ? "bg-[#00b0b91A]" : "bg-white"
              }`}
            >
              <Text
                className={`text-lg ${
                  isSelected
                    ? "text-[#00b0b9] font-bold"
                    : "text-black font-normal"
                }`}
              >
                {method.label}
              </Text>
              <Icon
                name={isSelected ? "check-box" : "check-box-outline-blank"}
                size={24}
                color="#00b0b9"
              />
            </TouchableOpacity>
          );
        })}

        <LoadingButton
          title="Confirm"
          onPress={handleConfirm}
          buttonClassName="p-4 mt-3"
        />
      </ScrollView>

      <ErrorModal
        content={"Please select a method of exchange."}
        title={"Missing Selection"}
        visible={visible}
        onCancel={() => setVisible(false)}
      />

      <ConfirmModal
        title="Warning"
        content={`You have unsaved item. ${"\n"} Do you really want to leave?`}
        visible={confirmVisible}
        onCancel={handleCancel}
        onConfirm={handleSure}
      />
    </SafeAreaView>
  );
};

export default MethodOfExchangeScreen;
