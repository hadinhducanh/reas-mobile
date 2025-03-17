import { Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

interface ToggleProps {
  label: string;
  value: boolean;
  onToggle: () => void;
}
const Toggle = ({ label, value, onToggle }: ToggleProps) => (
  <View className="flex-row items-center justify-between mt-4 px-5">
    <Text className="text-lg font-medium text-gray-500">{label}</Text>
    <TouchableOpacity
      onPress={onToggle}
      className="w-6 h-6 bg-white rounded-sm justify-center items-center border-2 border-[#00b0b9]"
    >
      {value && <Icon name="check" size={15} color="#00B0B9" />}
    </TouchableOpacity>
  </View>
);

export default Toggle;
