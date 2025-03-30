import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import MapView, { Marker, Region, UrlTile } from "react-native-maps";
import Icon from "react-native-vector-icons/Ionicons";
import { GOONG_MAP_KEY } from "../../common/constant";
import { PlaceDetail } from "../../common/models/location";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { getPlaceDetailsThunk } from "../../redux/thunk/locationThunks";
import { resetPlaceDetail } from "../../redux/slices/locationSlice";
import { SafeAreaView } from "react-native-safe-area-context";

interface LocationModalProps {
  visible: boolean;
  onClose: () => void;
  place_id: string;
}

const LocationModal: React.FC<LocationModalProps> = ({
  visible,
  onClose,
  place_id,
}) => {
  const tileUrlTemplate = `https://tiles.goong.io/assets/goong_map_web.json?api_key=${GOONG_MAP_KEY}`;
  const { width, height } = Dimensions.get("window");
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.005;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

  const dispatch = useDispatch<AppDispatch>();
  const { selectedPlaceDetail } = useSelector(
    (state: RootState) => state.location
  );
  const mapRef = useRef<MapView>(null);
  const [location] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    if (visible) {
      dispatch(getPlaceDetailsThunk(place_id));
    }
  }, [visible, place_id, dispatch]);

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

  const handleClose = () => {
    dispatch(resetPlaceDetail());
    onClose();
  };
  return (
    <Modal visible={visible} animationType="fade" onRequestClose={handleClose}>
      <SafeAreaView className="flex-1 bg-[#00B0B9]" edges={["top"]}>
        <View className="flex-1 bg-white">
          <View className="bg-[#00B0B9] flex-row justify-between items-center p-3">
            <View className="flex-row items-center">
              <TouchableOpacity onPress={handleClose} className="mr-2">
                <Icon name="chevron-back-outline" size={25} color="white" />
              </TouchableOpacity>
              <Text className="text-xl font-semibold text-white">Location</Text>
            </View>
          </View>

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
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default LocationModal;
