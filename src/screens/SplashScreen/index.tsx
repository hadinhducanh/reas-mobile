import React from "react";
import { View, Text, ImageBackground } from "react-native";

const SplashScreen: React.FC = () => {
  return (
    <View className="flex-1 justify-center items-center h-full bg-[#00b0b9]">
      {/* Outer circle */}
      <View className="w-[228px] h-[228px] rounded-full border-[6px] border-white justify-center items-center">
        {/* Inner circle */}
        <View className="w-[216px] h-[216px] rounded-full bg-[#00b0b9] justify-center items-center">
          {/* Image container */}
          <View className="w-[200px] h-[200px] rounded-full overflow-hidden">
            <ImageBackground
              source={{
                uri: "https://res.cloudinary.com/dpysbryyk/image/upload/v1738837274/REAS/Logo/yphvs1utycnesn4ozy76.png",
              }}
              style={{
                width: "100%",
                height: "100%",
              }}
              resizeMode="cover"
            />
          </View>
        </View>
      </View>
      <Text className="mt-[10px] text-[28px] font-bold text-white text-center">
        REAS
      </Text>
    </View>
  );
};

export default SplashScreen;
