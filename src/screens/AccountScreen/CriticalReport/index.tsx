import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import Icon from "react-native-vector-icons/Ionicons";
import { AppDispatch, RootState } from "../../../redux/store";
import ChooseImage from "../../../components/ChooseImage";
import { TypeCriticalReport } from "../../../common/enums/TypeCriticalReport";
import Header from "../../../components/Header";
import LoadingButton from "../../../components/LoadingButton";
import {
  useRoute,
  RouteProp,
  useNavigation,
  NavigationProp,
} from "@react-navigation/native";
import { RootStackParamList } from "../../../navigation/AppNavigator";
import { createCriticalReportThunk } from "../../../redux/thunk/criticalReportThunk";
import { uploadToCloudinary } from "../../../utils/CloudinaryImageUploader";
import { CriticalReportResidentRequest } from "../../../common/models/criticalReport";
import ErrorModal from "../../../components/ErrorModal";
import { resetCriticalReportDetail } from "../../../redux/slices/criticalReportSlice";
import ImagePreviewModal from "../../../components/ImagePreviewModal";

const CriticalReport: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "CriticalReport">>();
  const {
    id,
    typeOfReport,
    feedbackReport,
    userReport,
    exchangeReport,
    criticalReport,
  } = route.params;

  const { criticalReportCreate, criticalReportDetail, loadingCriticalReport } =
    useSelector((state: RootState) => state.criticalReport, shallowEqual);
  const { user } = useSelector((state: RootState) => state.auth, shallowEqual);

  const [comment, setComment] = useState<string>("");
  const [receivedItemImage, setReceivedItemImage] = useState<string>("");
  const [transferReceiptImage, setTransferReceiptImage] = useState<string>("");
  const [typesReport, setTypesReport] = useState<TypeCriticalReport | null>(
    typeOfReport
  );
  const [errorVisible, setErrorVisible] = useState<boolean>(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  // initialize local state only once when detail loads
  useEffect(() => {
    if (criticalReportDetail) {
      setComment(
        criticalReportDetail.contentReport.replace(/\\n/g, "\n") || ""
      );
      if (criticalReportDetail.imageUrl) {
        setReceivedItemImage(
          criticalReportDetail.imageUrl.split(", ")[0] || ""
        );
        setTransferReceiptImage(
          criticalReportDetail.imageUrl.split(", ")[1] || ""
        );
      }

      setTypesReport(criticalReportDetail.typeReport || null);
    }
  }, [criticalReportDetail]);

  const combinedImages = useMemo(
    () =>
      [receivedItemImage, transferReceiptImage]
        .filter((img) => img.trim())
        .join(", "),
    [receivedItemImage, transferReceiptImage]
  );

  const processImages = useCallback(async (): Promise<string> => {
    const urls = await Promise.all(
      combinedImages
        .split(", ")
        .filter((uri) => uri)
        .map((uri) => uploadToCloudinary(uri, user?.email))
    );
    return urls.filter(Boolean).join(", ");
  }, [combinedImages, user?.email]);

  const handleSend = useCallback(async () => {
    if (!comment || !typesReport) {
      Alert.alert("Invalid information", "All fields are required.");
      return;
    }
    setIsUploadingImages(true);
    const imageUrl = await processImages();
    setIsUploadingImages(false);

    // Build typed request based on mode
    if (typeOfReport === TypeCriticalReport.RESIDENT) {
      const request: CriticalReportResidentRequest = {
        typeReport: typesReport,
        contentReport: comment.replace(/\n/g, "\\n").trim(),
        imageUrl,
        userId: id,
      };
      dispatch(createCriticalReportThunk(request));
    } else if (typeOfReport === TypeCriticalReport.EXCHANGE) {
      const request: CriticalReportResidentRequest = {
        typeReport: typesReport,
        contentReport: comment.replace(/\n/g, "\\n").trim(),
        imageUrl,
        exchangeId: id,
      };
      dispatch(createCriticalReportThunk(request));
    } else {
      const request: CriticalReportResidentRequest = {
        typeReport: typesReport,
        contentReport: comment.replace(/\n/g, "\\n").trim(),
        imageUrl,
        feedbackId: id,
      };
      dispatch(createCriticalReportThunk(request));
    }
  }, [comment, typesReport, processImages, typeOfReport, id, dispatch]);

  useEffect(() => {
    if (criticalReportCreate) {
      setErrorVisible(true);
    }
  }, [criticalReportCreate]);

  const formatPrice = (price: number | undefined): string => {
    if (price === undefined) return "0";
    return price.toLocaleString("vi-VN");
  };

  if (loadingCriticalReport || isUploadingImages) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#00b0b9" />
      </View>
    );
  }

  const imageUrls = criticalReportDetail?.imageUrl
    ? criticalReportDetail?.imageUrl.split(", ")
    : [];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Header
        title="Critical report"
        showOption={false}
        backgroundColor="bg-[#00b0b9]"
        textColor="text-white"
        backIconColor="white"
      />

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {typeOfReport === TypeCriticalReport.FEEDBACK && (
          <View className="flex-row items-center bg-[#D6F2F4] rounded-lg my-4 p-3">
            <View className="" />
            <View className="w-12 h-12 bg-white rounded-md mr-3">
              <Image
                source={{
                  uri: feedbackReport?.item.imageUrl.split(", ")[0],
                }}
                className="w-full h-full object-contain"
                resizeMode="contain"
              />
            </View>

            <View className="flex-1">
              <Text className="text-gray-700 font-medium">
                {feedbackReport?.item.itemName}
              </Text>
              <View className="flex-row items-center">
                {[1, 2, 3, 4, 5].map((num) => (
                  <Icon
                    key={num}
                    name="star"
                    size={16}
                    color={
                      num <= feedbackReport?.rating! ? "#FFD700" : "#dfecec"
                    }
                  />
                ))}
              </View>
              <Text className="text-gray-500 font-medium" numberOfLines={1}>
                Comment:{" "}
                <Text className="text-gray-500">
                  {feedbackReport?.comment.split("\\n")[0]}
                </Text>
              </Text>
              <Text className="text-gray-500 font-medium">
                Feedback by:{" "}
                <Text className="text-[#00b0b9]">
                  {feedbackReport?.user.fullName}
                </Text>
              </Text>
            </View>
          </View>
        )}

        {typeOfReport === TypeCriticalReport.RESIDENT && (
          <View className="border-2 py-2 border-gray-300 rounded-xl my-4 flex-row justify-between">
            <View className="flex-row items-center">
              {userReport?.image ? (
                <View className="w-24 h-24 rounded-full items-center justify-center p-2">
                  <Image
                    source={{
                      uri: userReport?.image,
                    }}
                    className="w-full h-full rounded-full"
                  />
                </View>
              ) : (
                <View className="w-24 h-24 rounded-full items-center justify-center">
                  <Icon name="person-circle-outline" size={80} color="gray" />
                </View>
              )}
              <View className="ml-1">
                <Text className="text-lg font-bold">
                  {userReport?.fullName}
                </Text>
                <Text className="text-gray-500 my-1">
                  Sản phẩm:{" "}
                  <Text className="underline text-black">
                    {userReport?.numOfExchangedItems} đã bán
                  </Text>
                </Text>
              </View>
            </View>
            <View className="flex-col justify-center items-center px-5 border-l-2 border-gray-300">
              <View className="flex-row items-center">
                <Text className="mr-1 text-xl font-bold">
                  {userReport?.numOfRatings !== undefined
                    ? Number.isInteger(userReport?.numOfRatings)
                      ? `${userReport?.numOfRatings}.0`
                      : userReport?.numOfRatings
                    : "0.0"}
                </Text>
                <Icon name="star" size={20} color="yellow" />
              </View>
              <Text className="underline">
                {userReport?.numOfFeedbacks} đánh giá
              </Text>
            </View>
          </View>
        )}

        {typeOfReport === TypeCriticalReport.EXCHANGE && (
          <>
            <View className="flex-row justify-between items-center py-5">
              <View className="flex-row flex-1 items-center">
                <View className="items-center mr-2">
                  {user?.id !==
                  (exchangeReport?.buyerItem === null
                    ? exchangeReport?.paidBy.id
                    : exchangeReport?.buyerItem.owner.id) ? (
                    <>
                      {exchangeReport?.buyerItem === null ? (
                        <>
                          {exchangeReport?.paidBy.image ? (
                            <View className="w-16 h-16 rounded-full items-center justify-center">
                              <Image
                                source={{
                                  uri: exchangeReport?.paidBy.image,
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
                          {exchangeReport?.buyerItem.owner.image ? (
                            <View className="w-16 h-16 rounded-full items-center justify-center">
                              <Image
                                source={{
                                  uri: exchangeReport?.buyerItem.owner.image,
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
                    </>
                  ) : (
                    <>
                      {exchangeReport?.sellerItem.owner.image ? (
                        <View className="w-16 h-16 rounded-full items-center justify-center">
                          <Image
                            source={{
                              uri: exchangeReport?.sellerItem.owner.image,
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
                <View className="flex-1">
                  <Text
                    className="justify-start items-center text-left text-[18px] font-medium text-black"
                    numberOfLines={1}
                  >
                    {user?.id !== exchangeReport?.sellerItem.owner.id
                      ? exchangeReport?.sellerItem.owner.fullName
                      : exchangeReport?.buyerItem === null
                      ? exchangeReport.paidBy.fullName
                      : exchangeReport?.buyerItem.owner.fullName}
                  </Text>
                  <Text className="justify-start items-center text-left text-[14px] font-normal text-[#6b7280]">
                    {user?.id !== exchangeReport?.sellerItem.owner.id
                      ? "@Seller"
                      : "@Buyer"}
                  </Text>
                </View>
              </View>
              <View className="relative mr-2">
                <Icon
                  name="swap-horizontal-outline"
                  size={26}
                  color="#00B0B9"
                  style={{ position: "absolute" }}
                />
                <Icon
                  name="swap-horizontal-outline"
                  size={26}
                  color="#00B0B9"
                />
              </View>
              <View className="flex-row items-center flex-1">
                <View className="flex-1">
                  <Text
                    className="justify-start items-center text-right text-[18px] font-medium text-black"
                    numberOfLines={1}
                  >
                    {user?.id ===
                    (exchangeReport?.buyerItem === null
                      ? exchangeReport.paidBy.id
                      : exchangeReport?.buyerItem.owner.id)
                      ? exchangeReport?.buyerItem === null
                        ? exchangeReport.paidBy.fullName
                        : exchangeReport?.buyerItem.owner.fullName
                      : exchangeReport?.sellerItem.owner.fullName}
                  </Text>
                  <Text className="justify-start items-center text-right text-[14px] font-normal text-[#6b7280]">
                    {user?.id ===
                    (exchangeReport?.buyerItem === null
                      ? exchangeReport.paidBy.id
                      : exchangeReport?.buyerItem.owner.id)
                      ? "@Buyer"
                      : "@Seller"}
                  </Text>
                </View>
                <View className="items-center ml-2">
                  {user?.id ===
                  (exchangeReport?.buyerItem === null
                    ? exchangeReport?.paidBy.id
                    : exchangeReport?.buyerItem.owner.id) ? (
                    <Text className="justify-start items-center text-left text-[16px] font-medium text-black">
                      {exchangeReport?.buyerItem === null ? (
                        <>
                          {exchangeReport?.paidBy.image ? (
                            <View className="w-16 h-16 rounded-full items-center justify-center">
                              <Image
                                source={{
                                  uri: exchangeReport?.paidBy.image,
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
                          {exchangeReport?.buyerItem.owner.image ? (
                            <View className="w-16 h-16 rounded-full items-center justify-center">
                              <Image
                                source={{
                                  uri: exchangeReport?.buyerItem.owner.image,
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
                    </Text>
                  ) : (
                    <>
                      {exchangeReport?.sellerItem.owner.image ? (
                        <View className="w-16 h-16 rounded-full items-center justify-center">
                          <Image
                            source={{
                              uri: exchangeReport?.sellerItem.owner.image,
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
              </View>
            </View>
            <View className="mb-4">
              <View className="flex-row justify-between">
                <Text className="font-bold text-lg text-gray-500">
                  Their item
                </Text>
                <Text className="font-bold text-lg text-gray-500">
                  Your item
                </Text>
              </View>
              <View className="flex-row justify-between mt-2">
                {user?.id === exchangeReport?.sellerItem.owner.id ? (
                  <>
                    {exchangeReport?.buyerItem === null ? (
                      <View className="bg-white rounded-lg p-4 shadow-sm w-[47%] justify-center items-center">
                        <Text className="text-gray-500 text-lg">None</Text>
                      </View>
                    ) : (
                      <View className="bg-white rounded-lg p-4 shadow-sm w-[47%]">
                        <View className="w-full h-40">
                          <Image
                            source={{
                              uri: exchangeReport?.buyerItem.imageUrl.split(
                                ", "
                              )[0],
                            }}
                            className="w-full h-full object-contain"
                            resizeMode="contain"
                          />
                        </View>

                        <Text className="mt-2 text-base text-gray-500">
                          {exchangeReport?.buyerItem.itemName}
                        </Text>
                        <Text className="text-sm">
                          {exchangeReport?.buyerItem.price! === 0
                            ? "Free"
                            : formatPrice(exchangeReport?.buyerItem.price!) +
                              " VND"}
                        </Text>
                      </View>
                    )}

                    <View className="bg-white rounded-lg p-4 shadow-sm w-[47%]">
                      <View className="w-full h-40">
                        <Image
                          source={{
                            uri: exchangeReport?.sellerItem.imageUrl.split(
                              ", "
                            )[0],
                          }}
                          className="w-full h-full object-contain"
                          resizeMode="contain"
                        />
                      </View>
                      <Text className="mt-2 text-base text-gray-500">
                        {exchangeReport?.sellerItem.itemName}
                      </Text>
                      <Text className="text-sm">
                        {exchangeReport?.sellerItem.price! === 0
                          ? "Free"
                          : formatPrice(exchangeReport?.sellerItem.price!) +
                            " VND"}
                      </Text>
                    </View>
                  </>
                ) : (
                  <>
                    <View className="bg-white rounded-lg p-4 shadow-sm w-[47%]">
                      <View className="w-full h-40">
                        <Image
                          source={{
                            uri: exchangeReport?.sellerItem.imageUrl.split(
                              ", "
                            )[0],
                          }}
                          className="w-full h-full object-contain"
                          resizeMode="contain"
                        />
                      </View>

                      <Text className="mt-2 text-base text-gray-500">
                        {exchangeReport?.sellerItem.itemName}
                      </Text>
                      <Text className="text-sm">
                        {exchangeReport?.sellerItem.price! === 0
                          ? "Free"
                          : formatPrice(exchangeReport?.sellerItem.price!) +
                            " VND"}
                      </Text>
                    </View>

                    {exchangeReport?.buyerItem === null ? (
                      <View className="bg-white rounded-lg p-4 shadow-sm w-[47%] justify-center items-center">
                        <Text className="text-gray-500 text-lg">None</Text>
                      </View>
                    ) : (
                      <View className="bg-white rounded-lg p-4 shadow-sm w-[47%]">
                        <View className="w-full h-40">
                          <Image
                            source={{
                              uri: exchangeReport?.buyerItem.imageUrl.split(
                                ", "
                              )[0],
                            }}
                            className="w-full h-full object-contain"
                            resizeMode="contain"
                          />
                        </View>
                        <Text className="mt-2 text-base text-gray-500">
                          {exchangeReport?.buyerItem.itemName}
                        </Text>
                        <Text className="text-sm">
                          {exchangeReport?.buyerItem.price! === 0
                            ? "Free"
                            : formatPrice(exchangeReport?.buyerItem.price!) +
                              " VND"}
                        </Text>
                      </View>
                    )}
                  </>
                )}
              </View>
            </View>
          </>
        )}

        <View className="bg-white rounded-2xl shadow p-4 mb-6">
          <Text className="text-gray-600 mb-2 text-base font-semibold">
            Type of Report
          </Text>
          <View className="flex-row justify-between items-center bg-gray-100 rounded-lg p-3">
            <Text className="text-[#00b0b9] font-semibold">{typesReport}</Text>
          </View>
        </View>

        {criticalReportDetail === null && (
          <View className="bg-white rounded-2xl shadow p-4 mb-6">
            <Text className="text-gray-600 mb-2 text-base font-semibold">
              Upload Image
            </Text>
            <View className="flex-row justify-center">
              <ChooseImage
                receivedItemImage={receivedItemImage}
                setReceivedItemImage={setReceivedItemImage}
                transferReceiptImage={transferReceiptImage}
                setTransferReceiptImage={setTransferReceiptImage}
                isUploadEvidence
                isFeedback
              />
            </View>
          </View>
        )}

        {imageUrls?.length > 0 && (
          <>
            <View className="bg-white rounded-2xl shadow p-4 mb-6">
              <Text className="text-gray-600 mb-2 text-base font-semibold">
                Image
              </Text>
              <View className="flex-row justify-center">
                {imageUrls.map((uri, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      setSelectedIndex(index);
                      setImageModalVisible(true);
                    }}
                    className=""
                  >
                    <View className="w-40 h-56 border-2 border-dashed border-gray-300 rounded-lg items-center justify-center m-2">
                      <Image
                        source={{ uri }}
                        className="w-full h-full rounded-lg"
                        resizeMode="contain"
                      />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        )}

        <View className="bg-white rounded-2xl shadow p-4 mb-6">
          {criticalReportDetail === null ? (
            <>
              <Text className="text-gray-600 mb-2 text-base font-semibold">
                Reported content
              </Text>
              <TextInput
                className="h-32 bg-gray-100 rounded-lg p-3 text-gray-700"
                placeholder="Enter your comment..."
                placeholderTextColor="#9ca3af"
                multiline
                value={comment}
                onChangeText={setComment}
              />
            </>
          ) : (
            <>
              <Text className="text-gray-600 mb-2 text-base font-semibold">
                Report content
              </Text>
              {criticalReportDetail?.contentReport && (
                <View className="mt-2">
                  {criticalReportDetail?.contentReport
                    .split("\\n")
                    .map((line, index) => (
                      <Text className="text-gray-700" key={index}>
                        {line}
                      </Text>
                    ))}
                </View>
              )}
            </>
          )}
        </View>

        {criticalReportDetail !== null &&
          criticalReportDetail.contentResponse && (
            <View className="bg-white rounded-2xl shadow p-4 mb-6">
              <Text className="text-gray-600 mb-2 text-base font-semibold">
                Staff response
              </Text>
              {criticalReportDetail?.contentResponse && (
                <View className="mt-2">
                  {criticalReportDetail?.contentResponse
                    .split("\\n")
                    .map((line, index) => (
                      <Text className="text-gray-700" key={index}>
                        {line}
                      </Text>
                    ))}
                </View>
              )}
              <Text className="text-gray-600 font-semibold mt-2 ml-auto">
                Resolved by:{" "}
                <Text className="text-[#00b0b9]">
                  {criticalReportDetail.answerer.fullName}
                </Text>
              </Text>
            </View>
          )}

        {!criticalReport && (
          <View className="w-full py-5 mt-auto">
            <LoadingButton
              title="Send"
              onPress={handleSend}
              loading={isUploadingImages}
              buttonClassName="py-4"
            />
          </View>
        )}
      </ScrollView>

      <ErrorModal
        title={"Notification"}
        content={"Critical report was sent successful!"}
        visible={errorVisible}
        onCancel={() => {
          setErrorVisible(false);
          dispatch(resetCriticalReportDetail());
          navigation.goBack();
        }}
      />

      <ImagePreviewModal
        visible={imageModalVisible}
        onClose={() => setImageModalVisible(false)}
        initialIndex={selectedIndex}
        imageUrls={imageUrls}
      />
    </SafeAreaView>
  );
};

export default React.memo(CriticalReport);
