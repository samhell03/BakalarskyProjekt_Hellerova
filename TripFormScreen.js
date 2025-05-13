import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { createTable, insertTrip } from './database';

export default function TripFormScreen({ navigation }) {
  const [tripName, setTripName] = useState('');
  const [tripDescription, setTripDescription] = useState('');
  const [country, setCountry] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDateType, setSelectedDateType] = useState(null); // "start" or "end"

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        await createTable();
      } catch (error) {
        console.error("Chyba při inicializaci databáze:", error);
      }
    };
    initializeDatabase();
  }, []);

  const handleAddTrip = async () => {
    if (!tripName || !tripDescription || !startDate || !endDate || !country) {
      Alert.alert('Chyba', 'Vyplň prosím všechna pole!');
      return;
    }

    if (startDate > endDate) {
      Alert.alert('Chyba', 'Začátek výletu nemůže být po jeho konci!');
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (startDate < today) {
      Alert.alert('Chyba', 'Datum začátku výletu nemůže být v minulosti!');
      return;
    }

    try {
      // Převod start a end date na Unix timestamp
      const startTimestamp = new Date(startDate).getTime();
      const endTimestamp = new Date(endDate).getTime();

      await insertTrip(
        tripName,
        tripDescription,
        startTimestamp, // Předáme Unix timestamp
        endTimestamp,   // Předáme Unix timestamp
        country
      );

      Alert.alert(
        'Výlet přidán',
        `Název: ${tripName}\nPopis: ${tripDescription}\nDatum: ${new Date(startTimestamp).toLocaleDateString()} až ${new Date(endTimestamp).toLocaleDateString()}\nZemě: ${country}`,
        [{ text: 'OK' }]
      );
      setTripName('');
      setTripDescription('');
      setStartDate(null);
      setEndDate(null);
      setCountry('');
      navigation.navigate('Výlety');
    } catch (error) {
      console.error('Chyba při přidávání výletu:', error);
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
      <Text style={styles.header}>Přidat nový výlet</Text>

      <TextInput
        style={styles.input}
        placeholder="Název výletu"
        value={tripName}
        onChangeText={setTripName}
      />

      <TextInput
        style={styles.input}
        placeholder="Zadej název země"
        value={country}
        onChangeText={setCountry}
      />

      <TextInput
        style={styles.input}
        placeholder="Popis výletu"
        value={tripDescription}
        onChangeText={setTripDescription}
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
            markedDates={{
              [startDate]: { selected: true, selectedColor: 'blue', selectedTextColor: 'white' },
              [endDate]: { selected: true, selectedColor: 'red', selectedTextColor: 'white' }
            }}
            onDayPress={onDateSelect}
            monthFormat={'yyyy MM'}
          />
        </View>
      )}

      {/* Styled Add Trip Button */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddTrip}>
        <Text style={styles.addButtonText}>Přidat výlet</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFEBF1',
    justifyContent: 'center', // Center vertically
    alignItems: 'center',      // Center horizontally
  },
  header: {
    fontSize: 30,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#FF1493',
    marginTop: 40,
  },
  input: {
    borderWidth: 1,
    borderColor: '#FF1493',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
    width: '100%', // Make input fields take full width of the container
  },
  dateButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#FF1493',
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
    width: '100%', // Make the date picker buttons full width
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center', // Center the text
  },
  calendarContainer: {
    marginBottom: 20,
    width: '100%', // Ensure calendar takes full width
  },

  // Add Trip button styles
  addButton: {
    backgroundColor: '#FF1493', // Background color
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 20,
    width: '100%', // Make button full width
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
