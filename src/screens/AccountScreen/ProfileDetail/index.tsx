import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import LoadingButton from "../../../components/LoadingButton";
import { useNavigation } from "@react-navigation/native";
import Header from "../../../components/Header";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/AppNavigator";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import ChooseImage from "../../../components/ChooseImage";
import { PlaceDetail } from "../../../common/models/location";
import LocationService from "../../../services/LocationService";
import { updateResidentInfoThunk } from "../../../redux/thunk/userThunk";
import { Gender } from "../../../common/enums/Gender";
import {
  resetUser,
  setUserPlaceIdState,
} from "../../../redux/slices/userSlice";
import { fetchUserInfoThunk } from "../../../redux/thunk/authThunks";
import { uploadToCloudinary } from "../../../utils/CloudinaryImageUploader";
import { useFocusEffect } from "@react-navigation/native";

const ProfileDetail: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const { user } = useSelector((state: RootState) => state.auth);
  const { userDetail, userLocationId, loading } = useSelector(
    (state: RootState) => state.user
  );

  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [enable, setEnable] = useState<boolean>(false);

  const [transferReceiptImage, setTransferReceiptImage] = useState<string>("");
  const [locationDetail, setLocationDetail] = useState<PlaceDetail>();
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  const [countryCode, setCountryCode] = useState("+84");

  useEffect(() => {
    if (user) {
      setFullName(user?.fullName);
      setEmail(user.email);
      if (user.phone) {
        setPhoneNumber(user.phone);
      }
      if (user.userLocations.length !== 0) {
        setAddress(user.userLocations[0].specificAddress);
      }
      if (user.image) {
        setTransferReceiptImage(user.image);
      }
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      const fetchLocationDetails = async () => {
        if (user && user.userLocations && user.userLocations.length) {
          let targetLocation = null;

          if (userLocationId !== 0) {
            targetLocation = user.userLocations.find(
              (loc) => loc.id === userLocationId
            );
          }

          if (!targetLocation) {
            // fallback nếu userLocationId không tồn tại hoặc không match
            const primaryLocations = user.userLocations.filter(
              (loc) => loc.primary
            );
            if (primaryLocations.length > 0) {
              targetLocation = primaryLocations[0];
            }
          }

          if (targetLocation) {
            try {
              const details =
                await LocationService.getPlaceDetailsByReverseGeocode(
                  `${targetLocation.latitude},${targetLocation.longitude}`
                );
              dispatch(setUserPlaceIdState(details.place_id));
              setLocationDetail(details);
            } catch (error) {
              console.error("Error fetching location details:", error);
            }
          }
        }
      };

      fetchLocationDetails();
    }, [user, userLocationId])
  );

  const formatPhoneNumber = (digits: string) => {
    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 6) {
      return digits.slice(0, 3) + "-" + digits.slice(3);
    } else {
      return (
        digits.slice(0, 3) +
        "-" +
        digits.slice(3, 6) +
        "-" +
        digits.slice(6, 10)
      );
    }
  };

  const handlePhoneChange = (input: string) => {
    const cleaned = input.replace(/\D/g, "");
    const limited = cleaned.slice(0, 10);
    const formatted = formatPhoneNumber(limited);
    setPhoneNumber(formatted);
  };

  const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  useEffect(() => {
    const isValidPhone = (phone: string) => {
      const cleaned = phone.replace(/\D/g, "");
      return cleaned.length === 10;
    };

    const isValid =
      fullName.trim().length >= 3 &&
      isValidEmail(email) &&
      isValidPhone(phoneNumber) &&
      address.trim().length > 0;

    setEnable(isValid);
  }, [fullName, email, phoneNumber, address]);

  const renderValidationIcon = () => {
    if (email.trim().length === 0) {
      return null;
    }
    if (isValidEmail(email)) {
      return (
        <Icon
          name="checkmark-outline"
          size={20}
          color="#00b0b9"
          style={{ marginLeft: 10 }}
        />
      );
    } else {
      return (
        <Icon
          name="close-outline"
          size={20}
          color="red"
          style={{ marginLeft: 10 }}
        />
      );
    }
  };

  const processImages = useCallback(async (): Promise<string | null> => {
    const result = await uploadToCloudinary(transferReceiptImage, user?.email);
    return result;
  }, [transferReceiptImage, uploadToCloudinary, user?.email]);

  const handleEditSave = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    setIsEditing(false);

    if (transferReceiptImage && transferReceiptImage !== user?.image) {
      setIsUploadingImages(true);
      const processedImage = await processImages();
      const finalImage = processedImage ?? "";
      setTransferReceiptImage(finalImage);
      setIsUploadingImages(false);

      const updateResidentRequest = {
        fullName: fullName,
        phone: phoneNumber,
        gender: Gender.FEMALE,
        image: finalImage.length === 0 ? null : finalImage,
        userLocationId: 1,
      };

      dispatch(updateResidentInfoThunk(updateResidentRequest));
    } else {
      const updateResidentRequest = {
        fullName: fullName,
        phone: phoneNumber,
        gender: Gender.FEMALE,
        image: transferReceiptImage?.length === 0 ? null : transferReceiptImage,
        userLocationId: 1,
      };

      dispatch(updateResidentInfoThunk(updateResidentRequest));
    }
  };

  useEffect(() => {
    if (userDetail) {
      dispatch(fetchUserInfoThunk());
      dispatch(resetUser());
      setIsEditing(false);
    }
  }, [userDetail]);

  const textInputStyle = () =>
    `flex-1 text-[16px] text-[#0b1d2d] ${
      isEditing ? "font-normal" : "font-bold"
    }`;

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView className="flex-1 bg-[#F6F9F9]">
      <Header
        title="Personal information"
        showOption={false}
        showBackButton={user?.firstLogin ? false : true}
        onBackPress={() =>
          navigation.reset({
            index: 0,
            routes: [
              {
                name: "MainTabs",
                state: { routes: [{ name: "Account" }] },
              },
            ],
          })
        }
      />

      {loading || isUploadingImages ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#00b0b9" />
        </View>
      ) : (
        <View className="flex-1 mb-5">
          <View className="flex-1 flex-col justify-center bg-white rounded-[10px] mx-[20px] px-[20px] mb-[10px] items-center">
            {isEditing ? (
              <ChooseImage
                transferReceiptImage={transferReceiptImage}
                setTransferReceiptImage={setTransferReceiptImage}
                isProfile={true}
              />
            ) : (
              <>
                {transferReceiptImage.length !== 0 ? (
                  <View className="bg-[#a9b4bd] w-[180px] h-[180px] flex items-center justify-center rounded-full mb-10 relative">
                    <View className="w-full h-full rounded-full overflow-hidden">
                      <Image
                        source={{ uri: transferReceiptImage }}
                        className="w-full h-full rounded-full"
                      />
                    </View>
                  </View>
                ) : (
                  <View className="bg-[#a9b4bd] w-[180px] h-[180px] rounded-full mb-10 relative">
                    <Icon
                      name="person-circle-outline"
                      size={180}
                      color="white"
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        fontSize: 180,
                        textAlign: "center",
                        lineHeight: 180,
                      }}
                    />
                  </View>
                )}
              </>
            )}

            <View className="w-full h-[50px] mb-[20px]">
              <View className="flex-row h-[50px] px-[6px] items-center bg-[#e8f3f6] rounded-[8px]">
                <View className="w-[40px] h-[40px] bg-[#00b0b9] rounded-[8px] justify-center items-center mr-[10px]">
                  <Icon name="person-outline" size={20} color="#ffffff" />
                </View>
                <TextInput
                  placeholder="Full Name"
                  placeholderTextColor="#738aa0"
                  className={textInputStyle()}
                  value={fullName}
                  onChangeText={setFullName}
                  editable={isEditing}
                />
              </View>
            </View>

            <View className="w-full h-[50px] mb-[20px]">
              <View className="flex-row h-[50px] px-[6px] items-center bg-[#e8f3f6] rounded-[8px]">
                <View className="w-[40px] h-[40px] bg-[#00b0b9] rounded-[8px] justify-center items-center mr-[10px]">
                  <Icon name="mail-outline" size={20} color="#ffffff" />
                </View>
                <TextInput
                  placeholder="Email"
                  placeholderTextColor="#738aa0"
                  className={textInputStyle()}
                  value={email}
                  onChangeText={setEmail}
                  editable={isEditing}
                />
                {renderValidationIcon()}
              </View>
            </View>

            <View className="w-full h-[50px] mb-[20px]">
              <View className="flex-row h-full px-[6px] items-center bg-[#e8f3f6] rounded-[8px]">
                <View className="w-[40px] h-[40px] bg-[#00b0b9] rounded-[8px] justify-center items-center">
                  <Icon
                    name="phone-portrait-outline"
                    size={20}
                    color="#ffffff"
                  />
                </View>
                <View className="px-[10px] justify-center items-center border-r border-r-[#738aa0] mr-[10px]">
                  <Text className="text-[16px] text-[#0b1d2d]">
                    {countryCode}
                  </Text>
                </View>
                <TextInput
                  placeholder="123-456-6789"
                  placeholderTextColor="#738aa0"
                  keyboardType="number-pad"
                  value={phoneNumber}
                  onChangeText={handlePhoneChange}
                  className={textInputStyle()}
                  editable={isEditing}
                />
              </View>
            </View>

            <TouchableOpacity
              className="w-full h-[50px] mb-[30px]"
              onPress={() => navigation.navigate("LocationOfUser")}
              disabled={!isEditing}
            >
              <View className="flex-row h-[60px] px-[6px] items-center bg-[#e8f3f6] rounded-[8px]">
                <View className="w-[40px] h-[40px] bg-[#00b0b9] rounded-[8px] justify-center items-center mr-[10px]">
                  <Icon name="location-outline" size={22} color={"white"} />
                </View>
                {locationDetail?.formatted_address ? (
                  <View className="flex-col items-start justify-start flex-1 w-full">
                    <Text
                      className={`text-lg font-semibold text-black`}
                      numberOfLines={1}
                    >
                      {locationDetail?.name}
                    </Text>
                    <Text
                      className={`text-base text-black w-full flex-wrap`}
                      numberOfLines={1}
                    >
                      {locationDetail?.formatted_address}
                    </Text>
                  </View>
                ) : (
                  <View className="flex-col items-start justify-start flex-1 w-full">
                    <Text className={`text-lg font-semibold text-gray-500`}>
                      Input your location here
                    </Text>
                  </View>
                )}

                {isEditing && (
                  <Icon
                    name="chevron-forward-outline"
                    size={24}
                    color={"gray"}
                  />
                )}
              </View>
            </TouchableOpacity>

            {/* Nút Edit/Save */}
            <LoadingButton
              title={isEditing ? "Save change" : "Edit profile"}
              onPress={handleEditSave}
              loading={loading}
              disable={isEditing ? !enable : false}
              buttonClassName={`py-4 ${
                !enable && isEditing ? "bg-gray-300" : ""
              }`}
              textColor={!enable && isEditing ? "text-[#00b0b9]" : "text-white"}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ProfileDetail;
