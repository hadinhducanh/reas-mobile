import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/HomeScreen';
import FavoriteScreen from '../screens/FavortieScreen';

const Tab = createBottomTabNavigator();

const AppNavigator: React.FC = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ color, size }) => {
                        let iconName = '';

                        if (route.name === 'Home') {
                            iconName = 'home-outline';
                        } else if (route.name === 'Favorites') {
                            iconName = 'heart-outline';
                        }

                        return <Icon name={iconName} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: 'tomato',
                    tabBarInactiveTintColor: 'gray',
                })}
            >
                <Tab.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{ headerShown: false }}
                />
                <Tab.Screen
                    name="Favorites"
                    component={FavoriteScreen}
                    options={{ headerShown: false }}
                />

            </Tab.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;  