// StatsCard.tsx
import React, { useState } from "react";
import { View, Text, Pressable, Image } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import NegotiateModal from "../NegotiateModal";
import EvidenceModal from "../EvidenceModal";
import { StatusExchange } from "../../common/enums/StatusExchange";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

interface UploadEvidenceProps {
  status: StatusExchange;
}

export const UploadEvidence: React.FC<UploadEvidenceProps> = ({ status }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [titleModal, setTitleModal] = useState<string>("");
  const [isSeller, setIsSeller] = useState<boolean>(false);
  const { exchangeDetail } = useSelector((state: RootState) => state.exchange);
  const { user } = useSelector((state: RootState) => state.auth);

  const handlUploadEvidenceModal = (
    value: string,
    isSellerSelected: boolean
  ) => {
    setIsSeller(isSellerSelected);
    setTitleModal(value);
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
      {exchangeDetail?.exchangeDate &&
        new Date(exchangeDetail.exchangeDate) < new Date() &&
        (status === StatusExchange.APPROVED ||
          status === StatusExchange.SUCCESSFUL ||
          status === StatusExchange.FAILED) && (
          <View className="mb-8">
            <Text className="font-bold text-lg text-gray-500">
              Confirmed evidence
            </Text>

            <View className="bg-white mt-2 rounded-lg p-4 flex-col justify-center h-fit">
              {user?.id === exchangeDetail?.sellerItem.owner.id ? (
                <>
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <View className="items-center mr-2">
                        {exchangeDetail?.sellerItem.owner.image ? (
                          <View className="w-16 h-16 rounded-full items-center justify-center">
                            <Image
                              source={{
                                uri: exchangeDetail?.sellerItem.owner.image,
                              }}
                              className="w-full h-full rounded-full"
                            />
                          </View>
                        ) : (
                          <View className="w-16 h-16 rounded-full items-center justify-center">
                            <Icon
                              name="person-circle-outline"
                              size={60}
                              color="gray"
                            />
                          </View>
                        )}
                      </View>
                      <Text className="justify-start items-center text-left text-lg font-medium text-black">
                        You
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <Pressable className="flex-row items-center">
                        <Text
                          onPress={() =>
                            handlUploadEvidenceModal("Your evidence", true)
                          }
                          className={`text-sm  font-semibold underline ${
                            exchangeDetail.exchangeHistory.sellerConfirmation
                              ? "text-[#00b0b9] active:text-[rgb(0,176,185,0.8)]"
                              : "text-gray-500 active:text-gray-600"
                          }`}
                        >
                          Your evidence
                        </Text>
                      </Pressable>
                      {exchangeDetail.exchangeHistory.sellerConfirmation ? (
                        <Icon
                          name="checkmark-circle-outline"
                          size={20}
                          color="#00b0b9"
                          className="ml-1"
                        />
                      ) : (
                        <Icon
                          name="close-circle-outline"
                          size={20}
                          color="black"
                          className="ml-1"
                        />
                      )}
                    </View>
                  </View>

                  <View className="border-[0.2px] border-gray-300 my-3"></View>

                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <View className="items-center mr-2">
                        {exchangeDetail?.buyerItem === null ? (
                          <>
                            {exchangeDetail?.paidBy.image ? (
                              <View className="w-16 h-16 rounded-full items-center justify-center">
                                <Image
                                  source={{
                                    uri: exchangeDetail?.paidBy.image,
                                  }}
                                  className="w-full h-full rounded-full"
                                />
                              </View>
                            ) : (
                              <View className="w-16 h-16 rounded-full items-center justify-center">
                                <Icon
                                  name="person-circle-outline"
                                  size={60}
                                  color="gray"
                                />
                              </View>
                            )}
                          </>
                        ) : (
                          <>
                            {exchangeDetail?.buyerItem.owner.image ? (
                              <View className="w-16 h-16 rounded-full items-center justify-center">
                                <Image
                                  source={{
                                    uri: exchangeDetail?.buyerItem.owner.image,
                                  }}
                                  className="w-full h-full rounded-full"
                                />
                              </View>
                            ) : (
                              <View className="w-16 h-16 rounded-full items-center justify-center">
                                <Icon
                                  name="person-circle-outline"
                                  size={60}
                                  color="gray"
                                />
                              </View>
                            )}
                          </>
                        )}
                      </View>
                      <Text className="justify-start items-center text-left text-lg font-medium text-black">
                        {exchangeDetail.buyerItem === null
                          ? exchangeDetail.paidBy.fullName
                          : exchangeDetail.buyerItem.owner.fullName}
                      </Text>
                    </View>
                    <View className="flex-row items-center ">
                      <Pressable className="flex-row items-center">
                        <Text
                          disabled={
                            !exchangeDetail.exchangeHistory.buyerConfirmation
                          }
                          onPress={() =>
                            handlUploadEvidenceModal("Their evidence", false)
                          }
                          className={`text-sm  font-semibold underline ${
                            exchangeDetail.exchangeHistory.buyerConfirmation
                              ? "text-[#00b0b9] active:text-[rgb(0,176,185,0.8)]"
                              : "text-gray-500 active:text-gray-600"
                          }`}
                        >
                          Their evidence
                        </Text>
                      </Pressable>
                      {exchangeDetail.exchangeHistory.buyerConfirmation ? (
                        <Icon
                          name="checkmark-circle-outline"
                          size={20}
                          color="#00b0b9"
                          className="ml-1"
                        />
                      ) : (
                        <Icon
                          name="close-circle-outline"
                          size={20}
                          color="black"
                          className="ml-1"
                        />
                      )}
                    </View>
                  </View>
                </>
              ) : (
                <>
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <View className="items-center mr-2">
                        {exchangeDetail?.buyerItem === null ? (
                          <>
                            {exchangeDetail?.paidBy.image ? (
                              <View className="w-16 h-16 rounded-full items-center justify-center">
                                <Image
                                  source={{
                                    uri: exchangeDetail?.paidBy.image,
                                  }}
                                  className="w-full h-full rounded-full"
                                />
                              </View>
                            ) : (
                              <View className="w-16 h-16 rounded-full items-center justify-center">
                                <Icon
                                  name="person-circle-outline"
                                  size={60}
                                  color="gray"
                                />
                              </View>
                            )}
                          </>
                        ) : (
                          <>
                            {exchangeDetail?.buyerItem.owner.image ? (
                              <View className="w-16 h-16 rounded-full items-center justify-center">
                                <Image
                                  source={{
                                    uri: exchangeDetail?.buyerItem.owner.image,
                                  }}
                                  className="w-full h-full rounded-full"
                                />
                              </View>
                            ) : (
                              <View className="w-16 h-16 rounded-full items-center justify-center">
                                <Icon
                                  name="person-circle-outline"
                                  size={60}
                                  color="gray"
                                />
                              </View>
                            )}
                          </>
                        )}
                      </View>
                      <Text className="justify-start items-center text-left text-lg font-medium text-black">
                        You
                      </Text>
                    </View>
                    <View className="flex-row items-center ">
                      <Pressable className="flex-row items-center">
                        <Text
                          onPress={() =>
                            handlUploadEvidenceModal("Your evidence", false)
                          }
                          className={`text-sm  font-semibold underline ${
                            exchangeDetail.exchangeHistory.buyerConfirmation
                              ? "text-[#00b0b9] active:text-[rgb(0,176,185,0.8)]"
                              : "text-gray-500 active:text-gray-600"
                          }`}
                        >
                          Your evidence
                        </Text>
                      </Pressable>
                      {exchangeDetail.exchangeHistory.buyerConfirmation ? (
                        <Icon
                          name="checkmark-circle-outline"
                          size={20}
                          color="#00b0b9"
                          className="ml-1"
                        />
                      ) : (
                        <Icon
                          name="close-circle-outline"
                          size={20}
                          color="black"
                          className="ml-1"
                        />
                      )}
                    </View>
                  </View>

                  <View className="border-[0.2px] border-gray-300 my-3"></View>

                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <View className="items-center mr-2">
                        {exchangeDetail?.sellerItem.owner.image ? (
                          <View className="w-16 h-16 rounded-full items-center justify-center">
                            <Image
                              source={{
                                uri: exchangeDetail?.sellerItem.owner.image,
                              }}
                              className="w-full h-full rounded-full"
                            />
                          </View>
                        ) : (
                          <View className="w-16 h-16 rounded-full items-center justify-center">
                            <Icon
                              name="person-circle-outline"
                              size={60}
                              color="gray"
                            />
                          </View>
                        )}
                      </View>
                      <Text className="justify-start items-center text-left text-lg font-medium text-black">
                        {exchangeDetail.sellerItem.owner.fullName}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <Pressable className="flex-row items-center">
                        <Text
                          onPress={() =>
                            handlUploadEvidenceModal("Their evidence", true)
                          }
                          disabled={
                            !exchangeDetail.exchangeHistory.sellerConfirmation
                          }
                          className={`text-sm  font-semibold underline ${
                            exchangeDetail.exchangeHistory.sellerConfirmation
                              ? "text-[#00b0b9] active:text-[rgb(0,176,185,0.8)]"
                              : "text-gray-500 active:text-gray-600"
                          }`}
                        >
                          Their evidence
                        </Text>
                      </Pressable>
                      {exchangeDetail.exchangeHistory.sellerConfirmation ? (
                        <Icon
                          name="checkmark-circle-outline"
                          size={20}
                          color="#00b0b9"
                          className="ml-1"
                        />
                      ) : (
                        <Icon
                          name="close-circle-outline"
                          size={20}
                          color="black"
                          className="ml-1"
                        />
                      )}
                    </View>
                  </View>
                </>
              )}
            </View>
          </View>
        )}

      <EvidenceModal
        isSeller={isSeller}
        title={titleModal}
        visible={modalVisible}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
    </>
  );
};
