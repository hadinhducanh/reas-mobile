import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Modal,
  Dimensions,
  StyleSheet,
  TextInput,
  FlatList,
  Text,
  Pressable,
} from "react-native";
import MapView, { Marker, UrlTile, Region } from "react-native-maps";
import * as Location from "expo-location";
import Icon from "react-native-vector-icons/Ionicons";
import { GOONG_MAP_KEY } from "../../common/constant";
import { View, TouchableOpacity } from "react-native";
import { LocationDto, Suggestion } from "../../common/models/location";
import { useExchangeItem } from "../../context/ExchangeContext";
import LoadingButton from "../LoadingButton";
import LocationService from "../../services/LocationService";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import {
  getAllLocationThunk,
  getPlaceDetailsThunk,
} from "../../redux/thunk/locationThunks";
import { MethodExchange } from "../../common/enums/MethodExchange";
import { SafeAreaView } from "react-native-safe-area-context";
import ErrorModal from "../ErrorModal";
import { createNewUserLocationThunk } from "../../redux/thunk/userThunk";
import { fetchUserInfoThunk } from "../../redux/thunk/authThunks";
import { resetPlaceDetail } from "../../redux/slices/locationSlice";
import { resetUser } from "../../redux/slices/userSlice";

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.005;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const tileUrlTemplate = `https://tiles.goong.io/assets/goong_map_web.json?api_key=${GOONG_MAP_KEY}`;

interface SetLocationProps {
  visible: boolean;
  userLocation?: boolean;
  onCancel: () => void;
  onAddSuccess?: () => void;
}

