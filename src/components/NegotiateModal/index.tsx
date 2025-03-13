import React from "react";
import { Modal, Pressable, View, Text, TextInput } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import LoadingButton from "../LoadingButton";

interface NegotiateModalProps {
  visible: boolean;
  onCancel: () => void;
  onSet: () => void;
}

const NegotiateModal: React.FC<NegotiateModalProps> = ({
  visible,
  onCancel,
  onSet,
}) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable className="flex-1 bg-[rgba(0,0,0,0.2)]" onPress={onCancel}>
        <View className="absolute inset-0 flex justify-center items-center">
          <View className="w-[85%] bg-white rounded-lg p-5">
            <Text className="text-center text-xl font-bold text-[#00B0B9]">
              Negotiated Price
            </Text>
            <Text className="text-center text-sm text-gray-500 mt-1">
              Please input a negotiated price
            </Text>

            <View className="flex-row justify-between items-center mt-4 mb-2">
              <View>
                <Text className="text-base font-medium text-gray-800">
                  Estimated difference
                </Text>
                <Text className="text-lg font-bold text-[#00B0B9]">
                  350.000 VND
                </Text>
              </View>
              <Icon name="cash-outline" size={40} color="#00B0B9" />
            </View>

            <View className="border border-[#00B0B9] rounded-md px-3 py-2">
              <Text className="text-[#00B0B9] font-bold">Negotiated price</Text>
              <View className="flex-row items-center justify-between">
                <TextInput
                  placeholder="0"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  className="flex-1 text-base text-gray-700 font-semibold"
                />
                <Text className="text-gray-500 ml-1 font-semibold">đ</Text>
              </View>
            </View>

            <View className="flex-row mt-5">
              <View className="flex-1 mr-2">
                <LoadingButton
                  title="Cancel"
                  onPress={onCancel}
                  buttonClassName="p-4 border-[#00B0B9] border-2 bg-white"
                  textColor="text-[#00B0B9]"
                />
              </View>
              <View className="flex-1">
                <LoadingButton
                  title="Set"
                  onPress={onSet}
                  buttonClassName="p-4 border-2 border-transparent"
                />
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

export default NegotiateModal;
