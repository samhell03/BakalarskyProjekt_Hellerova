import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { updateTrip } from './database';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EditTripScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const { trip } = route.params || {};

  const [tripName, setTripName] = useState('');
  const [tripDescription, setTripDescription] = useState('');
  const [country, setCountry] = useState('');
  const [tripType, setTripType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDateType, setSelectedDateType] = useState(null);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (trip) {
      setTripName(trip.trip_name || '');
      setTripDescription(trip.trip_description || '');
      setCountry(trip.country || '');
      setTripType(trip.trip_type || '');
      setStartDate(trip.start_date || '');
      setEndDate(trip.end_date || '');
    }
  }, [trip]);

  const handleUpdate = async () => {
    try {
      if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
        Alert.alert('Chyba', 'Datum konce nemůže být před datem začátku.');
        return;
      }

      if (tripType !== undefined && tripType !== null) {
        await AsyncStorage.setItem(`selectedType_${trip.id}`, tripType);
      } else {
        await AsyncStorage.removeItem(`selectedType_${trip.id}`);
      }

      await updateTrip(trip.id, {
        trip_name: tripName,
        trip_description: tripDescription,
        start_date: startDate,
        end_date: endDate,
        country: country,
        trip_type: tripType,
      });

      Alert.alert('Hotovo', 'Výlet byl úspěšně aktualizován.');
      navigation.goBack();
    } catch (error) {
      console.error('Chyba při aktualizaci výletu:', error);
      Alert.alert('Chyba', 'Nepodařilo se upravit výlet.');
    }
  };

  const onDateSelect = (date) => {
    if (selectedDateType === 'start') {
      setStartDate(date.dateString);
    } else if (selectedDateType === 'end') {
      setEndDate(date.dateString);
    }
    setShowCalendar(false);
  };

  const handleStartDateSelect = () => {
    setSelectedDateType('start');
    setShowCalendar(true);
  };

  const handleEndDateSelect = () => {
    setSelectedDateType('end');
    setShowCalendar(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Úprava výletu</Text>

      <TextInput
        style={styles.input}
        placeholder="Název výletu"
        value={tripName}
        onChangeText={setTripName}
      />
      <TextInput
        style={styles.input}
        placeholder="Popis"
        value={tripDescription}
        onChangeText={setTripDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Země"
        value={country}
        onChangeText={setCountry}
      />

      <TouchableOpacity onPress={handleStartDateSelect} style={styles.dateButton}>
        <Text style={styles.dateButtonText}>
          {startDate ? `Začátek: ${new Date(startDate).toLocaleDateString()}` : 'Vyber datum začátku'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleEndDateSelect} style={styles.dateButton}>
        <Text style={styles.dateButtonText}>
          {endDate ? `Konec: ${new Date(endDate).toLocaleDateString()}` : 'Vyber datum konce'}
        </Text>
      </TouchableOpacity>

      {showCalendar && (
        <View style={styles.calendarContainer}>
          <Calendar
            minDate={today} 
            markedDates={{
              [startDate]: { selected: true, selectedColor: 'blue', selectedTextColor: 'white' },
              [endDate]: { selected: true, selectedColor: 'red', selectedTextColor: 'white' },
            }}
            onDayPress={onDateSelect}
            monthFormat={'yyyy MM'}
          />
        </View>
      )}

      <Text style={styles.label}>Typ výletu</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.optionButton, tripType === 'Pod stan' && styles.selectedOption]}
          onPress={() => setTripType('Pod stan')}
        >
          <Text style={styles.buttonText}>Pod stan</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.optionButton, tripType === 'Poznávací turistický výlet' && styles.selectedOption]}
          onPress={() => setTripType('Poznávací turistický výlet')}
        >
          <Text style={styles.buttonText}>Poznávací turistický výlet</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.optionButton, tripType === 'Dobrodružný výlet' && styles.selectedOption]}
          onPress={() => setTripType('Dobrodružný výlet')}
        >
          <Text style={styles.buttonText}>Dobrodružný výlet</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.optionButton, tripType === 'Plážová dovolená' && styles.selectedOption]}
          onPress={() => setTripType('Plážová dovolená')} >
          <Text style={styles.buttonText}>Plážová dovolená</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.optionButton, tripType === 'Zimní dovolená' && styles.selectedOption]}
          onPress={() => setTripType('Zimní dovolená')} >
          <Text style={styles.buttonText}>Zimní dovolená</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.optionButton, tripType === 'Pobyt na chatě' && styles.selectedOption]}
          onPress={() => setTripType('Pobyt na chatě')} >
          <Text style={styles.buttonText}>Pobyt na chatě</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.optionButton, tripType === 'Kemping s karavanem' && styles.selectedOption]}
          onPress={() => setTripType('Kemping s karavanem')} >
          <Text style={styles.buttonText}>Kemping s karavanem</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.optionButton, tripType === 'Festival/Koncert' && styles.selectedOption]}
          onPress={() => setTripType('Festival/Koncert')} >
          <Text style={styles.buttonText}>Festival/Koncert</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.optionButton, tripType === 'Wellness pobyt' && styles.selectedOption]}
          onPress={() => setTripType('Wellness pobyt')} >
          <Text style={styles.buttonText}>Wellness pobyt</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Uložit změny</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFF0F5',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#FF1493',
    marginTop: 60,
  },
  input: {
    height: 50,
    borderColor: '#FFB6C1',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    color: '#FF1493',
    marginBottom: 10,
  },
  buttonContainer: {
    marginBottom: 15,
  },
  optionButton: {
    backgroundColor: '#FF69B4',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  selectedOption: {
    backgroundColor: '#FF1493',
  },
  saveButton: {
    backgroundColor: '#FF1493',
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  dateButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#FF1493',
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
    width: '100%',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  calendarContainer: {
    marginBottom: 20,
    width: '100%',
  },
});
