import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  FlatList,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../../components/Header";
import Icon from "react-native-vector-icons/Ionicons";
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { RootStackParamList } from "../../../navigation/AppNavigator";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { getUserThunk } from "../../../redux/thunk/userThunk";
import LocationModal from "../../../components/LocationModal";
import dayjs from "dayjs";
import {
  getAllFeedbackOfUserThunk,
  getFeedbackCountsThunk,
} from "../../../redux/thunk/feedbackThunk";
import { FeedbackResponse } from "../../../common/models/feedback";
import FeedbackCard from "../../../components/FeedbackCard";
import { resetFeedback } from "../../../redux/slices/feedbackSlice";
import TabHeader from "../../../components/TabHeader";

const OwnerFeedback: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, "OwnerFeedback">>();
  const { userId } = route.params;
  const dispatch = useDispatch<AppDispatch>();

  const { userDetail, loading } = useSelector((state: RootState) => state.user);
  const { feedbackByUser, countsOfFeedback } = useSelector(
    (state: RootState) => state.feeback
  );

  const { content, pageNo, last } = feedbackByUser;

  const [locationVisible, setLocationVisible] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  useEffect(() => {
    dispatch(resetFeedback());
    dispatch(getUserThunk(userId));

    dispatch(getAllFeedbackOfUserThunk({ pageNo: 0, userId: userId }));
    dispatch(getFeedbackCountsThunk(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    if (selectedStatus === "All") {
      dispatch(getAllFeedbackOfUserThunk({ pageNo: 0, userId }));
    } else {
      const rating = Number(selectedStatus);
      dispatch(getAllFeedbackOfUserThunk({ pageNo: 0, userId, rating }));
    }
  }, [dispatch, selectedStatus]);

  function formatRelativeTime(timeStr: Date | undefined): string {
    const givenTime = dayjs(timeStr);
    const now = dayjs();

    const diffInSeconds = now.diff(givenTime, "second");

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
      const minutes = now.diff(givenTime, "minute");
      return `${minutes} minutes ago`;
    } else if (diffInSeconds < 86400) {
      const hours = now.diff(givenTime, "hour");
      return `${hours} hours ago`;
    } else if (diffInSeconds < 86400 * 30) {
      const days = now.diff(givenTime, "day");
      return `${days} days ago`;
    } else if (diffInSeconds < 86400 * 30 * 12) {
      const months = now.diff(givenTime, "month");
      return `${months} months ago`;
    } else {
      const years = now.diff(givenTime, "year");
      return `${years} years ago`;
    }
  }

  const tabs = [
    {
      label: "All",
      count: countsOfFeedback[0]!,
    },
    {
      label: "5",
      count: countsOfFeedback[5]!,
    },
    {
      label: "4",
      count: countsOfFeedback[4]!,
    },
    {
      label: "3",
      count: countsOfFeedback[3]!,
    },
    {
      label: "2",
      count: countsOfFeedback[2]!,
    },
    {
      label: "1",
      count: countsOfFeedback[1]!,
    },
  ];

  const renderFeedbackCard = ({ item }: { item: FeedbackResponse }) => (
    <>
      <FeedbackCard feedback={item} />
    </>
  );

  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }: any) => {
    const paddingToBottom = 80;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  const handleLoadMore = () => {
    if (!loading && !last) {
      if (selectedStatus === "All") {
        dispatch(
          getAllFeedbackOfUserThunk({
            pageNo: pageNo + 1,
            userId: userDetail?.id!,
          })
        );
      } else {
        const rating = Number(selectedStatus);

        dispatch(
          getAllFeedbackOfUserThunk({
            pageNo: pageNo + 1,
            userId: userDetail?.id!,
            rating: rating,
          })
        );
      }
    }
  };

  return (
    <SafeAreaView className="flex-1" edges={["top"]}>
      <Header
        title="Feedback detail"
        backgroundColor="bg-[#00B0B9]"
        backIconColor="white"
        textColor="text-white"
        optionIconColor="white"
        owner={false}
        showOption={false}
      />

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#00b0b9" />
        </View>
      ) : (
        <>
          <View className="bg-gray-200 h-[140px]" />

          <View className="bg-white -mt-[50px] px-5 pt-5">
            <View className="w-[100px] h-[100px] rounded-full -mt-[60px] items-center justify-center overflow-hidden bg-white">
              {userDetail?.image ? (
                <View className="w-24 h-24 rounded-full items-center justify-center">
                  <Image
                    source={{
                      uri: userDetail?.image,
                    }}
                    className="w-full h-full rounded-full"
                  />
                </View>
              ) : (
                <Icon name="person-circle" size={100} color="gray" />
              )}
            </View>

            <View className="mt-2 pb-5">
              <Text className="text-2xl font-bold">{userDetail?.fullName}</Text>
              <View className="flex-row items-center mt-1">
                <Text className="text-base mr-1">
                  {userDetail?.numOfRatings !== undefined
                    ? Number.isInteger(userDetail.numOfRatings)
                      ? `${userDetail.numOfRatings}.0`
                      : userDetail.numOfRatings
                    : ""}
                </Text>
                {[1, 2, 3, 4, 5].map((num) => (
                  <Icon
                    key={`star-${num}`}
                    name="star"
                    size={16}
                    color={
                      num <= userDetail?.numOfRatings! ? "#FFD700" : "#dfecec"
                    }
                  />
                ))}
                <Text className="ml-1 text-base font-semibold text-[#00B0B9]">
                  ({userDetail?.numOfFeedbacks} feedback)
                </Text>
              </View>
              <View className="flex-row items-center mt-2 w-3/4">
                <Icon name="location-outline" size={20} color="#738AA0" />
                <Text
                  className="text-base text-gray-500 ml-1"
                  numberOfLines={1}
                >
                  Location:{" "}
                  <Text
                    className="text-black underline "
                    onPress={() => setLocationVisible(true)}
                  >
                    {userDetail?.userLocations[0].specificAddress}
                  </Text>
                </Text>
              </View>
              <View className="flex-row items-center mt-1">
                <Icon name="time-outline" size={20} color="#738AA0" />
                <Text className="text-base text-gray-600 ml-1">
                  Paticipant:{" "}
                  <Text className="text-black">
                    {formatRelativeTime(userDetail?.creationDate)}
                  </Text>
                </Text>
              </View>
            </View>
          </View>

          <View className="bg-white">
            <TabHeader
              ownerFeedback={true}
              tabs={tabs}
              selectedTab={selectedStatus}
              onSelectTab={(value) => setSelectedStatus(value as string)}
            />
          </View>

          {feedbackByUser.content.length === 0 ? (
            <View className="bg-white flex-1 justify-center items-center">
              <Icon name="remove-circle-outline" size={70} color={"#00b0b9"} />
              <Text className="text-gray-500">No feedback</Text>
            </View>
          ) : (
            <View className="bg-white flex-1">
              <FlatList
                data={content}
                keyExtractor={(item, index) => `feedback-${item.id ?? index}`}
                renderItem={renderFeedbackCard}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                  loading && pageNo !== 0 ? (
                    <View className="flex-1 justify-center items-center">
                      <ActivityIndicator
                        size="large"
                        color="#00b0b9"
                        className="mb-5"
                      />
                    </View>
                  ) : null
                }
              />
            </View>
          )}
        </>
      )}

      {userDetail?.userLocations[0].specificAddress && (
        <LocationModal
          visible={locationVisible}
          onClose={() => setLocationVisible(false)}
          place_id={userDetail?.userLocations[0].specificAddress
            .split("//")[0]
            .trim()}
        />
      )}
    </SafeAreaView>
  );
};

export default OwnerFeedback;
