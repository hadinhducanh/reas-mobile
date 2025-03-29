import React, { useEffect, useState } from "react";
import {
  Modal,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  View,
  Text,
  Pressable,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { UserLocationDto } from "../../common/models/auth";
import LocationService from "../../services/LocationService";
import { PlaceDetail } from "../../common/models/location";
import { useExchangeItem } from "../../context/ExchangeContext";

interface ChooseLocationModalProps {
  locations: UserLocationDto[];
  visible: boolean;
  onCancel: () => void;
}

const ChooseLocationModal: React.FC<ChooseLocationModalProps> = ({
  locations,
  visible,
  onCancel,
}) => {
  const [locationDetails, setLocationDetails] = useState<PlaceDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
    null
  );
  const { exchangeItem, setExchangeItem } = useExchangeItem();

  useEffect(() => {
    if (visible && locations.length > 0) {
      setLoading(true);
      Promise.all(
        locations.map((loc) =>
          LocationService.getPlaceDetails(
            loc.specificAddress.split("//")[0].trim()
          )
        )
      )
        .then((results: PlaceDetail[]) => {
          setLocationDetails(results);
        })
        .catch((error) =>
          console.error("Error fetching location details:", error)
        )
        .finally(() => setLoading(false));
    }
  }, [visible, locations]);

  const handleSelectLocation = (place_id: string, address: string) => {
    setSelectedLocationId(place_id);
    setExchangeItem({
      ...exchangeItem,
      exchangeLocation: place_id + "//" + address,
    });
  };

  return (
    <>
      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={onCancel}
      >
        <View className="flex-1">
          <Pressable className="flex-1 bg-black/50" onPress={onCancel} />

          <View className="absolute inset-0 justify-center items-center">
            <View className="w-5/6 bg-white rounded-xl py-5 px-3">
              <View>
                <Text className="text-center text-xl font-bold text-[#00B0B9]">
                  Select location
                </Text>
              </View>
              <Text className="text-center text-base text-gray-500 mt-1">
                Please choose your location
              </Text>
              {loading ? (
                <ActivityIndicator size="small" color="#00B0B9" />
              ) : (
                <FlatList
                  data={locationDetails}
                  keyExtractor={(item) => item.place_id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() =>
                        handleSelectLocation(
                          item.place_id,
                          item.formatted_address
                        )
                      }
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
                          color={
                            selectedLocationId === item.place_id
                              ? "white"
                              : "#00B0B9"
                          }
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
              )}
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ChooseLocationModal;
