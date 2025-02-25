import React from "react";
import { SafeAreaView, View, ScrollView, TextInput, Image, Text, ImageBackground } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const HomeScreen: React.FC = () => {
  return (
    <SafeAreaView className="flex-1 bg-gray-00">
      <ScrollView>
        <View className="h-24 bg-[#00B0B9] w-full flex flex-row justify-between items-center px-5">
          {/* Search Bar */}
          <View className="flex-1 flex items-center mr-5">
            <View className="w-full h-12 bg-white rounded-lg flex flex-row items-center px-3">
              <View className="w-8 h-8 bg-[#00B0B9] rounded-md flex items-center justify-center mr-3">
                <Icon name="search" size={20} color="#ffffff" />
              </View>
              <TextInput
                placeholder="Search..."
                placeholderTextColor="#738aa0"
                className="flex-1 text-sm text-gray-800"
              />
            </View>
          </View>
          <View className="flex flex-row space-x-3 ml-2">
            <Icon name="notifications-outline" size={35} color="#ffffff" className="mr-2" />
            <Icon name="chatbubble-outline" size={30} color="#ffffff" />
          </View>
        </View>

        {/* Banner Image */}
        <View>
          <Image
            source={{ uri: "https://res.cloudinary.com/dnslrwedn/image/upload/v1740407613/52c61b29-1200_628_1_deautx.png" }}
            className="w-full h-60"
          />
        </View>

        <View className="w-[90%] mx-auto relative rounded-lg mt-5 p-4 bg-white">
          {/* Title */}
          <Text className="text-[#0b1d2d] text-sm font-bold capitalize mb-3">
            Explore Category
          </Text>

          {/* Categories */}
          <View className="flex flex-wrap justify-between">
            {/* Dòng 1 */}
            <View className="flex flex-row justify-around w-full mb-4">
              {[...Array(3)].map((_, index) => (
                <View key={index} className="flex flex-col items-center">
                  <View className="w-12 h-12 bg-gray-300 rounded-lg"></View>
                  <Text className="text-xs font-medium text-black capitalize mt-1">Furniture</Text>
                </View>
              ))}
            </View>

            {/* Dòng 2 */}
            <View className="flex flex-row justify-around w-full">
              {[...Array(3)].map((_, index) => (
                <View key={index} className="flex flex-col items-center">
                  <View className="w-12 h-12 bg-gray-300 rounded-lg"></View>
                  <Text className="text-xs font-medium text-black capitalize mt-1">Furniture</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View className="mt-5 ml-5">
          <Text className="text-[#0b1d2d] text-sm font-bold capitalize">
            New post
          </Text>
        </View>

        {/* Grid layout for cards */}
        <View className="flex flex-row flex-wrap justify-between px-5 mt-3">
          {[...Array(8)].map((_, index) => (
            <View key={index} className="w-[48%] bg-white rounded-lg shadow-md p-3 mb-4">
              {/* Image Container */}
              <View className="w-full aspect-[4/3] bg-white rounded-t-lg overflow-hidden relative">
              <Icon name="heart-outline" size={24} color="#ff0000" className="absolute bottom-2 right-2" />
              </View>
              {/* Product Info */}
              <View className="mt-2 space-y-1">
                <Text className="text-gray-500 text-sm font-medium truncate">Iphone 20</Text>
                <Text className="text-gray-900 text-base font-semibold">$12.79</Text>
                <Text className="text-gray-400 text-xs">14 mins ago | Vinhome Grand Park</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
