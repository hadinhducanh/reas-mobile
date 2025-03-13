import React, { useState } from "react";
import { View, Text, Modal, Pressable, Image } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useTranslation } from "react-i18next";
import LoadingButton from "../../components/LoadingButton";

interface LanguageSwitchModalProps {
  visible: boolean;
  onCancel: () => void;
}

const LanguageSwitchModal: React.FC<LanguageSwitchModalProps> = ({
  visible,
  onCancel,
}) => {
  const { t, i18n } = useTranslation();

  const currentLanguage = i18n.language === "vi" ? "vi" : "en";
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "vi">(
    currentLanguage
  );

  const confirmLanguage = () => {
    i18n.changeLanguage(selectedLanguage);
    onCancel();
  };

  const flagEN = {
    uri: "https://res.cloudinary.com/dpysbryyk/image/upload/v1741633940/REAS/Flag/English.png",
  };
  const flagVI = {
    uri: "https://res.cloudinary.com/dpysbryyk/image/upload/v1741633947/REAS/Flag/VietNam.png",
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable
        className="flex-1 bg-black/50 justify-center items-center"
        onPress={onCancel}
      >
        <View
          onStartShouldSetResponder={() => true}
          className="w-4/5 bg-white rounded-xl p-6"
        >
          <Text className="text-center text-xl font-bold text-[#00B0B9]">
            {t("Select Language")}
          </Text>
          <Text className="text-center text-base text-gray-500 mt-1">
            {t("Please choose your language")}
          </Text>

          <View className="mt-6">
            {/* Lựa chọn English */}
            <Pressable
              onPress={() => setSelectedLanguage("en")}
              className={`flex-row items-center justify-between border ${
                selectedLanguage === "en"
                  ? "border-[#00B0B9] bg-[#00B0B9] "
                  : "border-gray-200"
              } rounded-lg p-4 mb-4`}
            >
              <View className="flex-row items-center">
                <Image
                  source={flagEN}
                  className="w-6 h-6 mr-2"
                  resizeMode="contain"
                />
                <Text
                  className={`font-semibold text-base ${
                    selectedLanguage === "en" ? "text-white" : "text-gray-500"
                  }`}
                >
                  English
                </Text>
              </View>
              {selectedLanguage === "en" && (
                <Icon name="checkmark" size={20} color="white" />
              )}
            </Pressable>

            <Pressable
              onPress={() => setSelectedLanguage("vi")}
              className={`flex-row items-center justify-between border ${
                selectedLanguage === "vi"
                  ? "border-[#00B0B9] bg-[#00B0B9] "
                  : "border-gray-200"
              } rounded-lg p-4`}
            >
              <View className="flex-row items-center">
                <Image
                  source={flagVI}
                  className="w-6 h-6 mr-2"
                  resizeMode="contain"
                />
                <Text
                  className={`font-semibold text-base ${
                    selectedLanguage === "vi" ? "text-white" : "text-gray-500"
                  }`}
                >
                  Tiếng Việt
                </Text>
              </View>
              {selectedLanguage === "vi" && (
                <Icon name="checkmark" size={20} color="white" />
              )}
            </Pressable>
          </View>

          <View className="mt-6 flex-row justify-center">
            <LoadingButton
              title={t("Confirm")}
              onPress={confirmLanguage}
              buttonClassName="flex-1 py-4 mx-20"
            />
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

export default LanguageSwitchModal;
