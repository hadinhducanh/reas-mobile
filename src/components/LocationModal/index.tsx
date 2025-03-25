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

interface LocationModalProps {
  visible: boolean;
  onClose: () => void;
  selectedPlaceDetail: PlaceDetail | null;
}

const LocationModal: React.FC<LocationModalProps> = ({
  visible,
  onClose,
  selectedPlaceDetail,
}) => {
  const tileUrlTemplate = `https://tiles.goong.io/assets/goong_map_web.json?api_key=${GOONG_MAP_KEY}`;
  const { width, height } = Dimensions.get("window");
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.005;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

  const mapRef = useRef<MapView>(null);
  const [location] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
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
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-white">
        <View className="bg-white flex-row justify-between items-center p-3 shadow-md">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={onClose} className="mr-2">
              <Icon name="chevron-back-outline" size={25} color="#00B0B9" />
            </TouchableOpacity>
            <Text className="text-xl font-semibold">Location</Text>
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
    </Modal>
  );
};

export default LocationModal;
