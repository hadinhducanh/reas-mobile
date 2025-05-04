import React, { useEffect, useRef, useState } from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import MapView, { Marker, Circle, UrlTile, Region } from "react-native-maps";
import Slider from "@react-native-community/slider";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import LoadingButton from "../../../components/LoadingButton";
import * as Location from "expo-location";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { GOONG_MAP_KEY } from "../../../common/constant";
import { RootStackParamList } from "../../../navigation/AppNavigator";
import { findNearbyItemsThunk } from "../../../redux/thunk/itemThunks";
import { StackNavigationProp } from "@react-navigation/stack";
import { setRangeState } from "../../../redux/slices/itemSlice";

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.005;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const tileUrlTemplate = `https://tiles.goong.io/assets/goong_map_web.json?api_key=${GOONG_MAP_KEY}`;

const FilterMap: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch<AppDispatch>();
  const { itemSearch, loading } = useSelector((state: RootState) => state.item);

  const [range, setRange] = useState<number>(10);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [circleCenter, setCircleCenter] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const { selectedPlaceDetail } = useSelector(
    (state: RootState) => state.location
  );
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
      setCircleCenter({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
    })();
  }, []);

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

  const handleSliderComplete = (value: number) => {
    setRange(value);
    if (circleCenter && mapRef.current) {
      const circleRadius = value * 1000;

      mapRef.current.fitToCoordinates(
        [
          {
            latitude: circleCenter.latitude + circleRadius / 200000,
            longitude:
              circleCenter.longitude + circleRadius / (200000 * ASPECT_RATIO),
          },
          {
            latitude: circleCenter.latitude - circleRadius / 200000,
            longitude:
              circleCenter.longitude - circleRadius / (200000 * ASPECT_RATIO),
          },
        ],
        {
          edgePadding: { top: 30, right: 30, bottom: 30, left: 30 },
          animated: true,
        }
      );
    }
  };

  const handleRegionChangeComplete = (region: Region) => {
    setCircleCenter({
      latitude: region.latitude,
      longitude: region.longitude,
    });
  };

  const handleGetCurrentLocation = async () => {
    const newLocation = {
      latitude: 10.8171,
      longitude: 106.6563,
    };
    setLocation(newLocation);
    setCircleCenter(newLocation);

    mapRef.current?.animateToRegion({
      latitude: newLocation.latitude,
      longitude: newLocation.longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    });
  };

  const handleApplyPress = () => {
    if (circleCenter) {
      dispatch(
        findNearbyItemsThunk({
          pageNo: 0,
          latitude: circleCenter.latitude,
          longitude: circleCenter.longitude,
          distance: range,
        })
      );

      if (itemSearch) {
        dispatch(setRangeState(range));
        navigation.goBack();
      }
    } else {
      console.log("No marker location available");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        <View style={{ flex: 1, position: "relative" }}>
          <MapView
            ref={mapRef}
            style={{ flex: 1 }}
            initialRegion={region}
            onRegionChangeComplete={handleRegionChangeComplete}
          >
            <UrlTile
              urlTemplate={tileUrlTemplate}
              maximumZ={19}
              flipY={false}
            />
            {circleCenter && <Marker coordinate={circleCenter} />}
            {circleCenter && (
              <Circle
                center={circleCenter}
                radius={range * 1000}
                strokeColor="#00B0B9"
                strokeWidth={2}
                fillColor="rgba(0,176,185,0.2)"
              />
            )}
          </MapView>
        </View>

        <View className="absolute top-4 left-4 z-10 bg-white rounded-full items-center p-3">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="chevron-back-outline" size={25} color="#00B0B9" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Khu vực tùy chọn bên dưới */}
      <View className="bg-white px-4 pt-4 pb-6">
        <TouchableOpacity
          className="flex-row items-center justify-center border border-[#00B0B9] rounded-full py-2 mx-5"
          onPress={handleGetCurrentLocation} // Bắt sự kiện khi ấn nút
        >
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
          maximumValue={10}
          step={1}
          value={range}
          onSlidingComplete={handleSliderComplete}
          minimumTrackTintColor="#00B0B9"
          maximumTrackTintColor="#D3D3D3"
          thumbTintColor="#00B0B9"
        />
        <LoadingButton
          title="Apply"
          onPress={handleApplyPress} // Gọi hàm handleApplyPress khi ấn Apply
          buttonClassName="py-4"
          loading={loading}
        />
      </View>
    </SafeAreaView>
  );
};

export default FilterMap;
