import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons, FontAwesome5, Entypo } from '@expo/vector-icons';
import TripFormScreen from './TripFormScreen';

// HomeScreen komponenta
function HomeScreen() {
  return (
    <View style={styles.center}>
      <Text style={styles.header}>ROAMLY</Text>
    </View>
  );
}

// Placeholder komponenta pro další obrazovky
const Placeholder = ({ title }) => (
  <View style={styles.center}>
    <Text style={styles.header}>{title}</Text>
  </View>
);

// Tab navigator
const Tab = createBottomTabNavigator();

// Hlavní komponenta aplikace
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
            case 'Výlet':
              return <MaterialCommunityIcons name="notebook-outline" size={size} color={iconColor} />;
            case 'Itinerář':
              return <Ionicons name="calendar" size={size} color={iconColor} />;
            case 'Místa':
              return <Entypo name="location-pin" size={size} color={iconColor} />;
            case 'Mapa':
              return <Ionicons name="map" size={size} color={iconColor} />;
            //case 'Deník':
              //return <FontAwesome5 name="book" size={size} color={iconColor} />;
            case 'Statistiky':
              return <Ionicons name="stats-chart" size={size} color={iconColor} />;
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
      <Tab.Screen name="Výlet" component={TripFormScreen} />
      <Tab.Screen name="Itinerář" component={Placeholder} />
      <Tab.Screen name="Místa" component={Placeholder} />
      <Tab.Screen name="Mapa" component={Placeholder} />
      <Tab.Screen name="Statistiky" component={Placeholder} />
    </Tab.Navigator>
    </NavigationContainer>
  );
}

// Stylování pro komponenty
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'white',
  },
  header: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});
