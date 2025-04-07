import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  TextInput,
  Image,
  Text,
  Pressable,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import ItemCard from "../../components/CardItem";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { getAllItemAvailableThunk } from "../../redux/thunk/itemThunks";
import { ItemResponse, SearchItemRequest } from "../../common/models/item";
import {
  BATHROOM_TYPE_IMAGE,
  BEDROOM_TYPE_IMAGE,
  CLEANING_TYPE_IMAGE,
  COOLING_TYPE_IMAGE,
  ELECTRICTION_TYPE_IMAGE,
  KITCHEN_TYPE_IMAGE,
  LIGHTING_TYPE_IMAGE,
  LIVINGROOM_TYPE_IMAGE,
} from "../../common/constant";
import { StatusItem } from "../../common/enums/StatusItem";
import { TypeItem } from "../../common/enums/TypeItem";
import { SafeAreaView } from "react-native-safe-area-context";

type HomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ItemDetails"
>;
const categories = [
  {
    id: 1,
    name: "Kitchen",
    value: TypeItem.KITCHEN_APPLIANCES,
    image: KITCHEN_TYPE_IMAGE,
  },
  {
    id: 2,
    name: "Cleaning",
    value: TypeItem.CLEANING_LAUNDRY_APPLIANCES,
    image: CLEANING_TYPE_IMAGE,
  },
  {
    id: 3,
    name: "Cooling",
    value: TypeItem.COOLING_HEATING_APPLIANCES,
    image: COOLING_TYPE_IMAGE,
  },
  {
    id: 4,
    name: "Electric",
    value: TypeItem.ELECTRONICS_ENTERTAINMENT_DEVICES,
    image: ELECTRICTION_TYPE_IMAGE,
  },
  {
    id: 5,
    name: "Lighting",
    value: TypeItem.LIGHTING_SECURITY_DEVICES,
    image: LIGHTING_TYPE_IMAGE,
  },
  {
    id: 6,
    name: "Living room",
    value: TypeItem.LIVING_ROOM_APPLIANCES,
    image: LIVINGROOM_TYPE_IMAGE,
  },
  {
    id: 7,
    name: "Bedroom",
    value: TypeItem.BEDROOM_APPLIANCES,
    image: BEDROOM_TYPE_IMAGE,
  },
  {
    id: 8,
    name: "Bathroom",
    value: TypeItem.BATHROOM_APPLIANCES,
    image: BATHROOM_TYPE_IMAGE,
  },
];

