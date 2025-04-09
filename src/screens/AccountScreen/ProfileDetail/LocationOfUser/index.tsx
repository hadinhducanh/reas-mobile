import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { PlaceDetail } from "../../../../common/models/location";
import { AppDispatch, RootState } from "../../../../redux/store";
import LocationService from "../../../../services/LocationService";
import { RootStackParamList } from "../../../../navigation/AppNavigator";
import Header from "../../../../components/Header";
import {
  resetUser,
  setUserLocationIdState,
} from "../../../../redux/slices/userSlice";
import SetLocation from "../../../../components/SetLocation";
import ConfirmModal from "../../../../components/DeleteConfirmModal";
import { deleteUserLocationOfCurrentUserThunk } from "../../../../redux/thunk/userThunk";
import { fetchUserInfoThunk } from "../../../../redux/thunk/authThunks";

const LocationOfUser: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch<AppDispatch>();

  const { user } = useSelector((state: RootState) => state.auth);
  const { userPlaceId, deleteUserLocation, loading } = useSelector(
    (state: RootState) => state.user
  );

  const [locationVisible, setLocationVisible] = useState<boolean>(false);
  const [deletedVisible, setDeletedVisible] = useState(false);

  const [locationDetails, setLocationDetails] = useState<PlaceDetail[]>([]);
  const [loadingLocal, setLoading] = useState<boolean>(false);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
    userPlaceId
  );
  const [selectedDeleteLocationId, setSelectedDeleteLocationId] =
    useState<number>(0);
  const [shouldReloadLocations, setShouldReloadLocations] = useState(false);

  useEffect(() => {
    if (user && user?.userLocations.length > 0) {
      setLoading(true);
      Promise.all(
        user.userLocations.map((loc) =>
          LocationService.getPlaceDetailsByReverseGeocode(
            `${loc.latitude},${loc.longitude}`
          ).then((placeDetail) => ({
            ...placeDetail,
            userLocationInfo: loc,
          }))
        )
      )
        .then((results: PlaceDetail[]) => {
          setLocationDetails(results);
        })
        .catch((error) =>
          console.error("Error fetching location details:", error)
        )
        .finally(() => {
          setLoading(false);
          setShouldReloadLocations(false);
        });
    }
  }, [user?.userLocations.length, shouldReloadLocations]);

  const handleSelectLocation = (userLocationId: number, place_id: string) => {
    dispatch(setUserLocationIdState(userLocationId));
    setSelectedLocationId(place_id);
    navigation.goBack();
  };

  const handleConfirm = async () => {
    try {
      setDeletedVisible(false);
      await dispatch(
        deleteUserLocationOfCurrentUserThunk(selectedDeleteLocationId)
      ).unwrap();
      await dispatch(fetchUserInfoThunk());
      dispatch(resetUser());
      setSelectedDeleteLocationId(0);
    } catch (error) {
      console.error("Failed to delete location:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F6F9F9]" edges={["top"]}>
      <Header
        title="Personal information"
        showOption={false}
        showUserLocation={true}
        onAddLocation={() => setLocationVisible(true)}
      />

      {loadingLocal || loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#00b0b9" />
        </View>
      ) : (
        <>
          {locationDetails.length === 0 ? (
            <View className="flex-1 justify-center items-center">
              <Icon name="remove-circle-outline" size={70} color={"#00b0b9"} />
              <Text className="text-gray-500">No location</Text>
            </View>
          ) : (
            <View className="px-2">
              <FlatList
                data={locationDetails}
                keyExtractor={(item) => item.place_id}
                contentContainerStyle={{ paddingBottom: 100 }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() =>
                      handleSelectLocation(
                        item.userLocationInfo !== undefined
                          ? item.userLocationInfo?.id
                          : 0,
                        item.place_id
                      )
                    }
                    onLongPress={() => {
                      if (
                        locationDetails.length > 1 &&
                        selectedLocationId !== item.place_id
                      ) {
                        setDeletedVisible(true);
                        setSelectedDeleteLocationId(item.userLocationInfo?.id!);
                      }
                    }}
                    className={`p-5 rounded-lg mt-3 flex-row justify-between items-center ${
                      selectedLocationId === item.place_id
                        ? "bg-[#00b0b91A]"
                        : "bg-white"
                    }`}
                  >
                    <View className="flex-row items-center">
                      <Icon
                        name="location-outline"
                        size={22}
                        color={
                          selectedLocationId === item.place_id
                            ? "#00B0B9"
                            : "#00B0B9"
                        }
                      />
                      <View className="ml-2 flex-1">
                        <Text
                          className={`text-lg font-semibold ${
                            selectedLocationId === item.place_id
                              ? "text-[#00B0B9]"
                              : "text-black"
                          }`}
                        >
                          {item.name}
                        </Text>
                        <Text
                          className={`text-base ${
                            selectedLocationId === item.place_id
                              ? "text-[#00B0B9]"
                              : "text-black"
                          }`}
                          numberOfLines={1}
                        >
                          {item.formatted_address}
                        </Text>
                      </View>
                      <Icon
                        name={
                          selectedLocationId === item.place_id
                            ? "radio-button-on-outline"
                            : "radio-button-off-outline"
                        }
                        size={24}
                        color="#00b0b9"
                      />
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </>
      )}

      <SetLocation
        visible={locationVisible}
        onCancel={() => setLocationVisible(false)}
        onAddSuccess={() => {
          setLocationVisible(false);
          setShouldReloadLocations(true);
        }}
        userLocation={true}
      />

      <ConfirmModal
        title="Confirm delete"
        content="Are you sure you to delete this location?"
        visible={deletedVisible}
        onCancel={() => setDeletedVisible(false)}
        onConfirm={handleConfirm}
      />
    </SafeAreaView>
  );
};

export default LocationOfUser;
