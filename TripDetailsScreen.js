import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { getItemsForTrip, getTripDates } from './database';
import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function TripDetailsScreen({ route }) {
  const { tripId } = route.params;
  const [tripItems, setTripItems] = useState([]);
  const [tripDates, setTripDates] = useState({ startDate: '', endDate: '', country: '' });

  useEffect(() => {
    const loadTripDetails = async () => {
      try {
        const items = await getItemsForTrip(tripId);
        setTripItems(items);

        const dates = await getTripDates(tripId);
        setTripDates(dates);
      } catch (error) {
        console.error("Chyba při načítání údajů:", error);
        Alert.alert('Chyba', 'Nepodařilo se načíst data výletu.');
      }
    };

    loadTripDetails();
  }, [tripId]);

  const generateMarkedDates = (startDate, endDate) => {
    const marked = {};
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (!startDate || !endDate) return marked;

    let currentDate = new Date(start);
    while (currentDate <= end) {
      const dateKey = currentDate.toISOString().split('T')[0];

      if (dateKey === startDate) {
        marked[dateKey] = {
          selected: true,
          selectedColor: 'blue',
          selectedTextColor: 'white',
        };
      }

      else if (dateKey === endDate) {
        marked[dateKey] = {
          selected: true,
          selectedColor: 'red',
          selectedTextColor: 'white',
        };
      }
      else {
        marked[dateKey] = {
          selected: true,
          selectedColor: '#8A2BE2',
          selectedTextColor: '#fff',
        };
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return marked;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.item}>{item.item_name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={tripItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListHeaderComponent={
          <>
            <Text style={styles.header}>Detaily výletu</Text>

            <View style={styles.datesContainer}>
              <View style={styles.dateRow}>
                <Icon name="map-marker" size={20} color="#C71585" style={styles.icon} />
                <Text style={styles.dateText}>Země: {tripDates.country || 'Není nastavena'}</Text>
              </View>

              <View style={styles.dateRow}>
                <Icon name="calendar" size={20} color="#C71585" style={styles.icon} />
                <Text style={styles.dateText}>Začátek výletu: {tripDates.startDate ? formatDate(tripDates.startDate) : 'Není nastavena'}</Text>
              </View>

              <View style={styles.dateRow}>
                <Icon name="calendar" size={20} color="#C71585" style={styles.icon} />
                <Text style={styles.dateText}>Konec výletu: {tripDates.endDate ? formatDate(tripDates.endDate) : 'Není nastavena'}</Text>
              </View>
            </View>

            <Calendar
              markedDates={generateMarkedDates(tripDates.startDate, tripDates.endDate)}
              markingType={'period'}
              theme={{
                todayTextColor: '#FF1493',
                arrowColor: '#FF1493',
              }}
            />
            <Text style={styles.subHeader}>Položky k zabalení</Text>
          </>
        }
        ListEmptyComponent={
          <Text style={styles.noItemsText}>Nemáš žádné položky pro tento výlet.</Text>
        }
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFEBF1',
  },
  header: {
    fontSize: 30,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#FF1493',
    marginVertical: 15,
    marginTop: 60,
  },
  datesContainer: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 10,
  },
  dateText: {
    fontSize: 16,
    color: '#C71585',
    marginBottom: 5,
  },
  subHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF1493',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 15,
  },

  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    alignItems: 'center',
  },
  item: {
    fontSize: 18,
    color: '#C71585',
    fontWeight: 'bold',
  },
  noItemsText: {
    fontSize: 18,
    color: '#FF1493',
    textAlign: 'center',
    marginTop: 20,
  },
  flatListContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});
