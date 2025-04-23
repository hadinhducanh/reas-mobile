import React, { useEffect, useRef } from "react";
import {
  Modal,
  SafeAreaView,
  TouchableOpacity,
  Image,
  FlatList,
  View,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const { width, height } = Dimensions.get("window");

interface ImagePreviewModalProps {
  visible: boolean;
  imageUrl?: string | null;
  imageUrls?: string[];
  initialIndex?: number;
  onClose: () => void;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  visible,
  imageUrl = null,
  imageUrls,
  initialIndex = 0,
  onClose,
}) => {
  const flatListRef = useRef<FlatList<string>>(null);

  useEffect(() => {
    if (visible && imageUrls && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: initialIndex,
          animated: false,
        });
      }, 0);
    }
  }, [visible, imageUrls, initialIndex]);

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-black justify-center items-center">
        <TouchableOpacity
          className="absolute top-5 left-2 z-10 p-2 bg-white rounded-full"
          onPress={onClose}
        >
          <Icon name="chevron-back-outline" size={24} color="black" />
        </TouchableOpacity>

        {imageUrls && imageUrls.length > 0 ? (
          <FlatList
            ref={flatListRef}
            data={imageUrls}
            horizontal
            pagingEnabled
            keyExtractor={(_, index) => `${index}`}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View
                style={{ width, height }}
                className="justify-center items-center"
              >
                <Image
                  source={{ uri: item }}
                  className="w-full h-full"
                  resizeMode="contain"
                />
              </View>
            )}
            getItemLayout={(_, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
            onScrollToIndexFailed={({ index }) => {
              setTimeout(() => {
                flatListRef.current?.scrollToIndex({ index, animated: true });
              }, 100);
            }}
          />
        ) : imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            className="w-full h-full"
            resizeMode="contain"
          />
        ) : null}
      </SafeAreaView>
    </Modal>
  );
};

export default ImagePreviewModal;
