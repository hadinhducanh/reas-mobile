import React, { useState } from "react";
import { SafeAreaView, View, ScrollView, Image, TextInput, TouchableOpacity, Text } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';

const HomeScreen: React.FC = () => {
  const [textInput1, onChangeTextInput1] = useState<string>("");

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 bg-gray-100 pt-2">
        <Image source={{ uri: "https://i.imgur.com/1tMFzp8.png" }} resizeMode="stretch" className="h-14 w-full" />

        <View className="flex-row justify-between items-center mb-2 mx-5">
          <View className="flex-row items-center bg-white rounded-lg px-3 w-4/5 mt-2">
            <View className="w-10 h-10 bg-teal-500 rounded-lg justify-center items-center mr-3 mt-2 mb-2">
              <MaterialIcons name="search" size={24} color="#738AA0" />
            </View>
            <TextInput
              placeholder="Search..."
              value={textInput1}
              onChangeText={onChangeTextInput1}
              className="text-gray-500 text-base flex-1 py-1"
            />
          </View>
          <View className="w-12 bg-white rounded-lg px-3">
            <MaterialIcons name="filter-list" size={24} color="#738AA0" />
          </View>
        </View>

        <View className="flex-row justify-between items-center mb-8 mx-1">
          <TouchableOpacity className="w-36 flex-row justify-center items-center bg-teal-500 rounded-lg py-2" onPress={() => alert("Pressed!")}> 
            <Image source={{ uri: "https://i.imgur.com/1tMFzp8.png" }} resizeMode="stretch" className="w-6 h-6 mr-3" />
            <Text className="text-gray-900 text-sm font-semibold">Electronic</Text>
          </TouchableOpacity>
          {[...Array(4)].map((_, index) => (
            <View key={index} className="w-12 bg-white rounded-lg px-3">
              <Image source={{ uri: "https://i.imgur.com/1tMFzp8.png" }} resizeMode="stretch" className="h-6 mt-3" />
            </View>
          ))}
        </View>

        {[...Array(3)].map((_, index) => (
          <View key={index} className="flex-row justify-between items-center mb-5 mx-5">
            {[...Array(2)].map((_, subIndex) => (
              <View key={subIndex} className="w-40 bg-white rounded-lg pb-5">
                <View className="bg-white px-32 py-4 mb-3">
                  <Image
                    source={{ uri: "https://i.imgur.com/1tMFzp8.png" }}
                    resizeMode="stretch"
                    className="w-16 h-16 mt-28"
                  />
                </View>
                <Text className="text-gray-500 text-xs mb-3 ml-3">Iphone 20</Text>
                <Text className="text-gray-900 text-sm ml-3">$12.79</Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
