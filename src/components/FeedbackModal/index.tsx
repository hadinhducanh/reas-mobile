import React, { useEffect } from "react";
import { Modal, View, Text, Pressable, Image } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import LoadingButton from "../LoadingButton";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { viewFeedbackDetailThunk } from "../../redux/thunk/feedbackThunk";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/AppNavigator";

interface ChooseLocationModalProps {
  feedbackId: number;
  exchangeId: number;
  visible: boolean;
  onCancel: () => void;
}

const FeebackModal: React.FC<ChooseLocationModalProps> = ({
  feedbackId,
  exchangeId,
  visible,
  onCancel,
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useDispatch<AppDispatch>();
  const { feedbackDetail } = useSelector((state: RootState) => state.feeback);

  useEffect(() => {
    dispatch(viewFeedbackDetailThunk(feedbackId));
  }, [dispatch, feedbackId]);

  const formatPrice = (price: number | undefined): string => {
    if (price === undefined) return "0";
    return price.toLocaleString("vi-VN");
  };

  console.log(feedbackDetail);

  return (
    <>
      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={onCancel}
      >
        <View className="flex-1 bg-black/50 justify-center items-center">
          <Pressable className="absolute inset-0" onPress={onCancel} />

          <View className="w-[90%] bg-white rounded-lg shadow-md p-5">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="items-center">
                  <Icon name="person-circle-outline" size={40} color="gray" />
                </View>
                <Text className="text-lg font-bold">
                  {feedbackDetail?.user.fullName}
                </Text>
              </View>
              {feedbackDetail?.updated === undefined ? (
                <View>
                  <LoadingButton
                    onPress={() =>
                      navigation.navigate("FeedbackItem", {
                        exchangeId: exchangeId,
                      })
                    }
                    title="Update"
                    buttonClassName="px-3 py-1 bg-white border border-[#00B0B9]"
                    textColor="text-[#00B0B9]"
                  />
                </View>
              ) : (
                ""
              )}
            </View>

            {feedbackDetail?.imageUrl.length === 0 ? (
              ""
            ) : feedbackDetail?.imageUrl.split(", ").length === 1 ? (
              <View className="flex-row mt-2 justify-start">
                <View className="w-20 h-28 rounded-lg items-center justify-center">
                  <Image
                    source={{
                      uri: feedbackDetail?.imageUrl.split(", ")[0],
                    }}
                    className="w-full h-full rounded-lg"
                  />
                </View>
              </View>
            ) : (
              <View className="flex-row justify-start mt-2">
                <View className="w-20 h-28 rounded-lg items-center justify-centers mr-2">
                  <Image
                    source={{
                      uri: feedbackDetail?.imageUrl.split(", ")[0],
                    }}
                    className="w-full h-full rounded-lg"
                  />
                </View>
                <View className="w-20 h-28 rounded-lg items-center justify-center">
                  <Image
                    source={{
                      uri: feedbackDetail?.imageUrl.split(", ")[1],
                    }}
                    className="w-full h-full rounded-lg"
                  />
                </View>
              </View>
            )}

            {feedbackDetail?.comment && (
              <View className="mt-2">
                {feedbackDetail?.comment.split("\\n").map((line, index) => (
                  <Text className="text-gray-700" key={index}>
                    {line}
                  </Text>
                ))}
              </View>
            )}

            <View className="flex-row items-center mt-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <Icon
                  name="star"
                  size={16}
                  color={num <= feedbackDetail?.rating! ? "#FFD700" : "#dfecec"}
                />
              ))}
              <Text className="ml-2 text-gray-500 text-sm">| 2 năm trước</Text>
            </View>

            <View className="flex-row items-center bg-[#D6F2F4] rounded-lg mt-4 p-3">
              <View className="" />
              <View className="w-12 h-12 bg-white rounded-md mr-3">
                <Image
                  source={{
                    uri: feedbackDetail?.item.imageUrl.split(", ")[0],
                  }}
                  className="w-full h-full object-contain"
                  resizeMode="contain"
                />
              </View>
              <View>
                <Text className="text-gray-700 font-medium">
                  {feedbackDetail?.item.itemName}
                </Text>
                <Text className="text-[#00B0B9] font-bold">
                  {feedbackDetail?.item.price === 0
                    ? "Free"
                    : formatPrice(feedbackDetail?.item.price) + " VND"}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default FeebackModal;
