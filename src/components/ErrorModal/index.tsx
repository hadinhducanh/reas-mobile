import React from "react";
import { View, Text, Modal, Pressable, TextInput } from "react-native";
import LoadingButton from "../LoadingButton";

interface DeleteConfirmModalProps {
  title: string;
  content: string;
  visible: boolean;
  onCancel: () => void;
}

const ErrorModal: React.FC<DeleteConfirmModalProps> = ({
  title,
  content,
  onCancel,
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
          <View className="w-[85%] bg-white rounded-lg p-5">
            <Text className="text-center text-2xl font-semibold text-[#00B0B9]">
              {title}
            </Text>
            <View className="justify-center items-center">
              <Text className="text-center text-xl text-gray-500 mt-4 mb-2 w-full">
                {content}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

export default ErrorModal;
