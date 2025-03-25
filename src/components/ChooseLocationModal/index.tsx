import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useExchangeItem } from "../../context/ExchangeContext";
import { UserLocationDto } from "../../common/models/auth";
import LocationService from "../../services/LocationService";
import { PlaceDetail } from "../../common/models/location";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { getPlaceDetailsThunk } from "../../redux/thunk/locationThunks";
import MapView, { Marker, Region, UrlTile } from "react-native-maps";
import { GOONG_MAP_KEY } from "../../common/constant";
import LocationModal from "../LocationModal";

interface ChooseLocationModalProps {
  locations: UserLocationDto[];
  visible: boolean;
  onCancel: () => void;
  //   onSelectMethod: (method: MethodExchange, label: string) => void;
}

const ChooseLocationModal: React.FC<ChooseLocationModalProps> = ({
  locations,
  visible,
  onCancel,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedPlaceDetail } = useSelector(
    (state: RootState) => state.location
  );
  const [locationDetails, setLocationDetails] = useState<PlaceDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
    null
  );

  const [locationVisible, setLocationVisible] = useState<boolean>(false);

  useEffect(() => {
    if (visible && locations.length > 0) {
      setLoading(true);
      Promise.all(
        locations.map((loc) =>
          LocationService.getPlaceDetails(loc.specificAddress)
        )
      )
        .then((results) => {
          setLocationDetails(results);
        })
        .catch((error) =>
          console.error("Error fetching location details:", error)
        )
        .finally(() => setLoading(false));
    }
  }, [visible, locations]);

  const handleSelectLocation = (placeId: string) => {
    setSelectedLocationId(placeId);
    setTimeout(() => {
      dispatch(getPlaceDetailsThunk(placeId));
    }, 200);
  };

  return (
    <>
      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={onCancel}
      >
        <Pressable
          className="flex-1 bg-black/50 justify-center items-center"
          onPress={onCancel}
        >
          <View
            onStartShouldSetResponder={() => true}
            className="w-5/6 bg-white rounded-xl py-5 px-3"
          >
            <View>
              <Text className="text-center text-xl font-bold text-[#00B0B9]">
                Select location
              </Text>
              {selectedPlaceDetail && (
                <Text
                  className="text-center text-xl font-bold text-[#00B0B9]"
                  onPress={() => setLocationVisible(true)}
                >
                  Open map
                </Text>
              )}
            </View>
            <Text className="text-center text-base text-gray-500 mt-1">
              Please choose your location
            </Text>

            {loading ? (
              <ActivityIndicator size="small" color="#00B0B9" />
            ) : (
              <>
                <FlatList
                  data={locationDetails}
                  keyExtractor={(item) => item.place_id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => handleSelectLocation(item.place_id)}
                      className={`border-b mb-2 p-3 border-gray-200 rounded-lg ${
                        selectedLocationId === item.place_id
                          ? "bg-[#00B0B9]"
                          : "bg-white"
                      }`}
                    >
                      <View className="flex-row items-center">
                        <Icon
                          name="location-outline"
                          size={22}
                          color={`${
                            selectedLocationId === item.place_id
                              ? "white"
                              : "#00B0B9"
                          }`}
                        />
                        <View className="ml-2">
                          <Text
                            className={`text-lg font-semibold ${
                              selectedLocationId === item.place_id
                                ? "text-white"
                                : "text-black"
                            }`}
                          >
                            {item.name}
                          </Text>
                          <Text
                            className={`text-base ${
                              selectedLocationId === item.place_id
                                ? "text-white"
                                : "text-black"
                            }`}
                            numberOfLines={1}
                          >
                            {item.formatted_address}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )}
                />
              </>
            )}
          </View>
        </Pressable>
      </Modal>

      <LocationModal
        visible={locationVisible}
        onClose={() => setLocationVisible(false)}
        selectedPlaceDetail={selectedPlaceDetail}
      />
    </>
  );
};

export default ChooseLocationModal;
