import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/AppNavigator";
import {
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import LoadingButton from "../../components/LoadingButton";
import MatchedList from "../../components/MatchedList";

type ItemType = {
  id: number;
  name: string;
  price: string;
  image: string;
  location: string;
  description: string;
  isFavorited: boolean;
};

const CreateExchange: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, "CreateExchange">>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { itemId } = route.params;

  const [itemList] = useState<ItemType[]>([
    {
      id: 1,
      name: "iPhone 20",
      price: "150.000",
      image: "https://via.placeholder.com/150",
      location: "Vinhome Grand Park",
      description: "Brand new iPhone 20 with latest features.",
      isFavorited: false,
    },
    {
      id: 2,
      name: "iPhone 22",
      price: "150.000",
      image: "https://via.placeholder.com/150",
      location: "Vinhome Grand Park",
      description: "Brand new iPhone 20 with latest features.",
      isFavorited: false,
    },
  ]);
  const item = itemList.find((item) => item.id === itemId);

  const [selectedItem, setSelectedItem] = useState<ItemType | null>(null);

  const handleSelectItem = (item: ItemType) => {
    setSelectedItem(item);
  };

  const handleRemoveItem = () => {
    setSelectedItem(null);
  };

  const [modalVisible, setModalVisible] = useState(false);

  const handleProposeExchange = () => {
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleContinue = () => {
    setModalVisible(false);
    navigation.navigate("ConfirmExchange");
  };

  return (
    <>
      <SafeAreaView className="flex-1 bg-[#F6F9F9]" edges={["top"]}>
        <Header title="Create exchange" showOption={false} />
        <ScrollView className="mx-5" showsVerticalScrollIndicator={false}>
          <View className="py-5">
            <Text className="text-lg text-gray-500 font-medium mb-1">
              You want to exchange for:
            </Text>
            <View className="rounded-md p-3 flex-row items-center bg-white">
              {/* Khung ảnh cố định size */}

              <View className="w-40 h-28 rounded-md ">
                <Image
                  source={{
                    uri: "https://goldsun.vn/pic/ProductItem/Noi-com-d_637625508222561223.jpg",
                  }}
                  className="w-full h-full object-cover"
                  resizeMode="cover"
                />
              </View>

              {/* Thông tin sản phẩm */}
              <View className="ml-3 flex-1">
                <Text className="text-lg font-bold text-gray-900">
                  {item?.name}
                </Text>
                <Text className="text-gray-500 text-base my-1">
                  Listed by Đức Sơn
                </Text>
                <Text className="text-[#00B0B9] text-xl font-semibold">
                  {item?.price}VND
                </Text>
              </View>
            </View>
          </View>

          <View>
            {/* Suggested item */}
            <MatchedList
              items={itemList.filter((item) => item.id !== selectedItem?.id)}
              onSelectItem={handleSelectItem}
            />

            <Pressable
              className="flex-row justify-center items-center mx-5 bg-gray-100 border-[1px] border-gray-300 px-5 py-4 rounded-lg active:bg-gray-200 my-5"
              onPress={() => navigation.navigate("BrowseItems")}
            >
              <Icon name="folder-open" size={20} />
              <Text className="text-center text-lg text-gray-500 font-medium ml-1">
                Browse my items
              </Text>
            </Pressable>
            <Pressable
              className="flex-row justify-center items-center mx-5 bg-gray-100 border-[1px] border-gray-300 px-5 py-4 rounded-lg active:bg-gray-200"
              onPress={() => navigation.navigate("DifferentItem")}
            >
              <Text className="text-center text-lg text-gray-500 font-medium mr-1">
                Add a different item
              </Text>
              <Icon name="add" size={20} />
            </Pressable>

            <View className="bg-gray-100 p-4 rounded-lg border border-gray-300 mt-10">
              <Text className="text-gray-500 text-lg font-medium mb-2">
                Your chosen item
              </Text>
              {selectedItem ? (
                <View
                  key={item?.id}
                  className="mb-3 flex-row justify-between w-full items-center bg-white px-5 rounded-lg py-2"
                >
                  <View className="flex-row items-center mr-2">
                    <View className="w-20 h-20 rounded-md overflow-hidden">
                      <Image
                        source={{
                          uri: "https://goldsun.vn/pic/ProductItem/Noi-com-d_637625508222561223.jpg",
                        }}
                        className="w-full h-full object-cover"
                        resizeMode="cover"
                      />
                    </View>
                    <Text
                      className="text-gray-700 text-lg ml-2 w-40 font-medium"
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={{ flexShrink: 1 }}
                    >
                      {selectedItem.name}
                    </Text>
                  </View>

                  <View>
                    {/* <Pressable
                    className="bg-white border-[1px] border-[#00B0B9] py-3 px-8 rounded-xl active:bg-[rgb(0,176,185,0.1)]"
                    onPress={handleRemoveItem}
                  >
                    <Text className="text-base text-[#00B0B9] font-medium">
                      Remove
                    </Text>
                  </Pressable> */}
                    <LoadingButton
                      title="Remove"
                      onPress={handleRemoveItem}
                      buttonClassName="border-2 border-[#00B0B9] py-3 px-5 bg-white"
                      textColor="text-[#00B0B9]"
                    />
                  </View>
                </View>
              ) : (
                <View className="py-10">
                  <Text className="text-gray-300 text-center text-base mb-1">
                    Please add an item you want to exchange
                  </Text>
                  <Text className="text-gray-300 text-center text-base">
                    (optional for free exchange)
                  </Text>
                </View>
              )}
            </View>
          </View>

          <View className="mt-8">
            <Text className="font-bold text-lg text-gray-500">
              Exchange Details
            </Text>

            <View className="bg-white mt-2 rounded-lg p-4 flex-row justify-between">
              <View className="w-1/2 justify-between">
                <Text className="text-base text-gray-500">Method</Text>
                <Text className="text-base text-gray-500 my-4">Type</Text>
                <Text className="text-base text-gray-500 mb-4">
                  Meeting Location
                </Text>
                <Text className="text-base text-gray-500">Date & Time</Text>
              </View>
              <View className="w-1/2 justify-between">
                <Text className="text-right text-base text-[#00b0b9]">
                  Pick-up in person
                </Text>
                <Text className="text-right text-base text-[#00b0b9]">
                  Open with desired item
                </Text>
                <View className="flex-row items-center justify-end">
                  <Icon name="location-outline" size={20} color="#00B0B9" />
                  <Text className="ml-[2px] text-base underline text-[#00b0b9]">
                    Set location
                  </Text>
                </View>

                <View className="flex-row items-center justify-end">
                  <Icon
                    name="calendar-clear-outline"
                    size={20}
                    color="#00B0B9"
                  />
                  <Text className="ml-[2px] text-right text-base underline text-[#00b0b9]">
                    Schedule
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View className="my-5">
            <Text className="font-bold text-lg text-gray-500">Note</Text>

            <View className="px-3 py-3 rounded-lg my-2 bg-white">
              <View className="pb-36">
                <TextInput
                  className="text-gray-500 text-base"
                  placeholder="Write your message here..."
                ></TextInput>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
      <View
        className={`${
          Platform.OS === "ios" ? "pt-4 pb-7" : "py-3"
        } px-5 bg-white mt-auto rounded-t-xl flex-row items-center`}
      >
        <LoadingButton
          buttonClassName="p-3"
          title="Propose exchange"
          onPress={handleProposeExchange}
        />
      </View>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={handleCancel}
      >
        <Pressable
          className="flex-1 bg-[rgba(0,0,0,0.2)]"
          onPress={handleCancel}
        >
          <View className="absolute inset-0 justify-center items-center">
            <View className="w-[80%] bg-white rounded-md p-5">
              <Text className="text-[#00B0B9] text-2xl font-bold mb-2 text-center">
                Warning
              </Text>
              <Text className="text-gray-500 mb-4 text-xl text-center">
                This item is not in the desired list. The exchange might be less
                likely to be accepted.
              </Text>

              {/* Nút Cancel & Continue */}
              <View className="flex-row justify-between mt-2 mx-3">
                <View className="flex-1 mr-2">
                  <LoadingButton
                    title="Cancel"
                    onPress={handleCancel}
                    buttonClassName="p-4 bg-white border-2 border-[#00B0B9]"
                    textColor="text-[#00B0B9]"
                  />
                </View>
                <View className="flex-1">
                  <LoadingButton
                    title="Continue"
                    onPress={handleContinue}
                    buttonClassName="p-4 border-2 border-transparent"
                  />
                </View>
              </View>
            </View>
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

export default CreateExchange;
