import React from "react";
import { View, Text, ImageBackground, Image } from "react-native";
import { LOGO } from "../../common/constant";

const Splash: React.FC = () => {
  return (
    <View className="flex-1 justify-center items-center h-full bg-[#00b0b9]">
      {/* Outer circle */}
      <View className="w-[228px] h-[228px] rounded-full border-[6px] border-white justify-center items-center">
        <View className="w-[216px] h-[216px] rounded-full bg-[#00b0b9] justify-center items-center">
          <View className="w-[200px] h-[200px] rounded-full overflow-hidden">
            <Image
              source={{
                uri: "https://res.cloudinary.com/dpysbryyk/image/upload/v1744177339/REAS/Logo/Reas-logo.png",
              }}
              style={{ width: "100%", height: "100%" }}
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

export default Splash;
