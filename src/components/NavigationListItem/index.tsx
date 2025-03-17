import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

interface NavigationListItemProps {
  title: string;
  value?: string;
  route: keyof RootStackParamList;
  defaultValue?: string;
}
const NavigationListItem = ({
  title,
  value,
  route,
  defaultValue = "Select",
}: NavigationListItemProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate(route as any)}
      className="w-full bg-white rounded-lg mt-4 flex-row justify-between items-center px-5 py-3"
    >
      <View>
        <Text className="text-base text-black">{title}</Text>
        <Text
          className={`text-lg font-semibold ${
            value ? "text-[#00b0b9]" : "text-black"
          } mt-1`}
        >
          {value || defaultValue}
        </Text>
      </View>
      <Icon name="arrow-forward-ios" size={20} color="black" />
    </TouchableOpacity>
  );
};

export default NavigationListItem;
