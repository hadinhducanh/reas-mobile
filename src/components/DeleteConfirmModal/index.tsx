import React from "react";
import { View, Text, Modal, Pressable, TextInput } from "react-native";
import LoadingButton from "../LoadingButton";

interface DeleteConfirmModalProps {
  title: string;
  content: string;
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  title,
  content,
  onCancel,
  onConfirm,
  visible,
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
          <View className="w-[75%] bg-white rounded-lg p-5">
            <Text className="text-center text-2xl font-semibold text-[#00B0B9]">
              {title}
            </Text>
            <View className="justify-center items-center">
              <Text className="text-center text-xl text-gray-500 my-5 w-full">
                {content}
              </Text>
            </View>

            <View className="flex-row">
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
                  title="Sure"
                  onPress={onConfirm}
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

export default ConfirmModal;
