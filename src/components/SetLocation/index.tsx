import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Modal,
  Dimensions,
  StyleSheet,
  TextInput,
  FlatList,
  Text,
} from "react-native";
import MapView, { Marker, UrlTile, Region } from "react-native-maps";
import * as Location from "expo-location";
import Icon from "react-native-vector-icons/Ionicons";
import { GOONG_MAP_KEY } from "../../common/constant";
import { View, TouchableOpacity } from "react-native";
import { Suggestion } from "../../common/models/location";
import { useExchangeItem } from "../../context/ExchangeContext";
import LoadingButton from "../LoadingButton";
import LocationService from "../../services/LocationService";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { getPlaceDetailsThunk } from "../../redux/thunk/locationThunks";
import { MethodExchange } from "../../common/enums/MethodExchange";

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.005;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const tileUrlTemplate = `https://tiles.goong.io/assets/goong_map_web.json?api_key=${GOONG_MAP_KEY}`;

interface SetLocationProps {
  visible: boolean;
  onCancel: () => void;
}

const SetLocation: React.FC<SetLocationProps> = ({ visible, onCancel }) => {
  const { exchangeItem, setExchangeItem } = useExchangeItem();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedPlaceDetail } = useSelector(
    (state: RootState) => state.location
  );

  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] =
    useState<Suggestion | null>(null);

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
    setSelectedSuggestion(item);
    dispatch(getPlaceDetailsThunk(item.place_id));
    setIsSearching(false);
  };

  useEffect(() => {
    if (exchangeItem.locationGoong) {
      setSelectedSuggestion(exchangeItem.locationGoong);
      dispatch(getPlaceDetailsThunk(exchangeItem.locationGoong.place_id));
      setIsSearching(false);
    }
  }, [exchangeItem.locationGoong, dispatch]);

  const handleConfirm = () => {
    setExchangeItem({
      ...exchangeItem,
      exchangeLocation: selectedPlaceDetail?.place_id!,
      locationGoong: selectedSuggestion!,
    });
    onCancel();
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

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <View className="flex-1 bg-white">
        <View className="bg-white flex-row justify-between items-center p-3 shadow-md">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={handleCancel} className="mr-2">
              <Icon name="chevron-back-outline" size={25} color="#00B0B9" />
            </TouchableOpacity>
            <Text className="text-xl font-semibold">Modify location</Text>
          </View>
          {isSearching && (
            <TouchableOpacity onPress={() => setIsSearching(false)}>
              <Text className="text-[#00B0B9] text-base font-semibold">
                Back to map
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {isSearching ? (
          <>
            <View className="mt-4 flex-row items-center border-b-2 border-[#00B0B9] mx-3 py-2 px-3 shadow-sm">
              <Icon name="search" size={20} color="black" />
              <TextInput
                placeholder="Search location..."
                value={searchText}
                onChangeText={setSearchText}
                className="text-xl bg-white ml-2 flex-1"
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
            {exchangeItem.methodExchange ===
            MethodExchange.PICK_UP_IN_PERSON ? (
              <View className="p-3 border-b-2 border-t-2 border-gray-200 bg-white px-5">
                <View className="flex-row items-center">
                  <Icon name="location-outline" size={22} color="#00B0B9" />
                  <View className="ml-2">
                    <Text className="text-lg font-semibold">
                      {selectedPlaceDetail?.name}
                    </Text>
                    <Text className="text-base">
                      {selectedPlaceDetail?.formatted_address}
                    </Text>
                  </View>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  setIsSearching(true);
                  setSearchText("");
                  setSuggestions([]);
                }}
                className="absolute left-4 right-4 top-16 p-4 border border-gray-300 rounded-lg bg-white shadow-sm z-10 flex-row items-center"
              >
                <Icon name="search-outline" size={22} color="#00B0B9" />
                <TextInput
                  className="text-xl ml-2"
                  numberOfLines={1}
                  editable={true}
                  selectTextOnFocus={true}
                  onChangeText={() => {}}
                >
                  {selectedPlaceDetail?.formatted_address.length !== 0
                    ? selectedPlaceDetail?.formatted_address
                    : "Search location..."}
                </TextInput>
              </TouchableOpacity>
            )}

            {exchangeItem.methodExchange !== MethodExchange.PICK_UP_IN_PERSON &&
              exchangeItem.methodExchange !== MethodExchange.DELIVERY && (
                <>
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
          </>
        )}

        {!isSearching && location && region && (
          <View className="flex-1">
            <MapView
              ref={mapRef}
              style={StyleSheet.absoluteFillObject}
              initialRegion={region}
            >
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
    </Modal>
  );
};

export default SetLocation;
