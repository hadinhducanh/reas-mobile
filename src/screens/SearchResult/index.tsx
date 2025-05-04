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
import { RootStackParamList } from "../../navigation/AppNavigator";
import { SafeAreaView } from "react-native-safe-area-context";
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
import { getAllByTypeItemThunk } from "../../redux/thunk/categoryThunk";
import CategoryModal from "../../components/CategoryModal";
import { CategoryDto } from "../../common/models/category";
import { BrandDto } from "../../common/models/brand";
import BrandModal from "../../components/BrandModal";
import { getAllBrandThunk } from "../../redux/thunk/brandThunks";
import { FlatList } from "react-native-gesture-handler";
import CardItem from "../../components/CardItem";
import SortModal from "../../components/SortModal";

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
  const [isSelectedCategory, setIsSelectedCategory] = useState<boolean>(false);
  const [isSelectedBrand, setIsSelectedBrand] = useState<boolean>(false);
  const [isFilterPriceModalVisible, setIsFilterPriceModalVisible] =
    useState<boolean>(false);

  const [selectedSort, setSelectedSort] = useState<string>("new");
  const [selectedCategories, setSelectedCategories] = useState<CategoryDto[]>(
    []
  );
  const [selectedBrands, setSelectedBrands] = useState<BrandDto[]>([]);

  const { itemSearch, range, loading } = useSelector(
    (state: RootState) => state.item
  );

  const { content, pageNo, last } = itemSearch;

  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
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
    dispatch(getAllBrandThunk());
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
    dispatch(resetItemDetailState());

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
            categoryIds: selectedCategories.map((cate) => cate.id) || undefined,
            brandIds: selectedBrands.map((brand) => brand.id) || undefined,
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
  }, [
    dispatch,
    searchText,
    typeItem,
    fromPrice,
    toPrice,
    sortBy,
    sortDir,
    selectedCategories,
    selectedBrands,
  ]);

  const handleLoadMore = useCallback(() => {
    if (!loading && !last) {
      dispatch(
        searchItemPaginationThunk({
          pageNo: pageNo + 1,
          request: {
            ...searchRequest,
            categoryIds: selectedCategories.map((cate) => cate.id) || undefined,
            brandIds: selectedBrands.map((brand) => brand.id) || undefined,
            typeItems: typeItem || undefined,
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
    selectedCategories,
    selectedBrands,
  ]);

  useEffect(() => {
    if (typeItem) {
      dispatch(getAllByTypeItemThunk(typeItem[0]));
    }
  }, [typeItem, dispatch]);

  const handleApplyPrice = (min: string, max: string) => {
    dispatch(setRangeState(0));
    setMinPrice(min);
    setMaxPrice(max);
    setIsFilterPriceModalVisible(false);
  };

  const sortOptions = [
    { label: "Newest first", value: "new" },
    { label: "Price: Low to High", value: "lowPrice" },
    { label: "Price: High to Low", value: "highPrice" },
  ];

  const typeItems = [
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

  const formatPrice = (value: string): string => {
    const numericValue = value.replace(/\D/g, "");
    return numericValue
      ? parseInt(numericValue, 10).toLocaleString("en-US")
      : "";
  };

  const formatPriceRange = () => {
    const min = minPrice.length === 0 ? "0" : formatPrice(minPrice);
    if (maxPrice.length === 0) {
      return `${min} - ∞`;
    }
    if (maxPrice !== minPrice) {
      return `${min} - ${formatPrice(maxPrice)}đ`;
    }
    return `${min}đ`;
  };

  const ListHeaderComponent = (
    <>
      <View className="h-20 bg-[#00B0B9] w-full flex-row justify-between items-center px-4">
        <Pressable
          onPress={() => {
            dispatch(setRangeState(0));
            navigation.goBack();
          }}
          className="mr-1"
        >
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
          {minPrice.length === 0 && maxPrice.length === 0 ? (
            <Pressable
              className="flex-row items-center border border-black rounded-full px-3 py-1 active:bg-gray-100"
              onPress={() => setIsFilterPriceModalVisible(true)}
            >
              <Text className="text-base text-black">Price</Text>
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
                {`Price: ${formatPriceRange()}`}
              </Text>
              <Icon
                name="chevron-down-outline"
                size={14}
                color="#00B0B9"
                className="ml-2"
              />
            </Pressable>
          )}
          {minPrice.length === 0 && maxPrice.length === 0 ? (
            <View className="relative ml-2">
              <Icon name="funnel-outline" size={25} color="black" />
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

      <View className="px-2 bg-gray-100 mb-2">
        <View className="relative rounded-lg mt-5 p-3 bg-white">
          <View className="flex-row items-center justify-between mb-5">
            <Text className="text-[#0b1d2d] text-xl font-bold capitalize ">
              Explore Category
            </Text>
            <Pressable
              className="bg-[rgba(0,176,185,0.2)] flex-row items-center border border-[#00B0B9] rounded-full px-3 py-1 active:bg-[rgba(0,176,185,0.3)]"
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

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex flex-row px-3">
              {typeItems.map((category) => (
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
          <View className="flex-row ml-auto mt-3 space-x-2">
            {typeItem.length !== 0 && (
              <Pressable
                className="bg-[rgba(0,176,185,0.2)] flex-row items-center border border-[#00B0B9] rounded-full px-3 py-1 active:bg-[rgba(0,176,185,0.3)] w-44 justify-center"
                onPress={() => setIsSelectedCategory(true)}
              >
                <Text className="text-base text-[#00B0B9]" numberOfLines={1}>
                  {selectedCategories.length === 0
                    ? "Choose categories"
                    : selectedCategories
                        .map((cate) => cate.categoryName)
                        .join(", ")}
                </Text>
                <Icon
                  name="chevron-down-outline"
                  size={14}
                  color="#00B0B9"
                  className="ml-0"
                />
              </Pressable>
            )}

            <Pressable
              className="bg-[rgba(0,176,185,0.2)] flex-row items-center border border-[#00B0B9] rounded-full px-3 py-1 active:bg-[rgba(0,176,185,0.3)] w-36 justify-center ml-1"
              onPress={() => setIsSelectedBrand(true)}
            >
              <Text className="text-base text-[#00B0B9]" numberOfLines={1}>
                {selectedBrands.length === 0
                  ? "Choose brands"
                  : selectedBrands.map((brand) => brand.brandName).join(", ")}
              </Text>
              <Icon
                name="chevron-down-outline"
                size={14}
                color="#00B0B9"
                className="ml-0"
              />
            </Pressable>
          </View>
        </View>
      </View>
    </>
  );

  const renderItem = ({
    item,
    index,
  }: {
    item: ItemResponse;
    index: number;
  }) => {
    const isSingle = content.length % 2 === 1 && index === content.length - 1;

    return (
      <View className={`${isSingle ? "w-1/2 px-1.5" : "flex-1 px-1.5"}`}>
        <CardItem item={item} navigation={navigation} mode="default" />
      </View>
    );
  };

  return (
    <>
      <SafeAreaView className="flex-1" edges={["top"]}>
        <FlatList
          data={content}
          numColumns={2}
          renderItem={renderItem}
          keyExtractor={(item, index) =>
            item ? item.id.toString() : `empty-${index}`
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListHeaderComponent={ListHeaderComponent}
          ListEmptyComponent={() => {
            if (loading) {
              return (
                <View className="flex-1 justify-center items-center">
                  <ActivityIndicator size="large" color="#00b0b9" />
                </View>
              );
            }

            return (
              <View className="bg-white flex-1 justify-center items-center">
                <Icon
                  name="remove-circle-outline"
                  size={70}
                  color={"#00b0b9"}
                />
                <Text className="text-gray-500">No item</Text>
              </View>
            );
          }}
          ListFooterComponent={
            !loading || content.length === 0 ? null : (
              <ActivityIndicator
                size="large"
                color="#00b0b9"
                className="my-4"
              />
            )
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            backgroundColor: "#f3f4f6",
            flexGrow: 1,
          }}
        />
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
        visible={isSelectedCategory}
        onRequestClose={() => setIsSelectedCategory(false)}
      >
        <Pressable
          className="flex-1 bg-[rgba(0,0,0,0.2)]"
          onPress={() => setIsSelectedCategory(false)}
        >
          <CategoryModal
            selectedCategories={selectedCategories}
            onSelectCategory={(categories) => {
              setSelectedCategories(categories);
              setIsSelectedCategory(false);
            }}
          />
        </Pressable>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isSelectedBrand}
        onRequestClose={() => setIsSelectedBrand(false)}
      >
        <Pressable
          className="flex-1 bg-[rgba(0,0,0,0.2)]"
          onPress={() => setIsSelectedBrand(false)}
        >
          <BrandModal
            selectedBrands={selectedBrands}
            onSelectBrands={(brands) => {
              setSelectedBrands(brands);
              setIsSelectedBrand(false);
            }}
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
            setMinPrice("");
            setMaxPrice("");
          }}
        />
      </Modal>
    </>
  );
};

export default SearchResult;
