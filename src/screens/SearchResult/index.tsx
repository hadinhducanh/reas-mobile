import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
import {
  View,
  ScrollView,
  TextInput,
  Text,
  TouchableOpacity,
  Pressable,
  Modal,
  ActivityIndicator,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ItemType, RootStackParamList } from "../../navigation/AppNavigator";
import { SafeAreaView } from "react-native-safe-area-context";
import ItemCard from "../../components/CardItem";
import SortModal from "../../components/SortModal";
import FilterPriceModal from "../../components/FilterPriceModal";
import { ItemResponse, SearchItemRequest } from "../../common/models/item";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { StatusItem } from "../../common/enums/StatusItem";
import { searchItemPaginationThunk } from "../../redux/thunk/itemThunks";
import { TypeItem } from "../../common/enums/TypeItem";
import {
  resetItemDetailState,
  setRangeState,
} from "../../redux/slices/itemSlice";
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

type HomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ItemDetails"
>;

const SearchResult: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const route = useRoute<RouteProp<RootStackParamList, "SearchResult">>();

  const { searchTextParam, itemType } = route.params;

  const [isSortModalVisible, setIsSortModalVisible] = useState<boolean>(false);
  const [isFilterPriceModalVisible, setIsFilterPriceModalVisible] =
    useState<boolean>(false);

  const [selectedSort, setSelectedSort] = useState<string>("new");
  const { itemSearch, range, loading } = useSelector(
    (state: RootState) => state.item
  );
  const { content, pageNo, last } = itemSearch;

  const [minPrice, setMinPrice] = useState<string>("0");
  const [maxPrice, setMaxPrice] = useState<string>("0");
  const [searchText, setSearchText] = useState<string>("");
  const [typeItem, setTypeItem] = useState<TypeItem[]>([]);
  const isFirstRender = useRef(true);

  const handleSelectSort = useCallback((value: string) => {
    setSelectedSort(value);
    setIsSortModalVisible(false);
  }, []);

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

  const fromPrice = useMemo(() => {
    return parseInt(minPrice.replace(/,/g, ""), 10) || 0;
  }, [minPrice]);

  const toPrice = useMemo(() => {
    return parseInt(maxPrice.replace(/,/g, ""), 10) || 0;
  }, [maxPrice]);

  const { sortBy, sortDir } = useMemo(() => {
    let _sortBy = "id";
    let _sortDir = "desc";
    if (selectedSort === "new") {
      _sortBy = "approvedTime";
      _sortDir = "desc";
    } else if (selectedSort === "near") {
      _sortBy = "location";
      _sortDir = "asc";
    } else if (selectedSort === "lowPrice") {
      _sortBy = "price";
      _sortDir = "asc";
    } else if (selectedSort === "highPrice") {
      _sortBy = "price";
      _sortDir = "desc";
    }
    return { sortBy: _sortBy, sortDir: _sortDir };
  }, [selectedSort]);

  useEffect(() => {
    dispatch(resetItemDetailState());
    if (searchTextParam !== undefined) {
      setSearchText(searchTextParam);
      dispatch(
        searchItemPaginationThunk({
          pageNo: 0,
          request: {
            ...searchRequest,
            itemName: searchTextParam,
          },
          sortBy: "approvedTime",
          sortDir: "desc",
        })
      );
    } else if (itemType !== undefined) {
      setTypeItem([itemType]);
      dispatch(
        searchItemPaginationThunk({
          pageNo: 0,
          request: {
            ...searchRequest,
            typeItems: [itemType],
          },
          sortBy: "approvedTime",
          sortDir: "desc",
        })
      );
    }
  }, [dispatch, searchTextParam, itemType]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const deplayDebounce = setTimeout(() => {
      dispatch(
        searchItemPaginationThunk({
          pageNo: 0,
          request: {
            ...searchRequest,
            typeItems: typeItem || undefined,
            itemName: searchText || undefined,
            fromPrice: fromPrice || undefined,
            toPrice: toPrice || undefined,
          },
          sortBy: sortBy,
          sortDir: sortDir,
        })
      );
    }, 500);
    return () => clearTimeout(deplayDebounce);
  }, [dispatch, searchText, typeItem, fromPrice, toPrice, sortBy, sortDir]);

  const handleLoadMore = useCallback(() => {
    if (!loading && !last) {
      dispatch(
        searchItemPaginationThunk({
          pageNo: pageNo + 1,
          request: {
            ...searchRequest,
            itemName: searchText || undefined,
            fromPrice: fromPrice || undefined,
            toPrice: toPrice || undefined,
          },
          sortBy: sortBy,
          sortDir: sortDir,
        })
      );
    }
  }, [
    dispatch,
    loading,
    last,
    pageNo,
    searchText,
    typeItem,
    fromPrice,
    toPrice,
    sortBy,
    sortDir,
  ]);

  const handleApplyPrice = (min: string, max: string) => {
    dispatch(setRangeState(0));
    setMinPrice(min);
    setMaxPrice(max);
    setIsFilterPriceModalVisible(false);
  };

  const sortOptions = [
    { label: "Tin mới trước", value: "new" },
    { label: "Tin gần tôi trước", value: "near" },
    { label: "Giá thấp trước", value: "lowPrice" },
    { label: "Giá cao trước", value: "highPrice" },
  ];

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

  const chunkArray = (
    array: ItemResponse[],
    size: number
  ): ItemResponse[][] => {
    const chunked: ItemResponse[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunked.push(array.slice(i, i + size));
    }
    return chunked;
  };

  const rows = useMemo(() => chunkArray(content, 2), [content]);

  const formatPrice = (value: string): string => {
    const numericValue = value.replace(/\D/g, "");
    return numericValue
      ? parseInt(numericValue, 10).toLocaleString("en-US")
      : "";
  };

  return (
    <>
      <SafeAreaView className="flex-1 bg-[#00B0B9]" edges={["top"]}>
        <View className="h-20 bg-[#00B0B9] w-full flex-row justify-between items-center px-4">
          <Pressable onPress={() => navigation.goBack()} className="mr-1">
            <Icon name="chevron-back-outline" size={30} color="white" />
          </Pressable>
          <View className="flex-1 mr-5">
            <View className="bg-white rounded-xl flex-row items-center px-2">
              <TouchableOpacity className="p-2 bg-[#00B0B9] rounded-xl flex items-center justify-center mr-3">
                <Icon name="search" size={20} color="#ffffff" />
              </TouchableOpacity>
              <TextInput
                placeholder="Search..."
                placeholderTextColor="#738aa0"
                className="flex-1 text-lg text-gray-800 py-3"
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>
          </View>
          <View className="flex-row">
            <Pressable onPress={() => navigation.navigate("Notifications")}>
              <Icon
                name="notifications-outline"
                size={34}
                color="#ffffff"
                className="mr-1"
              />
            </Pressable>
            <Pressable onPress={() => navigation.navigate("ChatHistory")}>
              <Icon name="chatbox-outline" size={34} color="#ffffff" />
            </Pressable>
          </View>
        </View>

        {/* Filter Section */}
        <View className="bg-white px-5 py-4 flex-row items-center justify-between">
          <Pressable
            className="flex-row items-center"
            onPress={() => navigation.navigate("FilterMap")}
          >
            <Icon
              name="location-outline"
              size={25}
              color="#000"
              className="mr-1"
            />
            <Text className="text-base text-gray-500">
              Distance:
              <Text className="text-[#00B0B9] font-semibold">
                {range !== 0 ? " " + range + "km" : " Choose"}
              </Text>
            </Text>
            <Icon name="chevron-down-outline" size={16} color="#000" />
          </Pressable>

          <View className="flex-row items-center">
            {minPrice === "0" && maxPrice === "0" ? (
              <Pressable
                className="flex-row items-center border border-black rounded-full px-3 py-1 active:bg-gray-100"
                onPress={() => setIsFilterPriceModalVisible(true)}
              >
                <Text className="text-base text-black">Giá Tiền</Text>
                <Icon
                  name="chevron-down-outline"
                  size={14}
                  color="#000"
                  className="ml-1"
                />
              </Pressable>
            ) : (
              <Pressable
                className="flex-row items-center border border-[#00B0B9] rounded-full px-3 py-1 bg-[rgba(0,176,185,0.2)] active:bg-[rgba(0,176,185,0.3)]"
                onPress={() => setIsFilterPriceModalVisible(true)}
              >
                <Text className="text-base text-[#00B0B9] ">
                  {`Giá: ${formatPrice(minPrice)}đ - ${formatPrice(maxPrice)}đ`}
                </Text>
                <Icon
                  name="chevron-down-outline"
                  size={14}
                  color="#00B0B9"
                  className="ml-2"
                />
              </Pressable>
            )}
            {minPrice === "0" && maxPrice === "0" ? (
              <View className="relative ml-2">
                <Icon name="funnel-outline" size={25} color="black" />
                <View className="absolute -top-1 -right-1 w-4 h-4 bg-black rounded-full items-center justify-center">
                  <Icon name="checkmark" size={10} color="#fff" />
                </View>
              </View>
            ) : (
              <View className="relative ml-2">
                <Icon name="funnel-outline" size={25} color="#00B0B9" />
                <View className="absolute -top-1 -right-1 w-4 h-4 bg-[#00B0B9] rounded-full items-center justify-center">
                  <Icon name="checkmark" size={10} color="#fff" />
                </View>
              </View>
            )}
          </View>
        </View>

        <View className="px-2 bg-gray-100">
          <View className="relative rounded-lg mt-5 p-3 bg-white">
            <Text className="text-[#0b1d2d] text-lg font-bold capitalize mb-3">
              Explore Category
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex flex-row px-3">
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    className="flex flex-col items-center mr-6"
                    onPress={() =>
                      setTypeItem((prev) =>
                        prev.includes(category.value)
                          ? prev.filter((item) => item !== category.value)
                          : [category.value]
                      )
                    }
                  >
                    <View
                      className={`rounded-lg p-1 bg-gray-50 ${
                        typeItem[0] === category.value
                          ? "border-2 border-[#00B0B9]"
                          : "border border-transparent"
                      }`}
                    >
                      <Image
                        source={{ uri: category.image }}
                        style={{
                          width: 50,
                          height: 50,
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
            </ScrollView>

            <Pressable
              className="bg-[rgba(0,176,185,0.2)] flex-row items-center border border-[#00B0B9] rounded-full px-3 py-1 mt-3 ml-auto active:bg-[rgba(0,176,185,0.3)]"
              onPress={() => setIsSortModalVisible(true)}
            >
              <Text className="text-base text-[#00B0B9]">
                {sortOptions.find((o) => o.value === selectedSort)?.label}
              </Text>
              <Icon
                name="chevron-down-outline"
                size={14}
                color="#00B0B9"
                style={{ marginLeft: 4 }}
              />
            </Pressable>
          </View>
        </View>

        {loading ? (
          <View className="flex-1 justify-center items-center bg-white">
            <ActivityIndicator size="large" color="#00b0b9" />
          </View>
        ) : content.length === 0 ? (
          <View className="flex-1 justify-center items-center bg-white">
            <Icon name="remove-circle-outline" size={70} color={"#00b0b9"} />
            <Text className="text-gray-500">No item</Text>
          </View>
        ) : (
          <View className="bg-white flex-1">
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
              <View className="mt-3">
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
            </ScrollView>
          </View>
        )}
      </SafeAreaView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isSortModalVisible}
        onRequestClose={() => setIsSortModalVisible(false)}
      >
        <Pressable
          className="flex-1 bg-[rgba(0,0,0,0.2)]"
          onPress={() => setIsSortModalVisible(false)}
        >
          <SortModal
            selectedSort={selectedSort}
            onSelectSort={handleSelectSort}
          />
        </Pressable>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isSortModalVisible}
        onRequestClose={() => setIsSortModalVisible(false)}
      >
        <Pressable
          className="flex-1 bg-[rgba(0,0,0,0.2)]"
          onPress={() => setIsSortModalVisible(false)}
        >
          <SortModal
            selectedSort={selectedSort}
            onSelectSort={handleSelectSort}
          />
        </Pressable>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isFilterPriceModalVisible}
        onRequestClose={() => setIsFilterPriceModalVisible(false)}
      >
        <Pressable
          className="flex-1 bg-[rgba(0,0,0,0.2)]"
          onPress={() => setIsFilterPriceModalVisible(false)}
        ></Pressable>
        <FilterPriceModal
          initialMinPrice={minPrice}
          initialMaxPrice={maxPrice}
          onApply={handleApplyPrice}
          onClear={() => {
            setMinPrice("0");
            setMaxPrice("0");
          }}
        />
      </Modal>
    </>
  );
};

export default SearchResult;
