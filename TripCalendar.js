import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { getTrips } from './database';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Ionicons } from 'react-native-vector-icons';

export default function TripCalendar() {
  const [markedDates, setMarkedDates] = useState({});
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [trips, setTrips] = useState([]);
  const [nextTrip, setNextTrip] = useState(null);
  const [showNextTrip, setShowNextTrip] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const loadTrips = async () => {
        try {
          const tripsData = await getTrips();

          const dnes = new Date();
          dnes.setHours(0, 0, 0, 0);

          const filtrVylety = tripsData.filter((trip) => {
            const startDate = new Date(trip.start_date);
            startDate.setHours(0, 0, 0, 0);
            return startDate >= dnes;
          });

          const oznaceni = {};
          filtrVylety.forEach((trip) => {
            const datum = trip.start_date.split('T')[0];
            oznaceni[datum] = {
              marked: true,
              dotColor: '#FFEBF1',
              selected: true,
              selectedColor: '#FF1493',
            };
          });

          setTrips(filtrVylety);
          setMarkedDates(oznaceni);
          getNextTrip(filtrVylety);
        } catch (error) {
          console.error("Chyba při načítání výletů:", error);
          Alert.alert('Chyba', 'Nepodařilo se načíst výlety.');
        }
      };

      loadTrips();
    }, [])
  );


  const handleDayPress = (day) => {
    const selectedDate = day.dateString;
    const trip = trips.find((trip) => trip.start_date.split('T')[0] === selectedDate);
    setSelectedTrip(trip || null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const getNextTrip = (futureTrips) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sortedTrips = futureTrips
      .filter((trip) => {
        const startDate = new Date(trip.start_date);
        startDate.setHours(0, 0, 0, 0);
        return startDate > today;
      })
      .sort((a, b) => new Date(a.start_date) - new Date(b.start_date));

    if (sortedTrips.length > 0) {
      const nextTrip = sortedTrips[0];
      const daysUntilTrip = Math.ceil((new Date(nextTrip.start_date) - today) / (1000 * 3600 * 24));

      setNextTrip({
        name: nextTrip.trip_name,
        daysUntil: daysUntilTrip,
      });
    } else {
      setNextTrip(null);
    }
  };


  const toggleNextTrip = () => {
    setShowNextTrip((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={toggleNextTrip}>
          <Icon name={showNextTrip ? 'bell-slash' : 'bell'} size={26} color="#FF1493" />
        </TouchableOpacity>
        <Text style={styles.header}>Kalendář výletů</Text>
      </View>
      <View style={styles.nextTripWrapper}>
        {showNextTrip && nextTrip ? (
          <View style={styles.nextTripInfo}>
            <Text style={styles.nextTripLabel}>
              Následující výlet:{' '}
              <Text style={styles.nextTripName}>{nextTrip.name}</Text>
            </Text>
            <Text style={styles.nextTripDays}>Za {nextTrip.daysUntil} dní</Text>
          </View>
        ) : null}
      </View>

      <Calendar
        markedDates={markedDates}
        onDayPress={handleDayPress}
        theme={{
          todayTextColor: '#FF1493',
          arrowColor: '#FF1493',
        }}
      />

      {selectedTrip && (
        <View style={styles.tripDetails}>
          <Text style={styles.tripTitle}>{selectedTrip.trip_name}</Text>

          <View style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={20} color="#C71585" />
            <Text style={styles.dateText}>Začátek: {formatDate(selectedTrip.start_date)}</Text>
          </View>

          <View style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={20} color="#C71585" />
            <Text style={styles.dateText}>Konec: {formatDate(selectedTrip.end_date)}</Text>
          </View>

          <View style={styles.dateRow}>
            <Ionicons name="location-outline" size={20} color="#C71585" />
            <Text style={styles.dateText}>Země: {selectedTrip.country}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFEBF1',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    marginBottom: 10,
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FF1493',
    marginLeft: 10,
  },
  nextTripWrapper: {
    minHeight: 60,
    justifyContent: 'center',
    marginBottom: 10,
  },
  nextTripInfo: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  nextTripLabel: {
    fontSize: 16,
    color: '#000',
  },
  nextTripName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#C71585',
  },
  nextTripDays: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  tripDetails: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  tripTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#C71585',
    marginBottom: 10,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateText: {
    fontSize: 16,
    color: '#C71585',
    marginLeft: 10,
  },
});
