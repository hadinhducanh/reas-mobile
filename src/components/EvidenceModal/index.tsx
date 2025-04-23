import React, { useCallback, useState } from "react";
import {
  Modal,
  Pressable,
  View,
  Text,
  TextInput,
  ActivityIndicator,
  Image,
  Alert,
  TouchableOpacity,
} from "react-native";
import LoadingButton from "../LoadingButton";
import ChooseImage from "../ChooseImage";
import { uploadToCloudinary } from "../../utils/CloudinaryImageUploader";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { uploadExchangeEvidenceThunk } from "../../redux/thunk/exchangeThunk";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { StatusExchange } from "../../common/enums/StatusExchange";
import ImagePreviewModal from "../ImagePreviewModal";

interface EvidenceModalProps {
  isSeller: boolean;
  title: string;
  visible: boolean;
  onCancel: () => void;
  onConfirm: (combinedImages: string) => void;
}

const EvidenceModal: React.FC<EvidenceModalProps> = ({
  isSeller,
  title,
  visible,
  onCancel,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [receivedItemImage, setReceivedItemImage] = useState<string>("");
  const [transferReceiptImage, setTransferReceiptImage] = useState<string>("");
  const { user } = useSelector((state: RootState) => state.auth);
  const { loading, exchangeDetail } = useSelector(
    (state: RootState) => state.exchange
  );
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [additionalNotes, setAdditionalNotes] = useState<string>("");
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const combinedImages = [receivedItemImage, transferReceiptImage]
    .filter((img) => img.trim() !== "")
    .join(", ");

  const processImages = useCallback(async (): Promise<string> => {
    const imageArray = combinedImages
      .split(", ")
      .filter((img) => img.trim() !== "");
    const uploadedUrls = await Promise.all(
      imageArray.map(async (uri) => await uploadToCloudinary(uri, user?.email))
    );
    const validUrls = uploadedUrls.filter((url) => url);
    return validUrls.join(", ");
  }, [combinedImages, uploadToCloudinary, user?.email]);

  const handleConfirm = async () => {
    if (!receivedItemImage) {
      Alert.alert("Invalid information", "All fields are required.");
      return;
    } else {
      setIsUploadingImages(true);
      const processedImages = await processImages();
      setIsUploadingImages(false);

      if (
        !exchangeDetail?.exchangeHistory?.buyerConfirmation &&
        !exchangeDetail?.exchangeHistory?.buyerConfirmation
      ) {
        navigation.navigate("MainTabs", { screen: "Exchanges" });
      }
      await dispatch(
        uploadExchangeEvidenceThunk({
          exchangeHistoryId: exchangeDetail?.exchangeHistory.id!,
          imageUrl: processedImages,
          additionalNotes:
            additionalNotes.length === 0
              ? null
              : additionalNotes.replace(/\n/g, "\\n"),
        })
      );
      onCancel();
    }
  };

  const handleAdditionalNotes = useCallback(
    (value: string) => {
      setAdditionalNotes(value);
    },
    [setAdditionalNotes]
  );

  const evidenceOfSellerUrls = exchangeDetail?.exchangeHistory.sellerImageUrl
    ? exchangeDetail?.exchangeHistory.sellerImageUrl.split(", ")
    : [];

  const evidenceOfBuyerUrls = exchangeDetail?.exchangeHistory.buyerImageUrl
    ? exchangeDetail?.exchangeHistory.buyerImageUrl.split(", ")
    : [];

  return (
    <Modal transparent visible={visible} animationType="fade">
      <Pressable className="flex-1 bg-[rgba(0,0,0,0.2)]" onPress={onCancel}>
        <View className="absolute inset-0 flex justify-center items-center">
          {isUploadingImages || loading ? (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color="#00b0b9" />
            </View>
          ) : (
            <>
              {isSeller ? (
                <View className="w-[85%] bg-white rounded-lg p-5">
                  <Text className="text-center text-xl font-bold text-[#00B0B9]">
                    {title}
                  </Text>
                  {!exchangeDetail?.exchangeHistory.sellerConfirmation && (
                    <Text className="text-center text-sm text-gray-500 mt-1">
                      Please input your evidence {"\n"} confirming completing
                      your exchange
                    </Text>
                  )}

                  {!exchangeDetail?.exchangeHistory.sellerConfirmation &&
                  exchangeDetail?.statusExchangeRequest ===
                    StatusExchange.APPROVED ? (
                    <ChooseImage
                      receivedItemImage={receivedItemImage}
                      setReceivedItemImage={setReceivedItemImage}
                      transferReceiptImage={transferReceiptImage}
                      setTransferReceiptImage={setTransferReceiptImage}
                      isUploadEvidence={true}
                    />
                  ) : (
                    <>
                      {/* {exchangeDetail?.exchangeHistory.sellerImageUrl.split(
                        ", "
                      ).length === 1 ? (
                        <TouchableOpacity
                          onPress={() => {
                            setSelectedImage(
                              exchangeDetail?.exchangeHistory?.sellerImageUrl.split(
                                ", "
                              )[0]
                            );
                            setImageModalVisible(true);
                          }}
                          className="flex-row mt-2 justify-center"
                        >
                          <View className="w-40 h-56 border-2 border-dashed border-gray-300 rounded-lg items-center justify-center m-2">
                            <Image
                              source={{
                                uri: exchangeDetail?.exchangeHistory?.sellerImageUrl.split(
                                  ", "
                                )[0],
                              }}
                              className="w-full h-full rounded-lg"
                            />
                          </View>
                        </TouchableOpacity>
                      ) : (
                        
                      )} */}
                      {evidenceOfSellerUrls.length > 0 && (
                        <View className="flex-row justify-center mt-2">
                          {evidenceOfSellerUrls.map((uri, index) => (
                            <TouchableOpacity
                              key={index}
                              onPress={() => {
                                setSelectedIndex(index);
                                setImageModalVisible(true);
                              }}
                              className="flex-row mt-2 justify-center"
                            >
                              <View className="w-40 h-56 border-2 border-dashed border-gray-300 rounded-lg items-center justify-center m-2">
                                <Image
                                  source={{
                                    uri,
                                  }}
                                  className="w-full h-full rounded-lg"
                                />
                              </View>
                            </TouchableOpacity>
                          ))}
                        </View>
                      )}
                    </>
                  )}

                  {exchangeDetail?.exchangeHistory.sellerAdditionalNotes ===
                    null &&
                  !exchangeDetail.exchangeHistory.sellerConfirmation &&
                  exchangeDetail.statusExchangeRequest ===
                    StatusExchange.APPROVED ? (
                    <View className="my-5">
                      <Text className="font-bold text-base text-gray-500">
                        Note (Optional)
                      </Text>

                      <View className="w-full h-40 bg-gray-100 rounded-lg mt-4 px-5 py-3">
                        <TextInput
                          className="flex-1 text-base font-normal text-gray-500"
                          placeholder="Aaaaa"
                          placeholderTextColor="#d1d5db"
                          multiline={true}
                          textAlignVertical="top"
                          value={additionalNotes}
                          onChangeText={(text) => handleAdditionalNotes(text)}
                        />
                      </View>
                    </View>
                  ) : exchangeDetail?.exchangeHistory.sellerAdditionalNotes !==
                    null ? (
                    <View className="my-5">
                      <Text className="font-bold text-base text-gray-500">
                        Note
                      </Text>

                      <View className="bg-white mt-2 rounded-lg p-4 h-fit">
                        {exchangeDetail?.exchangeHistory.sellerAdditionalNotes
                          .split("\\n")
                          .map((line, index) => (
                            <Text
                              className="text-base text-gray-500"
                              key={index}
                            >
                              {line}
                            </Text>
                          ))}
                      </View>
                    </View>
                  ) : null}

                  {!exchangeDetail?.exchangeHistory.sellerConfirmation &&
                    exchangeDetail?.statusExchangeRequest ===
                      StatusExchange.APPROVED && (
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
                            onPress={handleConfirm}
                            buttonClassName="p-4 border-2 border-transparent"
                          />
                        </View>
                      </View>
                    )}
                </View>
              ) : (
                <View className="w-[85%] bg-white rounded-lg p-5">
                  <Text className="text-center text-xl font-bold text-[#00B0B9]">
                    {title}
                  </Text>
                  {!exchangeDetail?.exchangeHistory.buyerConfirmation && (
                    <Text className="text-center text-sm text-gray-500 mt-1">
                      Please input your evidence {"\n"} confirming completing
                      your exchange
                    </Text>
                  )}

                  {!exchangeDetail?.exchangeHistory?.buyerConfirmation &&
                  exchangeDetail?.statusExchangeRequest ===
                    StatusExchange.APPROVED ? (
                    <ChooseImage
                      receivedItemImage={receivedItemImage}
                      setReceivedItemImage={setReceivedItemImage}
                      transferReceiptImage={transferReceiptImage}
                      setTransferReceiptImage={setTransferReceiptImage}
                      isUploadEvidence={true}
                    />
                  ) : (
                    <>
                      {evidenceOfBuyerUrls.length > 0 && (
                        <View className="flex-row justify-center mt-2">
                          {evidenceOfBuyerUrls.map((uri, index) => (
                            <TouchableOpacity
                              key={index}
                              onPress={() => {
                                setSelectedIndex(index);
                                setImageModalVisible(true);
                              }}
                              className="flex-row mt-2 justify-center"
                            >
                              <View className="w-40 h-56 border-2 border-dashed border-gray-300 rounded-lg items-center justify-center m-2">
                                <Image
                                  source={{
                                    uri,
                                  }}
                                  className="w-full h-full rounded-lg"
                                />
                              </View>
                            </TouchableOpacity>
                          ))}
                        </View>
                      )}
                    </>
                  )}

                  {exchangeDetail?.exchangeHistory.buyerAdditionalNotes ===
                    null &&
                  !exchangeDetail.exchangeHistory.buyerConfirmation &&
                  exchangeDetail.statusExchangeRequest ===
                    StatusExchange.APPROVED ? (
                    <View className="my-5">
                      <Text className="font-bold text-base text-gray-500">
                        Note (Optional)
                      </Text>

                      <View className="w-full h-40 bg-gray-100 rounded-lg mt-4 px-5 py-3">
                        <TextInput
                          className="flex-1 text-base font-normal text-gray-500"
                          placeholder="Aaaaa"
                          placeholderTextColor="#d1d5db"
                          multiline={true}
                          textAlignVertical="top"
                          value={additionalNotes}
                          onChangeText={(text) => handleAdditionalNotes(text)}
                        />
                      </View>
                    </View>
                  ) : exchangeDetail?.exchangeHistory.buyerAdditionalNotes !==
                    null ? (
                    <View className="my-5">
                      <Text className="font-bold text-base text-gray-500">
                        Note
                      </Text>

                      <View className="bg-white mt-2 rounded-lg p-4 h-fit">
                        {exchangeDetail?.exchangeHistory.buyerAdditionalNotes
                          .split("\\n")
                          .map((line, index) => (
                            <Text
                              className="text-base text-gray-500"
                              key={index}
                            >
                              {line}
                            </Text>
                          ))}
                      </View>
                    </View>
                  ) : null}

                  {!exchangeDetail?.exchangeHistory?.buyerConfirmation &&
                    exchangeDetail?.statusExchangeRequest ===
                      StatusExchange.APPROVED && (
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
                            onPress={handleConfirm}
                            buttonClassName="p-4 border-2 border-transparent"
                          />
                        </View>
                      </View>
                    )}
                </View>
              )}
            </>
          )}
        </View>
      </Pressable>
      <ImagePreviewModal
        visible={imageModalVisible}
        onClose={() => setImageModalVisible(false)}
        initialIndex={selectedIndex}
        imageUrls={isSeller ? evidenceOfSellerUrls : evidenceOfBuyerUrls}
      />
    </Modal>
  );
};

export default EvidenceModal;
