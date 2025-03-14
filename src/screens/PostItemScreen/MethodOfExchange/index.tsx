import React, { useCallback } from "react";
import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/MaterialIcons";
import { RootStackParamList } from "../../../navigation/AppNavigator";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../../components/Header";
import { MethodExchange } from "../../../common/enums/MethodExchange";
import LoadingButton from "../../../components/LoadingButton";
import { useUploadItem } from "../../../context/ItemContext";

// Danh sách phương thức giao dịch
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

  const selectedMethodExchanges = new Set(uploadItem.methodExchanges || []);

  const toggleMethod = useCallback(
    (methodValue: MethodExchange) => {
      const updatedMethods = new Set(selectedMethodExchanges);

      if (updatedMethods.has(methodValue)) {
        updatedMethods.delete(methodValue);
      } else {
        updatedMethods.add(methodValue);
      }

      setUploadItem((prev) => ({
        ...prev,
        methodExchanges: Array.from(updatedMethods),
      }));
    },
    [selectedMethodExchanges, setUploadItem]
  );

  const handleConfirm = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

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
    </SafeAreaView>
  );
};

export default MethodOfExchangeScreen;
