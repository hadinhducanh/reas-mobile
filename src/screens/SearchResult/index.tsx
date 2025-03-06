import React, { useState } from "react";
import {
  View,
  ScrollView,
  TextInput,
  Text,
  TouchableOpacity,
  Pressable,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ItemType, RootStackParamList } from "../../navigation/AppNavigator";
import { SafeAreaView } from "react-native-safe-area-context";
import ItemCard from "../../components/CardItem";
import SortModal from "../../components/SortModal";
import FilterPriceModal from "../../components/FilterPriceModal";

type HomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ItemDetails"
>;

const SearchResult: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const [isSortModalVisible, setIsSortModalVisible] = useState<boolean>(false);
  const [isFilterPriceModalVisible, setIsFilterPriceModalVisible] =
    useState<boolean>(false);

  const [selectedSort, setSelectedSort] = useState<string>("relevant");

  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(0);

  const handleSelectSort = (value: string) => {
    setSelectedSort(value);
    setIsSortModalVisible(false);
  };

  // Khi người dùng chọn khoảng giá và nhấn Apply
  const handleApplyPrice = (min: number, max: number) => {
    setMinPrice(min);
    setMaxPrice(max);
    setIsFilterPriceModalVisible(false);
  };

  // Dữ liệu sắp xếp (SortModal)
  const sortOptions = [
    { label: "Tin liên quan trước", value: "relevant" },
    { label: "Tin mới trước", value: "new" },
    { label: "Tin gần tôi trước", value: "near" },
    { label: "Giá thấp trước", value: "lowPrice" },
    { label: "Giá cao trước", value: "highPrice" },
  ];

  // Danh mục ví dụ
  const categories = [
    { id: 1, name: "Kitchen" },
    { id: 2, name: "Cleaning" },
    { id: 3, name: "Cooling" },
    { id: 4, name: "Electric" },
    { id: 5, name: "Lighting" },
    { id: 6, name: "Living room" },
    { id: 7, name: "Bedroom" },
    { id: 8, name: "Bathroom" },
  ];

  const [itemList, setItemList] = useState<ItemType[]>([
    {
      id: 1,
      name: "iPhone 20",
      price: 30000000,
      images: "https://via.placeholder.com/150",
      location: "Vinhome Grand Park",
      description: "Brand new iPhone 20 with latest features.",
      isFavorited: false,
    },
    {
      id: 2,
      name: "Samsung Galaxy S25",
      price: 30000000,
      images: "https://via.placeholder.com/150",
      location: "District 1, HCMC",
      description: "Latest Samsung flagship phone.",
      isFavorited: false,
    },
    {
      id: 3,
      name: "Samsung Galaxy S24",
      price: 30000000,
      images: "https://via.placeholder.com/150",
      location: "District 3, HCMC",
      description: "Latest Samsung flagship phone1.",
      isFavorited: false,
    },
  ]);

  const chunkArray = (array: ItemType[], size: number): ItemType[][] => {
    const chunked: ItemType[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunked.push(array.slice(i, i + size));
    }
    return chunked;
  };

  const toggleLike = (itemId: number) => {
    setItemList((prevList) =>
      prevList.map((item) =>
        item.id === itemId ? { ...item, isFavorited: !item.isFavorited } : item
      )
    );
  };

  const rows = chunkArray(itemList, 2);

  return (
    <>
      <SafeAreaView className="flex-1 bg-[#00B0B9]" edges={["top"]}>
        <ScrollView
          className="bg-gray-100"
          showsVerticalScrollIndicator={false}
        >
          <View className="h-20 bg-[#00B0B9] w-full flex-row justify-between items-center px-4">
            <Pressable onPress={() => navigation.goBack()} className="mr-1">
              <Icon name="chevron-back-outline" size={30} color="white" />
            </Pressable>
            <View className="flex-1 mr-5">
              <View className="bg-white rounded-xl flex-row items-center px-2">
                <View className="p-2 bg-[#00B0B9] rounded-xl flex items-center justify-center mr-3">
                  <Icon name="search" size={20} color="#ffffff" />
                </View>
                <TextInput
                  placeholder="Search..."
                  placeholderTextColor="#738aa0"
                  className="flex-1 text-lg text-gray-800 py-3"
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

          <View className="bg-white px-5 py-5">
            <Pressable
              className="flex-row items-center"
              onPress={() => navigation.navigate("FilterMap")}
            >
              <Icon
                name="location-outline"
                size={25}
                color="#000"
                className="mr-2"
              />
              <Text className="ml-2 text-base text-gray-500">
                VinHome Grand Park:
                <Text className="text-[#00B0B9] font-semibold"> 10km</Text>
              </Text>
              <Icon
                name="chevron-down-outline"
                size={16}
                color="#000"
                className="ml-1"
              />
            </Pressable>

            {/* Nút Filter giá */}
            <View className="flex-row items-center mt-3">
              {minPrice === 0 && maxPrice === 0 ? (
                <View className="relative mr-2">
                  <Icon name="funnel-outline" size={25} color="black" />
                  <View className="absolute -top-1 -right-1 w-4 h-4 bg-black rounded-full items-center justify-center">
                    <Icon name="checkmark" size={10} color="#fff" />
                  </View>
                </View>
              ) : (
                <View className="relative mr-2">
                  <Icon name="funnel-outline" size={25} color="#00B0B9" />
                  <View className="absolute -top-1 -right-1 w-4 h-4 bg-[#00B0B9] rounded-full items-center justify-center">
                    <Icon name="checkmark" size={10} color="#fff" />
                  </View>
                </View>
              )}

              {minPrice === 0 && maxPrice === 0 ? (
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
                    {`Giá: ${minPrice}đ - ${maxPrice}đ`}
                  </Text>
                  <Icon
                    name="chevron-down-outline"
                    size={14}
                    color="#00B0B9"
                    className="ml-2"
                  />
                </Pressable>
              )}
            </View>
          </View>

          <View className="mx-4">
            <View className="mx-auto relative rounded-lg mt-5 p-4 bg-white">
              <Text className="text-[#0b1d2d] text-lg font-bold capitalize mb-3">
                Explore Category
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex flex-row px-3">
                  {categories.map((category) => (
                    <View
                      key={category.id}
                      className="flex flex-col items-center mr-6"
                    >
                      <View className="p-8 bg-gray-100 rounded-lg" />
                      <Text className="text-sm font-medium text-black capitalize mt-1">
                        {category.name}
                      </Text>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>

            <Pressable
              className="bg-[rgba(0,176,185,0.2)] flex-row items-center border border-[#00B0B9] rounded-full px-3 py-1 mt-5 ml-auto active:bg-[rgba(0,176,185,0.3)]"
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

            <View className="mt-3">
              {rows.map((row, rowIndex) => (
                <View key={rowIndex} className="flex flex-row mb-2 gap-x-2">
                  {row.map((item) => (
                    <View key={item.id} className="flex-1">
                      <ItemCard
                        item={item}
                        navigation={navigation}
                        toggleLike={toggleLike}
                        mode="default"
                      />
                    </View>
                  ))}
                  {row.length === 1 && <View className="flex-1" />}
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
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

      {/* Modal Filter Price */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isFilterPriceModalVisible}
        onRequestClose={() => setIsFilterPriceModalVisible(false)}
      >
        <Pressable
          className="flex-1 bg-[rgba(0,0,0,0.2)]"
          onPress={() => setIsFilterPriceModalVisible(false)}
        >
          {/* Bấm nền để đóng */}
        </Pressable>

        {/* Phần Modal chính */}
        <FilterPriceModal
          initialMinPrice={minPrice}
          initialMaxPrice={maxPrice}
          onApply={handleApplyPrice}
          onClear={() => {
            // Ví dụ: reset về 0 - 0
            setMinPrice(0);
            setMaxPrice(0);
          }}
        />
      </Modal>
    </>
  );
};

export default SearchResult;
