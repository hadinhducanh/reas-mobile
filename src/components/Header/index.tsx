import React, { useState } from "react";
import { View, Text, Pressable, Modal } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { StatusExchange } from "../../common/enums/StatusExchange";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { getAllExchangesByStatusOfCurrentUserThunk } from "../../redux/thunk/exchangeThunk";

interface HeaderProps {
  title?: string;
  backgroundColor?: string;
  textColor?: string;
  showBackButton?: boolean;
  showOption?: boolean;
  showFilter?: boolean;
  onBackPress?: () => void;
  backIconColor?: string;
  optionIconColor?: string;
  setFavorites?: () => void;
  owner?: boolean;
}

const statusExchanges = [
  { label: "Not yet exchange", value: StatusExchange.NOT_YET_EXCHANGE },
  { label: "Pending evidence", value: StatusExchange.PENDING_EVIDENCE },
];

const Header: React.FC<HeaderProps> = ({
  title = "Title",
  backgroundColor = "bg-[#F6F9F9]",
  textColor = "text-back",
  showBackButton = true,
  showOption = true,
  showFilter = false,
  onBackPress,
  setFavorites,
  backIconColor = "#0b1d2d",
  optionIconColor = "#0b1d2d",
  owner = true,
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useDispatch<AppDispatch>();

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isFilterVisible, setFilterVisible] = useState(false);
  const [selectedStatusExchangeLocal, setSelectedStatusExchangeLocal] =
    useState<StatusExchange>(StatusExchange.PENDING);
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

  const handleSelectStatusExchange = (status: StatusExchange) => {
    if (selectedStatusExchangeLocal === status) {
      setSelectedStatusExchangeLocal(StatusExchange.PENDING);
      dispatch(
        getAllExchangesByStatusOfCurrentUserThunk({
          pageNo: 0,
          statusExchangeRequest: StatusExchange.APPROVED,
        })
      );
    } else {
      setSelectedStatusExchangeLocal(status);
      dispatch(
        getAllExchangesByStatusOfCurrentUserThunk({
          pageNo: 0,
          statusExchangeRequest: status,
        })
      );
    }
    setFilterVisible(false);
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
        {showFilter && (
          <Pressable
            className="absolute right-5"
            onPress={() => setFilterVisible(true)}
          >
            <Icon name="funnel-outline" size={24} color="#00b0b9" />
          </Pressable>
        )}
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isPopupVisible}
        onRequestClose={() => setIsPopupVisible(false)}
      >
        <Pressable
          className="flex-1 bg-[rgba(0,0,0,0.2)]"
          onPress={() => setIsPopupVisible(false)}
        >
          <View className="mt-auto ">
            <Pressable
              className="flex-row items-center bg-white p-5 active:bg-gray-100"
              onPress={() => {}}
            >
              <Icon name="warning-outline" size={24} color="black" />
              {owner ? (
                <Text className="ml-2 text-base">Báo cáo tin đăng này</Text>
              ) : (
                <Text className="ml-2 text-base">Báo cáo người dùng</Text>
              )}
            </Pressable>
            {owner && (
              <Pressable
                className="flex-row items-center bg-white p-5 active:bg-gray-100 border-t-[1px] border-b-[1px] border-gray-200"
                onPress={setFavorites}
              >
                <Icon name="heart-outline" size={24} color="black" />
                <Text className="text-base ml-2">Lưu tin</Text>
              </Pressable>
            )}

            <Pressable
              className="flex-row items-center bg-white p-5 active:bg-gray-100"
              onPress={() => {}}
            >
              <Icon name="share-social-outline" size={24} color="black" />
              {owner ? (
                <Text className="ml-2 text-base">Chia sẻ tin</Text>
              ) : (
                <Text className="ml-2 text-base">Chia sẻ người dùng</Text>
              )}
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isFilterVisible}
        onRequestClose={() => setFilterVisible(false)}
      >
        <Pressable
          className="flex-1 bg-black/50 justify-center items-center"
          onPress={() => setFilterVisible(false)}
        >
          <View
            onStartShouldSetResponder={() => true}
            className="w-4/5 bg-white rounded-xl p-6"
          >
            <Text className="text-center text-xl font-bold text-[#00B0B9]">
              Select status
            </Text>
            <Text className="text-center text-base text-gray-500 mt-1">
              Please choose your status
            </Text>

            <View className="mt-6">
              {statusExchanges.map((status) => {
                const isSelected = selectedStatusExchangeLocal === status.value;
                const methodMatch = statusExchanges.find(
                  (statusItem) => statusItem.value === status.value
                );
                return (
                  <Pressable
                    key={status.value}
                    onPress={() => handleSelectStatusExchange(status.value)}
                    className={`flex-row items-center justify-between border ${
                      isSelected
                        ? "border-[#00B0B9] bg-[#00B0B9] "
                        : "border-gray-200"
                    } rounded-lg p-4 mb-4`}
                  >
                    <View className="flex-row items-center">
                      <Text
                        className={`font-semibold text-base ${
                          isSelected ? "text-white" : "text-gray-500"
                        }`}
                      >
                        {methodMatch?.label}
                      </Text>
                    </View>
                    {isSelected ? (
                      <Icon
                        name="radio-button-on-outline"
                        size={20}
                        color="white"
                      />
                    ) : (
                      <Icon
                        name="radio-button-off-outline"
                        size={20}
                        color="#00B0B9"
                      />
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

export default Header;
