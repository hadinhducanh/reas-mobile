import React, { useEffect } from "react";
import { View, Text, Modal, TouchableOpacity, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { GOONG_MAP_KEY } from "../../common/constant";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { resetPlaceDetail } from "../../redux/slices/locationSlice";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { getPlaceDetailsByReverseGeocodeThunk } from "../../redux/thunk/locationThunks";

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
  const dispatch = useDispatch<AppDispatch>();
  const { selectedPlaceDetail } = useSelector(
    (state: RootState) => state.location
  );

  useEffect(() => {
    if (visible) {
      dispatch(getPlaceDetailsByReverseGeocodeThunk(place_id));
    }
  }, [visible, place_id, dispatch]);

  const coordinate = selectedPlaceDetail
    ? {
        latitude: selectedPlaceDetail.geometry.location.lat,
        longitude: selectedPlaceDetail.geometry.location.lng,
      }
    : null;

  const handleClose = () => {
    dispatch(resetPlaceDetail());
    onClose();
  };

  // URL hiển thị bản đồ Goong với marker
  const goongMapUrl = `https://maps.goong.io/`;

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

          {/* WebView hiển thị bản đồ Goong */}
          <View className="flex-1">
            <WebView source={{ uri: goongMapUrl }} style={{ flex: 1 }} />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default LocationModal;