const SetLocation: React.FC<SetLocationProps> = ({
  visible,
  userLocation,
  onCancel,
  onAddSuccess,
}) => {
  const { exchangeItem, setExchangeItem } = useExchangeItem();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedPlaceDetail, locations } = useSelector(
    (state: RootState) => state.location
  );
  const { user } = useSelector((state: RootState) => state.auth);

  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLocationVisible, setLocationVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationDto | null>(
    null
  );
  const [errorVisible, setErrorVisible] = useState<boolean>(false);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }
      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
    })();
  }, []);

  const fetchSuggestions = useCallback(
    async (text: string) => {
      if (text.length > 2 && location) {
        try {
          const suggestions = await LocationService.getSuggestions(
            text,
            location.latitude,
            location.longitude
          );
          setSuggestions(suggestions);
        } catch (error) {
          console.error("Error fetching location suggestions:", error);
        }
      } else {
        setSuggestions([]);
      }
    },
    [location]
  );

  useEffect(() => {
    dispatch(getAllLocationThunk(0));
  }, [locations.content.length]);

  const handleCancel = () => {
    if (isSearching) {
      setIsSearching(false);
    } else {
      setSearchText("");
      setSuggestions([]);
      setIsSearching(false);
      onCancel();
    }
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(searchText);
    }, 500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchText, fetchSuggestions]);

  const onSelectSuggestion = (item: Suggestion) => {
    if (selectedLocation === null && userLocation) {
      setErrorVisible(true);
    } else {
      dispatch(getPlaceDetailsThunk(item.place_id));
      setIsSearching(false);
    }
  };

  const handleConfirm = async () => {
    if (userLocation) {
      try {
        await dispatch(
          createNewUserLocationThunk({
            id: user?.id!,
            latitude: selectedPlaceDetail?.geometry.location.lat!,
            longitude: selectedPlaceDetail?.geometry.location.lng!,
            specificAddress: selectedPlaceDetail?.formatted_address!,
            locationId: selectedLocation?.id!,
          })
        ).unwrap();

        dispatch(fetchUserInfoThunk());
        dispatch(resetPlaceDetail());
        dispatch(resetUser());

        onAddSuccess?.();
      } catch (error) {
        console.error("Failed to create location:", error);
      }
    } else {
      setExchangeItem({
        ...exchangeItem,
        exchangeLocation:
          selectedPlaceDetail?.geometry.location.lat +
          "," +
          selectedPlaceDetail?.geometry.location.lng +
          "//" +
          selectedPlaceDetail?.formatted_address,
      });
      onCancel();
    }
  };

  const coordinate = selectedPlaceDetail
    ? {
        latitude: selectedPlaceDetail.geometry.location.lat,
        longitude: selectedPlaceDetail.geometry.location.lng,
      }
    : location;

  const region: Region | undefined = coordinate
    ? {
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }
    : undefined;

  useEffect(() => {
    if (region && mapRef.current) {
      mapRef.current.animateToRegion(region, 1000);
    }
  }, [region]);

  const handleSelectedLocation = (locationSelected: LocationDto) => {
    if (selectedLocation?.id === locationSelected.id) {
      setSelectedLocation(null);
    } else {
      setSelectedLocation(locationSelected);
    }
    setLocationVisible(false);
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <SafeAreaView className="flex-1 bg-[#00B0B9]" edges={["top"]}>
        <View className="flex-1 bg-white">
          <View className="bg-[#00B0B9] flex-row justify-between items-center p-3">
            <View className="flex-row items-center">
              <TouchableOpacity onPress={handleCancel} className="mr-2">
                <Icon name="chevron-back-outline" size={25} color="white" />
              </TouchableOpacity>
              <Text className="text-xl font-semibold text-white">
                Add location
              </Text>
            </View>
            {userLocation && isSearching && (
              <TouchableOpacity
                onPress={() => setLocationVisible(true)}
                className="flex-row items-center justify-center"
              >
                <Text className="text-white font-semibold text-base">
                  {selectedLocation ? selectedLocation.area : "Choose location"}
                </Text>
                <Icon
                  name="chevron-down-outline"
                  size={14}
                  color="white"
                  className="ml-1"
                />
              </TouchableOpacity>
            )}
          </View>

          {isSearching ? (
            <>
              <View className="mt-4 flex-row items-center border-b-2 border-[#00B0B9] mx-3 px-3">
                <Icon name="search" size={20} color="#00B0B9" />
                <TextInput
                  placeholder="Search location..."
                  value={searchText}
                  onChangeText={setSearchText}
                  className="text-xl bg-white h-16 ml-2 flex-1"
                />
              </View>
              <View className="mt-5 w-full">
                {suggestions.length > 0 && (
                  <FlatList
                    data={suggestions}
                    keyExtractor={(item) => item.place_id}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => onSelectSuggestion(item)}
                        className="p-3 border-b border-gray-200 bg-white px-5"
                      >
                        <View className="flex-row items-center">
                          <Icon
                            name="location-outline"
                            size={22}
                            color="#00B0B9"
                          />
                          <View className="ml-2">
                            <Text className="text-lg font-semibold">
                              {item.structured_formatting.main_text}
                            </Text>
                            <Text className="text-base">
                              {item.structured_formatting.secondary_text}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    )}
                    className="mt-2"
                  />
                )}
              </View>
            </>
          ) : (
            <>
              <TouchableOpacity
                onPress={() => {
                  setIsSearching(true);
                  setSearchText("");
                  setSuggestions([]);
                }}
                className="absolute left-4 right-4 top-16 p-4 border border-gray-300 rounded-lg bg-white z-10 flex-row items-center"
              >
                <Icon name="search-outline" size={22} color="#00B0B9" />
                <Text className="text-xl ml-2" numberOfLines={1}>
                  {selectedPlaceDetail !== null
                    ? selectedPlaceDetail.formatted_address
                    : "Search location..."}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setIsSearching(true);
                  setSearchText("");
                  setSuggestions([]);
                }}
                className="absolute left-4 right-4 bottom-5 rounded-lg z-10 mx-4"
              >
                <LoadingButton
                  title="Confirm"
                  buttonClassName="p-4"
                  onPress={handleConfirm}
                />
              </TouchableOpacity>
            </>
          )}

          {!isSearching && location && region && (
            <View style={{ flex: 1, position: "relative" }}>
              <MapView ref={mapRef} style={{ flex: 1 }} initialRegion={region}>
                <UrlTile
                  urlTemplate={tileUrlTemplate}
                  maximumZ={19}
                  flipY={false}
                />
                {coordinate && <Marker coordinate={coordinate} />}
              </MapView>
            </View>
          )}
        </View>

        <Modal
          animationType="fade"
          transparent={true}
          visible={isLocationVisible}
          onRequestClose={() => setLocationVisible(false)}
        >
          <Pressable
            className="flex-1 bg-black/50 justify-center items-center"
            onPress={() => setLocationVisible(false)}
          >
            <View
              onStartShouldSetResponder={() => true}
              className="w-4/5 bg-white rounded-xl p-6"
            >
              <Text className="text-center text-xl font-bold text-[#00B0B9]">
                Select location
              </Text>
              <Text className="text-center text-base text-gray-500 mt-1">
                Please choose your location
              </Text>

              <View className="mt-6">
                {locations.content.map((location) => {
                  const isSelected = selectedLocation?.id === location.id;

                  return (
                    <TouchableOpacity
                      key={location.id}
                      onPress={() => handleSelectedLocation(location)}
                      className={`flex-row items-center justify-between border ${
                        isSelected
                          ? "border-[#00B0B9] bg-[#00B0B9] "
                          : "border-gray-200"
                      } rounded-lg p-4 mb-4`}
                    >
                      <View className="flex-row items-center">
                        <Text
                          className={`font-semibold text-base ${
                            isSelected ? "text-white" : "text-gray-500"
                          }`}
                        >
                          {location.area}
                        </Text>
                      </View>
                      {isSelected ? (
                        <Icon
                          name="radio-button-on-outline"
                          size={20}
                          color="white"
                        />
                      ) : (
                        <Icon
                          name="radio-button-off-outline"
                          size={20}
                          color="#00B0B9"
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </Pressable>
        </Modal>
        <ErrorModal
          title={"Location Required"}
          content={"Please select your location before proceeding."}
          visible={errorVisible}
          onCancel={() => setErrorVisible(false)}
        />
      </SafeAreaView>
    </Modal>
  );
};

export default SetLocation;
