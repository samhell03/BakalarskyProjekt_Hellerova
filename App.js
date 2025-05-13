import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import TripFormScreen from './TripFormScreen';
import Vylety from './Vylety';
import EditTripScreen from './EditTripScreen';
import PackingScreen from './PackingScreen';
import TentScreen from './TentScreen';
import TouristTripScreen from './TouristTripScreen';
import TripDetailsScreen from './TripDetailsScreen';
import AdventureTripScreen from './AdventureTripScreen';
import BeachHolidayScreen from './BeachHolidayScreen';
import WinterHolidayScreen from './WinterHolidayScreen';
import CampingScreen from './CampingScreen';
import HuntScreen from './HuntScreen';
import FestivalScreen from './FestivaScreen';
import WellnessScreen from './WellnessScreen';
import HomeScreen from './HomeScreen';
import TripCalendar from './TripCalendar'; 

const Stack = createNativeStackNavigator();
function VyletyStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Vylety" component={Vylety} />
      <Stack.Screen name="EditTripScreen" component={EditTripScreen} />
      <Stack.Screen name="PackingScreen" component={PackingScreen} />
      <Stack.Screen name="TentScreen" component={TentScreen} />
      <Stack.Screen name='TouristTripScreen' component={TouristTripScreen}/>
      <Stack.Screen name='AdventureTripScreen' component={AdventureTripScreen}/>
      <Stack.Screen name='BeachHolidayScreen' component={BeachHolidayScreen}/>
      <Stack.Screen name="HuntScreen" component={HuntScreen} />
      <Stack.Screen name='WinterHolidayScreen' component={WinterHolidayScreen} />
      <Stack.Screen name='CampingScreen' component={CampingScreen} />
      <Stack.Screen name='FestivalScreen' component={FestivalScreen} />
      <Stack.Screen name='WellnessScreen' component={WellnessScreen} />
      <Stack.Screen name="TripDetailsScreen" component={TripDetailsScreen} />
    </Stack.Navigator>
  );
}

// --- Bottom Tab Navigator
const Tab = createBottomTabNavigator();

// --- App
export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Domů"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            const iconColor = '#FF1493';
            switch (route.name) {
              case 'Domů':
                return <Ionicons name="home" size={size} color={iconColor} />;
              case 'Plánování':
                return <MaterialCommunityIcons name="notebook-outline" size={size} color={iconColor} />;
              case 'Výlety':
                return <Ionicons name="map" size={size} color={iconColor} />;
              case 'Kalendář': // Nový tab pro kalendář
                return <Ionicons name="calendar" size={size} color={iconColor} />;
              default:
                return null;
            }
          },
          tabBarActiveTintColor: '#FF1493',
          tabBarInactiveTintColor: '#FFB6C1',
          headerShown: false,
        })}
      >
        <Tab.Screen name="Domů" component={HomeScreen} />
        <Tab.Screen name="Plánování" component={TripFormScreen} />
        <Tab.Screen name="Výlety" component={VyletyStack} />
        <Tab.Screen name="Kalendář" component={TripCalendar} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
