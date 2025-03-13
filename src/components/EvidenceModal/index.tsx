import React, { useState } from "react";
import { Modal, Pressable, View, Text, TextInput } from "react-native";
import LoadingButton from "../LoadingButton";
import ChooseImage from "../ChooseImage";

interface EvidenceModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const EvidenceModal: React.FC<EvidenceModalProps> = ({
  visible,
  onCancel,
  onConfirm,
}) => {
  const [receivedItemImage, setReceivedItemImage] = useState<string>("");
  const [transferReceiptImage, setTransferReceiptImage] = useState<string>("");

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
              Your evidence
            </Text>
            <Text className="text-center text-sm text-gray-500 mt-1">
              Please input your evidence {"\n"} confirming completing your
              exchange
            </Text>

            {/* Choose evidence */}
            <ChooseImage
              receivedItemImage={receivedItemImage}
              setReceivedItemImage={setReceivedItemImage}
              transferReceiptImage={transferReceiptImage}
              setTransferReceiptImage={setTransferReceiptImage}
              isUploadEvidence={true}
            />

            <View className="mt-5">
              <Text className="font-bold text-lg text-gray-500">Note</Text>

              <View className="px-3 rounded-lg my-2 bg-gray-100">
                <View className="pb-20">
                  <TextInput
                    className="text-gray-500 text-base"
                    placeholder="Write your message here..."
                  ></TextInput>
                </View>
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
                  title="Confirm"
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

export default EvidenceModal;
