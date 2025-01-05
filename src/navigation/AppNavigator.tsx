import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import HomeScreen from '../screens/HomeScreen';

import SettingsScreen from '../screens/SettingScreen';
import FavoriteScreen from '../screens/FavortieScreen';

const Tab = createBottomTabNavigator();

const AppNavigator: React.FC = () => {
  // Lấy hàm t() từ hook useTranslation
  const { t } = useTranslation();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName = '';

            if (route.name === t('home')) {  // Dùng t() để dịch tên tab
              iconName = 'home-outline';
            } else if (route.name === t('favorites')) {
              iconName = 'heart-outline';
            } else if (route.name === t('settings')) {
              iconName = 'settings-outline';
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen
          name={t('home')}  // Dùng t() để dịch tên tab
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name={t('favorites')}
          component={FavoriteScreen}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name={t('settings')}
          component={SettingsScreen}
          options={{ headerShown: false }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
