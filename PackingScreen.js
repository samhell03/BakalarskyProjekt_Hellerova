import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PackingScreen({ route, navigation }) {
  const { trip } = route.params;
  const [selectedType, setSelectedType] = useState(null);

  useEffect(() => {
    const loadSelectedType = async () => {
      const storedType = await AsyncStorage.getItem(`selectedType_${trip.id}`);
      if (storedType) {
        setSelectedType(storedType);
      }
    };
    loadSelectedType();
  }, [trip.id]);

  const clearOldDefaults = async () => {
    const keys = await AsyncStorage.getAllKeys();
    const itemKeys = keys.filter(key => key.startsWith(`items_${trip.id}_`));
    await AsyncStorage.multiRemove(itemKeys);
  };

  const setNewDefaults = async (type) => {
    let defaultItems = [];

    switch (type) {
      case 'Pod stan':
        defaultItems = ['Stan', 'Spacák', 'Karimatka'];
        break;
      case 'Poznávací turistický výlet':
        defaultItems = ['Mapa', 'Pohodlné boty', 'Fotoaparát'];
        break;
      case 'Dobrodružný výlet':
        defaultItems = ['Lano', 'Lékárnička', 'Nůž'];
        break;
      case 'Plážová dovolená':
        defaultItems = ['Plavky', 'Opalovací krém', 'Šampaňské'];
        break;
        case 'Pobyt na chatě':
          defaultItems = ['Plavky', 'Opalovací krém', 'Šampaňské'];
          break;
      default:
        break;
    }

    await AsyncStorage.setItem(
      `items_${trip.id}_${type}`,
      JSON.stringify(defaultItems)
    );
  };

  const navigateToPackingScreen = (type) => {
    if (type === 'Pod stan') {
      navigation.navigate('TentScreen', { trip });
    } else if (type === 'Poznávací turistický výlet') {
      navigation.navigate('TouristTripScreen', { trip });
    } else if (type === 'Dobrodružný výlet') {
      navigation.navigate('AdventureTripScreen', { trip });
    } else if (type === 'Plážová dovolená') {
      navigation.navigate('BeachHolidayScreen', { trip });
    } else if (type === 'Zimní dovolená') {
      navigation.navigate('WinterHolidayScreen', { trip });
    } else if (type === 'Pobyt na chatě') {
      navigation.navigate('HuntScreen', { trip });
    } else if (type === 'Kemping s karavanem') {
      navigation.navigate('CampingScreen', { trip });
    } else if (type === 'Festival/Koncert') {
      navigation.navigate('FestivalScreen', { trip });
    } else if (type === 'Wellness pobyt') {
      navigation.navigate('WellnessScreen', { trip });
    }
  };


  const handleSelectType = async (type) => {
    if (!selectedType) {
      await AsyncStorage.setItem(`selectedType_${trip.id}`, type);
      await setNewDefaults(type);
      setSelectedType(type);
      Alert.alert(`Vybrán typ: ${type}`);
      navigateToPackingScreen(type); // Navigace při výběru typu
    } else if (selectedType === type) {
      navigateToPackingScreen(type);
    } else {
      // Přepis typu v editačním režimu
      await AsyncStorage.setItem(`selectedType_${trip.id}`, type);
      await clearOldDefaults();
      await setNewDefaults(type);
      setSelectedType(type);
      Alert.alert('Typ výletu byl změněn', `Nyní: ${type}`);
      navigateToPackingScreen(type); // Navigace po změně typu
    }
  };

  const isButtonDisabled = (type) => {
    return selectedType && selectedType !== type;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{trip.trip_name}</Text>
      <Text style={styles.description}>
        {selectedType
          ? `Typ výletu: ${selectedType}`
          : 'Vyber typ výletu, na který se chystáš:'}
      </Text>

      {['Pod stan', 'Poznávací turistický výlet', 'Dobrodružný výlet', 'Plážová dovolená', 'Zimní dovolená', 'Pobyt na chatě', 'Kemping s karavanem', 'Festival/Koncert', 'Wellness pobyt'].map((type) => (
  <TouchableOpacity
    key={type}
    style={[
      styles.optionButton,
      selectedType === type && styles.selectedOption,
      isButtonDisabled(type) && styles.disabledButton,
    ]}
    onPress={() => handleSelectType(type)}
  >
    <Text style={styles.buttonText}>{type}</Text>
  </TouchableOpacity>
  ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFE4EC',
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FF1493',
    textAlign: 'center',
    marginTop: 60,
  },
  description: {
    fontSize: 18,
    color: '#C71585',
    marginBottom: 30,
    textAlign: 'center',
  },
  optionButton: {
    backgroundColor: '#FF69B4',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    width: '80%',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#C71585',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  selectedOption: {
    backgroundColor: '#FF1493',
    shadowOpacity: 0.5,
  },
  disabledButton: {
    opacity: 0.4,
  },
});
