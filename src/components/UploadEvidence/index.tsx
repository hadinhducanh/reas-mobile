// StatsCard.tsx
import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import NegotiateModal from "../NegotiateModal";
import EvidenceModal from "../EvidenceModal";

interface UploadEvidenceProps {
  status: string;
}

export const UploadEvidence: React.FC<UploadEvidenceProps> = ({ status }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handlUploadEvidenceModal = () => {
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleConfirm = () => {
    setModalVisible(false);
  };
  return (
    <>
      {status === "Approved" && (
        <View className="mb-8">
          <Text className="font-bold text-lg text-gray-500">Confirmed</Text>

          <View className="bg-white mt-2 rounded-lg p-4 flex-col justify-center h-fit">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="w-16 h-16 rounded-full bg-black mr-2"></View>
                <Text className="justify-start items-center text-left text-lg font-medium text-black">
                  Đức Sơn
                </Text>
              </View>
              <View className="flex-row items-center">
                <View className="flex-row items-center">
                  <Text className="text-sm text-gray-500 font-semibold underline">
                    Their evidence
                  </Text>
                </View>
                <Icon
                  name="close-circle-outline"
                  size={20}
                  color="black"
                  className="ml-1"
                />
              </View>
            </View>

            <View className="border-[0.2px] border-gray-300 my-3"></View>

            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="w-16 h-16 rounded-full bg-black mr-2"></View>
                <Text className="justify-start items-center text-left text-lg font-medium text-black">
                  Ngọc Cường
                </Text>
              </View>
              <View className="flex-row items-center ">
                <Pressable className="flex-row items-center">
                  <Text
                    className="text-sm text-[rgb(0,176,185)] font-bold underline active:text-[rgb(0,176,185,0.8)]"
                    onPress={handlUploadEvidenceModal}
                  >
                    Your evidence
                  </Text>
                </Pressable>
                <Icon
                  name="checkmark-circle-outline"
                  size={20}
                  color="#00b0b9"
                  className="ml-1"
                />
              </View>
            </View>
          </View>
        </View>
      )}

      <EvidenceModal
        visible={modalVisible}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
    </>
  );
};
