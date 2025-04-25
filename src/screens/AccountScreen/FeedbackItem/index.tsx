import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import LoadingButton from "../../../components/LoadingButton";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../../components/Header";
import ChooseImage from "../../../components/ChooseImage";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import {
  createFeedbackThunk,
  updateFeedbackThunk,
  viewFeedbackDetailThunk,
} from "../../../redux/thunk/feedbackThunk";
import {
  getAllExchangesByStatusOfCurrentUserThunk,
  getExchangeDetailThunk,
} from "../../../redux/thunk/exchangeThunk";
import { RootStackParamList } from "../../../navigation/AppNavigator";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { uploadToCloudinary } from "../../../utils/CloudinaryImageUploader";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import ConfirmModal from "../../../components/DeleteConfirmModal";
import { resetFeedback } from "../../../redux/slices/feedbackSlice";
import { StatusExchange } from "../../../common/enums/StatusExchange";
import { fetchUserInfoThunk } from "../../../redux/thunk/authThunks";

const FeedbackItem: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const route = useRoute<RouteProp<RootStackParamList, "FeedbackItem">>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { exchangeId } = route.params;
  const { exchangeDetail } = useSelector((state: RootState) => state.exchange);
  const { user } = useSelector((state: RootState) => state.auth);
  const { feedbackDetail, loading } = useSelector(
    (state: RootState) => state.feeback
  );

  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [receivedItemImage, setReceivedItemImage] = useState<string>("");
  const [transferReceiptImage, setTransferReceiptImage] = useState<string>("");
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  useEffect(() => {
    dispatch(getExchangeDetailThunk(exchangeId));

    if (exchangeDetail?.feedbackId) {
      dispatch(viewFeedbackDetailThunk(exchangeDetail?.feedbackId));
    }
    if (feedbackDetail !== null) {
      if (feedbackDetail.imageUrl.split(", ").length === 2) {
        setReceivedItemImage(feedbackDetail?.imageUrl.split(", ")[0]!);
        setTransferReceiptImage(feedbackDetail?.imageUrl.split(", ")[1]!);
      } else {
        setReceivedItemImage(feedbackDetail?.imageUrl.split(", ")[0]!);
      }
      setComment(feedbackDetail?.comment!.replace(/\\n/g, "\n"));
      setRating(feedbackDetail?.rating!);
    }
  }, [dispatch, exchangeId, exchangeDetail?.feedbackId]);

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

  const handleSend = async () => {
    if (exchangeDetail?.feedbackId !== null) {
      setConfirmVisible(true);
    } else {
      setIsUploadingImages(true);
      const processedImages = await processImages();
      setIsUploadingImages(false);

      const feedbackRequest = {
        itemId: exchangeDetail?.sellerItem.id!,
        exchangeHistoryId: exchangeDetail?.exchangeHistory.id!,
        rating: rating,
        comment: comment.replace(/\n/g, "\\n").trim(),
        imageUrl: processedImages,
      };

      setConfirmVisible(false);
      await dispatch(createFeedbackThunk(feedbackRequest));
      dispatch(
        getAllExchangesByStatusOfCurrentUserThunk({
          pageNo: 0,
          statusExchangeRequest: StatusExchange.SUCCESSFUL,
        })
      );
      dispatch(resetFeedback());
      dispatch(fetchUserInfoThunk());
      setReceivedItemImage("");
      setTransferReceiptImage("");
      setRating(5);
      setComment("");
      navigation.goBack();
    }
  };

  const handleConfirm = async () => {
    setIsUploadingImages(true);
    const processedImages = await processImages();
    setIsUploadingImages(false);

    const feedbackRequest = {
      id: feedbackDetail?.id,
      itemId: exchangeDetail?.sellerItem.id!,
      exchangeHistoryId: exchangeDetail?.exchangeHistory.id!,
      rating: rating,
      comment: comment.replace(/\n/g, "\\n").trim(),
      imageUrl: processedImages,
    };
    setConfirmVisible(false);
    await dispatch(updateFeedbackThunk(feedbackRequest));
    dispatch(
      getAllExchangesByStatusOfCurrentUserThunk({
        pageNo: 0,
        statusExchangeRequest: StatusExchange.SUCCESSFUL,
      })
    );
    dispatch(resetFeedback());
    setReceivedItemImage("");
    setTransferReceiptImage("");
    setRating(5);
    setComment("");
    navigation.goBack();
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f6f9f9]">
      <Header title="Leave a feedback" showOption={false} />

      {loading || isUploadingImages ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#00b0b9" />
        </View>
      ) : (
        <View className="flex-1 m-5 bg-white rounded-[10px] flex flex-col items-center justify-center">
          <Text className="text-2xl font-bold text-[#0b1d2d] text-center pt-10">
            Please Rate Item And {"\n"} Resident For The Exchange
          </Text>

          <ChooseImage
            receivedItemImage={receivedItemImage}
            setReceivedItemImage={setReceivedItemImage}
            transferReceiptImage={transferReceiptImage}
            setTransferReceiptImage={setTransferReceiptImage}
            isUploadEvidence={true}
            isFeedback={true}
          />

          <View className="flex-row justify-between w-[65%] my-5">
            {[1, 2, 3, 4, 5].map((num) => (
              <TouchableOpacity key={num} onPress={() => setRating(num)}>
                <Icon
                  name="star"
                  size={40}
                  color={num <= rating ? "#FFD700" : "#dfecec"}
                />
              </TouchableOpacity>
            ))}
          </View>

          <Text className="text-[16px] leading-[24px] text-[#738aa0] text-center mt-[10px]">
            Your feedback help us and resdent in {"\n"} improving the quality of
            the app better!
          </Text>

          <View className="w-[90%] mx-auto h-40 bg-gray-100 rounded-lg mt-4 px-5 py-3">
            <TextInput
              className="flex-1 text-base font-normal text-gray-500"
              placeholder="Write your feedback..."
              placeholderTextColor="#d1d5db"
              multiline={true}
              textAlignVertical="top"
              value={comment}
              onChangeText={setComment}
            />
          </View>

          <View className="w-full p-5 mt-auto">
            {!feedbackDetail?.updated && (
              <LoadingButton
                title={exchangeDetail?.feedbackId !== null ? "Update" : "Send"}
                onPress={handleSend}
                buttonClassName="py-4"
              />
            )}
          </View>
        </View>
      )}
      <ConfirmModal
        title="Warning"
        content="You can only update feedback once!"
        visible={confirmVisible}
        onCancel={() => setConfirmVisible(false)}
        onConfirm={handleConfirm}
      />
    </SafeAreaView>
  );
};

export default FeedbackItem;
