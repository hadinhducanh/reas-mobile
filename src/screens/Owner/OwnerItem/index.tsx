import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../../components/Header";
import Icon from "react-native-vector-icons/Ionicons";
import TabHeader from "../../../components/TabHeader";
import ItemCard from "../../../components/CardItem";
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { RootStackParamList } from "../../../navigation/AppNavigator";
import { ItemResponse } from "../../../common/models/item";
import { AppDispatch, RootState } from "../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { getUserThunk } from "../../../redux/thunk/userThunk";
import {
  getAllItemOfUserByStatusThunk,
  getItemCountsOfUserThunk,
} from "../../../redux/thunk/itemThunks";
import { StatusItem } from "../../../common/enums/StatusItem";
import dayjs from "dayjs";
import LocationModal from "../../../components/LocationModal";
import { FlatList } from "react-native-gesture-handler";

const OwnerItem: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<StatusItem>(
    StatusItem.AVAILABLE
  );
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "OwnerFeedback">>();
  const { userId } = route.params;
  const { userDetail, loading } = useSelector((state: RootState) => state.user);
  const { user } = useSelector((state: RootState) => state.auth);
  const { itemByStatusOfUser, countsOfUser } = useSelector(
    (state: RootState) => state.item
  );
  const dispatch = useDispatch<AppDispatch>();

  const [locationVisible, setLocationVisible] = useState<boolean>(false);

  const { content, pageNo, last } = itemByStatusOfUser;

  useEffect(() => {
    dispatch(getUserThunk(userId));
    dispatch(
      getAllItemOfUserByStatusThunk({
        pageNo: 0,
        userId: userId,
        statusItem: StatusItem.AVAILABLE,
      })
    );
    dispatch(getItemCountsOfUserThunk(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    dispatch(
      getAllItemOfUserByStatusThunk({
        pageNo: 0,
        userId: userId,
        statusItem: selectedStatus,
      })
    );
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
      label: "AVAILABLE",
      count: countsOfUser.AVAILABLE!,
    },
    {
      label: "EXCHANGED",
      count: countsOfUser.EXCHANGED!,
    },
  ];

  const handleLoadMore = () => {
    if (!loading && !last) {
      dispatch(
        getAllItemOfUserByStatusThunk({
          pageNo: pageNo + 1,
          userId: userId,
          statusItem: selectedStatus,
        })
      );
    }
  };

  const ListHeaderComponent = (
    <>
      <Header
        title={userDetail?.fullName}
        backgroundColor="bg-[#00B0B9]"
        backIconColor="white"
        textColor="text-white"
        optionIconColor="white"
        showOption={userDetail?.id !== user?.id}
        user={userDetail!}
      />

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
            <Text className="text-sm mr-1">
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
                color={num <= userDetail?.numOfRatings! ? "#FFD700" : "#dfecec"}
              />
            ))}
            <Pressable
              onPress={() =>
                navigation.navigate("OwnerFeedback", { userId: userId })
              }
            >
              <Text className="ml-1 text-sm font-semibold text-[#00B0B9] underline">
                ({userDetail?.numOfFeedbacks} feedback)
              </Text>
            </Pressable>
          </View>

          <View className="flex-row items-center mt-2">
            <Icon name="location-outline" size={20} color="#738AA0" />
            <Text className="text-base text-gray-500 ml-1" numberOfLines={1}>
              Location:{" "}
              <Text
                className="text-black underline "
                onPress={() => setLocationVisible(true)}
              >
                {userDetail?.userLocations[0].specificAddress}
              </Text>{" "}
            </Text>
          </View>

          <View className="flex-row items-center mt-1">
            <Icon name="time-outline" size={20} color="#738AA0" />
            <Text className="text-base text-gray-600 ml-1">
              Paticipant:{" "}
              <Text className="text-black">
                {formatRelativeTime(userDetail?.creationDate)}
              </Text>{" "}
            </Text>
          </View>
        </View>
      </View>

      <View className="bg-white">
        <TabHeader
          owner={true}
          tabs={tabs}
          selectedTab={selectedStatus}
          onSelectTab={(value) => setSelectedStatus(value as StatusItem)}
        />
      </View>
    </>
  );

  const renderItem = ({
    item,
    index,
  }: {
    item: ItemResponse;
    index: number;
  }) => {
    const isSingle = content.length % 2 === 1 && index === content.length - 1;

    return (
      <View className={`${isSingle ? "w-1/2 px-1.5" : "flex-1 px-1.5"}`}>
        <ItemCard item={item} navigation={navigation} mode="default" />
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1" edges={["top"]}>
      <FlatList
        data={content}
        numColumns={2}
        renderItem={renderItem}
        keyExtractor={(item, index) =>
          item ? item.id.toString() : `empty-${index}`
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={() => {
          if (loading) {
            return (
              <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#00b0b9" />
              </View>
            );
          }

          return (
            <View className="bg-white flex-1 justify-center items-center">
              <Icon name="remove-circle-outline" size={70} color={"#00b0b9"} />
              <Text className="text-gray-500">No item</Text>
            </View>
          );
        }}
        ListFooterComponent={
          !loading || content.length === 0 ? null : (
            <ActivityIndicator size="large" color="#00b0b9" />
          )
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          backgroundColor: "#f3f4f6",
          flexGrow: 1,
        }}
      />

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

export default OwnerItem;