const { width } = Dimensions.get("window");

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const { itemAvailable, loading } = useSelector(
    (state: RootState) => state.item
  );
  const { content, pageNo, last } = itemAvailable;
  const [searchText, setSearchText] = useState<string>("");

  const chunkArray = (array: ItemResponse[], size: number) => {
    const chunked: ItemResponse[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunked.push(array.slice(i, i + size));
    }
    return chunked;
  };

  const rows = chunkArray(content, 2);

  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }: any) => {
    const paddingToBottom = 80;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  const searchRequest: SearchItemRequest = {
    statusItems: [StatusItem.AVAILABLE],
  };

  const handleLoadMore = () => {
    if (!loading && !last) {
      dispatch(
        getAllItemAvailableThunk({
          pageNo: pageNo + 1,
          request: searchRequest,
          sortBy: "approvedTime",
        })
      );
    }
  };

  useEffect(() => {
    dispatch(
      getAllItemAvailableThunk({
        pageNo: 0,
        request: searchRequest,
        sortBy: "approvedTime",
      })
    );
  }, [dispatch]);

  const handleSearch = () => {
    if (searchText !== "") {
      navigation.navigate("SearchResult", {
        searchTextParam: searchText,
      });
      setSearchText("");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#00B0B9]" edges={["top"]}>
      <ScrollView
        className="bg-gray-100"
        showsVerticalScrollIndicator={false}
        onScroll={({ nativeEvent }) => {
          if (isCloseToBottom(nativeEvent)) {
            handleLoadMore();
          }
        }}
        scrollEventThrottle={100}
      >
        <View className="h-20 bg-[#00B0B9] w-full flex-row justify-between items-center px-2">
          <View className="flex-1 mr-5">
            <View className="bg-white rounded-xl flex-row items-center px-2">
              <Pressable
                className="p-2 bg-[#00B0B9] rounded-xl flex items-center justify-center mr-3"
                onPress={handleSearch}
              >
                <Icon name="search" size={20} color="#ffffff" />
              </Pressable>
              <TextInput
                placeholder="Search..."
                placeholderTextColor="#738aa0"
                className="flex-1 text-lg text-gray-800 py-3"
                onChangeText={setSearchText}
                value={searchText}
                onSubmitEditing={handleSearch}
              />
            </View>
          </View>
          <View className="flex-row">
            <Pressable onPress={() => navigation.navigate("Notifications")}>
              <Icon
                className="mr-1"
                name="notifications-outline"
                size={34}
                color="#ffffff"
              />
            </Pressable>
            <Pressable onPress={() => navigation.navigate("ChatHistory")}>
              <Icon name="chatbox-outline" size={34} color="#ffffff" />
            </Pressable>
          </View>
        </View>

        <View>
          <Image
            source={{
              uri: "https://res.cloudinary.com/dnslrwedn/image/upload/v1740407613/52c61b29-1200_628_1_deautx.png",
            }}
            className="w-full h-60"
          />
        </View>

        <View className="">
          <View className="mx-5 relative rounded-lg mt-5 p-4 bg-white">
            <Text className="text-[#0b1d2d] text-lg font-bold capitalize mb-3">
              Explore Category
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex flex-row">
                {categories
                  .reduce((columns: any[], _, i) => {
                    if (i % 2 === 0) {
                      columns.push(categories.slice(i, i + 2));
                    }
                    return columns;
                  }, [])
                  .map((col, colIndex) => (
                    <View
                      key={colIndex}
                      className="flex flex-col justify-between mx-6"
                    >
                      {col.map((category: any) => (
                        <TouchableOpacity
                          key={category.id}
                          className="flex flex-col items-center mb-5"
                          onPress={() =>
                            navigation.navigate("SearchResult", {
                              itemType: category.value,
                            })
                          }
                        >
                          <View className="bg-gray-100 rounded-lg">
                            <Image
                              source={{ uri: category.image }}
                              style={{
                                width: 80,
                                height: 80,
                                alignSelf: "center",
                              }}
                              resizeMode="contain"
                            />
                          </View>
                          <Text className="text-sm font-medium text-black capitalize mt-1">
                            {category.name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ))}
              </View>
            </ScrollView>
          </View>

          <View className="my-8">
            <Image
              source={{
                uri: "https://cdn.chotot.com/admincentre/sZAVd-1sX7QEWxhi_hCWw5MbfVkTaBj80jUdAMPJNSs/preset:raw/plain/40d5af2875486372da8349afd2b4a157-2882896384210177312.jpg",
              }}
              style={{ width: width, height: 155 }}
              resizeMode="cover"
            />
          </View>

          <View className="mx-5 ">
            <Text className="text-[#0b1d2d] text-xl font-bold">New items</Text>
          </View>
          {content && (
            <View className="mx-3 mt-5">
              {rows.map((row, rowIndex) => (
                <View key={rowIndex} className="flex flex-row gap-x-2">
                  {row.map((item) => (
                    <View key={item.id} className="flex-1">
                      <ItemCard
                        item={item}
                        navigation={navigation}
                        mode="default"
                      />
                    </View>
                  ))}
                  {row.length === 1 && <View className="flex-1" />}
                </View>
              ))}
            </View>
          )}
          {loading && (
            <ActivityIndicator size="large" color="#00b0b9" className="mb-5" />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
