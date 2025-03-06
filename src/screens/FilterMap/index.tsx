import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from "react-native-maps";
import Slider from "@react-native-community/slider";
import LoadingButton from "../../components/LoadingButton";
import { useNavigation } from "@react-navigation/native";

const FilterMap: React.FC = () => {
  const navigation = useNavigation();
  const [range, setRange] = useState<number>(10);

  const [region, setRegion] = useState({
    latitude: 10.8424,
    longitude: 106.81,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const circleRadius = range * 1000;

  const handleLocation = () => {};

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        <MapView
          provider={PROVIDER_GOOGLE}
          style={{ flex: 1 }}
          region={region}
          onRegionChangeComplete={(rgn) => setRegion(rgn)}
        >
          <Marker
            coordinate={{
              latitude: region.latitude,
              longitude: region.longitude,
            }}
          />
          <Circle
            center={{ latitude: region.latitude, longitude: region.longitude }}
            radius={circleRadius}
            strokeColor="#00B0B9"
            strokeWidth={2}
            fillColor="rgba(0,176,185,0.2)"
          />
        </MapView>

        <View className="absolute top-4 left-4 z-10 bg-white rounded-full items-center p-3">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="chevron-back-outline" size={25} color="#00B0B9" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Khu vực tùy chọn bên dưới */}
      <View className="bg-white px-4 pt-4 pb-6">
        <TouchableOpacity className="flex-row items-center justify-center border border-[#00B0B9] rounded-full py-2 mx-5">
          <Icon name="navigate-outline" size={20} color="#00B0B9" />
          <Text className="text-[#00B0B9] font-semibold ml-2">
            Get Current Location
          </Text>
        </TouchableOpacity>

        {/* Display Range */}
        <View className="flex-row items-center justify-center mt-4">
          <Text className="text-black text-lg font-semibold mr-2">
            Display Range
          </Text>
          <Text className="text-[#00B0B9] text-lg font-semibold">{`<${range}km`}</Text>
        </View>

        <Slider
          style={{ width: "100%", height: 60 }}
          minimumValue={1}
          maximumValue={20}
          step={1}
          value={range}
          onValueChange={(val) => setRange(val)}
          minimumTrackTintColor="#00B0B9"
          maximumTrackTintColor="#D3D3D3"
          thumbTintColor="#00B0B9"
        />

        <LoadingButton
          title="Apply"
          onPress={handleLocation}
          buttonClassName="py-4"
        />
      </View>
    </SafeAreaView>
  );
};

export default FilterMap;
