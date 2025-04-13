import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { CategoryDto } from "../../common/models/category";
import { ScrollView } from "react-native-gesture-handler";

interface SelectedCategoryProps {
  selectedCategories: CategoryDto[];
  onSelectCategory: (value: CategoryDto[]) => void;
}

const CategoryModal: React.FC<SelectedCategoryProps> = ({
  selectedCategories,
  onSelectCategory,
}) => {
  const { categories } = useSelector((state: RootState) => state.category);

  const handleClear = () => {
    onSelectCategory([]);
  };

  const handleToggleCategory = (item: CategoryDto) => {
    const isSelected = selectedCategories.some(
      (category) => category.id === item.id
    );
    if (isSelected) {
      onSelectCategory(selectedCategories.filter((cat) => cat.id !== item.id));
    } else {
      onSelectCategory([...selectedCategories, item]);
    }
  };

  return (
    <View className="bg-white rounded-t-2xl mt-auto px-5">
      <View className="items-center mt-2 mb-3">
        <View className="w-20 h-1.5 bg-gray-400 rounded-full" />
      </View>

      <View className="flex-row items-center justify-between mb-4 px-2">
        <Text className="text-lg font-semibold text-black">
          Choose your categories
        </Text>
        <TouchableOpacity onPress={handleClear}>
          <Text className="text-base font-semibold text-[#00B0B9]">Clear</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="pb-4">
        {categories.map((item) => {
          const isSelected = selectedCategories.some(
            (category) => category.id === item.id
          );
          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleToggleCategory(item)}
              className={`flex-row items-center justify-between px-4 py-3 mb-1 rounded-md ${
                isSelected ? "bg-[#E6FBFD]" : "bg-white"
              }`}
            >
              <Text
                className={`text-base ${
                  isSelected ? "text-[#00B0B9]" : "text-black"
                }`}
              >
                {item.categoryName}
              </Text>
              {isSelected ? (
                <Icon name="radio-button-on" size={20} color="#00B0B9" />
              ) : (
                <Icon name="radio-button-off" size={20} color="#738AA0" />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default CategoryModal;
