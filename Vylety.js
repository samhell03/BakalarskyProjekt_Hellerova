import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getTrips, deleteTrip } from './database';
import Icon from 'react-native-vector-icons/FontAwesome';

const isToday = (dateString) => {
  const today = new Date();
  const date = new Date(dateString);
  return date.toDateString() === today.toDateString();
};

const isFutureTrip = (startDate) => {
  const today = new Date();
  const date = new Date(startDate);
  return date > today;
};

const isPastTrip = (endDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const date = new Date(endDate);
  date.setHours(0, 0, 0, 0);

  return date < today; 
};


const calculateDaysLeft = (startDate) => {
  const today = new Date();
  const tripDateObj = new Date(startDate);
  const timeDifference = tripDateObj - today;

  const daysLeft = Math.ceil(timeDifference / (1000 * 3600 * 24));
  return `Zbývá ${daysLeft} dní`;
};

const isWithin7Days = (startDate) => {
  const today = new Date();
  const tripDateObj = new Date(startDate);

  const timeDifference = tripDateObj - today;
  const daysLeft = Math.ceil(timeDifference / (1000 * 3600 * 24));

  return daysLeft <= 7 && daysLeft >= 0;
};


const calculateDaysPast = (endDate) => {
  const today = new Date();
  const tripDateObj = new Date(endDate);
  const timeDifference = today - tripDateObj;
  const daysPast = Math.floor(timeDifference / (1000 * 3600 * 24));
  return `Proběhlo před ${daysPast} dny`;
};

export default function Vylety() {
  const [trips, setTrips] = useState([]);
  const navigation = useNavigation();

  const loadTrips = async () => {
    try {
      const result = await getTrips();
      setTrips(result);
    } catch (error) {
      console.error('Chyba při načítání výletů:', error);
      Alert.alert('Chyba', 'Nastala chyba při načítání výletů.');
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadTrips();
    }, [])
  );

  const handleDelete = async (id) => {
    Alert.alert('Smazat výlet', 'Opravdu chceš tento výlet smazat?', [
      { text: 'Zrušit', style: 'cancel' },
      {
        text: 'Smazat',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteTrip(id);
            loadTrips();
          } catch (error) {
            console.error('Chyba při mazání výletu:', error);
            Alert.alert('Chyba', 'Výlet se nepodařilo smazat.');
          }
        }
      }
    ]);
  };

  const handleEdit = (trip) => navigation.navigate('EditTripScreen', { trip });
  const handlePackForTrip = (trip) => navigation.navigate('PackingScreen', { trip });
  const handleInfo = (trip) => navigation.navigate('TripDetailsScreen', { tripId: trip.id });

  const todayTrip = trips.find(trip => isToday(trip.start_date));
  const futureTrips = trips
    .filter(trip => isFutureTrip(trip.start_date))
    .sort((a, b) => new Date(a.start_date) - new Date(b.start_date));

  const pastTrips = trips
    .filter(trip => isPastTrip(trip.end_date))
    .sort((a, b) => new Date(b.end_date) - new Date(a.end_date));

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Seznam výletů</Text>

      {todayTrip && (
        <View style={styles.section}>
          <Text style={styles.currentTripHeader}>Aktuální výlet</Text>
          <TripCard
            trip={todayTrip}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onInfo={handleInfo}
            onPack={handlePackForTrip}
            dateText="Zahájeno dnes"
          />
        </View>
      )}

      {futureTrips.length > 0 && (
        <View>
          <Text style={styles.pastTripsHeader}>Následující výlety</Text>
          {futureTrips.map((trip) => (
  <TripCard
    key={trip.id}
    trip={trip}
    onEdit={handleEdit}
    onDelete={handleDelete}
    onInfo={handleInfo}
    onPack={isWithin7Days(trip.start_date) ? handlePackForTrip : null}
    dateText={calculateDaysLeft(trip.start_date)}
  />
))}

        </View>
      )}

      {pastTrips.length > 0 && (
        <View>
          <Text style={styles.pastTripsHeader}>Proběhlé</Text>
          {pastTrips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              onInfo={handleInfo}
              dateText={calculateDaysPast(trip.end_date)}
              isPast
            />
          ))}
        </View>
      )}

      {trips.length === 0 && (
        <Text style={styles.noTripsText}>Žádné výlety nejsou k dispozici.</Text>
      )}
    </ScrollView>
  );
}

const TripCard = ({ trip, onEdit, onDelete, onInfo, onPack, dateText, isPast = false }) => (
  <View style={[styles.tripItem, isPast && styles.pastTrip]}>
    <View style={styles.tripHeader}>
      <Text style={styles.tripName}>{trip.trip_name}</Text>
      <View style={styles.iconRow}>
        {onEdit && (
          <TouchableOpacity onPress={() => onEdit(trip)} style={styles.iconButton}>
            <Icon name="pencil" size={20} color="#FFA500" />
          </TouchableOpacity>
        )}
        {onInfo && (
          <TouchableOpacity onPress={() => onInfo(trip)} style={styles.iconButton}>
            <Icon name="info-circle" size={20} color="#4682B4" />
          </TouchableOpacity>
        )}
        {onDelete && (
          <TouchableOpacity onPress={() => onDelete(trip.id)} style={styles.iconButton}>
            <Icon name="trash" size={20} color="#FF1493" />
          </TouchableOpacity>
        )}
        {onPack && (
          <TouchableOpacity style={styles.packButton} onPress={() => onPack(trip)}>
            <Icon name="suitcase" size={22} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    </View>
    <Text style={styles.tripDescription}>
      <Icon name="search" size={16} color="#FF1493" /> {trip.trip_description}
    </Text>
    <View style={styles.tripDateContainer}>
      <Text style={styles.tripDate}><Icon name="calendar" size={16} color="#FF1493" /> Od: {new Date(trip.start_date).toLocaleDateString()}</Text>
      <Text style={styles.tripDate}><Icon name="calendar" size={16} color="#FF1493" /> Do: {new Date(trip.end_date).toLocaleDateString()}</Text>
    </View>
    <Text style={styles.tripCountry}>
      <Icon name="map-marker" size={16} color="#FF1493" /> {trip.country}
    </Text>
    <View style={styles.countdownContainer}>
      <Text style={styles.countdownText}>{dateText}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFEBF1'
  },

  header: {
    fontSize: 30,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FF1493',
    marginTop: 60
  },

  currentTripHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF1493',
    marginTop: 30,
    marginBottom: 10
  },

  pastTripsHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF1493',
    marginTop: 30,
    marginBottom: 10
  },

  section: {
    marginBottom: 10
  },

  tripItem: {
    marginBottom: 15,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  pastTrip: {
    backgroundColor: '#D3D3D3',
    opacity: 0.6
  },

  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  iconRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  iconButton: {
    marginLeft: 15
  },

  tripName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF1493'
  },

  tripDescription: {
    fontSize: 16,
    color: '#666',
    marginTop: 5
  },

  tripDateContainer: {
    marginTop: 5
  },

  tripDate: {
    fontSize: 16,
    color: '#888',
    marginTop: 5
  },

  tripCountry: {
    fontSize: 16,
    color: '#888',
    marginTop: 5
  },

  noTripsText: {
    fontSize: 16,
    color: '#FF1493',
    textAlign: 'center',
    marginTop: 20
  },

  countdownContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#FF1493',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
  },

  countdownText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600'
  },

  packButton: {
    marginLeft: 15,
    backgroundColor: '#32CD32',
    padding: 12,
    borderRadius: 30,
    width: 47,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
