import React, { useState } from "react";
import { View, Text, Pressable, Modal } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

interface HeaderProps {
  title?: string;
  backgroundColor?: string;
  textColor?: string;
  showBackButton?: boolean;
  showOption?: boolean;
  onBackPress?: () => void;
  backIconColor?: string;
  optionIconColor?: string;
  setFavorites?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  title = "Title",
  backgroundColor = "bg-[#F6F9F9]",
  textColor = "text-back",
  showBackButton = true,
  showOption = true,
  onBackPress,
  setFavorites,
  backIconColor = "#0b1d2d",
  optionIconColor = "#0b1d2d",
}) => {
  const navigation = useNavigation();
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  const onOptionPress = () => {
    setIsPopupVisible(true);
  };

  const closePopup = () => {
    setIsPopupVisible(false);
  };

  return (
    <>
      <View
        className={`relative flex-row items-center justify-center h-[50px] ${backgroundColor}`}
      >
        {showBackButton && (
          <Pressable className="absolute left-5" onPress={handleBackPress}>
            <Icon name="chevron-back-outline" size={24} color={backIconColor} />
          </Pressable>
        )}
        <Text className={`text-[18px] font-bold ${textColor}`}>{title}</Text>
        {showOption && (
          <Pressable className="absolute right-5" onPress={onOptionPress}>
            <Icon name="ellipsis-vertical" size={24} color={optionIconColor} />
          </Pressable>
        )}
      </View>

      {/* Popup hiển thị khi ấn vào Option */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isPopupVisible}
        onRequestClose={closePopup}
      >
        {/* Vùng background khi nhấn ra ngoài sẽ gọi closePopup */}
        <Pressable className="flex-1 bg-[rgba(0,0,0,0.2)]" onPress={closePopup}>
          <View className="mt-auto">
            <Pressable
              className="flex-row items-center bg-white p-5 active:bg-gray-100"
              onPress={() => {}}
            >
              <Icon name="warning-outline" size={24} color={optionIconColor} />
              <Text className="ml-2 text-base">Báo cáo tin đăng này</Text>
            </Pressable>
            <Pressable
              className="flex-row items-center bg-white p-5 active:bg-gray-100 border-t-[1px] border-b-[1px] border-gray-200"
              onPress={setFavorites}
            >
              <Icon name="heart-outline" size={24} color={optionIconColor} />
              <Text className="text-base ml-2">Lưu tin</Text>
            </Pressable>
            <Pressable
              className="flex-row items-center bg-white p-5 active:bg-gray-100"
              onPress={() => {}}
            >
              <Icon
                name="share-social-outline"
                size={24}
                color={optionIconColor}
              />

              <Text className="ml-2 text-base">Chia sẻ tin</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

export default Header;
